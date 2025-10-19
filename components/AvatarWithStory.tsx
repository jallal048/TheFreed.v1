import React from 'react';
import { Creator } from '../types';
import { useData } from '../contexts/DataProvider';
import { useAuth } from '../contexts/AuthContext';
import { useModals } from '../contexts/ModalProvider';
import { Icon } from './Icon';

interface AvatarWithStoryProps {
  creator: Partial<Creator> & { id: number; avatarUrl: string; username: string };
  className?: string; // e.g. "w-12 h-12"
  onClick?: (e: React.MouseEvent) => void;
  noStoryClick?: boolean; // if true, don't open story viewer
  isOwnProfile?: boolean;
}

export const AvatarWithStory: React.FC<AvatarWithStoryProps> = ({ creator, className = 'w-12 h-12', onClick, noStoryClick = false, isOwnProfile = false }) => {
  const { getActiveStoriesForCreator } = useData();
  const { currentUser } = useAuth();
  const { openStoryViewer, openAddStoryModal } = useModals();

  const activeStories = getActiveStoriesForCreator(creator.id);
  const hasStories = activeStories.length > 0;
  const hasUnseenStories = hasStories && activeStories.some(item => !currentUser?.viewedStories.includes(item.id));

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isOwnProfile) {
        openAddStoryModal();
        return;
    }
    if (onClick) {
      onClick(e);
      return;
    }
    if (hasStories && !noStoryClick) {
      openStoryViewer([creator.id], 0);
    }
  };

  const ringClass = hasStories
    ? hasUnseenStories
      ? 'bg-gradient-to-tr from-purple-500 to-pink-500'
      : 'bg-gray-300 dark:bg-gray-700'
    : '';
  
  const isClickable = (hasStories && !noStoryClick) || !!onClick || isOwnProfile;
  const containerClassName = `relative rounded-full flex items-center justify-center p-0.5 transition-transform group-hover:scale-105 ${ringClass} ${isClickable ? 'cursor-pointer' : 'cursor-default'} ${className}`;

  return (
    <div
      onClick={isClickable ? handleClick : undefined}
      className={containerClassName}
      aria-label={isOwnProfile ? 'Add to your story' : hasStories && !noStoryClick ? `View ${creator.username}'s story` : `${creator.username}'s avatar`}
      role={isClickable ? 'button' : 'img'}
      tabIndex={isClickable ? 0 : -1}
      onKeyDown={(e) => { if (isClickable && (e.key === 'Enter' || e.key === ' ')) handleClick(e as any); }}
    >
      <div className="bg-white dark:bg-black rounded-full w-full h-full">
        <img
          src={creator.avatarUrl}
          alt={`${creator.username}'s avatar`}
          className="w-full h-full rounded-full object-cover"
          onContextMenu={(e) => e.preventDefault()}
        />
      </div>
      {isOwnProfile && (
        <div className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full w-8 h-8 flex items-center justify-center border-4 border-white dark:border-black">
          <Icon name="plus" className="w-5 h-5" />
        </div>
      )}
    </div>
  );
};