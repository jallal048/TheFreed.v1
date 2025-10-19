

import React, { useState, useEffect, useMemo } from 'react';
import { useData } from '../contexts/DataProvider';
import { useNavigation } from '../contexts/NavigationProvider';
import { RankConfig, CreatorRankInfo, RankName, Creator, Category } from '../types';
import { RankBadge } from '../components/RankBadge';
import { Icon } from '../components/Icon';
import { useLocale } from '../contexts/LocaleProvider';
import { useAuth } from '../contexts/AuthContext';

const CreatorRankingItemSkeleton: React.FC = () => (
    <div className="w-full h-[68px] flex items-center bg-white dark:bg-gray-900 p-3 rounded-lg border border-gray-200 dark:border-gray-800 animate-pulse">
      <div className="w-10 h-6 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full mr-4 ml-2"></div>
      <div className="flex-1 text-left">
        <div className="w-32 h-5 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
      </div>
      <div className="w-20 h-5 bg-gray-200 dark:bg-gray-700 rounded-full mr-4"></div>
      <div className="w-24 h-5 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
    </div>
);

const CreatorRankingItem: React.FC<{ 
    creator: CreatorRankInfo, 
    index: number, 
    onClick: (username: string) => void,
    isHighlighted: boolean
}> = React.memo(({ creator, index, onClick, isHighlighted }) => {
    const { t } = useLocale();
    return (
        <button 
            onClick={() => onClick(creator.username)}
            className={`w-full flex items-center p-3 rounded-lg transition-all duration-200 text-left ${isHighlighted ? 'bg-indigo-900/50 border-indigo-500' : 'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50 border-gray-200 dark:border-gray-800'}`}
            aria-label={`View profile of ${creator.username}, ranked number ${index + 1}`}
        >
            <span className="w-10 font-bold text-lg text-gray-500 dark:text-gray-400 text-center">#{index + 1}</span>
            <img src={creator.profileImageUrl} alt={`${creator.username}'s avatar`} className="w-12 h-12 rounded-full mr-4" />
            <div className="flex-1">
                <span className="font-bold text-gray-900 dark:text-white">{creator.username}</span>
            </div>
            <RankBadge rank={creator.rank} />
            <div className="ml-4 w-32 text-right">
                <span className="text-sm text-gray-600 dark:text-gray-300 font-semibold">{creator.creatorScore.toLocaleString()}</span>
                <span className="text-xs text-gray-500"> {t('rankingsPage.points')}</span>
            </div>
        </button>
    );
});

const PodiumCard: React.FC<{
    creator: CreatorRankInfo;
    rank: number;
    onClick: (username: string) => void;
}> = ({ creator, rank, onClick }) => {
    const rankStyles = {
        1: { border: 'border-yellow-400', medalColor: 'text-yellow-400', elevation: 'md:mb-8', order: 'order-1 md:order-2', size: 'md:w-1/3' },
        2: { border: 'border-slate-400', medalColor: 'text-slate-400', elevation: 'md:mb-4', order: 'order-2 md:order-1', size: 'md:w-[30%]' },
        3: { border: 'border-yellow-600', medalColor: 'text-yellow-600', elevation: '', order: 'order-3', size: 'md:w-[30%]' },
    };
    
    const style = rankStyles[rank as keyof typeof rankStyles];

    return (
        <div className={`w-full ${style.size} ${style.order} ${style.elevation}`}>
            <button
                onClick={() => onClick(creator.username)}
                className={`w-full bg-gray-900/50 backdrop-blur-sm rounded-2xl border-2 ${style.border} p-6 text-center flex flex-col items-center transition-all duration-300 hover:bg-gray-800 hover:-translate-y-2`}
            >
                <div className="relative mb-3">
                    <img src={creator.profileImageUrl} alt={creator.username} className="w-24 h-24 rounded-full border-4 border-gray-800" />
                    <div className={`absolute -bottom-2 -right-2 bg-gray-900 rounded-full p-1 border-2 ${style.border}`}>
                        <Icon name="trophy" className={`w-6 h-6 ${style.medalColor}`} />
                    </div>
                </div>
                <p className="text-xl font-bold text-white truncate">{creator.username}</p>
                <p className="font-semibold text-gray-300">{creator.creatorScore.toLocaleString()} pts</p>
                <span className="mt-2 text-5xl font-extrabold text-white" style={{WebkitTextStroke: `2px`, WebkitTextStrokeColor: `rgba(255,255,255,0.3)`}}>
                    {rank}
                </span>
            </button>
        </div>
    );
};

export const RankingsPage: React.FC = () => {
  const { getRankingsConfig, creators, getCategories, isBlocked, users } = useData();
  const { onSelectCreator } = useNavigation();
  const { t } = useLocale();
  const { currentUser } = useAuth();

  const config = getRankingsConfig();
  const [activeRank, setActiveRank] = useState<RankName>(config[0]?.rankName || 'PLATINUM');
  const [rankings, setRankings] = useState<CreatorRankInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allCategoriesFlat = useMemo(() => {
    const categories = getCategories();
    const flatList: Category[] = [];
    const seen = new Set<number>();
    const addCategory = (cat: Category) => { if (!seen.has(cat.id)) { flatList.push(cat); seen.add(cat.id); } };
    categories.forEach(cat => { addCategory(cat); cat.children.forEach(child => addCategory(child)); });
    return flatList.sort((a, b) => a.name.localeCompare(b.name));
  }, [getCategories]);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
        let creatorProfiles = creators.filter(c => c.rank === activeRank);
        if (!currentUser?.showSensitiveContent) {
            creatorProfiles = creatorProfiles.filter(c => c.mainCategory.slug !== 'nsfw');
        }
        if (selectedCategory) {
            creatorProfiles = creatorProfiles.filter(c => c.mainCategory?.slug === selectedCategory || c.subCategories.some(sc => sc.slug === selectedCategory));
        }
        if (currentUser) {
            creatorProfiles = creatorProfiles.filter(creator => {
                const creatorUser = users.find(u => u.creatorId === creator.id);
                const creatorUserId = creatorUser ? creatorUser.id : creator.id;
                return !isBlocked(currentUser.id, creatorUserId);
            });
        }

        creatorProfiles.sort((a,b) => b.creatorScore - a.creatorScore);
        const rankInfo: CreatorRankInfo[] = creatorProfiles.map(c => ({
            userId: c.id, username: c.username, rank: c.rank,
            globalPercentile: c.globalPercentile, creatorScore: c.creatorScore, profileImageUrl: c.avatarUrl
        }));
      setRankings(rankInfo);
      setIsLoading(false);
    }, 500);
  }, [activeRank, creators, selectedCategory, currentUser, users, isBlocked]);

  const handleCreatorClick = (username: string) => {
    const creator = creators.find(c => c.username === username);
    if(creator) onSelectCreator(creator);
  }
  
  const topThree = rankings.slice(0, 3);
  const restOfRankings = rankings.slice(3);

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{t('rankingsPage.title')}</h1>
        <p className="text-lg text-gray-500 dark:text-gray-400">{t('rankingsPage.description')}</p>
      </div>
      
      <div className="flex flex-col gap-4 mb-4">
        <div>
          <label htmlFor="category-filter" className="sr-only">{t('rankingsPage.filterByCategory')}</label>
          <div className="relative">
              <Icon name="collection" className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <select
                  id="category-filter"
                  value={selectedCategory || ''}
                  onChange={(e) => setSelectedCategory(e.target.value || null)}
                  aria-label={t('rankingsPage.filterByCategory')}
                  className="w-full sm:w-auto bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-md py-2 pl-10 pr-4 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-indigo-500 appearance-none"
              >
                  <option value="">{t('rankingsPage.allCategories')}</option>
                  {allCategoriesFlat.map(cat => ( <option key={cat.id} value={cat.slug}>{cat.name}</option> ))}
              </select>
          </div>
        </div>
        <div className="border-b border-gray-200 dark:border-gray-800">
          <div className="flex justify-start gap-2 -mb-px overflow-x-auto">
              {config.map(rankConf => (
              <button 
                  key={rankConf.rankName}
                  onClick={() => { setActiveRank(rankConf.rankName); }}
                  className={`flex-shrink-0 py-3 px-2 sm:px-4 text-sm sm:text-base font-semibold transition-colors ${activeRank === rankConf.rankName ? 'border-b-2 border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white border-b-2 border-transparent'}`}
              >
                  {rankConf.rankName}
              </button>
              ))}
          </div>
        </div>
      </div>


      {isLoading ? (
        <div className="space-y-2 mt-8">
            {Array.from({ length: 5 }).map((_, i) => <CreatorRankingItemSkeleton key={i} />)}
        </div>
      ) : (
        <div className="mt-8">
          {rankings.length > 0 ? (
            <>
                <div className="flex flex-col md:flex-row justify-center items-end gap-4 mb-12">
                   {topThree[1] && <PodiumCard creator={topThree[1]} rank={2} onClick={handleCreatorClick} />}
                   {topThree[0] && <PodiumCard creator={topThree[0]} rank={1} onClick={handleCreatorClick} />}
                   {topThree[2] && <PodiumCard creator={topThree[2]} rank={3} onClick={handleCreatorClick} />}
                </div>
                <div className="space-y-2">
                    {restOfRankings.map((creator, index) => (
                        <CreatorRankingItem 
                            key={creator.userId}
                            creator={creator}
                            index={index + 3}
                            onClick={handleCreatorClick}
                            isHighlighted={creator.userId === currentUser?.creatorId}
                        />
                    ))}
                </div>
            </>
          ) : (
            <div className="text-center py-16 bg-gray-50 dark:bg-gray-900/50 rounded-lg">
                <Icon name="chart-bar" className="w-12 h-12 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedCategory ? t('rankingsPage.emptyFilterTitle') : t('rankingsPage.emptyTitle')}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mt-1">
                    {selectedCategory
                        ? t('rankingsPage.noCreatorsInFilter', { rank: activeRank.toLowerCase() })
                        : t('rankingsPage.noCreatorsInRank', { rank: activeRank.toLowerCase() })
                    }
                </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};