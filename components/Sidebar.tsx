import React from 'react';
import { Icon } from './Icon';
import { useNavigation } from '../contexts/NavigationProvider';
import { useModals } from '../contexts/ModalProvider';
import { useLocale } from '../contexts/LocaleProvider';
import { useAuth } from '../contexts/AuthContext';

const NavItem: React.FC<{ icon: string; label: string; isActive: boolean; onClick: () => void; }> = ({ icon, label, isActive, onClick }) => (
    <button onClick={onClick} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-lg ${isActive ? 'bg-indigo-100 dark:bg-indigo-600/20 text-indigo-700 dark:text-indigo-300 font-bold' : 'text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-900 hover:text-gray-900 dark:hover:text-white'}`} aria-current={isActive ? 'page' : undefined}>
        <Icon name={icon} className="w-6 h-6" />
        {label}
    </button>
);

export const Sidebar: React.FC = () => {
    const { view, onGoToHome, onGoToDiscover, onGoToMessages, onGoToMyProfile, onGoToRankings } = useNavigation();
    const { currentUser } = useAuth();
    const { t } = useLocale();

    const isMyProfileActive =
        view.page === 'fanProfile' ||
        (view.page === 'profile' && view.creator?.id === currentUser?.creatorId);
    
    return (
        <aside className="hidden md:flex flex-col w-64 h-screen fixed top-0 left-0 bg-white dark:bg-black border-r border-gray-200 dark:border-gray-900 p-4">
            <div className="flex items-center gap-3 cursor-pointer flex-shrink-0 px-2 pt-2 pb-6">
                <Icon name="logo" className="h-9 w-9 text-indigo-500 dark:text-indigo-400" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">TheFreed</h1>
            </div>

            <nav className="flex flex-col gap-2">
                <NavItem icon="home" label={t('nav.home')} isActive={view.page === 'home'} onClick={onGoToHome} />
                <NavItem icon="compass" label={t('nav.discover')} isActive={view.page === 'discover' || view.page === 'explore'} onClick={onGoToDiscover} />
                <NavItem icon="chart-bar" label={t('nav.rankings')} isActive={view.page === 'rankings'} onClick={onGoToRankings} />
                <NavItem icon="chat-bubble-left-right" label={t('nav.messages')} isActive={view.page === 'messages'} onClick={onGoToMessages} />
                <NavItem icon="user" label={t('nav.profile')} isActive={isMyProfileActive} onClick={onGoToMyProfile} />
            </nav>
        </aside>
    );
};