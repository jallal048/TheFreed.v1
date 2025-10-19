
import React from 'react';
import { Achievement } from '../types';
import { Icon } from './Icon';

interface AchievementBadgeProps {
  achievement: Achievement;
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  return (
    <div 
      className="flex flex-col items-center text-center w-24"
      title={`${achievement.name}: ${achievement.description}`}
    >
      <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white shadow-lg mb-2">
        <Icon name={achievement.icon} className="w-8 h-8" />
      </div>
      <p className="text-xs font-semibold text-gray-700 dark:text-gray-300 leading-tight">
        {achievement.name}
      </p>
    </div>
  );
};
