import React from 'react';
import { useNavigation } from '../contexts/NavigationProvider';
import { Icon } from './Icon';

const prefetch = (page: string) => {
  // Hint the browser to fetch next chunks when user is about to navigate
  switch (page) {
    case 'discover': import('../pages/DiscoverPage'); break;
    case 'messages': import('../pages/MessagesPage'); break;
    case 'profile': import('../pages/ProfilePage'); break;
    case 'rankings': import('../pages/RankingsPage'); break;
    case 'explore': import('../pages/ExplorePage'); break;
    case 'settings': import('../pages/SettingsPage'); break;
    case 'adminDashboard': import('../AdminApp'); break;
    default: break;
  }
};

export const Sidebar: React.FC = () => {
  const nav = useNavigation();

  return (
    <aside className="hidden md:block fixed inset-y-0 left-0 w-64 bg-white/80 dark:bg-zinc-900/80 backdrop-blur border-r border-zinc-200/60 dark:border-zinc-800/60">
      <nav className="p-4 space-y-1">
        <button onMouseEnter={() => prefetch('home')} onClick={nav.onGoToHome} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <Icon name="home" /> <span>Home</span>
        </button>
        <button onMouseEnter={() => prefetch('discover')} onClick={nav.onGoToDiscover} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <Icon name="compass" /> <span>Discover</span>
        </button>
        <button onMouseEnter={() => prefetch('messages')} onClick={nav.onGoToMessages} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <Icon name="envelope" /> <span>Messages</span>
        </button>
        <button onMouseEnter={() => prefetch('rankings')} onClick={nav.onGoToRankings} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <Icon name="rankings" /> <span>Rankings</span>
        </button>
        <button onMouseEnter={() => prefetch('explore')} onClick={() => nav.onGoToExplore()} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <Icon name="globe-alt" /> <span>Explore</span>
        </button>
        <button onMouseEnter={() => prefetch('settings')} onClick={nav.onGoToSettings} className="flex items-center gap-3 w-full px-3 py-2 rounded hover:bg-zinc-100 dark:hover:bg-zinc-800">
          <Icon name="cog-6-tooth" /> <span>Settings</span>
        </button>
      </nav>
    </aside>
  );
};
