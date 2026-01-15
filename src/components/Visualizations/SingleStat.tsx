import type { SingleStatData } from '../../types';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface SingleStatProps {
  data: SingleStatData;
}

export function SingleStat({ data }: SingleStatProps) {
  const { value, label, suffix, trend } = data;
  
  const displayValue = typeof value === 'number' 
    ? value.toLocaleString() 
    : value;

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="flex items-baseline gap-1">
        <span className="text-6xl font-bold text-[#E91E8C]">
          {displayValue}
        </span>
        {suffix && (
          <span className="text-4xl font-bold text-[#E91E8C]">
            {suffix}
          </span>
        )}
      </div>
      
      <p className="mt-3 text-lg text-gray-600 text-center max-w-md">
        {label}
      </p>
      
      {trend && (
        <div className={`mt-4 flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
          trend.direction === 'up' 
            ? 'bg-green-100 text-green-700' 
            : trend.direction === 'down'
            ? 'bg-red-100 text-red-700'
            : 'bg-gray-100 text-gray-600'
        }`}>
          {trend.direction === 'up' && <TrendingUp className="w-4 h-4" />}
          {trend.direction === 'down' && <TrendingDown className="w-4 h-4" />}
          {trend.direction === 'neutral' && <Minus className="w-4 h-4" />}
          <span>{trend.value > 0 ? '+' : ''}{trend.value}%</span>
        </div>
      )}
    </div>
  );
}

