
import React from 'react';
import { useNavigation } from '../contexts/NavigationProvider';
import { useData } from '../contexts/DataProvider';
import { Feed } from '../components/Feed';
import { Icon } from '../components/Icon';
import { useAuth } from '../contexts/AuthContext';

export const HashtagPage: React.FC = () => {
    const { view, onGoToDiscover } = useNavigation();
    const { getPostsByHashtag } = useData();
    const { currentUser } = useAuth();

    if (view.page !== 'hashtag' || !view.hashtag) {
        return null;
    }

    const { hashtag } = view;
    const posts = getPostsByHashtag(hashtag);
    const filteredPosts = posts.filter(post => {
        if (!currentUser?.showSensitiveContent && post.isNsfw) {
            return false;
        }
        return true;
    });

    return (
        <div className="max-w-3xl mx-auto">
             <div className="mb-6">
                <button 
                  onClick={onGoToDiscover}
                  className="flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white font-semibold transition-colors duration-200"
                >
                  <Icon name="arrow-left" className="w-5 h-5" />
                  Back to Discover
                </button>
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="text-indigo-400">#</span>{hashtag}
            </h1>
            
            {filteredPosts.length > 0 ? (
                <Feed posts={filteredPosts} />
            ) : (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                    <h3 className="text-xl font-semibold">No posts found</h3>
                    <p className="text-gray-500 mt-2">There are no public posts with this hashtag yet.</p>
                </div>
            )}
        </div>
    );
};
