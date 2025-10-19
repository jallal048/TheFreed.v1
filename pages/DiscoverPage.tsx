
import React, { useMemo, useState, useEffect } from 'react';
import { useNavigation } from '../contexts/NavigationProvider';
import { useData } from '../contexts/DataProvider';
import { Post, PostType, SearchResults, Category } from '../types';
import { Icon } from '../components/Icon';
import { useLocale } from '../contexts/LocaleProvider';
import { SearchResultsDropdown } from '../components/SearchResultsDropdown';
import { NsfwOverlay } from '../components/NsfwOverlay';

const _PostGridItem: React.FC<{ post: Post }> = ({ post }) => {
    const { onGoToExplore } = useNavigation();
    const media = post.media[0];

    return (
        <NsfwOverlay creator={post.creator}>
            <button
                onClick={() => onGoToExplore(post.id)}
                className="relative aspect-square group overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-indigo-500"
            >
                {media?.type === 'image' && (
                    <img src={media.url} alt="" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
                )}
                {media?.type === 'video' && (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                        <Icon name="video" className="w-12 h-12 text-gray-400 dark:text-gray-600" />
                    </div>
                )}
                {!media && (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center p-4">
                        <p className="text-gray-500 dark:text-gray-400 text-sm line-clamp-3">{post.text}</p>
                    </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-2 text-white" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                        <div className="flex items-center gap-2">
                            <img src={post.creator.avatarUrl} alt={post.creator.username} className="w-6 h-6 rounded-full border-2 border-white" />
                            <p className="text-sm font-semibold truncate">{post.creator.username}</p>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 opacity-80">
                            <Icon name="like-filled" className="w-4 h-4" />
                            <span className="text-xs font-bold">{post.likedBy.length}</span>
                        </div>
                    </div>
                </div>

                {post.type !== PostType.Public && (
                    <div className="absolute top-2 left-2 bg-black/50 text-white p-1 rounded-full">
                        <Icon name="lock" className="w-4 h-4" />
                    </div>
                )}
                {post.media.length > 1 && (
                    <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full">
                        <Icon name="collection" className="w-4 h-4" />
                    </div>
                )}
                
            </button>
        </NsfwOverlay>
    );
};
const PostGridItem = React.memo(_PostGridItem);


export const DiscoverPage: React.FC = () => {
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
        if (!selectedCategory) {
            return discoverPosts;
        }
        return discoverPosts.filter(post => 
            post.creator.mainCategory?.slug === selectedCategory ||
            post.creator.subCategories.some(sc => sc.slug === selectedCategory)
        );
    }, [discoverPosts, selectedCategory]);
    
    // Debounce effect
    useEffect(() => {
        const handler = setTimeout(() => { setDebouncedQuery(searchQuery); }, 300);
        return () => { clearTimeout(handler); };
    }, [searchQuery]);


    useEffect(() => {
        const performSearch = async () => {
            if (debouncedQuery.length < 2) {
                setResults(null);
                setIsPreviewOpen(false);
                return;
            }
            setIsLoading(true);
            const searchResults = await search(debouncedQuery);
            setResults(searchResults);
            setIsLoading(false);
            setIsPreviewOpen(true);
        };
        performSearch();
    }, [debouncedQuery, search]);


    const handleSearchSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            setIsPreviewOpen(false);
            onSearch(searchQuery);
        }
    };

    const CategoryFilter: React.FC<{ categories: Category[] }> = ({ categories }) => (
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 -mx-6 px-6">
            <button
                onClick={() => setSelectedCategory(null)}
                className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                    !selectedCategory
                        ? 'bg-indigo-600 text-white'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
            >
                {t('discoverPage.all')}
            </button>
            {categories.map(cat => (
                 <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`flex-shrink-0 px-4 py-2 text-sm font-semibold rounded-full transition-colors ${
                        selectedCategory === cat.slug
                            ? 'bg-indigo-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                >
                    {cat.name}
                </button>
            ))}
             <style>{`
              .overflow-x-auto::-webkit-scrollbar { height: 4px; }
              .overflow-x-auto::-webkit-scrollbar-track { background: transparent; }
              .overflow-x-auto::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
              .dark .overflow-x-auto::-webkit-scrollbar-thumb { background: #4b5563; }
            `}</style>
        </div>
    );

    return (
        <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">{t('discoverPage.title')}</h1>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-6">
                {t('discoverPage.description')}
            </p>

            <form onSubmit={handleSearchSubmit} className="mb-4 relative">
                <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none"><Icon name="search" className="w-5 h-5 text-gray-400" /></div>
                    <input 
                        type="search" 
                        placeholder={t('discoverPage.searchPlaceholder')} 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => searchQuery.length > 1 && setIsPreviewOpen(true)}
                        onBlur={() => setTimeout(() => setIsPreviewOpen(false), 200)}
                        className="w-full bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-full py-3 pl-12 pr-4 text-gray-900 dark:text-white placeholder-gray-500 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white dark:focus:bg-gray-800 outline-none transition-all text-lg"
                    />
                </div>
                {isPreviewOpen && (
                    <SearchResultsDropdown results={results} isLoading={isLoading} />
                )}
            </form>
            
            <div className="mb-8">
                <CategoryFilter categories={allCategories.filter(c => c.children.length > 0 || c.slug === 'nsfw')} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-1 md:gap-2">
                {filteredPosts.map(post => (
                    <PostGridItem key={post.id} post={post} />
                ))}
            </div>
        </div>
    );
};