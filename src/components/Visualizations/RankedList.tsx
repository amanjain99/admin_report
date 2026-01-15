import type { ListData } from '../../types';

interface RankedListProps {
  data: ListData;
}

export function RankedList({ data }: RankedListProps) {
  const { items, valueLabel } = data;

  return (
    <div className="w-full py-4">
      <div className="space-y-3">
        {items.map((item, index) => {
          const maxValue = Math.max(...items.map(i => typeof i.value === 'number' ? i.value : 0));
          const percentage = typeof item.value === 'number' ? (item.value / maxValue) * 100 : 0;
          
          return (
            <div 
              key={index}
              className="relative bg-gray-50 rounded-xl overflow-hidden"
            >
              {/* Progress bar background */}
              <div 
                className="absolute inset-y-0 left-0 bg-[#FCE4F2] transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
              
              {/* Content */}
              <div className="relative flex items-center justify-between px-5 py-4">
                <div className="flex items-center gap-4">
                  {item.rank !== undefined && (
                    <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white text-sm font-semibold text-gray-700 shadow-sm">
                      {item.rank}
                    </span>
                  )}
                  <span className="font-medium text-gray-800">{item.name}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-[#E91E8C]">
                    {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
                  </span>
                  {item.subtext && (
                    <span className="text-sm text-gray-500">{item.subtext}</span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {valueLabel && (
        <p className="text-center text-sm text-gray-500 mt-4">
          Sorted by {valueLabel}
        </p>
      )}
    </div>
  );
}

