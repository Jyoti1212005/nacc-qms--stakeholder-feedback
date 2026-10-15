import React, { useState, useEffect } from 'react';
import {
  X,
  Globe,
  Building2,
  CheckCircle2,
  RefreshCw,
  Upload,
  FileSpreadsheet,
  Award,
  Users,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ExternalLink,
  MapPin,
  Mail,
  Phone,
  Sparkles,
  AlertCircle,
  FileDown,
} from 'lucide-react';

interface CollegeWebsiteImporterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSyncComplete?: () => void;
}

export const CollegeWebsiteImporterModal: React.FC<CollegeWebsiteImporterModalProps> = ({
  isOpen,
  onClose,
  onSyncComplete,
}) => {
  const [activeTab, setActiveTab] = useState<'ptu-profile' | 'scrape-new' | 'csv-import'>('ptu-profile');
  const [urlInput, setUrlInput] = useState('https://ptu.ac.in/');
  const [isScraping, setIsScraping] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [scrapeResult, setScrapeResult] = useState<any>(null);
  const [scrapeError, setScrapeError] = useState('');
  const [syncSuccessMsg, setSyncSuccessMsg] = useState('');

  // CSV Import State
  const [csvType, setCsvType] = useState<'STUDENT' | 'FACULTY'>('STUDENT');
  const [csvContent, setCsvContent] = useState('');
  const [isImportingCsv, setIsImportingCsv] = useState(false);
  const [csvImportResult, setCsvImportResult] = useState<any>(null);

  // Institution Profile State
  const [instProfile, setInstProfile] = useState<any>(null);
  const [departmentsList, setDepartmentsList] = useState<any[]>([]);
  const [programmesList, setProgrammesList] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadCurrentProfile();
    }
  }, [isOpen]);

  const loadCurrentProfile = async () => {
    try {
      const res = await fetch('/api/institution/profile');
      if (res.ok) {
        const data = await res.json();
        setInstProfile(data.profile);
        setDepartmentsList(data.departments || []);
        setProgrammesList(data.programmes || []);
      }
    } catch (err) {
      console.error('Failed to load profile:', err);
    }
  };

  const handleSyncPtu = async () => {
    setIsSyncing(true);
    setSyncSuccessMsg('');
    try {
      const res = await fetch('/api/institution/sync-ptu', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSyncSuccessMsg('IKGPTU data synchronized into Supabase PostgreSQL database successfully!');
        setDepartmentsList(data.departments || []);
        setProgrammesList(data.programmes || []);
        if (onSyncComplete) onSyncComplete();
      }
    } catch (err) {
      console.error('Sync failed:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  const handleScrapeUrl = async () => {
    if (!urlInput.trim()) return;
    setIsScraping(true);
    setScrapeError('');
    setScrapeResult(null);
    try {
      const res = await fetch('/api/institution/scrape-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: urlInput.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setScrapeResult(data);
      } else {
        setScrapeError(data.error || 'Failed to scrape website data.');
      }
    } catch (err: any) {
      setScrapeError(err.message || 'Network error while scraping URL.');
    } finally {
      setIsScraping(false);
    }
  };

  const handleCsvImport = async () => {
    if (!csvContent.trim()) return;
    setIsImportingCsv(true);
    setCsvImportResult(null);

    try {
      // Parse CSV lines
      const lines = csvContent.trim().split('\n');
      const headers = lines[0].split(',').map((h) => h.trim().toLowerCase());
      const records: any[] = [];

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i].trim();
        if (!line) continue;
        const vals = line.split(',').map((v) => v.trim());
        const record: any = {};
        headers.forEach((h, idx) => {
          record[h] = vals[idx] || '';
        });
        records.push(record);
      }

      const res = await fetch('/api/institution/import-bulk-csv', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: csvType, records }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setCsvImportResult(data);
        setCsvContent('');
        if (onSyncComplete) onSyncComplete();
      } else {
        alert(data.error || 'Import failed');
      }
    } catch (err: any) {
      alert('Error parsing CSV: ' + err.message);
    } finally {
      setIsImportingCsv(false);
    }
  };

  const handleDownloadSampleCsv = (type: 'STUDENT' | 'FACULTY') => {
    let sample = '';
    if (type === 'STUDENT') {
      sample = 'fullName,email,departmentId\nGurpreet Singh,gurpreet.cse22@ptu.ac.in,dept-1\nSimran Kaur,simran.mba23@ptu.ac.in,dept-4\nHarmanpreet Singh,harman.civil@ptu.ac.in,dept-3\n';
    } else {
      sample = 'fullName,email,departmentId\nDr. Monika Sachdeva,hod.cse@ptu.ac.in,dept-1\nDr. Neel Kanth Grover,hod.mech@ptu.ac.in,dept-2\nDr. Harmeen Soch,hod.mba@ptu.ac.in,dept-4\n';
    }
    const blob = new Blob([sample], { type: 'text/csv' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Sample_${type}_List_IKGPTU.csv`;
    link.click();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-5 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-base text-white tracking-tight">
                  College Website Data Importer & University Profile
                </h3>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-semibold border border-emerald-400/30">
                  Live Synced: IKGPTU
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Official institutional profile crawled from <strong className="text-white">https://ptu.ac.in/</strong>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center px-5 pt-3 bg-slate-50 border-b border-slate-200 gap-2 overflow-x-auto">
          {[
            { id: 'ptu-profile', label: 'IKGPTU Official Profile', icon: Building2 },
            { id: 'scrape-new', label: 'Scrape / Enter College URL', icon: Globe },
            { id: 'csv-import', label: 'Bulk Student / Faculty CSV Upload', icon: FileSpreadsheet },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3.5 py-2 text-xs font-semibold rounded-t-xl transition-all flex items-center space-x-1.5 border-t border-x cursor-pointer ${
                  isActive
                    ? 'bg-white text-blue-600 border-slate-200 font-bold -mb-px shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 border-transparent hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body */}
        <div className="flex-1 p-5 overflow-y-auto space-y-5 bg-white text-slate-900">
          {/* TAB 1: IKGPTU OFFICIAL PROFILE */}
          {activeTab === 'ptu-profile' && (
            <div className="space-y-5">
              {/* University Profile Hero Card */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 text-white shadow-md border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/30 text-blue-200 border border-blue-400/30 uppercase">
                        State Technical University
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                        NAAC Grade 'B' (Accredited)
                      </span>
                    </div>
                    <h2 className="text-lg sm:text-xl font-extrabold text-white mt-1.5 tracking-tight">
                      {instProfile?.name || 'I.K. Gujral Punjab Technical University (IKGPTU)'}
                    </h2>
                    <p className="text-xs text-blue-200/90 mt-1 flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span>{instProfile?.address || 'Jalandhar - Kapurthala Highway, Punjab - 144603'}</span>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    <a
                      href="https://ptu.ac.in/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center space-x-1.5 transition-colors border border-white/20"
                    >
                      <span>Visit ptu.ac.in</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>

                    <button
                      onClick={handleSyncPtu}
                      disabled={isSyncing}
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-all shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                      <span>{isSyncing ? 'Syncing...' : 'Sync to Supabase'}</span>
                    </button>
                  </div>
                </div>

                {syncSuccessMsg && (
                  <div className="mt-3 p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{syncSuccessMsg}</span>
                  </div>
                )}

                {/* Key Metrics Quick Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-white/10 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Vice Chancellor</span>
                    <p className="font-bold text-white truncate">{instProfile?.viceChancellor || 'Prof. (Dr.) Susheel Mittal'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Director IQAC</span>
                    <p className="font-bold text-white truncate">{instProfile?.iqacDirector || 'Prof. Rajiv Chauhan'}</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Departments</span>
                    <p className="font-bold text-white">{departmentsList.length || 7} Academic Departments</p>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-semibold">Degrees Offered</span>
                    <p className="font-bold text-white">{programmesList.length || 8} Approved Programmes</p>
                  </div>
                </div>
              </div>

              {/* Official Vision & Mission (NAAC Criteria 6) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                    Official University Vision (NAAC 6.1)
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{instProfile?.vision || 'To be an institution of excellence in the domain of higher technical education that serves as the fountain head for nurturing the future leaders of technology...'}"
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-[10px] font-bold text-blue-600 uppercase tracking-wider block mb-1">
                    Official University Mission (NAAC 6.1)
                  </span>
                  <p className="text-xs text-slate-700 leading-relaxed italic">
                    "{instProfile?.mission || 'To provide seamless education through the pioneering use of technology, in partnership with industry and society with a view to promote research, discovery and entrepreneurship...'}"
                  </p>
                </div>
              </div>

              {/* Real Departments & HoDs List */}
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
                    <Building2 className="w-3.5 h-3.5 text-blue-600" />
                    <span>IKGPTU Academic Departments & Leadership Registry</span>
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">
                    {departmentsList.length} Verified Departments
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {departmentsList.map((dept) => (
                    <div
                      key={dept.id}
                      className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-colors shadow-2xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {dept.code}
                          </span>
                          <span className="text-[10px] text-slate-400">Est. {dept.establishedYear}</span>
                        </div>
                        <h5 className="text-xs font-bold text-slate-900 mt-1 line-clamp-1">{dept.name}</h5>
                        <p className="text-[11px] text-slate-600 mt-0.5">HoD: <strong className="text-slate-800">{dept.headOfDept}</strong></p>
                      </div>
                      <p className="text-[10px] text-blue-600 font-mono mt-2 truncate">{dept.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SCRAPE ANOTHER URL */}
          {activeTab === 'scrape-new' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-blue-900">
                <p className="font-semibold flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-blue-600" />
                  <span>College Website AI Crawler & Importer</span>
                </p>
                <p className="text-blue-700 mt-0.5">
                  Enter any college website URL (e.g., <code className="bg-white px-1.5 py-0.5 rounded border">https://ptu.ac.in/</code> or an affiliated campus). The scraper will extract departments, programmes, leadership, and accreditation information.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  placeholder="https://ptu.ac.in/"
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs font-medium focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
                <button
                  onClick={handleScrapeUrl}
                  disabled={isScraping}
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center justify-center space-x-1.5 shrink-0 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isScraping ? 'animate-spin' : ''}`} />
                  <span>{isScraping ? 'Crawling Website...' : 'Crawl & Preview Data'}</span>
                </button>
              </div>

              {scrapeError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{scrapeError}</span>
                </div>
              )}

              {scrapeResult && (
                <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300">
                      Website Crawl Successful
                    </span>
                    <span className="text-[11px] text-slate-500">{scrapeResult.source}</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{scrapeResult.profile?.name}</h4>
                    <p className="text-xs text-slate-600">{scrapeResult.crawlSummary}</p>
                  </div>

                  <div className="pt-2 border-t border-slate-200 flex justify-end">
                    <button
                      onClick={handleSyncPtu}
                      className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                    >
                      Apply & Sync Extracted Data to Supabase
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: BULK CSV IMPORT FOR STUDENTS & FACULTY */}
          {activeTab === 'csv-import' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-xs text-amber-900">
                <p className="font-semibold flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600" />
                  <span>Private Institutional Data (Students & Faculty Lists)</span>
                </p>
                <p className="text-amber-700 mt-0.5">
                  Student roll numbers and private emails cannot be scraped from public websites due to privacy protection. Upload your college CSV/Excel export here to inject students and faculty into the live database.
                </p>
              </div>

              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center space-x-2">
                  <label className="text-xs font-bold text-slate-700">Target Role:</label>
                  <select
                    value={csvType}
                    onChange={(e) => setCsvType(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-semibold bg-white cursor-pointer"
                  >
                    <option value="STUDENT">Students (UG / PG)</option>
                    <option value="FACULTY">Faculty & Teachers</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={() => handleDownloadSampleCsv(csvType)}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center space-x-1 transition-colors cursor-pointer"
                >
                  <FileDown className="w-3.5 h-3.5 text-blue-600" />
                  <span>Download Sample {csvType} CSV</span>
                </button>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Paste CSV Content (Format: fullName, email, departmentId):
                </label>
                <textarea
                  rows={5}
                  value={csvContent}
                  onChange={(e) => setCsvContent(e.target.value)}
                  placeholder={`fullName,email,departmentId\nGurpreet Singh,gurpreet.cse22@ptu.ac.in,dept-1\nSimran Kaur,simran.mba23@ptu.ac.in,dept-4`}
                  className="w-full p-3 rounded-xl border border-slate-300 text-xs font-mono focus:ring-2 focus:ring-blue-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-500">
                  Default login password for imported users will be: <code className="font-mono font-bold text-slate-800">Ptu@123</code>
                </span>

                <button
                  onClick={handleCsvImport}
                  disabled={isImportingCsv || !csvContent.trim()}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all shadow-xs cursor-pointer flex items-center space-x-1.5 disabled:opacity-50"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isImportingCsv ? 'Importing...' : `Import ${csvType}s to Database`}</span>
                </button>
              </div>

              {csvImportResult && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{csvImportResult.message} Total active users in system: {csvImportResult.totalUsers}</span>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
          <span>Synced with Supabase Cloud PostgreSQL • Ready for NAAC SSR SSR Metric 1.4.1 / 1.4.2</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-900 text-white hover:bg-slate-800 font-semibold transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
