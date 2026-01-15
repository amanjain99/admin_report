import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { ComparisonData } from '../../types';

interface BarChartVizProps {
  data: ComparisonData;
}

const defaultColors = ['#E91E8C', '#10B981', '#F59E0B', '#3B82F6', '#8B5CF6', '#EC4899'];

export function BarChartViz({ data }: BarChartVizProps) {
  const { items, yLabel } = data;
  
  const chartData = items.map((item, index) => ({
    ...item,
    fill: item.color || defaultColors[index % defaultColors.length],
  }));

  return (
    <div className="w-full h-80 py-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis 
            dataKey="name" 
            tick={{ fill: '#6B7280', fontSize: 12 }}
            tickLine={{ stroke: '#E5E7EB' }}
            axisLine={{ stroke: '#E5E7EB' }}
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
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
            itemStyle={{ color: '#6B7280' }}
            formatter={(value: number) => [value.toLocaleString(), yLabel || 'Value']}
          />
          <Bar 
            dataKey="value" 
            radius={[6, 6, 0, 0]}
            maxBarSize={60}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

