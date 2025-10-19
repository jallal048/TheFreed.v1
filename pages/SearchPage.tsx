import React, { useState } from 'react';
import { CreatorCard } from '../components/CreatorCard';
import { Icon } from '../components/Icon';
import { useNavigation } from '../contexts/NavigationProvider';
import { Feed } from '../components/Feed';

export const SearchPage: React.FC = () => {
  const { view, onSelectCreator } = useNavigation();
  const [activeTab, setActiveTab] = useState<'creators' | 'posts'>('creators');

  if (view.page !== 'search') return null;

  const { creators = [], posts = [] } = view.searchResults || {};
  const query = view.searchQuery || '';

  const noResults = activeTab === 'creators' ? creators.length === 0 : posts.length === 0;

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        Search results for: <span className="text-indigo-500 dark:text-indigo-400">"{query}"</span>
      </h1>
      
      <div className="border-b border-gray-200 dark:border-gray-800 mb-6">
        <nav className="-mb-px flex space-x-6">
          <button 
            onClick={() => setActiveTab('creators')} 
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'creators' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Creators <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 ml-2 px-2 py-0.5 rounded-full text-xs">{creators.length}</span>
          </button>
          <button 
            onClick={() => setActiveTab('posts')}
            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${activeTab === 'posts' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            Posts <span className="bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400 ml-2 px-2 py-0.5 rounded-full text-xs">{posts.length}</span>
          </button>
        </nav>
      </div>

      {noResults ? (
        <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-2xl mt-8 border border-gray-200 dark:border-gray-800">
          <Icon name="search" className="w-16 h-16 text-gray-400 dark:text-gray-700 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">No {activeTab} found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2 max-w-md mx-auto">Try another keyword.</p>
        </div>
      ) : (
        <>
          {activeTab === 'creators' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {creators.map(c => <CreatorCard key={c.id} creator={c} onClick={() => onSelectCreator(c)} />)}
            </div>
          )}
          {activeTab === 'posts' && (
            <div className="max-w-3xl mx-auto">
                <Feed posts={posts} />
            </div>
          )}
        </>
      )}
    </div>
  );
};