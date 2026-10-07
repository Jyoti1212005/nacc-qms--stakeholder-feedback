import { OAuth2Client } from 'google-auth-library';

export interface VerifiedGoogleUser {
  email: string;
  name: string;
  picture?: string;
  sub: string;
  email_verified: boolean;
}

const googleClientId = process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '';
const oauth2Client = new OAuth2Client(googleClientId);

/**
 * Verifies a Google ID token from Google Identity Services (GIS).
 * Ensures the account is a genuine Google account, verified by Google servers.
 */
export async function verifyGoogleIdToken(token: string): Promise<VerifiedGoogleUser | null> {
  if (!token || typeof token !== 'string') {
    return null;
  }

  // 1. First attempt verification via Google OAuth tokeninfo endpoint
  try {
    const url = `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(token.trim())}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      const isEmailVerified = data.email_verified === 'true' || data.email_verified === true;
      if (data.email && isEmailVerified) {
        return {
          email: data.email.toLowerCase(),
          name: data.name || data.given_name || data.email.split('@')[0],
          picture: data.picture,
          sub: data.sub,
          email_verified: true,
        };
      }
    }
  } catch (netErr: any) {
    console.warn('[Google Auth] Tokeninfo fetch warning:', netErr.message);
  }

  // 2. Second attempt via google-auth-library if Client ID is configured
  if (googleClientId) {
    try {
      const ticket = await oauth2Client.verifyIdToken({
        idToken: token,
        audience: googleClientId,
      });
      const payload = ticket.getPayload();
      if (payload && payload.email && payload.email_verified) {
        return {
          email: payload.email.toLowerCase(),
          name: payload.name || payload.email.split('@')[0],
          picture: payload.picture,
          sub: payload.sub,
          email_verified: true,
        };
      }
    } catch (libErr: any) {
      console.warn('[Google Auth] OAuth2Client verify warning:', libErr.message);
    }
  }

  return null;
}
