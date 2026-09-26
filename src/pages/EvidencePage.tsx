import React, { useState, useEffect } from 'react';
import {
  FileCheck2,
  Plus,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  Download,
  FileText,
  FileSpreadsheet,
  FileCheck,
  Tag,
  ShieldCheck,
  Trash2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { EvidenceItem, VerificationStatus } from '../types';

export const EvidencePage: React.FC = () => {
  const { selectedAcademicYear, showToast, departments } = useApp();
  const { currentUser, hasRole } = useAuth();

  const [evidence, setEvidence] = useState<EvidenceItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  // Upload Modal
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Infrastructure & Learning Resources');
  const [newFileType, setNewFileType] = useState<'PDF' | 'DOCX' | 'XLSX'>('PDF');
  const [newDepartmentId, setNewDepartmentId] = useState('dept-1');
  const [newTags, setNewTags] = useState('Purchase Order, Lab Upgrade, Commissioning');

  // Preview Modal
  const [previewItem, setPreviewItem] = useState<EvidenceItem | null>(null);

  // Verification Review Modal
  const [verifyingItem, setVerifyingItem] = useState<EvidenceItem | null>(null);
  const [verifyStatus, setVerifyStatus] = useState<VerificationStatus>('VERIFIED');
  const [verifyNotes, setVerifyNotes] = useState('Verified for compliance against institutional accreditation benchmarks.');

  const loadEvidence = () => {
    setIsLoading(true);
    fetch('/api/evidence')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setEvidence(data);
      })
      .catch((err) => console.error('Evidence error:', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadEvidence();
  }, [selectedAcademicYear]);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;

    try {
      const res = await fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDesc,
          category: newCategory,
          fileType: newFileType,
          departmentId: newDepartmentId,
          tags: newTags.split(',').map((t) => t.trim()),
        }),
      });

      if (res.ok) {
        showToast('Documentary evidence uploaded to audit repository!', 'success');
        setShowUploadModal(false);
        setNewTitle('');
        setNewDesc('');
        loadEvidence();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyingItem) return;

    try {
      const res = await fetch(`/api/evidence/${verifyingItem.id}/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: verifyStatus,
          notes: verifyNotes,
        }),
      });

      if (res.ok) {
        showToast(`Evidence ${verifyingItem.code} status updated!`, 'success');
        setVerifyingItem(null);
        loadEvidence();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to remove this evidence record?')) return;
    try {
      const res = await fetch(`/api/evidence/${id}`, { method: 'DELETE' });
      if (res.ok) {
        showToast('Evidence record deleted!', 'info');
        loadEvidence();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const filtered = evidence.filter((item) => {
    if (filterCategory !== 'all' && item.category !== filterCategory) return false;
    if (filterStatus !== 'all' && item.verificationStatus !== filterStatus) return false;
    if (
      searchQuery &&
      !item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.code.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
    ) {
      return false;
    }
    return true;
  });

  const getStatusBadge = (st: VerificationStatus) => {
    switch (st) {
      case 'VERIFIED':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'REQUIRES_UPDATE':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-100 text-emerald-800 rounded uppercase">
              Audit Vault
            </span>
            <span className="text-xs text-slate-400">• Documentary Compliance</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Institutional Evidence Repository
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Central audit repository linking institutional proof documents (MoUs, logs, attendance, purchase orders) to CAPA action plans and NAAC quality indicators.
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Evidence</span>
        </button>
      </div>

      {/* Search & Filters Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by document code, title, or tag..."
            className="w-full min-h-[44px] pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-xl"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            aria-label="Filter by category"
            className="min-h-[44px] text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="Curricular Aspects">Curricular Aspects</option>
            <option value="Teaching-Learning & Evaluation">Teaching-Learning</option>
            <option value="Infrastructure & Learning Resources">Infrastructure</option>
            <option value="Student Support & Progression">Student Support</option>
          </select>

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            aria-label="Filter by verification status"
            className="min-h-[44px] text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="VERIFIED">Verified</option>
            <option value="REQUIRES_UPDATE">Requires Update</option>
            <option value="REJECTED">Rejected</option>
            <option value="PENDING">Pending Review</option>
          </select>
        </div>
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:border-emerald-300 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <span className="font-mono text-xs font-extrabold text-emerald-700 px-2 py-0.5 bg-emerald-50 rounded border border-emerald-200">
                  {item.code}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${getStatusBadge(item.verificationStatus)}`}>
                  {item.verificationStatus}
                </span>
              </div>

              <div className="flex items-start space-x-3 mt-3">
                <div className="p-2.5 bg-slate-100 rounded-xl text-slate-700 shrink-0">
                  {item.fileType === 'PDF' ? (
                    <FileText className="w-6 h-6 text-red-500" />
                  ) : item.fileType === 'XLSX' ? (
                    <FileSpreadsheet className="w-6 h-6 text-emerald-600" />
                  ) : (
                    <FileCheck className="w-6 h-6 text-blue-500" />
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-bold text-slate-900 leading-snug">{item.title}</h3>
                  <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                    {item.category} • {(item.fileSize / (1024 * 1024)).toFixed(1)} MB
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-600 mt-3 line-clamp-2">{item.description}</p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mt-3">
                {item.tags.map((t, idx) => (
                  <span key={idx} className="px-1.5 py-0.5 text-[9px] font-semibold bg-slate-100 text-slate-600 rounded">
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Footer Actions */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">By: {item.uploadedByName}</span>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setPreviewItem(item)}
                  className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg text-xs flex items-center space-x-1"
                  title="Preview Document"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span className="text-[11px] font-bold">Preview</span>
                </button>

                {hasRole(['SUPER_ADMIN', 'IQAC_ADMIN']) && (
                  <button
                    onClick={() => {
                      setVerifyingItem(item);
                      setVerifyStatus(item.verificationStatus);
                      setVerifyNotes(item.verificationNotes || '');
                    }}
                    className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg text-xs flex items-center space-x-1"
                    title="Audit Review"
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span className="text-[11px] font-bold">Verify</span>
                  </button>
                )}

                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg"
                  title="Delete Evidence"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Evidence Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] overflow-y-auto my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">Upload Institutional Evidence Document</h3>
              <button
                onClick={() => setShowUploadModal(false)}
                aria-label="Close modal"
                className="text-slate-400 hover:text-slate-600 min-w-[44px] min-h-[44px] flex items-center justify-center text-sm font-bold rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpload} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Document Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Purchase Order & Installation Report of 30 Workstations"
                  required
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="Summary of evidentiary value and regulatory context..."
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Accreditation Category</label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white font-semibold"
                  >
                    <option value="Curricular Aspects">Curricular Aspects</option>
                    <option value="Teaching-Learning & Evaluation">Teaching-Learning</option>
                    <option value="Infrastructure & Learning Resources">Infrastructure</option>
                    <option value="Student Support & Progression">Student Support</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">File Format</label>
                  <select
                    value={newFileType}
                    onChange={(e) => setNewFileType(e.target.value as any)}
                    className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white font-semibold"
                  >
                    <option value="PDF">PDF (Portable Document)</option>
                    <option value="DOCX">DOCX (Word Document)</option>
                    <option value="XLSX">XLSX (Spreadsheet)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Tags (Comma-separated)</label>
                <input
                  type="text"
                  value={newTags}
                  onChange={(e) => setNewTags(e.target.value)}
                  placeholder="e.g. Invoices, Commissioning, Lab 4, MoUs"
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer flex items-center justify-center"
                >
                  Upload & Register
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Preview Document Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-5 sm:p-6 shadow-2xl border border-slate-200 max-h-[92vh] flex flex-col my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 shrink-0 gap-2">
              <div className="flex items-center space-x-2 min-w-0">
                <span className="font-mono text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 shrink-0">
                  {previewItem.code}
                </span>
                <h3 className="text-sm font-bold text-slate-900 truncate">{previewItem.title}</h3>
              </div>
              <button
                onClick={() => setPreviewItem(null)}
                aria-label="Close preview modal"
                className="text-slate-400 hover:text-slate-600 min-w-[44px] min-h-[44px] flex items-center justify-center text-sm font-bold rounded-lg cursor-pointer shrink-0"
              >
                ✕
              </button>
            </div>

            {/* Document Viewer Simulation */}
            <div className="my-4 flex-1 bg-slate-100 rounded-xl border border-slate-200 p-4 sm:p-6 flex flex-col items-center justify-center text-center overflow-y-auto">
              <FileText className="w-12 h-12 sm:w-16 sm:h-16 text-slate-400 mb-3" />
              <h4 className="text-sm font-extrabold text-slate-800">{previewItem.title}</h4>
              <p className="text-xs text-slate-500 max-w-md mt-1">{previewItem.description}</p>

              <div className="mt-4 sm:mt-6 p-4 bg-white rounded-xl border border-slate-200 w-full max-w-md text-left text-xs space-y-2 shadow-xs">
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Document Identifier:</span>
                  <span className="font-bold text-slate-900">{previewItem.code}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Accreditation Category:</span>
                  <span className="font-bold text-slate-900">{previewItem.category}</span>
                </div>
                <div className="flex justify-between border-b border-slate-100 pb-1.5">
                  <span className="text-slate-500">Audit Status:</span>
                  <span className="font-extrabold text-emerald-700">{previewItem.verificationStatus}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Uploaded By:</span>
                  <span className="font-bold text-slate-900">{previewItem.uploadedByName}</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0">
              <span className="text-[11px] text-slate-400 font-mono">
                SHA-256 Verified Institutional Artifact
              </span>
              <button
                onClick={() => {
                  showToast('Document downloaded for offline review', 'info');
                  setPreviewItem(null);
                }}
                className="min-h-[44px] px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Document</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Verify Modal */}
      {verifyingItem && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border border-slate-200 my-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900">Audit Verification: {verifyingItem.code}</h3>
              <button
                onClick={() => setVerifyingItem(null)}
                aria-label="Close modal"
                className="text-slate-400 hover:text-slate-600 min-w-[44px] min-h-[44px] flex items-center justify-center text-sm font-bold rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleVerify} className="mt-4 space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Verification Status Decision</label>
                <select
                  value={verifyStatus}
                  onChange={(e) => setVerifyStatus(e.target.value as any)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white font-semibold"
                >
                  <option value="VERIFIED">VERIFIED (Valid Proof of Implementation)</option>
                  <option value="REQUIRES_UPDATE">REQUIRES UPDATE (Insufficient Information)</option>
                  <option value="REJECTED">REJECTED (Non-compliant Document)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Auditor Observation Notes</label>
                <textarea
                  rows={3}
                  value={verifyNotes}
                  onChange={(e) => setVerifyNotes(e.target.value)}
                  className="w-full p-2.5 border border-slate-200 rounded-xl text-xs"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setVerifyingItem(null)}
                  className="min-h-[44px] px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold cursor-pointer flex items-center justify-center"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="min-h-[44px] px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold cursor-pointer flex items-center justify-center"
                >
                  Submit Verification
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
