import React from 'react';
import { Creator, StoryItem } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useModals } from '../../contexts/ModalProvider';
import { StoryBubble } from './StoryBubble';

interface StoryHighlightsProps {
  creator: Creator;
  stories: StoryItem[];
}

export const StoryHighlights: React.FC<StoryHighlightsProps> = ({ creator, stories }) => {
  const { currentUser } = useAuth();
  const { openStoryViewer } = useModals();

  if (!stories || stories.length === 0) {
    return null;
  }

  const handleStoryClick = () => {
    openStoryViewer([creator.id], 0);
  };

  const hasUnseen = stories.some(item => !currentUser?.viewedStories.includes(item.id));

  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6">
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Recent Stories</h3>
      <div className="flex">
        <div className="flex-shrink-0 w-20">
          <StoryBubble
            creator={creator}
            hasUnseenStories={hasUnseen}
            isOwnStory={false}
            hasStory={true}
            onClick={handleStoryClick}
          />
        </div>
      </div>
    </div>
  );
};