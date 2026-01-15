import React, { useEffect, useRef, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Download, ChevronDown, Phone, ArrowLeft, Sparkles, ArrowUp, Trash2, MessageCircle, Loader2, LayoutDashboard, FileDown } from 'lucide-react';
import { ResponseCard } from '../components/ResponseCard';
import { useQuery, useDashboard, useCart } from '../hooks';
import { mockWaygroundData } from '../data/mockData';

interface FilterDropdownProps {
  label: string;
  value: string;
}

function FilterDropdown({ label, value }: FilterDropdownProps) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs text-gray-500 font-medium">{label}</label>
      <button className="flex items-center justify-between gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm text-gray-700 hover:border-gray-300 transition-colors min-w-[160px]">
        <span>{value}</span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>
    </div>
  );
}

export function ResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialQuery = searchParams.get('q') || '';
  const { isLoading, conversation, submitQuery, clearConversation } = useQuery();
  const { addToDashboard, removeFromDashboard, isOnDashboard } = useDashboard();
  const { addToCart, removeFromCart, isInCart, cartCount } = useCart();
  const conversationEndRef = useRef<HTMLDivElement>(null);
  const hasSubmittedInitial = useRef(false);

  // Submit initial query on mount
  useEffect(() => {
    if (initialQuery && !hasSubmittedInitial.current) {
      hasSubmittedInitial.current = true;
      submitQuery(initialQuery);
    }
  }, [initialQuery, submitQuery]);

  // Auto-scroll to latest response
  useEffect(() => {
    if (conversationEndRef.current) {
      conversationEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversation]);

  const handleFollowUp = (query: string) => {
    submitQuery(query);
    setSearchParams({ q: query });
  };

  const handleNewQuery = (query: string) => {
    submitQuery(query);
    setSearchParams({ q: query });
  };

  const handleClear = () => {
    clearConversation();
    hasSubmittedInitial.current = false;
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Usage Analytics</h1>
                <p className="text-sm text-gray-500 mt-1">Quizizz</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-500">
                Last updated: <span className="text-gray-700 font-medium">{mockWaygroundData.lastUpdated}</span>
              </span>
              
              <button 
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:border-[#2196F3] hover:text-[#2196F3] transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>My Dashboard</span>
              </button>
              
              <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4" />
                <span>Export</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              
              <button className="flex items-center gap-2 px-5 py-2.5 bg-[#E91E8C] text-white rounded-xl text-sm font-medium hover:bg-[#D1177D] transition-colors">
                <Phone className="w-4 h-4" />
                <span>Contact your success partner</span>
              </button>
            </div>
          </div>
          
          {/* Filters */}
          <div className="flex items-end gap-4">
            <FilterDropdown label="Date range" value="Current school year" />
            <FilterDropdown label="Schools" value="Schools" />
            <FilterDropdown label="Subjects" value="Subjects" />
            <FilterDropdown label="Grades" value="Grades" />
          </div>
        </div>
      </header>

      {/* Divider line */}
      <div className="h-1 bg-gradient-to-r from-[#E91E8C] via-[#E91E8C] to-[#FF6B9D]" />

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-8 py-8 pb-32">
        {/* Tabs */}
        <div className="flex items-center gap-4 mb-8">
          <button className="px-5 py-2.5 bg-white rounded-xl text-sm font-medium text-gray-800 shadow-sm border border-gray-200">
            Overview
          </button>
          <button className="px-5 py-2.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            Details
          </button>
        </div>

        {/* Results Area */}
        <div className="space-y-6">
          {/* Clear conversation button */}
          {conversation.length > 0 && (
            <div className="flex justify-end">
              <button
                onClick={handleClear}
                className="flex items-center gap-2 px-3 py-1.5 text-sm text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear conversation
              </button>
            </div>
          )}

          {/* Conversation messages */}
          {conversation.map((message) => (
            <div key={message.id}>
              {message.type === 'user' ? (
                <div className="flex justify-end mb-4">
                  <div className="bg-[#E91E8C] text-white px-5 py-3 rounded-2xl rounded-tr-md max-w-md">
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ) : message.response ? (
                <ResponseCard
                  response={message.response}
                  isInCart={isInCart(message.response.id)}
                  onAddToCart={() => addToCart(message.response!)}
                  onRemoveFromCart={() => removeFromCart(message.response!.id)}
                  onFollowUp={handleFollowUp}
                  isOnDashboard={isOnDashboard(message.response.id)}
                  onAddToDashboard={() => addToDashboard(message.response!)}
                  onRemoveFromDashboard={() => removeFromDashboard(message.response!.id)}
                />
              ) : null}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex items-center gap-3 px-6 py-4 bg-white rounded-2xl border border-gray-200">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-[#E91E8C] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-[#E91E8C] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-[#E91E8C] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
              <span className="text-sm text-gray-500">Analyzing your data...</span>
            </div>
          )}

          <div ref={conversationEndRef} />
        </div>
      </main>

      {/* Query Input - Fixed at bottom */}
      <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#F9FAFB] via-[#F9FAFB] to-transparent pt-6 pb-6 px-8">
        <SearchInputCompact 
          onSubmit={handleNewQuery} 
          isLoading={isLoading} 
          cartCount={cartCount}
          onCartClick={() => navigate('/cart')}
        />
      </div>
    </div>
  );
}

// Compact search input for results page
interface SearchInputCompactProps {
  onSubmit: (query: string) => void;
  isLoading: boolean;
  cartCount: number;
  onCartClick: () => void;
}

function SearchInputCompact({ onSubmit, isLoading, cartCount, onCartClick }: SearchInputCompactProps) {
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (query.trim() && !isLoading) {
      onSubmit(query.trim());
      setQuery('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="relative max-w-3xl mx-auto flex items-center gap-3">
      <div className="flex-1 relative bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-200 overflow-hidden transition-all hover:shadow-xl hover:border-gray-300 focus-within:shadow-xl focus-within:border-[#E91E8C]/30 focus-within:ring-4 focus-within:ring-[#E91E8C]/10">
        <div className="flex items-center gap-3 px-5 py-4">
          <div className="flex-shrink-0">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#E91E8C] to-[#FF6B9D] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>
          
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask another question..."
            disabled={isLoading}
            className="flex-1 text-gray-800 placeholder-gray-400 bg-transparent border-none outline-none text-base"
          />
          
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

      {/* Export button */}
      <button
        onClick={onCartClick}
        className="relative flex-shrink-0 w-14 h-14 bg-white rounded-2xl shadow-lg shadow-gray-200/50 border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-emerald-50 hover:border-emerald-400 hover:text-emerald-600 transition-all hover:shadow-xl"
        title="View Export List"
      >
        <FileDown className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[22px] h-[22px] px-1.5 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-sm">
            {cartCount}
          </span>
        )}
      </button>
    </div>
  );
}

