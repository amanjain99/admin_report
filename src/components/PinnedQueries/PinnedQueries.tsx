import { Pin, X, Play, BarChart3, PieChart, TrendingUp, List, Hash } from 'lucide-react';
import type { PinnedQuery, VisualizationType } from '../../types';

interface PinnedQueriesProps {
  queries: PinnedQuery[];
  onRun: (query: string) => void;
  onRemove: (id: string) => void;
}

function getTypeIcon(type: VisualizationType) {
  switch (type) {
    case 'single_stat':
      return <Hash className="w-4 h-4" />;
    case 'comparison':
      return <BarChart3 className="w-4 h-4" />;
    case 'distribution':
      return <PieChart className="w-4 h-4" />;
    case 'trend':
      return <TrendingUp className="w-4 h-4" />;
    case 'list':
      return <List className="w-4 h-4" />;
    default:
      return <Hash className="w-4 h-4" />;
  }
}

export function PinnedQueries({ queries, onRun, onRemove }: PinnedQueriesProps) {
  if (queries.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Pin className="w-5 h-5 text-[#E91E8C]" />
          <h3 className="font-semibold text-gray-900">Pinned Queries</h3>
        </div>
        <p className="text-sm text-gray-500 text-center py-8">
          No pinned queries yet. Pin frequently-asked questions for quick access.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-gray-100">
        <Pin className="w-5 h-5 text-[#E91E8C]" />
        <h3 className="font-semibold text-gray-900">Pinned Queries</h3>
        <span className="ml-auto text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
          {queries.length}
        </span>
      </div>
      
      <div className="divide-y divide-gray-100">
        {queries.map((query) => (
          <div 
            key={query.id}
            className="group flex items-center gap-3 px-6 py-3 hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-[#FCE4F2] text-[#E91E8C] flex items-center justify-center">
              {getTypeIcon(query.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-800 truncate">{query.title}</p>
              <p className="text-xs text-gray-400 truncate">{query.query}</p>
            </div>
            
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => onRun(query.query)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-[#E91E8C] hover:bg-[#FCE4F2] transition-colors"
                title="Run query"
              >
                <Play className="w-4 h-4" />
              </button>
              <button
                onClick={() => onRemove(query.id)}
                className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                title="Remove"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

