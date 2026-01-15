import { Pin, PinOff, MessageCircle, LayoutDashboard } from 'lucide-react';
import type { QueryResponse, SingleStatData, ComparisonData, DistributionData, TrendData, ListData } from '../../types';
import { SingleStat, BarChartViz, PieChartViz, LineChartViz, RankedList } from '../Visualizations';

interface ResponseCardProps {
  response: QueryResponse;
  isPinned: boolean;
  onPin: () => void;
  onUnpin: () => void;
  onFollowUp: (query: string) => void;
  isOnDashboard?: boolean;
  onAddToDashboard?: () => void;
  onRemoveFromDashboard?: () => void;
}

export function ResponseCard({ 
  response, 
  isPinned, 
  onPin, 
  onUnpin, 
  onFollowUp,
  isOnDashboard = false,
  onAddToDashboard,
  onRemoveFromDashboard,
}: ResponseCardProps) {
  const { type, title, subtitle, data, followUpSuggestions } = response;

  const renderVisualization = () => {
    switch (type) {
      case 'single_stat':
        return <SingleStat data={data as SingleStatData} />;
      case 'comparison':
        return <BarChartViz data={data as ComparisonData} />;
      case 'distribution':
        return <PieChartViz data={data as DistributionData} />;
      case 'trend':
        return <LineChartViz data={data as TrendData} />;
      case 'list':
        return <RankedList data={data as ListData} />;
      default:
        return <SingleStat data={data as SingleStatData} />;
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between px-6 pt-6 pb-2">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          {subtitle && (
            <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center gap-1">
          {/* Add to Dashboard button */}
          {onAddToDashboard && onRemoveFromDashboard && (
            <button
              onClick={isOnDashboard ? onRemoveFromDashboard : onAddToDashboard}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                isOnDashboard
                  ? 'bg-[#E8F4FD] text-[#2196F3] hover:bg-[#D4ECFC]'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
              }`}
              title={isOnDashboard ? 'Remove from dashboard' : 'Add to dashboard'}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>{isOnDashboard ? 'On Dashboard' : 'Add to Dashboard'}</span>
            </button>
          )}

          {/* Pin button */}
          <button
            onClick={isPinned ? onUnpin : onPin}
            className={`flex-shrink-0 p-2 rounded-lg transition-colors ${
              isPinned
                ? 'bg-[#FCE4F2] text-[#E91E8C] hover:bg-[#F9D5E8]'
                : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
            }`}
            title={isPinned ? 'Unpin this query' : 'Pin this query'}
          >
            {isPinned ? <PinOff className="w-5 h-5" /> : <Pin className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Visualization */}
      <div className="px-6 pb-4">
        {renderVisualization()}
      </div>

      {/* Follow-up suggestions */}
      {followUpSuggestions && followUpSuggestions.length > 0 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <MessageCircle className="w-4 h-4 text-gray-400" />
            <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
              Follow-up questions
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {followUpSuggestions.map((suggestion, index) => (
              <button
                key={index}
                onClick={() => onFollowUp(suggestion)}
                className="px-3 py-1.5 bg-white border border-gray-200 rounded-full text-sm text-gray-600 hover:border-[#E91E8C] hover:text-[#E91E8C] transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

