import React from 'react';

interface DataPoint {
  name: string;
  value: number;
}

interface AdminLineChartProps {
  data: DataPoint[];
  color?: string;
  formatAsCurrency?: boolean;
}

export const AdminLineChart: React.FC<AdminLineChartProps> = ({ data, color = '#818cf8', formatAsCurrency = false }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500">No data available</div>;
  }

  const width = 500;
  const height = 300;
  const padding = 40;

  const maxVal = Math.max(...data.map(d => d.value), 0);
  const minVal = 0;

  const getX = (index: number) => {
    if (data.length === 1) return width / 2;
    return padding + (index / (data.length - 1)) * (width - 2 * padding);
  };

  const getY = (value: number) => {
    if (maxVal === minVal) return height - padding;
    return height - padding - ((value - minVal) / (maxVal - minVal || 1)) * (height - 2 * padding);
  };

  const linePath = data.map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i)} ${getY(d.value)}`).join(' ');
  const areaPath = `${linePath} V ${height - padding} H ${padding} Z`;

  const gridColor = "rgba(255, 255, 255, 0.1)";
  const textColor = "#9ca3af";

  const formatLabel = (value: number) => {
    if (formatAsCurrency) {
        if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
        return `$${value.toFixed(0)}`;
    }
    if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
    return value.toString();
  };

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full">
      {/* Y-axis grid lines and labels */}
      {[...Array(5)].map((_, i) => {
        const y = padding + i * ((height - 2 * padding) / 4);
        const value = maxVal - i * (maxVal / 4);
        return (
          <g key={i}>
            <line x1={padding} y1={y} x2={width - padding} y2={y} stroke={gridColor} strokeDasharray="2" />
            <text x={padding - 10} y={y + 4} textAnchor="end" fontSize="10" fill={textColor}>{formatLabel(value)}</text>
          </g>
        );
      })}

      {/* X-axis labels */}
      {data.map((d, i) => {
        if (i % Math.ceil(data.length / 7) === 0) { // Show up to 7 labels
          return (
            <text key={i} x={getX(i)} y={height - padding + 15} textAnchor="middle" fontSize="10" fill={textColor}>{d.name}</text>
          );
        }
        return null;
      })}

      <defs>
        <linearGradient id={`areaGradient-${color}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="100%" stopColor={color} stopOpacity={0} />
        </linearGradient>
      </defs>
      
      <path d={areaPath} fill={`url(#areaGradient-${color})`} />
      <path d={linePath} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      
      {data.map((d, i) => (
        <circle key={i} cx={getX(i)} cy={getY(d.value)} r="3" fill="#1f2937" stroke={color} strokeWidth="1.5" />
      ))}
    </svg>
  );
};