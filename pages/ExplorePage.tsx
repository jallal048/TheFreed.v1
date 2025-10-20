import React, { useMemo } from 'react';
import { useNavigation } from '../contexts/NavigationProvider';
import { useData } from '../contexts/DataProvider';
import { useAuth } from '../contexts/AuthContext';
import { Post } from '../types';
import { Icon } from '../components/Icon';
import { useLocale } from '../contexts/LocaleProvider';

const PostCard: React.FC<{ post: Post }> = ({ post }) => {
  const { onGoToProfile } = useNavigation();
  const media = post.media[0];
  
  return (
    <div className="group relative bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 hover:scale-[1.02]">
      {/* Media preview */}
      <div className="aspect-square relative overflow-hidden bg-gray-100 dark:bg-gray-800">
        {media?.type === 'image' && (
          <img 
            src={media.url} 
            alt=""
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        )}
        {media?.type === 'video' && (
          <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
            <Icon name="video" className="w-12 h-12 text-white/90" />
          </div>
        )}
        {!media && (
          <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-800 dark:to-gray-700 p-4 flex items-center justify-center">
            <p className="text-gray-600 dark:text-gray-300 text-sm font-medium text-center line-clamp-4">{post.text}</p>
          </div>
        )}
        
        {/* Engagement overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Icon name="like-filled" className="w-4 h-4" />
                  <span className="text-sm font-bold">{post.likedBy.length}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Icon name="comment" className="w-4 h-4" />
                  <span className="text-sm font-bold">{post.comments.length}</span>
                </div>
              </div>
              {post.type === 'PREMIUM' && (
                <div className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold">
                  PREMIUM
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Creator info */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800">
        <button 
          onClick={() => onGoToProfile(post.creator.id)}
          className="flex items-center gap-2 w-full text-left hover:opacity-80 transition-opacity"
        >
          <img 
            src={post.creator.avatarUrl} 
            alt={post.creator.username}
            className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 shadow-sm"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">
              {post.creator.displayName || post.creator.username}
            </p>
            <p className="text-gray-500 dark:text-gray-400 text-xs">
              @{post.creator.username}
            </p>
          </div>
        </button>
      </div>
    </div>
  );
};

const ExplorePageComponent: React.FC = () => {
  const { posts } = useData();
  const { currentUser } = useAuth();
  const { t } = useLocale();
  
  const explorePosts = useMemo(() => {
    return posts
      .filter(post => {
        if (post.scheduledAt) return false;
        if (!currentUser?.showSensitiveContent && post.isNsfw) return false;
        return post.type === 'PUBLIC' || post.type === 'PREMIUM';
      })
      .sort(() => Math.random() - 0.5) // Shuffle for exploration
      .slice(0, 50); // Limit for performance
  }, [posts, currentUser]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {t('explorePage.title') || 'Explore'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {t('explorePage.subtitle') || 'Discover amazing content from creators'}
        </p>
      </div>

      {/* Posts grid */}
      {explorePosts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {explorePosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Icon name="compass" className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No content to explore yet
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            Check back later for new posts from creators
          </p>
        </div>
      )}
    </div>
  );
};

export default ExplorePageComponent;