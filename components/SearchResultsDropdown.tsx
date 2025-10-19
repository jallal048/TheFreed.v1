import React from 'react';
import { SearchResults } from '../types';
import { useNavigation } from '../contexts/NavigationProvider';
import { useData } from '../contexts/DataProvider';
import { useLocale } from '../contexts/LocaleProvider';

interface SearchResultsDropdownProps {
  results: SearchResults | null;
  isLoading: boolean;
}

export const SearchResultsDropdown: React.FC<SearchResultsDropdownProps> = ({ results, isLoading }) => {
    const { onSelectCreator, onGoToPost, onGoToHashtag } = useNavigation();
    const { creators: allCreators } = useData();
    const { t } = useLocale();

    const handleCreatorClick = (username: string) => {
        const creator = allCreators.find(c => c.username === username);
        if (creator) onSelectCreator(creator);
    };

    if (isLoading) {
        return (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-10 p-4 text-center">
                <p className="text-gray-500">Searching...</p>
            </div>
        );
    }

    if (!results || (results.creators.length === 0 && results.posts.length === 0 && results.hashtags.length === 0)) {
        return null;
    }

    return (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg z-10 max-h-96 overflow-y-auto">
            <div className="p-2">
                {results.creators.length > 0 && (
                    <section>
                        <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('discoverPage.searchResults.creators')}</h3>
                        <ul>
                            {results.creators.map(creator => (
                                <li key={creator.userId}>
                                    <button onMouseDown={() => handleCreatorClick(creator.username)} className="w-full text-left flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <img src={creator.profileImageUrl} alt={creator.username} className="w-8 h-8 rounded-full" />
                                        <span className="font-semibold text-gray-800 dark:text-gray-200">{creator.username}</span>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
                 {results.posts.length > 0 && (
                    <section className="mt-2">
                        <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('discoverPage.searchResults.posts')}</h3>
                        <ul>
                            {results.posts.map(post => (
                                <li key={post.postId}>
                                    <button onMouseDown={() => onGoToPost(post.postId)} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <p className="text-sm text-gray-800 dark:text-gray-200 truncate">{post.excerpt}</p>
                                        <p className="text-xs text-gray-500">by @{post.creatorUsername}</p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
                {results.hashtags.length > 0 && (
                    <section className="mt-2">
                        <h3 className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">{t('discoverPage.searchResults.hashtags')}</h3>
                        <ul>
                            {results.hashtags.map(hashtag => (
                                <li key={hashtag.tag}>
                                    <button onMouseDown={() => onGoToHashtag(hashtag.tag)} className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800">
                                        <p className="font-semibold text-indigo-600 dark:text-indigo-400">#{hashtag.tag}</p>
                                        <p className="text-xs text-gray-500">{hashtag.postCount.toLocaleString()} posts</p>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </section>
                )}
            </div>
        </div>
    );
};