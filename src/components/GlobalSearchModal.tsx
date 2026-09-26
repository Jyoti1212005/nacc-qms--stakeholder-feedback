import React, { useState, useEffect } from 'react';
import { Search, X, ArrowRight, FileText, CheckSquare, Award, Building2, FileCheck2 } from 'lucide-react';
import { useApp, NavigationPage } from '../context/AppContext';

export const GlobalSearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setActivePage } = useApp();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ type: string; title: string; subtitle: string; link: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isSearchOpen) {
      setQuery('');
      setResults([]);
      return;
    }
  }, [isSearchOpen]);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timer = setTimeout(() => {
      setIsLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.results || []);
        })
        .catch((err) => console.warn('Search query failed:', err))
        .finally(() => setIsLoading(false));
    }, 200);

    return () => clearTimeout(timer);
  }, [query]);

  if (!isSearchOpen) return null;

  const handleSelect = (link: string) => {
    setIsSearchOpen(false);
    if (link.includes('forms')) setActivePage('feedback');
    else if (link.includes('action')) setActivePage('action-plans');
    else if (link.includes('evidence')) setActivePage('evidence');
    else if (link.includes('indicator')) setActivePage('quality-indicators');
    else if (link.includes('dept')) setActivePage('department');
  };

  const getIconForType = (type: string) => {
    switch (type) {
      case 'Survey Form':
        return <FileText className="w-4 h-4 text-blue-500" />;
      case 'CAPA Action':
        return <CheckSquare className="w-4 h-4 text-purple-500" />;
      case 'Evidence':
        return <FileCheck2 className="w-4 h-4 text-emerald-500" />;
      case 'Indicator':
        return <Award className="w-4 h-4 text-amber-500" />;
      case 'Department':
        return <Building2 className="w-4 h-4 text-cyan-500" />;
      default:
        return <Search className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0a192f]/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4 animate-in fade-in duration-100">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-[#fed7aa] overflow-hidden">
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#f3e8e0] flex items-center space-x-3 bg-[#fffaf5]">
          <Search className="w-5 h-5 text-[#ff7a50] shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search surveys, indicators, action plans, evidence, departments..."
            className="w-full bg-transparent text-sm text-[#0a192f] focus:outline-hidden placeholder:text-slate-400"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 p-1 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2 py-1 text-[11px] font-semibold bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa] rounded hover:bg-[#ffe5d4] transition-colors"
          >
            ESC
          </button>
        </div>

        {/* Results Body */}
        <div className="max-h-96 overflow-y-auto p-2">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-slate-500">Searching institutional records...</div>
          ) : query.trim().length >= 2 && results.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-500">
              No matching records found for "{query}".
            </div>
          ) : query.trim().length < 2 ? (
            <div className="p-6 text-center text-xs text-slate-400">
              Type at least 2 characters to search across all institutional modules.
            </div>
          ) : (
            <div className="divide-y divide-[#f5ece5]">
              {results.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelect(item.link)}
                  className="w-full text-left p-3 rounded-xl hover:bg-[#fff5ee] flex items-center justify-between transition-colors group cursor-pointer"
                >
                  <div className="flex items-center space-x-3">
                    <div className="p-2 rounded-lg bg-[#fff0e6] text-[#c2410c] group-hover:bg-[#ff7a50] group-hover:text-white transition-colors">
                      {getIconForType(item.type)}
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-[#0a192f] group-hover:text-[#c2410c]">
                          {item.title}
                        </span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#fff0e6] text-[#c2410c] border border-[#fed7aa] font-medium">
                          {item.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[#ff7a50] transition-colors" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-4 py-2.5 bg-[#fffaf5] border-t border-[#f3e8e0] flex items-center justify-between text-[11px] text-slate-500">
          <span>Global Institutional Search</span>
          <span>Press ESC to exit</span>
        </div>
      </div>
    </div>
  );
};
