
import React from 'react';
import { Media } from '../types';
import { Icon } from './Icon';
import { useModals } from '../contexts/ModalProvider';
import { Watermark } from './Watermark';

interface MediaGalleryProps {
    media: Media[];
    creatorUsername: string;
    showWatermark: boolean;
    postId: number;
    onVideoPlay: () => void;
    onVideoComplete: () => void;
}

export const MediaGallery: React.FC<MediaGalleryProps> = ({ media, creatorUsername, showWatermark, postId, onVideoPlay, onVideoComplete }) => {
    const { openLightbox } = useModals();
    if (!media || media.length === 0) return null;

    const creatorInfo = { username: creatorUsername, isOwner: !showWatermark };

    const renderGridItem = (item: Media, index: number) => {
        const isLastItem = index === 3 && media.length > 4;
        return (
             <div 
                key={`${postId}-${index}`}
                className="relative aspect-square cursor-pointer group overflow-hidden rounded-lg"
                onClick={() => openLightbox(media, index, creatorInfo)}
            >
                {item.type === 'image' ? (
                     <img src={item.url} alt={`Post media ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                ) : (
                    <div className="w-full h-full bg-black flex items-center justify-center">
                        <video 
                            src={item.url} 
                            onPlay={onVideoPlay}
                            onEnded={onVideoComplete}
                            controls 
                            className="w-full h-full object-contain"
                        />
                    </div>
                )}
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {isLastItem && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <span className="text-white text-3xl font-bold">+{media.length - 4}</span>
                    </div>
                )}
                {showWatermark && item.type === 'video' && <Watermark username={creatorUsername} />}
             </div>
        )
    }

    return (
        <div className="mt-4">
            {media.length === 1 ? (
                renderGridItem(media[0], 0)
            ) : (
                <div className={`grid gap-2 grid-cols-2 ${media.length > 2 ? 'grid-rows-2' : 'grid-rows-1'}`}>
                    {media.slice(0, 4).map((item, index) => {
                        const isSingle = media.length === 1;
                        const isDouble = media.length === 2;
                        const isTriple = media.length === 3;
                        const isQuad = media.length >= 4;

                        let className = "relative aspect-square cursor-pointer group overflow-hidden rounded-lg";
                        
                        if (isTriple) {
                            if (index === 0) className += ' col-span-2 row-span-2';
                        } else if (isDouble) {
                            className += ' col-span-1 aspect-[4/3]';
                        }
                        
                        return (
                            <div 
                                key={`${postId}-${index}`}
                                className={className}
                                onClick={() => openLightbox(media, index, creatorInfo)}
                            >
                               {item.type === 'image' ? (
                                     <img src={item.url} alt={`Post media ${index + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                                ) : (
                                    <div className="w-full h-full bg-black flex items-center justify-center">
                                       <video 
                                            src={item.url}
                                            onPlay={onVideoPlay}
                                            onEnded={onVideoComplete}
                                            controls 
                                            className="w-full h-full object-contain"
                                        />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                {index === 3 && media.length > 4 && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                                        <span className="text-white text-3xl font-bold">+{media.length - 4}</span>
                                    </div>
                                )}
                                {showWatermark && item.type === 'video' && <Watermark username={creatorUsername} />}
                             </div>
                        )
                    })}
                </div>
            )}
        </div>
    );
};
