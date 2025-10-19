import React, { useState, useEffect, useCallback } from 'react';
import { useModals } from '../contexts/ModalProvider';
import { Icon } from './Icon';
import { Watermark } from './Watermark';

export const Lightbox: React.FC = () => {
    const { isLightboxOpen, closeLightbox, lightboxMedia, lightboxStartIndex, lightboxCreatorInfo } = useModals();
    const [currentIndex, setCurrentIndex] = useState(lightboxStartIndex);

    useEffect(() => {
        if (isLightboxOpen) {
            setCurrentIndex(lightboxStartIndex);
        }
    }, [isLightboxOpen, lightboxStartIndex]);
    
    const handleNext = useCallback(() => {
        if (lightboxMedia.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % lightboxMedia.length);
        }
    }, [lightboxMedia.length]);

    const handlePrev = useCallback(() => {
        if (lightboxMedia.length > 1) {
            setCurrentIndex((prevIndex) => (prevIndex - 1 + lightboxMedia.length) % lightboxMedia.length);
        }
    }, [lightboxMedia.length]);
    
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowRight') handleNext();
            if (e.key === 'ArrowLeft') handlePrev();
        };
        if (isLightboxOpen) document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [isLightboxOpen, handleNext, handlePrev, closeLightbox]);

    if (!isLightboxOpen || lightboxMedia.length === 0) return null;

    const currentMedia = lightboxMedia[currentIndex];
    const showWatermark = lightboxCreatorInfo && !lightboxCreatorInfo.isOwner;

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={closeLightbox}>
            <button className="absolute top-4 right-4 text-white/70 hover:text-white" onClick={(e) => { e.stopPropagation(); closeLightbox(); }}><Icon name="close" className="w-10 h-10" /></button>
            {lightboxMedia.length > 1 && (
                <>
                    <button className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full" onClick={(e) => { e.stopPropagation(); handlePrev(); }}><Icon name="chevron-left" className="w-8 h-8" /></button>
                    <button className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full" onClick={(e) => { e.stopPropagation(); handleNext(); }}><Icon name="chevron-right" className="w-8 h-8" /></button>
                </>
            )}
            <div className="relative max-w-full max-h-full" onClick={e => e.stopPropagation()}>
                {currentMedia.type === 'image' && <img src={currentMedia.url} alt="" className="object-contain max-w-[90vw] max-h-[90vh] rounded-lg" />}
                {currentMedia.type === 'video' && (
                    <div className="relative w-[90vw] h-[90vh] flex items-center justify-center">
                        <div className="text-center"><Icon name="video" className="w-24 h-24 text-white/50 mx-auto" /><p className="text-white mt-4">Video player not implemented.</p></div>
                        {showWatermark && <Watermark username={lightboxCreatorInfo.username} />}
                    </div>
                )}
            </div>
             <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white bg-black/50 px-3 py-1 rounded-full text-sm">{currentIndex + 1} / {lightboxMedia.length}</div>
        </div>
    );
};
