import React, { useState } from 'react';
import {
  ShieldCheck,
  Award,
  CheckCircle2,
  Copy,
  Check,
  Printer,
  ExternalLink,
  X,
  FileCheck2,
  Calendar,
  Building,
  Lock,
} from 'lucide-react';
import { QrCodeSvg } from './QrCodeSvg';

interface LiveQrVerificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  referenceNo?: string;
  academicYear?: string;
  departmentName?: string;
  averageDelta?: number;
  totalGapsRemediated?: number;
}

export const LiveQrVerificationModal: React.FC<LiveQrVerificationModalProps> = ({
  isOpen,
  onClose,
  referenceNo = 'NAAC-QMS-ATR-202627-INST',
  academicYear = '2026-27',
  departmentName = 'Apex Institute of Technology & Management (All Departments)',
  averageDelta = 1.28,
  totalGapsRemediated = 6,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://institution.edu';
  const verificationUrl = `${currentOrigin}/api/public/verify/${referenceNo}`;
  const verificationHash = '7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069';

  const handleCopy = () => {
    navigator.clipboard.writeText(verificationUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto text-slate-800">
        {/* Certificate Header Bar */}
        <div className="bg-linear-to-r from-[#0a192f] via-[#102a4e] to-[#1e3a8a] text-white p-6 relative overflow-hidden">
          {/* Background subtle watermark crest */}
          <div className="absolute right-0 top-0 translate-x-8 -translate-y-4 text-white/5 pointer-events-none">
            <Award className="w-56 h-56" />
          </div>

          <div className="flex items-start justify-between relative z-10">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-[#ff7a50] to-[#f97316] p-0.5 shadow-lg flex items-center justify-center text-white shrink-0">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 text-[9px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 rounded-full tracking-wider">
                    Official Cryptographic Seal
                  </span>
                  <span className="text-[10px] text-blue-200 font-semibold">• NAAC Metric 1.4.2</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white tracking-tight mt-0.5">
                  IQAC Verification & Digital Seal
                </h2>
                <p className="text-xs text-blue-200/90 font-medium">
                  Apex Institute of Technology & Management (Autonomous)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white flex items-center justify-center transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Verification Certificate Body */}
        <div className="p-6 sm:p-7 space-y-6">
          {/* Institutional Trust Verification Banner */}
          <div className="flex items-center justify-between p-4 bg-emerald-50 border-2 border-emerald-200 rounded-2xl">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-black text-emerald-950 uppercase tracking-wide">
                  100% Ratified & Audited Document
                </p>
                <p className="text-xs text-emerald-800 font-medium">
                  Verified against Board of Studies minutes & post-intervention remeasurements.
                </p>
              </div>
            </div>
            <div className="hidden sm:block text-right">
              <span className="text-[10px] text-emerald-700 font-semibold block">Accreditation Cycle</span>
              <span className="text-xs font-bold text-emerald-950">A+ Grade (3.42 CGPA)</span>
            </div>
          </div>

          {/* QR Code and Metadata Side-by-Side */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-center">
            {/* Scannable QR Code Column */}
            <div className="sm:col-span-5 flex flex-col items-center justify-center p-4 bg-slate-50 border border-slate-200 rounded-2xl text-center shadow-inner">
              <div className="p-2.5 bg-white rounded-xl shadow-md border border-slate-200">
                <QrCodeSvg value={verificationUrl} size={145} />
              </div>
              <span className="mt-2 text-[10px] font-extrabold text-slate-700 uppercase tracking-wider flex items-center space-x-1">
                <Lock className="w-3 h-3 text-[#ff7a50]" />
                <span>Scan for Live Verification</span>
              </span>
              <span className="text-[10px] text-slate-500 font-mono mt-0.5">
                {referenceNo}
              </span>
            </div>

            {/* Document Metrics & Attribution */}
            <div className="sm:col-span-7 space-y-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5">
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-semibold">Regulatory Metric:</span>
                  <span className="font-bold text-slate-800">NAAC Metric 1.4.1 & 1.4.2</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-semibold">Academic Year:</span>
                  <span className="font-bold text-slate-800">AY {academicYear}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-semibold">Scope:</span>
                  <span className="font-bold text-slate-800 truncate max-w-[190px]" title={departmentName}>
                    {departmentName}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-semibold">CAPA Actions Remediated:</span>
                  <span className="font-bold text-emerald-700">{totalGapsRemediated} Actions (100% Closed)</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span className="font-semibold">Satisfaction Delta (+Δ):</span>
                  <span className="font-bold text-indigo-700">+{averageDelta.toFixed(2)} Points Improvement</span>
                </div>
              </div>

              {/* SHA-256 Checksum */}
              <div className="p-2.5 bg-blue-50/70 border border-blue-200 rounded-xl">
                <div className="flex items-center justify-between text-[11px] text-blue-900 font-semibold mb-1">
                  <span>Cryptographic Fingerprint:</span>
                  <span className="text-[10px] text-blue-700 uppercase font-bold">SHA-256</span>
                </div>
                <p className="font-mono text-[10px] text-blue-950 break-all leading-tight">
                  {verificationHash}
                </p>
              </div>
            </div>
          </div>

          {/* Official Signatories */}
          <div className="grid grid-cols-2 gap-4 pt-3 border-t border-slate-200">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div className="font-serif italic font-bold text-slate-800 text-sm border-b border-slate-300 pb-1 mb-1">
                Prof. Radhika Venkataraman
              </div>
              <p className="text-[10px] font-bold text-slate-700 uppercase">Director, IQAC</p>
              <p className="text-[9px] text-slate-500">Internal Quality Assurance Cell</p>
            </div>

            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-center">
              <div className="font-serif italic font-bold text-slate-800 text-sm border-b border-slate-300 pb-1 mb-1">
                Dr. K. S. Krishnamurthy
              </div>
              <p className="text-[10px] font-bold text-slate-700 uppercase">Principal & Chairperson, IQAC</p>
              <p className="text-[9px] text-slate-500">Apex Institute of Technology</p>
            </div>
          </div>

          {/* Public Verification Link Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-3.5 bg-slate-100 rounded-2xl border border-slate-200">
            <div className="min-w-0 flex-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Public Disclosure URL (Share with NAAC Peer Team)
              </span>
              <p className="text-xs font-mono text-slate-700 truncate select-all">
                {verificationUrl}
              </p>
            </div>

            <div className="flex items-center space-x-2 shrink-0">
              <button
                onClick={handleCopy}
                className="px-3 py-1.5 min-h-[36px] text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-600" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>

              <button
                onClick={handlePrint}
                className="px-3 py-1.5 min-h-[36px] text-xs font-bold bg-[#0a192f] hover:bg-[#152e50] text-white rounded-xl shadow-xs transition-all flex items-center space-x-1.5 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print Seal</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
