import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

interface ActionItemExtractorProps {
  initialText?: string;
}

const ActionItemExtractor: React.FC<ActionItemExtractorProps> = ({ initialText = '' }) => {
  const [text, setText] = useState(initialText);
  const [actionItems, setActionItems] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleExtract = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:8000/extract-actions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (data.error) {
        setError(data.error);
        setActionItems(null);
      } else {
        setActionItems(data.action_items);
      }
    } catch (e) {
      setError('Failed to extract action items.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto bg-gray-900 border border-gray-700 rounded-lg p-4 mt-4">
      <h3 className="text-lg font-semibold mb-2 text-gray-100">Extract Action Items</h3>
      <Textarea
        className="w-full mb-2 bg-gray-800 border border-gray-700 text-gray-100"
        rows={4}
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste conversation or summary here..."
      />
      <Button onClick={handleExtract} disabled={loading || !text.trim()} className="mb-2">
        {loading ? 'Extracting...' : 'Extract Action Items'}
      </Button>
      {error && <div className="text-red-400 mt-2">{error}</div>}
      {actionItems && (
        <div className="mt-4 bg-gray-800 border border-gray-700 rounded p-3">
          <h4 className="font-semibold text-gray-200 mb-2">Action Items:</h4>
          <pre className="text-gray-100 whitespace-pre-wrap">{actionItems}</pre>
        </div>
      )}
    </div>
  );
};

export default ActionItemExtractor;
