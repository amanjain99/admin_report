import { useNavigate } from 'react-router-dom';
import { ArrowLeft, LayoutDashboard, Trash2, Plus } from 'lucide-react';
import { useDashboard } from '../hooks';
import { SingleStat, BarChartViz, PieChartViz, LineChartViz, RankedList } from '../components/Visualizations';
import type { SingleStatData, ComparisonData, DistributionData, TrendData, ListData, DashboardItem } from '../types';

interface DashboardCardProps {
  item: DashboardItem;
  onRemove: () => void;
}

function DashboardCard({ item, onRemove }: DashboardCardProps) {
  const { response } = item;
  const { type, title, subtitle, data } = response;

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
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md group">
      {/* Header */}
      <div className="flex items-start justify-between px-5 pt-5 pb-2">
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-semibold text-gray-900 truncate">{title}</h3>
          {subtitle && (
            <p className="text-xs text-gray-500 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        
        {/* Remove button */}
        <button
          onClick={onRemove}
          className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
          title="Remove from dashboard"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {/* Visualization */}
      <div className="px-5 pb-5">
        {renderVisualization()}
      </div>
    </div>
  );
}

export function DashboardPage() {
  const navigate = useNavigate();
  const { dashboardItems, removeFromDashboard } = useDashboard();

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#2196F3] to-[#64B5F6] flex items-center justify-center">
                  <LayoutDashboard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
                  <p className="text-sm text-gray-500">
                    {dashboardItems.length} {dashboardItems.length === 1 ? 'item' : 'items'} saved
                  </p>
                </div>
              </div>
            </div>

            <button
              onClick={() => navigate('/results')}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#E91E8C] text-white rounded-xl text-sm font-medium hover:bg-[#D1177D] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add from Analytics</span>
            </button>
          </div>
        </div>
      </header>

      {/* Divider line */}
      <div className="h-1 bg-gradient-to-r from-[#2196F3] via-[#2196F3] to-[#64B5F6]" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {dashboardItems.length === 0 ? (
          /* Empty State */
          <div className="flex flex-col items-center justify-center py-20">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
              <LayoutDashboard className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your dashboard is empty</h2>
            <p className="text-gray-500 text-center max-w-md mb-8">
              Start building your custom dashboard by adding query results from the Usage Analytics page.
            </p>
            <button
              onClick={() => navigate('/results')}
              className="flex items-center gap-2 px-6 py-3 bg-[#E91E8C] text-white rounded-xl text-sm font-medium hover:bg-[#D1177D] transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Go to Usage Analytics</span>
            </button>
          </div>
        ) : (
          /* Dashboard Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dashboardItems.map((item) => (
              <DashboardCard
                key={item.id}
                item={item}
                onRemove={() => removeFromDashboard(item.id)}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

