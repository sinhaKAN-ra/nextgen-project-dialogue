import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp, BookOpen } from 'lucide-react';

interface SummaryPanelProps {
  userId?: string;
}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ userId }) => {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handleFetchSummary = async (scope: 'project' | 'user') => {
    setLoading(true);
    setError(null);
    setSummary(null);
    try {
      const res = await fetch('http://localhost:8000/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          scope === 'project' ? { scope } : { scope, user_id: userId || '' }
        ),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSummary(data.summary);
      }
    } catch (e) {
      setError('Failed to fetch summary.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full bg-gradient-to-r from-gray-800 to-gray-700 border border-gray-600 shadow-lg rounded-2xl p-6 my-8 mx-0 transition-all">
      <div className="flex items-center gap-4 mb-3">
        <BookOpen className="w-7 h-7 text-indigo-400" />
        <h3 className="text-xl font-bold text-gray-100 tracking-tight">Project & User Summary</h3>
      </div>
      <div className="flex gap-2 mb-4">
        <Button onClick={() => handleFetchSummary('project')} disabled={loading} variant="ghost">
          Project Summary
        </Button>
        <Button onClick={() => handleFetchSummary('user')} disabled={loading || !userId} variant="ghost">
          My Summary
        </Button>
      </div>
      {loading && <div className="text-blue-400 font-medium py-2">Loading summary...</div>}
      {error && <div className="text-red-400 font-medium py-2">{error}</div>}
      {summary && (
        <div className="mt-4 relative animate-fade-in-up">
          <div className="flex items-center justify-between mb-2">
            <span className="inline-block px-3 py-1 bg-indigo-600 text-white rounded-full text-xs font-medium">Summary</span>
            <button
              className="ml-2 px-2 py-1 bg-gray-800 hover:bg-gray-700 rounded text-xs text-gray-300 border border-gray-600 transition focus:outline-none focus:ring-2 focus:ring-indigo-400"
              title="Copy summary to clipboard"
              onClick={() => {
                navigator.clipboard.writeText(summary);
              }}
            >
              Copy
            </button>
          </div>
          <div className="bg-gray-950 border border-gray-800 rounded-lg p-6 text-base leading-relaxed text-gray-100 max-h-96 overflow-auto shadow-inner">
            <pre className="whitespace-pre-wrap break-words font-mono">{summary}</pre>
          </div>
        </div>
      )}
    </div>
  );
};

export default SummaryPanel;
