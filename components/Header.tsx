

import React, { useState, useEffect, useRef, useContext } from 'react';
import { Icon } from './Icon';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '../contexts/NavigationProvider';
import { UserRole, Notification } from '../types';
import { formatTimestamp } from '../utils/formatters';
import { useData } from '../contexts/DataProvider';
import { AvatarWithStory } from './AvatarWithStory';
import { LanguageSwitcher } from './LanguageSwitcher';
import { useLocale } from '../contexts/LocaleProvider';
import { useModals } from '../contexts/ModalProvider';

const NotificationPanel: React.FC<{notifications: Notification[], onNotificationClick: (postId: number) => void}> = ({ notifications, onNotificationClick }) => {
  const { t } = useLocale();
  return (
    <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg">
      <div className="p-2">
        <div className="px-2 py-2 border-b border-gray-200 dark:border-gray-800">
          <h4 className="text-sm font-semibold text-gray-900 dark:text-white">{t('header.notifications')}</h4>
        </div>
        <div className="py-1 max-h-96 overflow-y-auto">
          {notifications.length > 0 ? notifications.map(n => (
            <button 
              key={n.id} 
              onClick={() => onNotificationClick(parseInt(n.linkTo.split('/')[2]))}
              className="w-full text-left block px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"
            >
              <div className="flex items-start gap-3">
                <img src={n.actor.avatarUrl} alt="" className="w-8 h-8 rounded-full"/>
                <div>
                  <p className="text-gray-900 dark:text-white text-xs">{n.message}</p>
                  <p className="text-gray-500 dark:text-gray-500 text-xs">{formatTimestamp(n.timestamp)}</p>
                </div>
              </div>
            </button>
          )) : (
            <p className="px-2 py-4 text-center text-sm text-gray-500">{t('header.noNotifications')}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export const Header: React.FC = () => {
  const { currentUser, logout, openAuthModal, theme, toggleTheme } = useAuth();
  const { onGoToDashboard, onGoToMyProfile, onGoToSettings, onGoToBookmarks, onGoToSchedule, onGoToPost, onGoToReferrals } = useNavigation();
  const { markNotificationsAsRead } = useData(); 
  const { openCreatePostModal } = useModals();
  const { t } = useLocale();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  const hasUnread = currentUser?.userNotifications.some(n => !n.read);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setIsMenuOpen(false);
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) setIsNotificationsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLinkClick = (action: () => void) => { action(); setIsMenuOpen(false); };
  
  const handleNotificationToggle = () => {
    if(!isNotificationsOpen) markNotificationsAsRead();
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  return (
    <header className="bg-white/80 dark:bg-black/50 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 p-4 sticky top-0 z-20 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3 cursor-pointer flex-shrink-0 md:hidden">
        <Icon name="logo" className="h-8 w-8 text-indigo-500 dark:text-indigo-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">TheFreed</h1>
      </div>
      
      {/* Spacer for desktop */}
      <div className="hidden md:block flex-1"></div>

      <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
        {currentUser && currentUser.role === UserRole.Creator && (
            <>
              {/* Desktop Create Button */}
              <button
                onClick={openCreatePostModal}
                className="hidden md:flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 text-sm"
              >
                <Icon name="plus" className="w-5 h-5" />
                <span>{t('nav.create')}</span>
              </button>
              {/* Mobile Create Button */}
              <button
                onClick={openCreatePostModal}
                className="md:hidden text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
                aria-label="Create post"
              >
                <Icon name="plus" className="w-6 h-6" />
              </button>
            </>
        )}
        <LanguageSwitcher />
        <button onClick={toggleTheme} className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors" aria-label="Toggle theme">
            {theme === 'dark' ? <Icon name="sun" /> : <Icon name="moon" />}
        </button>

        {currentUser ? (
          <>
            <div className="relative" ref={notificationRef}>
              <button onClick={handleNotificationToggle} className="text-gray-500 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors relative" aria-label="Notifications">
                  <Icon name="bell" />
                  {hasUnread && <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-black"></span>}
              </button>
              {isNotificationsOpen && <NotificationPanel notifications={currentUser.userNotifications} onNotificationClick={(id) => { onGoToPost(id); setIsNotificationsOpen(false); }} />}
            </div>

            <div className="relative" ref={menuRef}>
                <div className="border-2 border-gray-300 dark:border-gray-700 rounded-full">
                    {currentUser.role === UserRole.Creator && currentUser.creatorId ? (
                        <AvatarWithStory
                            creator={{ id: currentUser.creatorId, avatarUrl: currentUser.avatarUrl, username: currentUser.username }}
                            className="h-9 w-9"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        />
                    ) : (
                        <img onClick={() => setIsMenuOpen(!isMenuOpen)} src={currentUser.avatarUrl} alt="User Avatar" className="h-9 w-9 rounded-full cursor-pointer" />
                    )}
                </div>
                <div className={`absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-lg shadow-lg transition-all transform-gpu origin-top-right ${isMenuOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}>
                    <div className="p-2">
                        <div className="px-2 py-2 border-b border-gray-200 dark:border-gray-800">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">{currentUser.username}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser.email}</p>
                        </div>
                        <div className="py-1">
                          <button onClick={() => handleLinkClick(onGoToMyProfile)} className="w-full text-left flex items-center gap-2 block px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"><Icon name="user-circle" className="w-5 h-5"/>{currentUser.role === UserRole.Creator ? t('header.myPublicProfile') : t('header.profile')}</button>
                           {currentUser.role === UserRole.Creator && (<button onClick={() => handleLinkClick(onGoToSchedule)} className="w-full text-left flex items-center gap-2 block px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"><Icon name="calendar-days" className="w-5 h-5"/>{t('nav.schedule')}</button>)}
                          <button onClick={() => handleLinkClick(onGoToDashboard)} className="w-full text-left flex items-center gap-2 block px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"><Icon name="chart-pie" className="w-5 h-5"/>{t('header.dashboard')}</button>
                           <button onClick={() => handleLinkClick(onGoToBookmarks)} className="w-full text-left flex items-center gap-2 block px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"><Icon name="bookmark" className="w-5 h-5"/>{t('header.savedPosts')}</button>
                           <button onClick={() => handleLinkClick(onGoToReferrals)} className="w-full text-left flex items-center gap-2 block px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"><Icon name="users" className="w-5 h-5"/>{t('header.referrals')}</button>
                           <button onClick={() => handleLinkClick(onGoToSettings)} className="w-full text-left flex items-center gap-2 block px-2 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md"><Icon name="cog-6-tooth" className="w-5 h-5"/>{t('header.settings')}</button>
                        </div>
                         <div className="py-1 border-t border-gray-200 dark:border-gray-800">
                          <button onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full text-left block px-2 py-2 text-sm text-red-500 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-400/20 hover:text-red-600 dark:hover:text-white rounded-md">{t('header.logout')}</button>
                        </div>
                    </div>
                </div>
            </div>
          </>
        ) : (
          <>
            <button onClick={() => openAuthModal('login')} className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-semibold">{t('header.login')}</button>
            <button onClick={() => openAuthModal('signup')} className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-4 rounded-full transition-colors duration-300 text-sm">{t('header.signUpFree')}</button>
          </>
        )}
      </div>
    </header>
  );
};