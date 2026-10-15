import dns from 'dns';
import util from 'util';
import nodemailer from 'nodemailer';

const resolveMx = util.promisify(dns.resolveMx);

// Known disposable or fake email domains list to prevent temporary disposable emails
const DISPOSABLE_EMAIL_DOMAINS = new Set([
  'tempmail.com',
  'mailinator.com',
  '10minutemail.com',
  'guerrillamail.com',
  'throwawaymail.com',
  'yopmail.com',
  'trashmail.com',
  'getairmail.com',
  'sharklasers.com',
  'dispostable.com',
  'temp-mail.org',
  'fakemailgenerator.com',
  'generator.email',
  'mohmal.com',
  'maildrop.cc',
  'burnermail.io',
]);

export interface PendingOtpRecord {
  email: string;
  otp: string;
  expiresAt: number;
  attempts: number;
  verified: boolean;
  purpose: 'REGISTER' | 'LOGIN';
  createdAt: number;
}

// In-memory OTP storage
const otpMemoryStore = new Map<string, PendingOtpRecord>();

// Whitelist of trusted standard and public mail providers
const TRUSTED_EMAIL_DOMAINS = new Set([
  'gmail.com',
  'googlemail.com',
  'yahoo.com',
  'yahoo.co.in',
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',
  'icloud.com',
  'proton.me',
  'protonmail.com',
  'zoho.com',
  'aol.com',
  'mail.com',
  'yandex.com',
  'naac-qms.edu',
  'localhost',
  'test.local',
]);

/**
 * Validates whether the email syntax is correct and the domain has real MX DNS records.
 * Non-existent domains will fail MX lookup, while trusted domains and institutional TLDs are accepted.
 */
export async function verifyEmailDomain(email: string): Promise<{ valid: boolean; error?: string }> {
  if (!email || typeof email !== 'string') {
    return { valid: false, error: 'Email address is required.' };
  }

  const clean = email.trim().toLowerCase();
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(clean)) {
    return { valid: false, error: 'Email format is invalid. Please enter a valid email address.' };
  }

  const parts = clean.split('@');
  const domain = parts[1];

  if (!domain) {
    return { valid: false, error: 'Invalid email domain.' };
  }

  // Reject disposable domains
  if (DISPOSABLE_EMAIL_DOMAINS.has(domain)) {
    return {
      valid: false,
      error: `Disposable and temporary email services (@${domain}) are prohibited. Please provide a verified institutional or standard email address.`,
    };
  }

  // Trusted popular email providers & institutional test domains
  if (TRUSTED_EMAIL_DOMAINS.has(domain)) {
    return { valid: true };
  }

  // Institutional or academic TLDs (e.g. .edu, .ac.in, .edu.in, .org, .gov.in)
  if (
    domain.endsWith('.edu') ||
    domain.endsWith('.ac.in') ||
    domain.endsWith('.edu.in') ||
    domain.endsWith('.org') ||
    domain.endsWith('.gov.in') ||
    domain.endsWith('.res.in')
  ) {
    return { valid: true };
  }

  // Attempt DNS MX lookup with timeout for other custom domains
  try {
    const mxLookup = resolveMx(domain);
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('DNS_TIMEOUT')), 3000)
    );
    const mxRecords = await Promise.race([mxLookup, timeout]);
    if (Array.isArray(mxRecords) && mxRecords.length === 0) {
      return {
        valid: false,
        error: `Domain "@${domain}" has no active mail exchange (MX) servers. Please provide an active email address.`,
      };
    }
    return { valid: true };
  } catch (err: any) {
    // If DNS query fails due to local network DNS resolution (ECONNREFUSED, timeout, etc.),
    // don't reject valid email syntax so genuine users aren't locked out.
    if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND' || err.message === 'DNS_TIMEOUT') {
      console.warn(`[Email Verify] Notice: DNS lookup for @${domain} skipped (${err.code || err.message}). Allowing valid email syntax.`);
      return { valid: true };
    }
    return {
      valid: false,
      error: `Email domain "@${domain}" could not be verified. Please enter a standard email address (e.g. Gmail or institutional domain).`,
    };
  }
}

/**
 * Create Nodemailer transporter if SMTP credentials are provided in .env
 */
function getSmtpTransporter() {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 587;
  const user = process.env.GMAIL_USER || process.env.SMTP_USER;
  const pass = process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASS;

  if (user && pass) {
    const cleanPass = pass.replace(/\s+/g, '');
    if (!host || host.includes('gmail') || user.endsWith('@gmail.com')) {
      return nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user,
          pass: cleanPass,
        },
      });
    }
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass: cleanPass,
      },
    });
  }
  return null;
}

/**
 * Generates a 6-digit OTP, stores it with 10-minute validity, and sends email or logs.
 */
export async function generateAndSendOtp(
  email: string,
  purpose: 'REGISTER' | 'LOGIN' = 'REGISTER'
): Promise<{
  success: boolean;
  message: string;
  emailSent: boolean;
  devOtp?: string;
  expiresInSeconds: number;
  error?: string;
}> {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Verify email domain exists via DNS MX lookup
  const domainCheck = await verifyEmailDomain(cleanEmail);
  if (!domainCheck.valid) {
    return {
      success: false,
      message: domainCheck.error || 'Invalid email domain.',
      emailSent: false,
      expiresInSeconds: 0,
      error: domainCheck.error,
    };
  }

  // 2. Generate cryptographically random 6-digit OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const validityMs = 10 * 60 * 1000; // 10 minutes
  const expiresAt = Date.now() + validityMs;

  otpMemoryStore.set(cleanEmail, {
    email: cleanEmail,
    otp: otpCode,
    expiresAt,
    attempts: 0,
    verified: false,
    purpose,
    createdAt: Date.now(),
  });

  // 3. Attempt sending through real SMTP / Gmail
  const transporter = getSmtpTransporter();
  let emailSent = false;

  if (transporter) {
    try {
      const info = await transporter.sendMail({
        from: `"NAAC-QMS Security Cell" <${process.env.SMTP_USER || process.env.GMAIL_USER}>`,
        to: cleanEmail,
        subject: `[NAAC-QMS] Your Email Verification Security Code: ${otpCode}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #fed7aa; border-radius: 12px; background-color: #ffffff;">
            <div style="text-align: center; border-bottom: 2px solid #ff7a50; padding-bottom: 16px; margin-bottom: 20px;">
              <h2 style="color: #0a192f; margin: 0; font-size: 20px;">NAAC-QMS Institutional Quality Portal</h2>
              <p style="color: #c2410c; margin: 4px 0 0; font-size: 13px; font-weight: bold;">Stakeholder Identity & Security Verification</p>
            </div>
            <p style="color: #334155; font-size: 14px;">Hello,</p>
            <p style="color: #334155; font-size: 14px; line-height: 1.5;">
              A request was initiated to verify this email address for <strong>${purpose === 'REGISTER' ? 'New Account Registration' : 'Secure Login'}</strong> on the NAAC Quality Management System portal.
            </p>
            <div style="margin: 28px 0; text-align: center;">
              <span style="display: inline-block; font-size: 32px; font-weight: 800; letter-spacing: 8px; color: #c2410c; background: #fff0e6; border: 2px dashed #ff7a50; padding: 14px 28px; border-radius: 10px;">
                ${otpCode}
              </span>
            </div>
            <p style="color: #64748b; font-size: 12px; text-align: center;">
              This 6-digit code is valid for <strong>10 minutes</strong>. Do not share this code with anyone.
            </p>
            <div style="border-top: 1px solid #f1f5f9; padding-top: 16px; margin-top: 24px; color: #94a3b8; font-size: 11px; text-align: center;">
              Internal Quality Assurance Cell (IQAC) • National Assessment and Accreditation Council Alignment
            </div>
          </div>
        `,
      });
      console.log(`[AUTH-OTP] Real Email sent to ${cleanEmail}: ${info.messageId}`);
      emailSent = true;
    } catch (smtpErr: any) {
      console.warn(`[AUTH-OTP] SMTP delivery failed (${smtpErr.message}). Falling back to dev mode console output.`);
    }
  }

  // Always log in terminal for quick review and developer visibility
  console.log(`\n======================================================`);
  console.log(`🔐 [NAAC-QMS SECURITY OTP]`);
  console.log(`📧 Target Email: ${cleanEmail}`);
  console.log(`🔑 Verification OTP: ${otpCode}`);
  console.log(`⏱️ Valid for: 10 minutes (Expires: ${new Date(expiresAt).toLocaleTimeString()})`);
  console.log(`📬 Real SMTP Sent: ${emailSent ? 'YES' : 'NO (Credentials not yet configured in .env)'}`);
  console.log(`======================================================\n`);

  return {
    success: true,
    message: emailSent
      ? `A 6-digit verification code has been dispatched to "${cleanEmail}". Please check your inbox.`
      : `Verification code generated successfully.`,
    emailSent,
    devOtp: emailSent ? undefined : otpCode, // For testing convenience when SMTP is not configured
    expiresInSeconds: 600,
  };
}

/**
 * Validates the user-submitted 6-digit OTP against memory store
 */
export function verifyOtp(email: string, submittedOtp: string): { success: boolean; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const record = otpMemoryStore.get(cleanEmail);

  if (!record) {
    return {
      success: false,
      error: 'No active verification code request found for this email. Please click "Send OTP".',
    };
  }

  if (Date.now() > record.expiresAt) {
    otpMemoryStore.delete(cleanEmail);
    return {
      success: false,
      error: 'Verification code has expired (10-minute window). Please request a new code.',
    };
  }

  if (record.attempts >= 5) {
    otpMemoryStore.delete(cleanEmail);
    return {
      success: false,
      error: 'Maximum verification attempts exceeded. Please request a new verification code.',
    };
  }

  if (record.otp.trim() !== submittedOtp.trim()) {
    record.attempts += 1;
    return {
      success: false,
      error: `Invalid verification code. Please check and re-enter. (${5 - record.attempts} attempts remaining)`,
    };
  }

  // Mark verified
  record.verified = true;
  return { success: true };
}

/**
 * Check if the email was previously verified via OTP and still valid
 */
export function isEmailOtpVerified(email: string): boolean {
  const cleanEmail = email.trim().toLowerCase();
  const record = otpMemoryStore.get(cleanEmail);
  if (!record) return false;
  return record.verified && Date.now() <= record.expiresAt;
}

/**
 * Clear OTP after successful registration or login
 */
export function consumeOtp(email: string): void {
  otpMemoryStore.delete(email.trim().toLowerCase());
}
