import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Trash2, FileText, Presentation, Download, X } from 'lucide-react';
import { useCart } from '../hooks';
import type { QueryResponse, SingleStatData, ComparisonData, DistributionData, TrendData, ListData } from '../types';
import { SingleStat, BarChartViz, PieChartViz, LineChartViz, RankedList } from '../components/Visualizations';

// Mini card preview component for cart items
function CartItemCard({ 
  response, 
  onRemove 
}: { 
  response: QueryResponse; 
  onRemove: () => void;
}) {
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
            <p className="text-sm text-gray-500 mt-0.5 truncate">{subtitle}</p>
          )}
        </div>
        
        <button
          onClick={onRemove}
          className="flex-shrink-0 p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors opacity-0 group-hover:opacity-100"
          title="Remove from cart"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Visualization */}
      <div className="px-5 pb-5">
        {renderVisualization()}
      </div>
    </div>
  );
}

export function CartPage() {
  const navigate = useNavigate();
  const { cartItems, removeFromCart, clearCart } = useCart();

  const handleExportPDF = async () => {
    if (cartItems.length === 0) return;
    
    // Dynamic import for PDF export
    const { exportToPDF } = await import('../services/exportPdf');
    await exportToPDF(cartItems.map(item => item.response));
  };

  const handleExportSlides = async () => {
    if (cartItems.length === 0) return;
    
    // Dynamic import for slides export
    const { exportToSlides } = await import('../services/exportSlides');
    await exportToSlides(cartItems.map(item => item.response));
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate(-1)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Export Cart</h1>
                  <p className="text-sm text-gray-500">
                    {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in cart
                  </p>
                </div>
              </div>
            </div>
            
            {cartItems.length > 0 && (
              <div className="flex items-center gap-3">
                <button
                  onClick={clearCart}
                  className="flex items-center gap-2 px-4 py-2.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Clear All</span>
                </button>
                
                <div className="h-8 w-px bg-gray-200" />
                
                <button
                  onClick={handleExportPDF}
                  className="flex items-center gap-2 px-5 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 hover:border-rose-300 hover:text-rose-600 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>Export as PDF</span>
                </button>
                
                <button
                  onClick={handleExportSlides}
                  className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 rounded-xl text-sm font-medium text-white hover:bg-emerald-600 transition-colors"
                >
                  <Presentation className="w-4 h-4" />
                  <span>Export as Slides</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Divider line */}
      <div className="h-1 bg-gradient-to-r from-emerald-400 via-emerald-500 to-teal-500" />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-8 py-8">
        {cartItems.length === 0 ? (
          // Empty state
          <div className="flex flex-col items-center justify-center py-24">
            <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mb-6">
              <ShoppingCart className="w-10 h-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 text-center max-w-md mb-8">
              Add response cards to your cart from the results page to export them as PDF or presentation slides.
            </p>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl font-medium hover:bg-emerald-600 transition-colors"
            >
              <span>Start Querying</span>
            </button>
          </div>
        ) : (
          <>
            {/* Export info banner */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-5 mb-8">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center flex-shrink-0">
                  <Download className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-emerald-900 mb-1">Ready to Export</h3>
                  <p className="text-sm text-emerald-700">
                    Your selected visualizations are ready to be exported. Choose PDF for a document format or Slides for a presentation-ready format.
                  </p>
                </div>
              </div>
            </div>

            {/* Cart items grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {cartItems.map((item) => (
                <CartItemCard
                  key={item.id}
                  response={item.response}
                  onRemove={() => removeFromCart(item.id)}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

