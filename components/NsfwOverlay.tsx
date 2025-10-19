
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Creator } from '../types';
import { Icon } from './Icon';
import { useNavigation } from '../contexts/NavigationProvider';
import { useLocale } from '../contexts/LocaleProvider';

interface NsfwOverlayProps {
    creator: Partial<Creator>;
    children: React.ReactNode;
}

export const NsfwOverlay: React.FC<NsfwOverlayProps> = ({ creator, children }) => {
    const { currentUser } = useAuth();
    const { onGoToSettings } = useNavigation();
    const { t } = useLocale();

    const isNsfwCreator = creator.mainCategory?.slug === 'nsfw';
    const shouldBlur = isNsfwCreator && !currentUser?.showSensitiveContent;

    if (!shouldBlur) {
        return <>{children}</>;
    }

    return (
        <div className="relative overflow-hidden rounded-2xl">
            <div className="blur-xl pointer-events-none">{children}</div>
            <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-center p-4">
                <Icon name="ban" className="w-10 h-10 text-white mb-2" />
                <p className="font-bold text-white">Sensitive Content</p>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        onGoToSettings('privacy');
                    }}
                    className="mt-3 bg-white/20 hover:bg-white/30 text-white font-semibold text-xs py-1.5 px-4 rounded-full"
                >
                    Verify age in settings to view
                </button>
            </div>
        </div>
    );
};
