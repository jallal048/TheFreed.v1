import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

interface DataPoint {
  month: string;
  count: number;
}

interface LineChartProps {
  data: DataPoint[];
}

export const LineChart: React.FC<LineChartProps> = ({ data }) => {
  const { theme } = useAuth();
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">No data available</div>;
  }

  const width = 500;
  const height = 300;
  const padding = 40;

  const maxVal = Math.max(...data.map(d => d.count));
  const minVal = 0; // Assuming growth starts from 0

  const getX = (index: number) => {
    if (data.length === 1) {
      return width / 2;
    }
    return padding + (index / (data.length - 1)) * (width - 2 * padding);
  };

  const getY = (value: number) => {
    if (maxVal === minVal) {
        return height - padding;
    }
    return height - padding - ((value - minVal) / (maxVal - minVal)) * (height - 2 * padding);
  };

  const linePath = data
    .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.count)}`)
    .join(' ');
    
  const areaPath = `${linePath} V ${height - padding} H ${padding} Z`;

  const gridColor = theme === 'dark' ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)";
  const textColor = theme === 'dark' ? "#9ca3af" : "#6b7280"; // gray-400 and gray-500

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {/* Y-axis grid lines and labels */}
      {[...Array(5)].map((_, i) => {
        const y = padding + i * ((height - 2 * padding) / 4);
        const value = maxVal - i * (maxVal / 4);
        return (
          <g key={i}>
            <line
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke={gridColor}
              strokeDasharray="2"
            />
            <text
              x={padding - 10}
              y={y + 5}
              textAnchor="end"
              fontSize="12"
              fill={textColor}
            >
              {value >= 1000 ? `${Math.round(value / 1000)}k` : value}
            </text>
          </g>
        );
      })}

      {/* X-axis labels */}
      {data.map((d, i) => (
        <text
          key={i}
          x={getX(i)}
          y={height - padding + 20}
          textAnchor="middle"
          fontSize="12"
          fill={textColor}
        >
          {d.month}
        </text>
      ))}

      {/* Gradient for area chart */}
      <defs>
        <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="rgba(99, 102, 241, 0.4)" />
          <stop offset="100%" stopColor="rgba(99, 102, 241, 0)" />
        </linearGradient>
      </defs>
      
      {/* Area */}
      <path d={areaPath} fill="url(#areaGradient)" />

      {/* Line */}
      <path
        d={linePath}
        fill="none"
        stroke="#6366f1" // indigo-500
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      
      {/* Data points */}
      {data.map((d, i) => (
        <circle
          key={i}
          cx={getX(i)}
          cy={getY(d.count)}
          r="4"
          fill={theme === 'dark' ? '#111827' : '#fff'} // bg-gray-900 or white
          stroke="#6366f1" // indigo-500
          strokeWidth="2"
        />
      ))}
    </svg>
  );
};
