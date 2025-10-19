import React from 'react';
import { Icon } from '../Icon';

interface StoryBubbleProps {
  creator: {
    id: number;
    avatarUrl: string;
    username: string;
  };
  hasUnseenStories: boolean;
  isOwnStory: boolean;
  hasStory: boolean;
  onClick: () => void;
}

export const StoryBubble: React.FC<StoryBubbleProps> = ({ creator, hasUnseenStories, isOwnStory, hasStory, onClick }) => {
  const ringClass = isOwnStory
    ? 'ring-gray-300 dark:ring-gray-700'
    : hasUnseenStories
    ? 'bg-gradient-to-tr from-purple-500 to-pink-500'
    : 'bg-gray-300 dark:bg-gray-700';

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-2 text-center w-full group">
      <div className={`relative w-16 h-16 rounded-full flex items-center justify-center p-0.5 transition-transform group-hover:scale-105 ${ringClass}`}>
        <div className="bg-white dark:bg-black rounded-full w-full h-full">
           <img
            src={creator.avatarUrl}
            alt={`${creator.username}'s story`}
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        {isOwnStory && (
           <div className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center border-2 border-white dark:border-black">
             <Icon name="plus" className="w-4 h-4" />
           </div>
        )}
      </div>
      <p className="text-xs font-medium text-gray-600 dark:text-gray-400 truncate w-full">
        {creator.username}
      </p>
    </button>
  );
};