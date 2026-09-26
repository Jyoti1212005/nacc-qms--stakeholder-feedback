import React, { useState, useEffect } from 'react';
import {
  BrainCircuit,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ThumbsUp,
  ThumbsDown,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { AIInsightItem } from '../types';

export const AiAnalyticsPage: React.FC = () => {
  const { selectedAcademicYear, showToast } = useApp();
  const { currentUser, hasRole } = useAuth();

  const [insights, setInsights] = useState<AIInsightItem[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [topic, setTopic] = useState('Curriculum & Infrastructure Quality');
  const [isLoading, setIsLoading] = useState(true);

  const loadInsights = () => {
    setIsLoading(true);
    fetch('/api/ai/insights')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setInsights(data);
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    loadInsights();
  }, [selectedAcademicYear]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const res = await fetch('/api/ai/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic }),
      });

      if (res.ok) {
        showToast('Qualitative feedback synthesis completed successfully!', 'success');
        loadInsights();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const res = await fetch(`/api/ai/insights/${id}/approve`, { method: 'POST' });
      if (res.ok) {
        showToast('Qualitative analysis officially verified and approved by IQAC!', 'success');
        loadInsights();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center space-x-2">
            <span className="px-2 py-0.5 text-[10px] font-bold bg-indigo-100 text-indigo-800 rounded uppercase flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-indigo-600" />
              <span>NLP Sentiment Pipeline</span>
            </span>
            <span className="text-xs text-slate-400">• Qualitative Synthesis</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Qualitative Feedback Synthesis & Sentiment Analysis
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Automated thematic clustering, sentiment extraction, and recommended CAPA formulation grounded strictly in stakeholder text submissions.
          </p>
        </div>

        {/* Action Trigger */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            aria-label="Select quality analysis domain"
            className="min-h-[44px] text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 cursor-pointer"
          >
            <option value="Curriculum & Infrastructure Quality">Curriculum & Infrastructure</option>
            <option value="Placement Readiness & Industry Bootcamps">Placement Readiness</option>
            <option value="Laboratory Facilities & Library Resources">Labs & Library Resources</option>
            <option value="Teaching Pedagogy & Mentorship">Teaching Pedagogy</option>
          </select>

          {hasRole(['SUPER_ADMIN', 'IQAC_ADMIN']) && (
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="min-h-[44px] px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 cursor-pointer shadow-xs whitespace-nowrap"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Synthesizing...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Generate New Synthesis</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Mandatory Regulatory Verification Notice */}
      <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-center justify-between text-xs text-amber-900">
        <div className="flex items-center space-x-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span className="font-bold">Automated Feedback Analysis • IQAC Verification Required</span>
          <span className="hidden md:inline text-amber-700">
            — All automated feedback summaries must be verified and ratified by the IQAC director before inclusion in official reports.
          </span>
        </div>
      </div>

      {/* Insights List */}
      <div className="space-y-5">
        {insights.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-indigo-300 transition-all space-y-5"
          >
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {item.category}
                  </span>
                  <span className="text-xs text-slate-400">
                    Sample: {item.sampleSize} Responses • Confidence: {(item.confidence * 100).toFixed(0)}%
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">{item.title}</h3>
              </div>

              {/* Status */}
              <div>
                {item.isApproved ? (
                  <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full border border-emerald-200 flex items-center space-x-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>IQAC Approved ({item.reviewedBy || 'Director'})</span>
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold rounded-full border border-amber-200">
                    Pending Institutional Review
                  </span>
                )}
              </div>
            </div>

            {/* Executive Synthesis Summary */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Executive Synthesis
              </span>
              <p className="text-xs text-slate-700 leading-relaxed font-medium">{item.summary}</p>
            </div>

            {/* Strengths & Concerns Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Strengths */}
              <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-2">
                <h4 className="text-xs font-bold text-emerald-900 flex items-center space-x-1.5">
                  <ThumbsUp className="w-4 h-4 text-emerald-600" />
                  <span>Major Institutional Strengths</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-emerald-950">
                  {item.majorStrengths.map((str, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Concerns */}
              <div className="p-4 bg-red-50/50 rounded-xl border border-red-100 space-y-2">
                <h4 className="text-xs font-bold text-red-900 flex items-center space-x-1.5">
                  <ThumbsDown className="w-4 h-4 text-red-600" />
                  <span>Major Stakeholder Concerns</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-red-950">
                  {item.majorConcerns.map((con, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-red-500 font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Emerging Trends & Suggested CAPA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Emerging Trends */}
              <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100 space-y-2">
                <h4 className="text-xs font-bold text-blue-900 flex items-center space-x-1.5">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span>Emerging Stakeholder Trends</span>
                </h4>
                <ul className="space-y-1 text-xs text-blue-950">
                  {item.emergingTrends.map((tr, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-blue-500 font-bold">&rarr;</span>
                      <span>{tr}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Suggested CAPA */}
              <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-2">
                <h4 className="text-xs font-bold text-purple-900 flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-purple-600" />
                  <span>Recommended Action Plans (CAPA)</span>
                </h4>
                <ul className="space-y-1 text-xs text-purple-950">
                  {item.suggestedCAPA.map((capa, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-purple-500 font-bold">&#10003;</span>
                      <span>{capa}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Verification Footer */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Generated at: {new Date(item.createdAt).toLocaleString()}
              </span>

              {!item.isApproved && hasRole(['SUPER_ADMIN', 'IQAC_ADMIN']) && (
                <button
                  onClick={() => handleApprove(item.id)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verify & Approve for Official Report</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
