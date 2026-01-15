import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import type { TrendData } from '../../types';

interface LineChartVizProps {
  data: TrendData;
}

export function LineChartViz({ data }: LineChartVizProps) {
  const { points, xLabel, yLabel } = data;

  return (
    <div className="w-full h-80 py-4">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={points}
          margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
        >
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#E91E8C" stopOpacity={0.2}/>
              <stop offset="95%" stopColor="#E91E8C" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="label" 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#E5E7EB' }}
            axisLine={{ stroke: '#E5E7EB' }}
            label={xLabel ? { 
              value: xLabel, 
              position: 'insideBottom',
              offset: -10,
              style: { fill: '#6B7280', fontSize: 12 }
            } : undefined}
          />
          <YAxis 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#E5E7EB' }}
            axisLine={{ stroke: '#E5E7EB' }}
            label={yLabel ? { 
              value: yLabel, 
              angle: -90, 
              position: 'insideLeft',
              style: { fill: '#6B7280', fontSize: 12 }
            } : undefined}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              border: '1px solid #E5E7EB',
              borderRadius: '8px',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            }}
            labelStyle={{ color: '#1F2937', fontWeight: 600 }}
            formatter={(value: number) => [value.toLocaleString(), yLabel || 'Value']}
          />
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#E91E8C"
            strokeWidth={3}
            fill="url(#colorValue)"
            dot={{ fill: '#E91E8C', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#E91E8C' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

