import React from 'react';

interface DataPoint {
  name: string;
  value: number;
  color: string;
}

interface PieChartProps {
  data: DataPoint[];
}

export const PieChart: React.FC<PieChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">No data available</div>;
  }

  const total = data.reduce((acc, d) => acc + d.value, 0);
  let cumulativePercent = 0;

  const getCoordinatesForPercent = (percent: number) => {
    const x = Math.cos(2 * Math.PI * percent);
    const y = Math.sin(2 * Math.PI * percent);
    return [x, y];
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
        <svg viewBox="-1 -1 2 2" className="w-48 h-48 transform -rotate-90">
            {data.map((d, i) => {
                const percent = d.value / total;
                 if (percent === 0) return null;

                const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
                cumulativePercent += percent;
                const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
                const largeArcFlag = percent > 0.5 ? 1 : 0;

                const pathData = [
                    `M ${startX} ${startY}`, // Move
                    `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, // Arc
                    `L 0 0`, // Line to center
                ].join(' ');

                return <path key={i} d={pathData} className={`${d.color.replace('text-', 'fill-')}`} />;
            })}
        </svg>
        <div className="mt-6 w-full space-y-2">
            {data.map((d, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${d.color.replace('text-', 'bg-')}`}></span>
                        <span className="text-gray-500 dark:text-gray-400">{d.name}</span>
                    </div>
                    <span className="font-semibold text-gray-900 dark:text-white">${d.value.toLocaleString()}</span>
                </div>
            ))}
        </div>
    </div>
  );
};
