import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataProvider';
import { useNavigation } from '../contexts/NavigationProvider';
import { Feed } from '../components/Feed';
import { Icon } from '../components/Icon';
import { useLocale } from '../contexts/LocaleProvider';

export const BookmarksPage: React.FC = () => {
    const { currentUser } = useAuth();
    const { posts } = useData();
    const { onGoToHome } = useNavigation();
    const { t } = useLocale();
    
    const bookmarkedPosts = posts
        .filter(post => currentUser?.bookmarkedPostIds.includes(post.id))
        .sort((a, b) => b.id - a.id);

    return (
        <div className="max-w-3xl mx-auto">
            <div className="mb-6">
                <button onClick={onGoToHome} className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold transition-colors">
                  <Icon name="arrow-left" className="w-5 h-5" />{t('bookmarks.backToHome')}
                </button>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <Icon name="bookmark-filled" className="w-8 h-8 text-indigo-500 dark:text-indigo-400" />
                {t('bookmarks.title')}
            </h1>
            {bookmarkedPosts.length > 0 ? (
                <Feed posts={bookmarkedPosts} />
            ) : (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800">
                    <Icon name="bookmark" className="w-16 h-16 text-gray-300 dark:text-gray-700 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t('bookmarks.noPosts')}</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">{t('bookmarks.noPostsDesc')}</p>
                </div>
            )}
        </div>
    );
};