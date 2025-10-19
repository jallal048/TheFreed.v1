
import React from 'react';
import { useData } from '../../contexts/DataProvider';
import { useNavigation } from '../../contexts/NavigationProvider';
import { Creator } from '../../types';
import { useModals } from '../../contexts/ModalProvider';
import { Icon } from '../Icon';
import { useAuth } from '../../contexts/AuthContext';

const CreatorItem: React.FC<{ creator: Creator }> = ({ creator }) => {
    const { onSelectCreator } = useNavigation();
    const { openSubModal } = useModals();
    const { currentUser, openAuthModal } = useAuth();
    const { isFollowingCreator, toggleFollowCreator } = useData();
    const isFollowing = isFollowingCreator(creator.id);

    const handleFollow = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!currentUser) {
            openAuthModal();
        } else {
            toggleFollowCreator(creator.id, openAuthModal);
        }
    };
    
    return (
        <div className="flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-800 p-2 rounded-lg">
            <button onClick={() => onSelectCreator(creator)} className="flex items-center gap-3 text-left flex-1 min-w-0">
                <img src={creator.avatarUrl} alt={creator.username} className="w-10 h-10 rounded-full" />
                <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                        <p className="font-bold text-sm text-gray-900 dark:text-white truncate">{creator.displayName}</p>
                         {creator.mainCategory.slug === 'nsfw' && (
                             <span className="text-xs font-bold px-1 py-0.5 rounded bg-red-100 dark:bg-red-500/20 text-red-700 dark:text-red-400 flex-shrink-0">18+</span>
                        )}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">@{creator.username}</p>
                </div>
            </button>
            <button 
                onClick={handleFollow} 
                className={`font-semibold text-xs py-1.5 px-4 rounded-full flex-shrink-0 transition-colors ${
                    isFollowing 
                        ? 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white' 
                        : 'bg-indigo-100 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-200 dark:hover:bg-indigo-500/30'
                }`}
            >
                {isFollowing ? 'Following' : 'Follow'}
            </button>
        </div>
    );
}

export const SuggestedCreatorsWidget: React.FC = () => {
    const { getSuggestedCreators } = useData();
    const suggested = getSuggestedCreators();

    if (suggested.length === 0) {
        return null;
    }

    return (
        <div className="bg-white dark:bg-gray-900 rounded-2xl p-4 border border-gray-200 dark:border-transparent">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-3 px-2">Who to follow</h3>
            <div className="space-y-2">
                {suggested.map(creator => <CreatorItem key={creator.id} creator={creator} />)}
            </div>
        </div>
    );
};