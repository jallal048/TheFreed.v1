
import React from 'react';
import { Creator } from '../types';
import { AvatarWithStory } from './AvatarWithStory';
import { NsfwOverlay } from './NsfwOverlay';
import { useLocale } from '../contexts/LocaleProvider';

interface CreatorCardProps {
  creator: Creator;
  onClick: () => void;
}

const _CreatorCard: React.FC<CreatorCardProps> = ({ creator, onClick }) => {
  const { t } = useLocale();
  const getSubscribeButtonText = () => creator.monthlyPrice > 0 ? t('creatorCard.subscribeFor', { price: creator.monthlyPrice.toFixed(2) }) : t('creatorCard.subscribeFree');

  return (
    <NsfwOverlay creator={creator}>
        <div 
        className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border border-gray-200 dark:border-gray-800"
        >
        <div className="relative">
            <button onClick={onClick} className="w-full text-left">
            <img 
                src={creator.bannerUrl} 
                alt={`${creator.displayName}'s banner`} 
                className="w-full h-32 object-cover transition-transform duration-300 group-hover:scale-105"
                onContextMenu={(e) => e.preventDefault()}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-gray-900 via-white/50 dark:via-gray-900/50 to-transparent"></div>
            </button>
            <div 
            className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 w-24 h-24 rounded-full border-4 border-white dark:border-gray-900 transition-all duration-300 group-hover:border-indigo-500"
            >
            <AvatarWithStory creator={creator} className="w-full h-full" />
            </div>
        </div>
        <button onClick={onClick} className="w-full pt-16 p-6 text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{creator.displayName}</h3>
            <p className="text-sm text-gray-500 mb-3">@{creator.username}</p>
            <p className="text-gray-600 dark:text-gray-300 text-sm h-12 overflow-hidden mb-4">
            {creator.bio}
            </p>
            <div className="bg-indigo-100 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold py-2 px-4 rounded-full inline-block text-sm">
            {getSubscribeButtonText()}
            </div>
        </button>
        </div>
    </NsfwOverlay>
  );
};

export const CreatorCard = React.memo(_CreatorCard);