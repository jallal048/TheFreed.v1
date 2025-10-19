
import React from 'react';
import { useNavigation } from '../contexts/NavigationProvider';
import { useData } from '../contexts/DataProvider';
import { Icon } from '../components/Icon';
import { CreatorCard } from '../components/CreatorCard';
import { NsfwOverlay } from '../components/NsfwOverlay';

export const CategoryPage: React.FC = () => {
    const { view, onGoToDiscover, onSelectCreator } = useNavigation();
    const { getCreatorsByCategory, getCategories } = useData();

    if (view.page !== 'category' || !view.categorySlug) {
        return null;
    }

    const { categorySlug } = view;
    const creators = getCreatorsByCategory(categorySlug);
    const allCategories = getCategories();
    const category = allCategories.flatMap(c => [c, ...c.children]).find(c => c.slug === categorySlug);

    return (
        <div className="max-w-5xl mx-auto">
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
                Creators in <span className="text-indigo-400">{category?.name || 'Category'}</span>
            </h1>
            
            {creators.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {creators.map(creator => (
                        <CreatorCard 
                            key={creator.id} 
                            creator={creator} 
                            onClick={() => onSelectCreator(creator)} 
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-900 rounded-2xl">
                    <h3 className="text-xl font-semibold">No creators found</h3>
                    <p className="text-gray-500 mt-2">There are no creators in this category yet.</p>
                </div>
            )}
        </div>
    );
};
