
import React, { useState, useEffect, useCallback } from 'react';
import { useModals } from '../../contexts/ModalProvider';
import { useData } from '../../contexts/DataProvider';
import { Icon } from '../Icon';
import { StoryItem } from '../../types';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '../../contexts/NavigationProvider';

const StoryProgressBar: React.FC<{ count: number; currentIndex: number; progress: number }> = ({ count, currentIndex, progress }) => (
  <div className="absolute top-2 left-0 right-0 flex gap-1 px-2 z-20">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
        <div
          className="h-full bg-white"
          style={{ width: `${i < currentIndex ? 100 : i === currentIndex ? progress : 0}%`, transition: i === currentIndex ? 'width 0.1s linear' : 'none' }}
        />
      </div>
    ))}
  </div>
);

const NsfwStoryGate: React.FC = () => {
    const { onGoToSettings } = useNavigation();
    const { closeStoryViewer } = useModals();

    const handleVerifyClick = () => {
        closeStoryViewer();
        onGoToSettings('privacy');
    };

    return (
        <div className="absolute inset-0 bg-black/70 backdrop-blur-xl flex flex-col items-center justify-center text-center p-6 z-30">
            <Icon name="ban" className="w-12 h-12 text-white mb-4" />
            <h3 className="text-xl font-bold text-white">Sensitive Content</h3>
            <p className="text-white/80 mt-1">This story is for ages 18+ only. Verify your age to view.</p>
            <button onClick={handleVerifyClick} className="mt-4 bg-white/20 hover:bg-white/30 text-white font-bold py-2 px-6 rounded-full">
                Verify Age in Settings
            </button>
        </div>
    );
};


export const StoryViewer: React.FC = () => {
    const { isStoryViewerOpen, closeStoryViewer, storyViewerCreatorIds, storyViewerStartIndex } = useModals();
    const { getActiveStories, creators, markStoryAsViewed } = useData();
    const { currentUser } = useAuth();

    const [currentCreatorIndex, setCurrentCreatorIndex] = useState(0);
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [progress, setProgress] = useState(0);
    
    const activeStories = getActiveStories();
    
    const currentCreatorId = storyViewerCreatorIds[currentCreatorIndex];
    const currentStorySet = activeStories.find(s => s.creatorId === currentCreatorId)?.items || [];
    const currentStoryItem = currentStorySet[currentStoryIndex];

    useEffect(() => {
        if (isStoryViewerOpen) {
            setCurrentCreatorIndex(storyViewerStartIndex);
            setCurrentStoryIndex(0);
        }
    }, [isStoryViewerOpen, storyViewerStartIndex]);
    
    const canViewNsfw = currentUser?.showSensitiveContent;
    const isNsfwStory = currentStoryItem?.isNsfw;
    
    useEffect(() => {
        if (isStoryViewerOpen && currentStoryItem) {
            markStoryAsViewed(currentStoryItem.id);

            // Don't start the timer for blurred NSFW stories
            if (isNsfwStory && !canViewNsfw) {
                setProgress(0);
                return;
            }

            const timer = setInterval(() => {
                setProgress(p => p + 100 / 50); // 5 seconds duration
            }, 100);
            return () => clearInterval(timer);
        }
    }, [isStoryViewerOpen, currentStoryItem, markStoryAsViewed, isNsfwStory, canViewNsfw]);

    const goToNextStory = useCallback(() => {
        if (currentStoryIndex < currentStorySet.length - 1) {
            setCurrentStoryIndex(prev => prev + 1);
        } else if (currentCreatorIndex < storyViewerCreatorIds.length - 1) {
            setCurrentCreatorIndex(prev => prev + 1);
            setCurrentStoryIndex(0);
        } else {
            closeStoryViewer();
        }
    }, [currentCreatorIndex, currentStoryIndex, currentStorySet.length, storyViewerCreatorIds.length, closeStoryViewer]);
    
    const goToPrevStory = useCallback(() => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
        } else if (currentCreatorIndex > 0) {
            setCurrentCreatorIndex(prev => prev - 1);
            // Go to the last story of the previous creator
            const prevCreatorId = storyViewerCreatorIds[currentCreatorIndex - 1];
            const prevStorySet = activeStories.find(s => s.creatorId === prevCreatorId);
            setCurrentStoryIndex(prevStorySet ? prevStorySet.items.length - 1 : 0);
        }
    }, [currentCreatorIndex, currentStoryIndex, storyViewerCreatorIds, activeStories]);

    useEffect(() => {
        if (progress >= 100) {
            goToNextStory();
        }
    }, [progress, goToNextStory]);
    
    useEffect(() => {
        setProgress(0);
    }, [currentStoryItem]);
    
    const handleNavigationClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // If the NSFW gate is shown, don't allow navigation
        if (isNsfwStory && !canViewNsfw) return;

        const { clientX, currentTarget } = e;
        const { left, width } = currentTarget.getBoundingClientRect();
        const clickPosition = (clientX - left) / width;
        if (clickPosition > 0.5) {
            goToNextStory();
        } else {
            goToPrevStory();
        }
    };

    if (!isStoryViewerOpen || !currentStoryItem) return null;
    
    const creator = creators.find(c => c.id === currentCreatorId);

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-lg z-50 flex items-center justify-center">
            <div className="relative w-full h-full max-w-md max-h-[95vh] aspect-[9/16] rounded-lg overflow-hidden" onClick={handleNavigationClick}>
                <StoryProgressBar count={currentStorySet.length} currentIndex={currentStoryIndex} progress={progress} />
                <div className="absolute top-4 left-4 z-20 flex items-center gap-3">
                    <img src={creator?.avatarUrl} alt="" className="w-10 h-10 rounded-full" />
                    <p className="font-bold text-white text-shadow">{creator?.username}</p>
                </div>
                 <button onClick={closeStoryViewer} className="absolute top-4 right-4 z-20 text-white"><Icon name="close" className="w-8 h-8"/></button>

                {currentStoryItem.media.type === 'image' && (
                    <img src={currentStoryItem.media.url} className={`w-full h-full object-cover ${isNsfwStory && !canViewNsfw ? 'blur-2xl' : ''}`} />
                )}
                 {currentStoryItem.media.type === 'video' && (
                    <div className={`w-full h-full bg-gray-900 flex items-center justify-center text-white ${isNsfwStory && !canViewNsfw ? 'blur-2xl' : ''}`}>Video not implemented</div>
                )}

                {isNsfwStory && !canViewNsfw && <NsfwStoryGate />}
            </div>
        </div>
    );
};
