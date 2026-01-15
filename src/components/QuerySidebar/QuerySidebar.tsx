import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Send, 
  Lightbulb,
  Zap
} from 'lucide-react';

const suggestedQueries = [
  { emoji: '👥', text: 'How many teachers use accommodations?' },
  { emoji: '📊', text: 'Compare content types by sessions' },
  { emoji: '❓', text: 'What are the top question types?' },
  { emoji: '📈', text: 'Show monthly session trends' },
];

export function QuerySidebar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
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
    <aside className="w-80 flex flex-col h-full overflow-hidden relative">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-sky-100 to-violet-200" />
      
      {/* Animated Floating Blobs */}
      <div 
        className="absolute top-20 left-8 w-32 h-32 rounded-full bg-pink-300/40 blur-2xl animate-pulse"
        style={{ animationDuration: '3s' }}
      />
      <div 
        className="absolute top-1/2 right-4 w-28 h-28 rounded-full bg-violet-400/30 blur-2xl animate-pulse"
        style={{ animationDuration: '4s', animationDelay: '1s' }}
      />
      <div 
        className="absolute bottom-32 left-12 w-24 h-24 rounded-full bg-cyan-300/40 blur-2xl animate-pulse"
        style={{ animationDuration: '3.5s', animationDelay: '0.5s' }}
      />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full p-4 gap-4 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center gap-3 p-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-400 via-rose-500 to-violet-500 flex items-center justify-center shadow-lg shadow-pink-300/40">
            <Zap className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 text-lg">Ask away</h2>
            <p className="text-sm text-slate-500">Intelligent insights, instantly</p>
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Suggestions Section */}
        <div>
          <div className="flex items-center gap-2 mb-3 px-1">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Suggestions</span>
          </div>
          
          <div className="space-y-2">
            {suggestedQueries.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion.text)}
                className="w-full text-left px-4 py-3 backdrop-blur-xl bg-white/70 rounded-xl border border-white/50 shadow-sm text-sm text-slate-700 hover:bg-white/90 hover:border-pink-200 hover:shadow-md hover:shadow-pink-100/50 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <span className="text-lg">{suggestion.emoji}</span>
                  <span className="line-clamp-2">{suggestion.text}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Input Card */}
        <div 
          className={`backdrop-blur-xl bg-white/70 rounded-2xl p-4 border shadow-lg transition-all duration-300 ${
            isFocused 
              ? 'border-pink-300 shadow-pink-200/50' 
              : 'border-white/50 shadow-violet-200/30'
          }`}
        >
          <textarea
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="Ask anything about your data..."
            className="w-full bg-transparent text-sm text-slate-700 placeholder-slate-400 resize-none border-none outline-none min-h-[60px]"
            rows={2}
          />
          <div className="border-t border-slate-200/50 pt-3 mt-2 flex items-center justify-end">
            <button
              onClick={handleSubmit}
              disabled={!query.trim()}
              className={`px-5 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-all duration-300 ${
                query.trim()
                  ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white hover:from-pink-600 hover:to-violet-600 shadow-lg shadow-pink-300/40'
                  : 'bg-slate-200/50 text-slate-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-4 h-4" />
              Ask
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center py-2">
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <Sparkles className="w-3.5 h-3.5 text-pink-400" />
            <span>Powered by AI</span>
            <span className="mx-1">•</span>
            <span>Data refreshed daily</span>
          </div>
        </div>
      </div>
    </aside>
  );
}

