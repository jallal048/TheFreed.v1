import React from 'react';

interface WatermarkProps {
    username: string;
}

export const Watermark: React.FC<WatermarkProps> = ({ username }) => {
    return (
        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-md pointer-events-none select-none" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.7)' }}>
            TheFreed/@{username}
        </div>
    );
};