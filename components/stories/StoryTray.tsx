import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataProvider';
import { useModals } from '../../contexts/ModalProvider';
import { StoryBubble } from './StoryBubble';

export const StoryTray: React.FC = () => {
  const { currentUser } = useAuth();
  const { getActiveStories, creators, isSubscribedToCreator } = useData();
  const { openStoryViewer, openAddStoryModal } = useModals();

  const activeStories = getActiveStories();

  const subscribedCreatorIds = currentUser?.subscriptions
    .filter(sub => new Date(sub.expiresAt) > new Date())
    .map(sub => sub.creatorId) || [];
    
  if (currentUser?.creatorId) {
    subscribedCreatorIds.push(currentUser.creatorId);
  }

  const storiesForFeed = activeStories.filter(story => subscribedCreatorIds.includes(story.creatorId));

  const creatorHasStory = (creatorId: number) => storiesForFeed.some(s => s.creatorId === creatorId);
  
  const creatorIdsWithStories = storiesForFeed.map(s => s.creatorId);

  const handleStoryClick = (clickedCreatorId: number) => {
      const startIndex = creatorIdsWithStories.indexOf(clickedCreatorId);
      if (startIndex !== -1) {
          openStoryViewer(creatorIdsWithStories, startIndex);
      }
  };

  return (
    <div className="mb-6 border-b border-gray-200 dark:border-gray-800 pb-6">
      <div className="flex overflow-x-auto space-x-4 pb-2 -mx-6 px-6">
        {currentUser?.role === 'CREATOR' && (
          <div className="flex-shrink-0 w-20">
            <StoryBubble
              creator={{ 
                id: currentUser.creatorId!, 
                avatarUrl: currentUser.avatarUrl,
                username: 'Your Story',
              }}
              hasUnseenStories={false}
              isOwnStory={true}
              hasStory={creatorHasStory(currentUser.creatorId!)}
              onClick={openAddStoryModal}
            />
          </div>
        )}
        {storiesForFeed.map((story) => {
            const creator = creators.find(c => c.id === story.creatorId);
            if (!creator) return null;

            const hasUnseen = story.items.some(item => !currentUser?.viewedStories.includes(item.id));
            
            return (
                 <div key={story.creatorId} className="flex-shrink-0 w-20">
                     <StoryBubble
                        creator={creator}
                        hasUnseenStories={hasUnseen}
                        isOwnStory={false}
                        hasStory={true}
                        onClick={() => handleStoryClick(story.creatorId)}
                    />
                 </div>
            )
        })}
      </div>
    </div>
  );
};
