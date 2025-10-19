import React, { useMemo } from 'react';
import { useNavigation } from '../contexts/NavigationProvider';
import { useData } from '../contexts/DataProvider';
import { Post as PostComponent } from '../components/Post';
import { CreatorCarousel } from '../components/CreatorCarousel';
import { Icon } from '../components/Icon';

export const ExplorePage: React.FC = () => {
  const { creators, getRelatedFeed } = useData();
  const { onGoToDiscover, view } = useNavigation();
  
  const exploreFeed = useMemo(() => {
    if (view.page === 'explore' && view.explorePostId) {
      return getRelatedFeed(view.explorePostId);
    }
    return [];
  }, [view, getRelatedFeed]);
  
  const itemsToRender = useMemo(() => {
      const items = [];
      const carouselInterval = 5;
      for (let i = 0; i < exploreFeed.length; i++) {
        items.push(<PostComponent key={`post-${exploreFeed[i].id}`} post={exploreFeed[i]} />);
        if ((i + 1) % carouselInterval === 0 && i < exploreFeed.length - 1) {
          const shuffledCreators = [...creators].sort(() => 0.5 - Math.random()).slice(0, 10);
          items.push(<CreatorCarousel key={`carousel-${i}`} creators={shuffledCreators} />);
        }
      }
      return items;
  }, [exploreFeed, creators]);


  return (
    <div className="max-w-3xl mx-auto">
        <div className="mb-6">
            <button 
                onClick={onGoToDiscover}
                className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold transition-colors duration-200"
            >
                <Icon name="arrow-left" className="w-5 h-5" />
                Back to Discover Grid
            </button>
        </div>
      
        <div className="space-y-6">
            {itemsToRender}
        </div>
    </div>
  );
};