import React from 'react';
import { Icon } from './Icon';
import { useNavigation } from '../contexts/NavigationProvider';
import { useModals } from '../contexts/ModalProvider';
import { useLocale } from '../contexts/LocaleProvider';
import { useAuth } from '../contexts/AuthContext';

const NavItem: React.FC<{ icon: string; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 hover:text-gray-900 dark:hover:text-white'}`} aria-current={isActive ? 'page' : undefined}>
        <Icon name={icon} className="w-6 h-6" />
        <span className="text-xs font-medium">{label}</span>
    </button>
);

export const BottomNav: React.FC = () => {
    const { view, onGoToHome, onGoToDiscover, onGoToMessages, onGoToMyProfile, onGoToRankings } = useNavigation();
    const { currentUser } = useAuth();
    const { t } = useLocale();

    const isMyProfileActive =
        view.page === 'fanProfile' ||
        (view.page === 'profile' && view.creator?.id === currentUser?.creatorId);

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 z-30">
            <div className="grid grid-cols-5 h-full">
                <NavItem icon="home" label={t('nav.home')} isActive={view.page === 'home'} onClick={onGoToHome} />
                <NavItem icon="compass" label={t('nav.discover')} isActive={view.page === 'discover' || view.page === 'explore'} onClick={onGoToDiscover} />
                <NavItem icon="rankings" label={t('nav.rankings')} isActive={view.page === 'rankings'} onClick={onGoToRankings} />
                <NavItem icon="chat-bubble-left-right" label={t('nav.messages')} isActive={view.page === 'messages'} onClick={onGoToMessages} />
                <NavItem icon="user" label={t('nav.profile')} isActive={isMyProfileActive} onClick={onGoToMyProfile} />
            </div>
        </nav>
    );
};