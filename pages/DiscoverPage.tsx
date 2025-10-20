import React, { useMemo } from 'react';
import { useNavigation } from '../contexts/NavigationProvider';
import { useData } from '../contexts/DataProvider';
import { Post, PostType, SearchResults, Category } from '../types';
import { Icon } from '../components/Icon';
import { useLocale } from '../contexts/LocaleProvider';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { SearchResultsDropdown } from '../components/SearchResultsDropdown';
import { NsfwOverlay } from '../components/NsfwOverlay';

const PostGridItem: React.FC<{ post: Post }> = ({ post }) => {
  const { onGoToExplore } = useNavigation();
  const media = post.media[0];
  return (
    <NsfwOverlay creator={post.creator}>
      <div className="group relative bg-white dark:bg-gray-900 rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] border border-gray-200 dark:border-gray-800">
        <button onClick={() => onGoToExplore(post.id)} className="w-full">
          <div className="aspect-square relative overflow-hidden">
            {media?.type === 'image' && (
              <img src={media.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
            )}
            {media?.type === 'video' && (
              <div className="w-full h-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                <Icon name="video" className="w-12 h-12 text-white/90" />
              </div>
            )}
            {!media && (
              <div className="w-full h-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-gray-800 dark:to-gray-700 p-3 flex items-center justify-center">
                <p className="text-gray-700 dark:text-gray-300 text-sm font-medium text-center line-clamp-3">{post.text}</p>
              </div>
            )}
            
            {/* Engagement stats overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-0 left-0 right-0 p-3">
                <div className="flex items-center gap-3 text-white">
                  <div className="flex items-center gap-1">
                    <Icon name="like-filled" className="w-4 h-4" />
                    <span className="text-sm font-bold">{post.likedBy.length}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Icon name="comment" className="w-4 h-4" />
                    <span className="text-sm font-bold">{post.comments.length}</span>
                  </div>
                </div>
              </div>
              
              {/* Top badges */}
              <div className="absolute top-2 right-2 flex flex-col gap-1">
                {post.type !== PostType.Public && (
                  <div className="bg-yellow-500 text-black px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Icon name="lock" className="w-3 h-3" />
                    PREMIUM
                  </div>
                )}
                {post.media.length > 1 && (
                  <div className="bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                    <Icon name="collection" className="w-3 h-3" />
                    {post.media.length}
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Creator info strip */}
          <div className="p-3">
            <div className="flex items-center gap-2">
              <img 
                src={post.creator.avatarUrl} 
                alt={post.creator.username}
                className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700"
              />
              <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                @{post.creator.username}
              </span>
            </div>
          </div>
        </button>
      </div>
    </NsfwOverlay>
  );
};

const CategoryChips: React.FC<{ categories: Category[]; selectedCategory: string | null; onSelect: (slug: string | null) => void }> = ({ categories, selectedCategory, onSelect }) => {
  const { t } = useLocale();
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
          !selectedCategory
            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
        }`}
      >
        {t('discoverPage.all') || 'All'}
      </button>
      {categories.map(cat => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.slug)}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
            selectedCategory === cat.slug
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

const DiscoverPageComponent: React.FC = () => {
  const { getDiscoverFeed, search, getCategories } = useData();
  const { onSearch } = useNavigation();
  const { t } = useLocale();
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState(searchQuery);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const discoverPosts = useMemo(() => getDiscoverFeed(), [getDiscoverFeed]);
  const allCategories = useMemo(() => getCategories(), [getCategories]);

  const filteredPosts = useMemo(() => {
    if (!selectedCategory) return discoverPosts;
    return discoverPosts.filter(post => post.creator.mainCategory?.slug === selectedCategory || post.creator.subCategories.some(sc => sc.slug === selectedCategory));
  }, [discoverPosts, selectedCategory]);

  useEffect(() => { const handler = setTimeout(() => setDebouncedQuery(searchQuery), 300); return () => clearTimeout(handler); }, [searchQuery]);
  useEffect(() => { const perform = async () => { if (debouncedQuery.length < 2) { setResults(null); setIsPreviewOpen(false); return; } setIsLoading(true); const r = await search(debouncedQuery); setResults(r); setIsLoading(false); setIsPreviewOpen(true); }; perform(); }, [debouncedQuery, search]);

  const handleSearchSubmit = (e: React.FormEvent) => { e.preventDefault(); if (searchQuery.trim()) { setIsPreviewOpen(false); onSearch(searchQuery); } };

  return (
    <div className="space-y-6">
      {/* Header with search */}
      <div className="text-center space-y-4">
        <div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{t('discoverPage.title')}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">{t('discoverPage.description')}</p>
        </div>
        
        {/* Enhanced search bar */}
        <form onSubmit={handleSearchSubmit} className="relative max-w-2xl mx-auto">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icon name="search" className="w-5 h-5 text-gray-400" />
            </div>
            <input 
              type="search" 
              placeholder={t('discoverPage.searchPlaceholder') || 'Search creators, posts, hashtags...'}
              value={searchQuery} 
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery.length > 1 && setIsPreviewOpen(true)}
              onBlur={() => setTimeout(() => setIsPreviewOpen(false), 200)}
              className="w-full bg-white dark:bg-gray-900 border-2 border-gray-200 dark:border-gray-700 rounded-2xl py-4 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow-md transition-all text-lg font-medium"
            />
          </div>
          {isPreviewOpen && (<SearchResultsDropdown results={results} isLoading={isLoading} />)}
        </form>
      </div>
      
      {/* Category filters */}
      <div>
        <CategoryChips 
          categories={allCategories.filter(c => c.children.length > 0 || c.slug === 'nsfw')} 
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {/* Posts grid */}
      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-3 md:gap-4">
          {filteredPosts.map(post => (
            <PostGridItem key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900/50 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-700">
          <Icon name="compass" className="w-16 h-16 text-gray-300 dark:text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            {t('discoverPage.emptyTitle') || 'Nothing here yet'}
          </h3>
          <p className="text-gray-500 dark:text-gray-400">
            {t('discoverPage.emptyDescription') || 'Try a different category or search term'}
          </p>
        </div>
      )}
    </div>
  );
};

export default DiscoverPageComponent;