import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  Clock, 
  MessageSquare,
  ChevronRight,
  Lightbulb
} from 'lucide-react';

const suggestedQueries = [
  'How many teachers use accommodations?',
  'Compare content types by sessions',
  'What are the top question types?',
  'Show monthly session trends',
];

const recentQueries = [
  'Total sessions this month',
  'Teachers using differentiation',
];

export function QuerySidebar() {
  const [query, setQuery] = useState('');
  const [isExpanded, setIsExpanded] = useState(true);
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (query.trim()) {
      navigate(`/results?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (query.trim()) {
        handleSubmit();
      }
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    navigate(`/results?q=${encodeURIComponent(suggestion)}`);
  };

  return (
    <aside className="w-80 bg-white border-l border-gray-200 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E91E8C] to-[#FF6B9D] flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-gray-900 text-sm">AI Analytics</h2>
            <p className="text-xs text-gray-500">Ask about your data</p>
          </div>
        </div>
      </div>

      {/* Query Input */}
      <div className="p-4">
        <div className="relative">
          <div className="bg-gray-50 rounded-xl border border-gray-200 focus-within:border-[#E91E8C] focus-within:ring-2 focus-within:ring-[#E91E8C]/10 transition-all">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask a question about your usage data..."
              className="w-full px-4 py-3 bg-transparent text-sm text-gray-800 placeholder-gray-400 resize-none border-none outline-none min-h-[80px]"
              rows={3}
            />
            <div className="flex items-center justify-between px-3 pb-2">
              <span className="text-xs text-gray-400">Press Enter to ask</span>
              <button
                onClick={handleSubmit}
                disabled={!query.trim()}
                className={`p-2 rounded-lg transition-all ${
                  query.trim()
                    ? 'bg-[#E91E8C] text-white hover:bg-[#D1177D]'
                    : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Suggestions */}
      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {/* Suggested Queries */}
        <div className="mb-6">
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 w-full"
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>Suggestions</span>
            <ChevronRight className={`w-3.5 h-3.5 ml-auto transition-transform ${isExpanded ? 'rotate-90' : ''}`} />
          </button>
          
          {isExpanded && (
            <div className="space-y-2">
              {suggestedQueries.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full text-left px-3 py-2.5 bg-gradient-to-r from-[#FCE4F2] to-[#FEF3F8] rounded-lg text-sm text-gray-700 hover:from-[#F8D4E8] hover:to-[#FCE4F2] transition-all group"
                >
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-3.5 h-3.5 text-[#E91E8C] flex-shrink-0" />
                    <span className="line-clamp-2">{suggestion}</span>
                    <ChevronRight className="w-3.5 h-3.5 text-gray-400 ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Recent Queries */}
        {recentQueries.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">
              <Clock className="w-3.5 h-3.5" />
              <span>Recent</span>
            </div>
            <div className="space-y-1.5">
              {recentQueries.map((recentQuery, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(recentQuery)}
                  className="w-full text-left px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  {recentQuery}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-500 text-center">
          Powered by AI • Data refreshed daily
        </p>
      </div>
    </aside>
  );
}

