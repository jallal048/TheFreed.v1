
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

export const HomePage: React.FC = () => {
    const { currentUser } = useAuth();
    const { posts, isSubscribedToCreator, isFollowingCreator } = useData();
    const { onGoToDiscover } = useNavigation();
    const { t } = useLocale();
    
    const feedPosts = useMemo(() => {
        if (!currentUser) return [];
        return posts
            .filter(post => {
                if (post.scheduledAt) return false;
                
                // Filter out individual NSFW posts if user has it disabled
                if (!currentUser?.showSensitiveContent && post.isNsfw) {
                    return false;
                }
                
                const isOwner = post.creator.id === currentUser?.creatorId;
                const isSubscribed = isSubscribedToCreator(post.creator.id);
                const isFollowing = isFollowingCreator(post.creator.id);
                
                // An owner sees their own posts. A subscriber or follower sees posts from that creator.
                // The Post component itself will handle locking content for followers who are not subscribers.
                return isOwner || isSubscribed || isFollowing;
            })
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [posts, currentUser, isSubscribedToCreator, isFollowingCreator]);

    const isCreator = currentUser?.role === UserRole.Creator;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            <div className="lg:col-span-2 space-y-6">
                <StoryTray />
                
                {isCreator && (
                    <div className="pt-2">
                        <CreatePostInput />
                    </div>
                )}
                
                {feedPosts.length > 0 ? (
                    <Feed posts={feedPosts} />
                ) : (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-transparent">
                        <Icon name="logo" className="w-16 h-16 text-indigo-200 dark:text-indigo-400/50 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('homePage.emptyFeedTitle')}</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">{t('homePage.emptyFeedDescription')}</p>
                        <button 
                            onClick={onGoToDiscover}
                            className="mt-6 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300 flex items-center gap-2 mx-auto"
                        >
                           <Icon name="compass" className="w-5 h-5"/>
                           {t('homePage.discoverCreators')}
                        </button>
                    </div>
                )}
            </div>
            <aside className="hidden lg:block lg:col-span-1">
                <HomeSidebar />
            </aside>
        </div>
    );
};