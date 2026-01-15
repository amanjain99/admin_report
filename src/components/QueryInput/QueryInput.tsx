import { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Search, Sparkles, ArrowUp, Loader2 } from 'lucide-react';
import { getQuerySuggestions } from '../../services/queryParser';

interface QueryInputProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

export function QueryInput({ onSubmit, isLoading, placeholder = "Ask a question about your usage data..." }: QueryInputProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);

  // Update suggestions when query changes
  useEffect(() => {
    if (query.trim()) {
      const newSuggestions = getQuerySuggestions(query);
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      // Show default suggestions when empty
      setSuggestions(getQuerySuggestions(''));
      setShowSuggestions(false);
    }
    setSelectedIndex(-1);
  }, [query]);

  // Handle click outside to close suggestions
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = () => {
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
      setQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    onSubmit(suggestion);
    setQuery('');
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
        handleSuggestionClick(suggestions[selectedIndex]);
      } else {
        handleSubmit();
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, suggestions.length - 1));
      setShowSuggestions(true);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
      setSelectedIndex(-1);
    }
  };

  return (
    <div className="relative w-full max-w-3xl mx-auto">
      {/* Main input container */}
      <div className="relative bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-200 overflow-hidden transition-all hover:shadow-xl hover:border-gray-300 focus-within:shadow-xl focus-within:border-[#E91E8C]/30 focus-within:ring-4 focus-within:ring-[#E91E8C]/10">
        <div className="flex items-center gap-3 px-5 py-4">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E91E8C] to-[#FF6B9D] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          
          {/* Input */}
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(suggestions.length > 0 || query.length === 0)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isLoading}
            className="flex-1 text-gray-800 placeholder-gray-400 bg-transparent border-none outline-none text-base"
          />
          
          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!query.trim() || isLoading}
            className={`flex-shrink-0 w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
              query.trim() && !isLoading
                ? 'bg-[#E91E8C] text-white hover:bg-[#D1177D] cursor-pointer'
                : 'bg-gray-100 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <ArrowUp className="w-5 h-5" />
            )}
          </button>
        </div>
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div 
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg shadow-gray-200/50 border border-gray-200 overflow-hidden z-50"
        >
          <div className="p-2">
            <p className="px-3 py-2 text-xs font-medium text-gray-400 uppercase tracking-wider">
              Suggested questions
            </p>
            {suggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => handleSuggestionClick(suggestion)}
                className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-left transition-colors ${
                  index === selectedIndex
                    ? 'bg-[#FCE4F2] text-[#E91E8C]'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <span className="text-sm">{suggestion}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Helper text */}
      <p className="text-center text-xs text-gray-400 mt-3">
        Press Enter to ask • Try "Top schools by student responses" or "Compare all content types"
      </p>
    </div>
  );
}

