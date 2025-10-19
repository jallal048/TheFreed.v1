import React from 'react';
import { RankName } from '../types';

interface RankBadgeProps {
  rank: RankName;
}

const rankStyles: Record<RankName, { color: string }> = {
  PLATINUM: { color: 'bg-purple-500' },
  DIAMOND: { color: 'bg-cyan-400' },
  GOLD: { color: 'bg-yellow-400' },
  SILVER: { color: 'bg-slate-400' },
  BRONZE: { color: 'bg-yellow-600' },
  IRON: { color: 'bg-gray-500' },
};

export const RankBadge: React.FC<RankBadgeProps> = ({ rank }) => {
  const style = rankStyles[rank];
  return (
    <div style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }} className={`flex items-center justify-center px-2.5 py-1 rounded-full text-white text-xs font-bold ${style.color} tracking-wide`}>
      <span className="capitalize">{rank.toLowerCase()}</span>
    </div>
  );
};