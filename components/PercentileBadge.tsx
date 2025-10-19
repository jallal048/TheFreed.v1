import React from 'react';

interface PercentileBadgeProps {
  percentile: number;
}

export const PercentileBadge: React.FC<PercentileBadgeProps> = ({ percentile }) => {
  return (
    <div style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }} className="flex items-center gap-1 px-2.5 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-full text-xs font-semibold shadow">
      <span>✨</span>
      <span>Top {percentile}%</span>
    </div>
  );
};