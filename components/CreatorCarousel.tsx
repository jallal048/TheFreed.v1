import React, { useCallback } from 'react';
import { Creator } from '../types';
import { CreatorCard } from './CreatorCard';
import { useNavigation } from '../contexts/NavigationProvider';

interface CreatorCarouselProps {
    creators: Creator[];
}

export const CreatorCarousel: React.FC<CreatorCarouselProps> = ({ creators }) => {
    const { onSelectCreator } = useNavigation();

    const handleSelectCreator = useCallback((creator: Creator) => {
        onSelectCreator(creator);
    }, [onSelectCreator]);

    if (!creators || creators.length === 0) {
        return null;
    }

    return (
        <div className="my-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Suggested Creators</h2>
            <div className="flex overflow-x-auto space-x-6 pb-4 -mx-6 px-6">
                {creators.map(creator => (
                    <div key={creator.id} className="flex-shrink-0 w-72">
                        <CreatorCard creator={creator} onClick={() => handleSelectCreator(creator)} />
                    </div>
                ))}
            </div>
            <style>{`
              .overflow-x-auto::-webkit-scrollbar { height: 8px; }
              .overflow-x-auto::-webkit-scrollbar-track { background: transparent; }
              .overflow-x-auto::-webkit-scrollbar-thumb { background: #a0aec0; border-radius: 4px; }
              .dark .overflow-x-auto::-webkit-scrollbar-thumb { background: #4a5568; }
            `}</style>
        </div>
    );
};
