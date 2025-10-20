import React from 'react';
import { useNavigation } from '../contexts/NavigationProvider';
import { Icon } from './Icon';

const prefetch = (page: string) => {
  switch (page) {
    case 'home': import('../pages/HomePage'); break;
    case 'discover': import('../pages/DiscoverPage'); break;
    case 'messages': import('../pages/MessagesPage'); break;
    case 'rankings': import('../pages/RankingsPage'); break;
    case 'explore': import('../pages/ExplorePage'); break;
    case 'settings': import('../pages/SettingsPage'); break;
    default: break;
  }
};

export const BottomNav: React.FC = () => {
  const nav = useNavigation();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white/90 dark:bg-zinc-900/90 backdrop-blur border-t border-zinc-200/60 dark:border-zinc-800/60">
      <div className="grid grid-cols-5">
        <button onMouseEnter={() => prefetch('home')} onClick={nav.onGoToHome} className="py-3 flex flex-col items-center">
          <Icon name="home" />
          <span className="text-xs">Home</span>
        </button>
        <button onMouseEnter={() => prefetch('discover')} onClick={nav.onGoToDiscover} className="py-3 flex flex-col items-center">
          <Icon name="compass" />
          <span className="text-xs">Discover</span>
        </button>
        <button onMouseEnter={() => prefetch('explore')} onClick={() => nav.onGoToExplore()} className="py-3 flex flex-col items-center">
          <Icon name="globe-alt" />
          <span className="text-xs">Explore</span>
        </button>
        <button onMouseEnter={() => prefetch('messages')} onClick={nav.onGoToMessages} className="py-3 flex flex-col items-center">
          <Icon name="envelope" />
          <span className="text-xs">Messages</span>
        </button>
        <button onMouseEnter={() => prefetch('settings')} onClick={nav.onGoToSettings} className="py-3 flex flex-col items-center">
          <Icon name="cog-6-tooth" />
          <span className="text-xs">Settings</span>
        </button>
      </div>
    </nav>
  );
};
