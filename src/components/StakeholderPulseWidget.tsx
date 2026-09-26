import React, { useState, useEffect } from 'react';
import {
  Zap,
  Star,
  Sparkles,
  Send,
  X,
  CheckCircle2,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  Smile,
  Meh,
  Frown,
  Rocket,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

interface Props {
  isEmbedded?: boolean;
  onClose?: () => void;
}

export const StakeholderPulseWidget: React.FC<Props> = ({ isEmbedded = false, onClose }) => {
  const { showToast, departments } = useApp();
  const { currentUser, currentRoleDefinition } = useAuth();

  const [isOpen, setIsOpen] = useState<boolean>(isEmbedded);
  const [rating, setRating] = useState<number>(5);
  const [selectedCategory, setSelectedCategory] = useState<string>('Curriculum & Teaching');
  const [quickFeedback, setQuickFeedback] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [pulseStats, setPulseStats] = useState<any>(null);

  const categories = [
    { id: 'Curriculum & Teaching', label: 'Curriculum & Teaching' },
    { id: 'Laboratory Infrastructure', label: 'Laboratory & High-Tech Labs' },
    { id: 'Placement & Internships', label: 'Placement & Coding Bootcamps' },
    { id: 'Wi-Fi & Digital Campus', label: 'Wi-Fi 6 & Digital Library' },
    { id: 'Faculty Mentorship', label: 'Faculty Proctoring & Care' },
  ];

  const emojis = [
    { score: 1, icon: Frown, label: 'Needs Urgent Work', color: 'text-red-500' },
    { score: 2, icon: Frown, label: 'Below Expectation', color: 'text-amber-500' },
    { score: 3, icon: Meh, label: 'Adequate', color: 'text-yellow-600' },
    { score: 4, icon: Smile, label: 'Very Good', color: 'text-emerald-500' },
    { score: 5, icon: Rocket, label: 'Exceptional', color: 'text-indigo-600' },
  ];

  const fetchStats = () => {
    fetch('/api/pulse-survey/stats')
      .then((r) => r.json())
      .then((data) => setPulseStats(data))
      .catch((err) => console.error('Failed to fetch pulse stats', err));
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/pulse-survey', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rating,
          category: selectedCategory,
          quickFeedback,
          stakeholderType: currentUser?.role || 'STUDENT',
          departmentId: currentUser?.departmentId || 'dept-1',
        }),
      });

      if (!res.ok) throw new Error('Pulse submission failed');
      const data = await res.json();
      setIsSubmitted(true);
      fetchStats();
      showToast('⚡ 30-Second Stakeholder Pulse logged successfully!', 'success');

      // Reset after 4 seconds if embedded or closed
      setTimeout(() => {
        setIsSubmitted(false);
        setQuickFeedback('');
        if (!isEmbedded) {
          setIsOpen(false);
        }
      }, 4000);
    } catch (err: any) {
      console.error(err);
      showToast('Error recording pulse: ' + (err.message || 'Server error'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // If not embedded and not open, render the sleek floating trigger button
  if (!isEmbedded && !isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 bg-[#0a192f] hover:bg-[#132c52] text-white border-2 border-[#ff7a50] rounded-full px-4 py-2.5 shadow-xl flex items-center space-x-2.5 transition-all hover:scale-105 cursor-pointer group"
        title="Share 30-second rapid feedback on today's campus experience"
      >
        <span className="relative flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff7a50] opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-[#ff7a50]" />
        </span>
        <Zap className="w-4 h-4 text-amber-300 group-hover:rotate-12 transition-transform" />
        <span className="text-xs font-black tracking-tight text-[#fffaf5]">
          30s Stakeholder Pulse
        </span>
      </button>
    );
  }

  const content = (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden text-slate-900">
      {/* Widget Header */}
      <div className="bg-[#0a192f] px-4 py-3.5 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-amber-400 to-[#ff7a50] flex items-center justify-center text-slate-900 font-black shadow-sm">
            <Zap className="w-4 h-4 text-slate-900" />
          </div>
          <div>
            <div className="flex items-center space-x-1.5">
              <span className="text-[10px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/30">
                Rapid Micro-Survey
              </span>
              <span className="text-[10px] text-slate-400">• 30 Seconds</span>
            </div>
            <h3 className="text-xs sm:text-sm font-black text-white">Stakeholder Pulse</h3>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {pulseStats && (
            <div className="hidden sm:flex items-center space-x-1 px-2 py-0.5 rounded-full bg-slate-800 text-[10px] font-bold text-amber-300 border border-slate-700">
              <TrendingUp className="w-3 h-3 text-emerald-400" />
              <span>{pulseStats.weeklyMoodIndex || 4.3}★ Mood Index</span>
            </div>
          )}
          {!isEmbedded && (
            <button
              onClick={() => {
                setIsOpen(false);
                if (onClose) onClose();
              }}
              className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Widget Body */}
      <div className="p-4 sm:p-5">
        {isSubmitted ? (
          <div className="py-6 text-center space-y-3">
            <div className="w-12 h-12 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 animate-bounce">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-extrabold text-slate-900">Pulse Logged in Real-Time!</h4>
            <p className="text-xs text-slate-600 max-w-xs mx-auto">
              Your rating has been synthesized into the institutional quality improvement index.
            </p>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 inline-block text-xs font-bold text-slate-700">
              Weekly Campus Mood: <span className="text-emerald-600 font-extrabold">{pulseStats?.weeklyMoodIndex || 4.3}★</span> • {pulseStats?.totalPulses || 840}+ responses recorded
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Step 1: Rating Selection */}
            <div>
              <label className="text-xs font-extrabold text-slate-800 block mb-2">
                1. How was your academic / campus experience this week?
              </label>
              <div className="grid grid-cols-5 gap-2">
                {emojis.map((e) => {
                  const Icon = e.icon;
                  const isSelected = rating === e.score;
                  return (
                    <button
                      key={e.score}
                      type="button"
                      onClick={() => setRating(e.score)}
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-blue-50 border-blue-500 shadow-xs scale-105 text-blue-900'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${e.color}`} />
                      <span className="text-[10px] font-black mt-1">{e.score}★</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Category Chips */}
            <div>
              <label className="text-xs font-extrabold text-slate-800 block mb-2">
                2. Which focal area are you evaluating?
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setSelectedCategory(c.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                      selectedCategory === c.id
                        ? 'bg-[#0a192f] text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200/60'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 3: Quick Voice / 1-Liner Remark */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-extrabold text-slate-800">
                  3. Quick 1-Liner (Optional)
                </label>
                <span className="text-[10px] text-slate-400">Anonymous</span>
              </div>
              <input
                type="text"
                value={quickFeedback}
                onChange={(e) => setQuickFeedback(e.target.value)}
                placeholder="e.g. Great practical sessions in AI Lab today..."
                className="w-full text-xs px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
                maxLength={120}
              />
            </div>

            {/* Step 4: Rapid Submit Button */}
            <div className="pt-1 flex items-center justify-between gap-3">
              <div className="flex items-center space-x-1.5 text-[11px] text-slate-500 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Persona: <strong>{currentRoleDefinition.title}</strong></span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-linear-to-r from-blue-600 via-indigo-600 to-blue-700 hover:opacity-95 text-white rounded-xl text-xs font-black transition-all shadow-xs flex items-center space-x-1.5 cursor-pointer disabled:opacity-50"
              >
                <Zap className="w-3.5 h-3.5 text-amber-300" />
                <span>{isSubmitting ? 'Logging...' : 'Submit Pulse (30s)'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Live Pulse Ticker */}
        {pulseStats?.recentPulses && pulseStats.recentPulses.length > 0 && !isSubmitted && (
          <div className="mt-4 pt-3 border-t border-slate-100">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1.5">
              Live Stakeholder Stream
            </span>
            <div className="space-y-1 max-h-20 overflow-y-auto pr-1 text-[11px] text-slate-600">
              {pulseStats.recentPulses.slice(0, 2).map((p: any) => (
                <div key={p.id} className="flex items-center justify-between p-1.5 bg-slate-50 rounded-lg">
                  <div className="flex items-center space-x-1.5 truncate">
                    <span className="text-amber-500 font-bold">{p.rating}★</span>
                    <span className="font-semibold text-slate-800 text-[10px]">{p.category}:</span>
                    <span className="text-slate-600 truncate">{p.quickFeedback}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 shrink-0 ml-2">{p.stakeholderType}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // If embedded in a page, return as regular component
  if (isEmbedded) {
    return content;
  }

  // Floating modal / drawer at bottom-right
  return (
    <div className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-2rem)] shadow-2xl animate-in fade-in slide-in-from-bottom-5">
      {content}
    </div>
  );
};
