
import React from 'react';
import { Creator, Post } from '../types';
import { Feed } from '../components/Feed';
import { Icon } from '../components/Icon';
import { CreatorProfile } from '../components/CreatorProfile';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationProvider';
import { OnboardingChecklist } from '../components/OnboardingChecklist';
import { useData } from '../contexts/DataProvider';
import { StoryHighlights } from '../components/stories/StoryHighlights';
import { useLocale } from '../contexts/LocaleProvider';

interface ProfilePageProps {
  creator: Creator;
  posts: Post[];
}

const NsfwProfileFeedGate: React.FC = () => {
    const { onGoToSettings } = useNavigation();
    const { t } = useLocale();
    
    return (
        <div className="bg-gray-100 dark:bg-gray-800/50 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 text-center flex flex-col items-center">
            <Icon name="ban" className="w-12 h-12 text-red-500 dark:text-red-400 mb-3" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t('nsfw.profileGateTitle')}</h3>
            <p className="text-gray-600 dark:text-gray-400 mt-1 max-w-md">
                {t('nsfw.profileGateDescription')}
            </p>
            <button
                onClick={() => onGoToSettings('privacy')}
                className="mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-6 rounded-full transition-colors"
            >
                {t('nsfw.profileGateAction')}
            </button>
        </div>
    );
};

export const ProfilePage: React.FC<ProfilePageProps> = ({ creator, posts }) => {
  const { onGoToHome, onGoToSettings } = useNavigation();
  const { currentUser } = useAuth();
  const { getActiveStoriesForCreator, isBlocked, users } = useData();
  const { t } = useLocale();
  
  const isOwner = currentUser?.creatorId === creator.id;
  const showOnboarding = isOwner && currentUser?.onboardingProgress && currentUser.onboardingProgress.some(p => !p.completed);
  const activeStories = getActiveStoriesForCreator(creator.id);
  
  const isNsfwProfile = creator.mainCategory.slug === 'nsfw';
  const canViewAllContent = currentUser?.showSensitiveContent;

  const visiblePosts = canViewAllContent 
    ? posts
    : posts.filter(post => !post.isNsfw);

  const showNsfwGate = isNsfwProfile && !canViewAllContent;

  if (currentUser) {
    const creatorUser = users.find(u => u.creatorId === creator.id);
    const creatorUserId = creatorUser ? creatorUser.id : creator.id;
    if (isBlocked(currentUser.id, creatorUserId)) {
      return (
        <div className="text-center py-20">
            <Icon name="ban" className="w-16 h-16 text-gray-400 dark:text-gray-600 mx-auto" />
            <h2 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">{t('profilePage.userNotAvailable')}</h2>
            <p className="text-gray-500 dark:text-gray-400">{t('profilePage.cannotViewProfile')}</p>
        </div>
      );
    }
  }


  return (
    <div className="container mx-auto max-w-7xl">
      <div className="mb-6">
        <button 
          onClick={onGoToHome}
          className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold transition-colors duration-200"
        >
          <Icon name="arrow-left" className="w-5 h-5" />
          {t('profilePage.backToHome')}
        </button>
      </div>

      <div className="mb-8">
        <CreatorProfile creator={creator} posts={posts} />
      </div>

      {activeStories.length > 0 && (
        <div className="mb-8">
          <StoryHighlights creator={creator} stories={activeStories} />
        </div>
      )}
      
      {showOnboarding && <div className="mb-8"><OnboardingChecklist /></div>}

      <div className="flex-1 min-w-0 space-y-8">
        {showNsfwGate && <NsfwProfileFeedGate />}

        {visiblePosts.length > 0 ? (
          <Feed posts={visiblePosts} />
        ) : (
          <div className="text-center py-16 bg-gray-50 dark:bg-gray-900 rounded-2xl">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('profilePage.noPosts')}</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">
                {isNsfwProfile && !canViewAllContent 
                    ? t('profilePage.nsfwBlurb')
                    : t('profilePage.noPostsBlurb')
                }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};