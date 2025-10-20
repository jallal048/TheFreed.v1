import React, { useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataProvider';
import { useNavigation } from '../contexts/NavigationProvider';
import { Feed } from '../components/Feed';
import { Icon } from '../components/Icon';
import { StoryTray } from '../components/stories/StoryTray';
import { useLocale } from '../contexts/LocaleProvider';
import { UserRole } from '../types';
import { CreatePostInput } from '../components/CreatePostInput';
import { HomeSidebar } from '../components/HomeSidebar';

const HomePageComponent: React.FC = () => {
  const { currentUser } = useAuth();
  const { posts, isSubscribedToCreator, isFollowingCreator } = useData();
  const { onGoToDiscover } = useNavigation();
  const { t } = useLocale();

  const feedPosts = useMemo(() => {
    if (!currentUser) return [];
    return posts
      .filter(post => {
        if (post.scheduledAt) return false;
        if (!currentUser?.showSensitiveContent && post.isNsfw) return false;
        const isOwner = post.creator.id === currentUser?.creatorId;
        const isSubscribed = isSubscribedToCreator(post.creator.id);
        const isFollowing = isFollowingCreator(post.creator.id);
        return isOwner || isSubscribed || isFollowing;
      })
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }, [posts, currentUser, isSubscribedToCreator, isFollowingCreator]);

  const isCreator = currentUser?.role === UserRole.Creator;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main feed column */}
        <div className="lg:col-span-3 space-y-6">
          {/* Welcome header for creators */}
          {isCreator && (
            <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                  <Icon name="sparkles" className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">
                    {t('homePage.creatorWelcome') || `Welcome back, ${currentUser?.username}!`}
                  </h2>
                  <p className="text-white/90 text-sm">
                    {t('homePage.creatorWelcomeDesc') || 'Ready to create something amazing today?'}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Stories */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
            <StoryTray />
          </div>
          
          {/* Post creation for creators */}
          {isCreator && (
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 shadow-sm border border-gray-200 dark:border-gray-800">
              <CreatePostInput />
            </div>
          )}
          
          {/* Feed */}
          {feedPosts.length > 0 ? (
            <div className="space-y-4">
              <Feed posts={feedPosts} />
            </div>
          ) : (
            <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800">
              <div className="max-w-md mx-auto">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-500/20 dark:to-purple-500/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Icon name="logo" className="w-10 h-10 text-indigo-500 dark:text-indigo-400" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {t('homePage.emptyFeedTitle') || 'Your feed is empty'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  {t('homePage.emptyFeedDescription') || 'Follow creators or subscribe to premium content to see posts here'}
                </p>
                <button 
                  onClick={onGoToDiscover} 
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg shadow-indigo-500/25"
                >
                  <Icon name="compass" className="w-5 h-5" />
                  {t('homePage.discoverCreators') || 'Discover Creators'}
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar */}
        <aside className="hidden lg:block lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <HomeSidebar />
          </div>
        </aside>
      </div>
    </div>
  );
};

export default HomePageComponent;