
import React from 'react';
import { Creator, Post, SocialLink, Category } from '../types';
import { Icon } from './Icon';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataProvider';
import { useModals } from '../contexts/ModalProvider';
import { useNavigation } from '../contexts/NavigationProvider';
import { formatLastSeen, formatStat } from '../utils/formatters';
import { AvatarWithStory } from './AvatarWithStory';
import { RankBadge } from './RankBadge';
import { PercentileBadge } from './PercentileBadge';
import { useLocale } from '../contexts/LocaleProvider';

interface CreatorProfileProps {
  creator: Creator;
  posts: Post[];
}

const ActivityStatus: React.FC<{ lastSeen: 'online' | string }> = ({ lastSeen }) => {
    const isOnline = lastSeen === 'online';
    return (
        <div className="flex items-center gap-2">
            {isOnline && <span className="w-2.5 h-2.5 bg-purple-500 rounded-full"></span>}
            <p className="text-sm text-gray-500 dark:text-gray-400">{formatLastSeen(lastSeen)}</p>
        </div>
    )
}

const SocialLinks: React.FC<{ links: SocialLink[] }> = ({ links }) => {
    if (!links || links.length === 0) return null;
    return (
        <div className="flex items-center gap-4">
            {links.map(link => (
                <a 
                    key={link.type} 
                    href={link.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-gray-500 dark:text-gray-400 hover:text-indigo-500 dark:hover:text-indigo-400 transition-colors"
                    aria-label={`Visit ${link.type}`}
                >
                    <Icon name={link.type === 'website' ? 'link' : link.type} className="w-6 h-6" />
                </a>
            ))}
        </div>
    )
}

export const CreatorProfile: React.FC<CreatorProfileProps> = ({ creator, posts }) => {
  const { currentUser, openAuthModal } = useAuth();
  const { isSubscribedToCreator, isFollowingCreator, toggleFollowCreator, startOrGetConversation, users } = useData();
  const { openSubModal, openAchievementsModal } = useModals();
  const { onGoToMessages, onGoToSettings, onGoToCategory } = useNavigation();
  const { t } = useLocale();
  
  const creatorUser = users.find(u => u.creatorId === creator.id);
  const isOwner = currentUser?.creatorId === creator.id;
  const isSubscribed = isSubscribedToCreator(creator.id);
  const isFollowing = isFollowingCreator(creator.id);
  
  const totalLikes = posts.reduce((acc, post) => acc + post.likedBy.length, 0);

  const handleFollow = () => {
    if (!currentUser) {
        openAuthModal();
        return;
    }
    toggleFollowCreator(creator.id, openAuthModal);
  };

  const handleSendMessage = async () => {
    if (!currentUser || !isSubscribed) return;
    const creatorUser = users.find(u => u.creatorId === creator.id);
    if (!creatorUser) {
        console.error("Could not find user for this creator profile");
        return;
    }
    const conversationId = await startOrGetConversation(creatorUser.id);
    onGoToMessages(conversationId);
  }

  const getSubscribeButtonText = () => {
      if (creator.monthlyPrice > 0) {
          return t('creatorProfile.subscribeFor', { price: creator.monthlyPrice.toFixed(2) });
      }
      return t('creatorProfile.subscribeFree');
  };

  const PrimaryButton = () => {
      if (isOwner) {
          return <button onClick={() => onGoToSettings()} className="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white font-bold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2"><Icon name="pencil" className="w-5 h-5"/>{t('creatorProfile.editProfile')}</button>
      }
      if (isSubscribed) {
           return <button onClick={handleSendMessage} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2"><Icon name="chat-bubble-left-right" className="w-5 h-5"/>{t('creatorProfile.sendMessage')}</button>
      }
      return <button onClick={() => !currentUser ? openAuthModal() : openSubModal(creator)} className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 px-6 rounded-full transition-all duration-300">{getSubscribeButtonText()}</button>
  }

  const FollowButton = () => {
      if (isOwner) return null;
      return (
          <button onClick={handleFollow} className={`w-full sm:w-auto font-bold py-3 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${isFollowing ? 'bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white' : 'border-2 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800'}`}>
              <Icon name={isFollowing ? 'check' : 'plus'} className="w-5 h-5" />
              {isFollowing ? 'Following' : 'Follow'}
          </button>
      );
  }

  const allCategories = [creator.mainCategory, ...creator.subCategories].filter((c): c is Category => !!c);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl overflow-hidden">
      <div className="relative">
        <img src={creator.bannerUrl} alt={`${creator.displayName}'s banner`} className="w-full h-48 object-cover" onContextMenu={(e) => e.preventDefault()} />
        <div className="absolute bottom-0 left-6 transform translate-y-1/2 w-32 h-32 rounded-full border-4 border-white dark:border-black">
          <AvatarWithStory creator={creator} className="w-full h-full" isOwnProfile={isOwner} />
        </div>
      </div>
      <div className="pt-20 px-6 pb-6">
        <div className="flex flex-col md:flex-row justify-between items-start">
            <div className="flex-1 space-y-2 md:pr-4">
                <div className="flex items-center gap-3 flex-wrap">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white">{creator.displayName}</h2>
                  <RankBadge rank={creator.rank} />
                  {creator.globalPercentile && <PercentileBadge percentile={creator.globalPercentile} />}
                  {creatorUser && (
                    <button onClick={() => openAchievementsModal(creatorUser.id)} className="p-2 rounded-full text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-yellow-500 transition-colors" title="View Achievements">
                        <Icon name="trophy" className="w-6 h-6" />
                    </button>
                  )}
                </div>
                <p className="text-md text-gray-500 dark:text-gray-400">@{creator.username}</p>
                <ActivityStatus lastSeen={creator.lastSeen} />
            </div>
            <div className="mt-4 md:mt-0 w-full md:w-auto flex-shrink-0 flex flex-col sm:flex-row items-center gap-3">
              <FollowButton />
              <PrimaryButton />
            </div>
        </div>
        <p className="mt-4 text-gray-600 dark:text-gray-300 max-w-2xl">{creator.bio}</p>
        
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4 text-gray-600 dark:text-gray-300">
            <dl className="flex items-center gap-8">
                <div className="text-center"><dd className="text-xl font-bold text-gray-900 dark:text-white">{posts.length}</dd><dt className="text-sm text-gray-500">{t('creatorProfile.posts')}</dt></div>
                <div className="text-center"><dd className="text-xl font-bold text-gray-900 dark:text-white">{formatStat(totalLikes)}</dd><dt className="text-sm text-gray-500">{t('creatorProfile.likes')}</dt></div>
                <div className="text-center"><dd className="text-xl font-bold text-gray-900 dark:text-white">{creator.stats.subscribers}</dd><dt className="text-sm text-gray-500">{t('creatorProfile.subscribers')}</dt></div>
            </dl>
            {creator.location && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <Icon name="location-marker" className="w-5 h-5" />
                    <span>{creator.location}</span>
                </div>
            )}
        </div>
        
        {(creator.socialLinks?.length > 0 || allCategories.length > 0) && (
            <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-800 flex flex-wrap gap-x-8 gap-y-4 items-center">
                {allCategories.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('creatorProfile.categories')}</h3>
                    <div className="flex flex-wrap items-center gap-2">
                      {creator.mainCategory && (
                        <button 
                          onClick={() => onGoToCategory(creator.mainCategory.slug)}
                          className={
                            creator.mainCategory.name === 'NSFW'
                            ? "bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-500/30 px-3 py-1 rounded-full text-sm font-bold transition-colors"
                            : "bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-500/30 px-3 py-1 rounded-full text-sm font-bold transition-colors"
                          }
                        >
                          {creator.mainCategory.name}
                        </button>
                      )}
                      {creator.subCategories.map(category => (
                        <button 
                          key={category.id} 
                          onClick={() => onGoToCategory(category.slug)}
                          className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 px-3 py-1 rounded-full text-xs font-medium transition-colors"
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                 {creator.socialLinks && creator.socialLinks.length > 0 && (
                    <div>
                         <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">{t('creatorProfile.socialLinks')}</h3>
                         <SocialLinks links={creator.socialLinks} />
                    </div>
                 )}
            </div>
        )}
      </div>
    </div>
  );
};