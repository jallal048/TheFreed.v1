

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useData } from './DataProvider';
import { useAuth } from './AuthContext';
import { ViewState, Creator, SettingsSection, UserRole } from '../types';

interface NavigationContextType {
  view: ViewState;
  onSelectCreator: (creator: Creator) => void;
  onGoToHome: () => void;
  onGoToDiscover: () => void;
  onGoToExplore: (postId: number) => void;
  onGoToDashboard: () => void;
  onGoToMyProfile: () => void;
  onGoToPost: (postId: number) => void;
  onGoToSettings: (section?: SettingsSection) => void;
  onSearch: (query: string) => void;
  onGoToMessages: (conversationId?: number) => void;
  onGoToBookmarks: () => void;
  onGoToFanLists: () => void;
  onGoToSchedule: () => void;
  onGoToRankings: () => void;
  onGoToHashtag: (tag: string) => void;
  onGoToCategory: (slug: string) => void;
  onGoToSupport: () => void;
  onGoToReferrals: () => void;
  // Admin navigation
  onGoToAdminLogin: () => void;
  onGoToAdminDashboard: () => void;
  onGoToAdminUsers: (filters?: { role?: UserRole, status?: 'active' | 'suspended' }) => void;
  onGoToAdminContent: () => void;
  onGoToAdminVerifications: () => void;
  onGoToAdminFinances: () => void;
  onGoToAdminSettings: () => void;
  onGoToAdminUserDetail: (userId: number) => void;
  onGoToAdminReports: () => void;
  onGoToAdminAnnouncements: () => void;
  onGoToAdminAutoMod: () => void;
  onGoToAdminPostDetail: (postId: number) => void;
  onGoToAdminSupport: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [view, setView] = useState<ViewState>({ page: 'home' });
  
  const dataContext = useData();
  const authContext = useAuth();


  const handleNavigation = (newView: ViewState) => {
    setView(newView);
    window.scrollTo(0, 0);
  };
  
  const onSelectCreator = (creator: Creator) => handleNavigation({ page: 'profile', creator });
  const onGoToHome = () => handleNavigation({ page: 'home' });
  const onGoToDiscover = () => handleNavigation({ page: 'discover' });
  const onGoToExplore = (postId: number) => handleNavigation({ page: 'explore', explorePostId: postId });
  const onGoToDashboard = () => handleNavigation({ page: 'dashboard' });
  const onGoToBookmarks = () => handleNavigation({ page: 'bookmarks' });
  const onGoToFanLists = () => handleNavigation({ page: 'fanLists' });
  const onGoToSchedule = () => handleNavigation({ page: 'schedule' });
  const onGoToRankings = () => handleNavigation({ page: 'rankings' });
  const onGoToHashtag = (tag: string) => handleNavigation({ page: 'hashtag', hashtag: tag });
  const onGoToCategory = (slug: string) => handleNavigation({ page: 'category', categorySlug: slug });
  const onGoToSupport = () => handleNavigation({ page: 'support' });
  const onGoToReferrals = () => handleNavigation({ page: 'settings', activeSection: 'referrals' });

  // Admin navigation handlers
  const onGoToAdminLogin = () => handleNavigation({ page: 'adminLogin' });
  const onGoToAdminDashboard = () => handleNavigation({ page: 'adminDashboard' });
  const onGoToAdminUsers = (filters?: { role?: UserRole, status?: 'active' | 'suspended' }) => handleNavigation({ page: 'adminUsers', filters });
  const onGoToAdminContent = () => handleNavigation({ page: 'adminContent' });
  const onGoToAdminVerifications = () => handleNavigation({ page: 'adminVerifications' });
  const onGoToAdminFinances = () => handleNavigation({ page: 'adminFinances' });
  const onGoToAdminSettings = () => handleNavigation({ page: 'adminSettings' });
  const onGoToAdminUserDetail = (userId: number) => handleNavigation({ page: 'adminUserDetail', userId });
  const onGoToAdminReports = () => handleNavigation({ page: 'adminReports' });
  const onGoToAdminAnnouncements = () => handleNavigation({ page: 'adminAnnouncements' });
  const onGoToAdminAutoMod = () => handleNavigation({ page: 'adminAutoMod' });
  const onGoToAdminPostDetail = (postId: number) => handleNavigation({ page: 'adminPostDetail', postId });
  const onGoToAdminSupport = () => handleNavigation({ page: 'adminSupport' });


  const onGoToMyProfile = () => {
    const { currentUser } = authContext;
    const { creators } = dataContext;
    if (!currentUser || !creators) return;

    if (currentUser?.role === UserRole.Creator && currentUser.creatorId) {
      const myCreatorProfile = creators.find(c => c.id === currentUser.creatorId);
      if (myCreatorProfile) {
        handleNavigation({ page: 'profile', creator: myCreatorProfile });
      } else {
        onGoToDashboard();
      }
    } else if (currentUser?.role === UserRole.Fan) {
      handleNavigation({ page: 'fanProfile' });
    }
  };

  const onGoToPost = (postId: number) => {
    const { posts, creators } = dataContext;
    if (!posts || !creators) return;

    const post = posts.find(p => p.id === postId);
    if (post) {
      const creatorProfile = creators.find(c => c.id === post.creator.id);
      if (creatorProfile) {
        setView({ page: 'profile', creator: creatorProfile });
        setTimeout(() => {
          document.getElementById(`post-${postId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 100);
      }
    }
  };

  const onGoToSettings = (section?: SettingsSection) => {
    const { currentUser } = authContext;
    if (!currentUser) return;
    const defaultSection = currentUser?.role === UserRole.Creator ? 'profile' : 'account';
    handleNavigation({ page: 'settings', activeSection: section || defaultSection });
  };

  const onSearch = (query: string) => {
    const { currentUser } = authContext;
    const { creators, posts } = dataContext;
    if (!creators || !posts) return;

    const lowerCaseQuery = query.toLowerCase();
    const filteredCreators = creators.filter(c => 
      (currentUser?.showSensitiveContent || c.mainCategory.slug !== 'nsfw') &&
      (c.displayName.toLowerCase().includes(lowerCaseQuery) || 
      c.username.toLowerCase().includes(lowerCaseQuery) ||
      c.bio.toLowerCase().includes(lowerCaseQuery))
    );
    const filteredPosts = posts.filter(p => 
      (currentUser?.showSensitiveContent || p.creator.mainCategory.slug !== 'nsfw') &&
      p.text && p.text.toLowerCase().includes(lowerCaseQuery) && !p.scheduledAt
    );
    
    handleNavigation({ page: 'search', searchResults: { creators: filteredCreators, posts: filteredPosts }, searchQuery: query });
  };

  const onGoToMessages = (conversationId?: number) => {
    handleNavigation({ page: 'messages', preSelectedConversationId: conversationId });
  };

  const value = {
    view,
    onSelectCreator,
    onGoToHome,
    onGoToDiscover,
    onGoToExplore,
    onGoToDashboard,
    onGoToMyProfile,
    onGoToPost,
    onGoToSettings,
    onSearch,
    onGoToMessages,
    onGoToBookmarks,
    onGoToFanLists,
    onGoToSchedule,
    onGoToRankings,
    onGoToHashtag,
    onGoToCategory,
    onGoToSupport,
    onGoToReferrals,
    onGoToAdminLogin,
    onGoToAdminDashboard,
    onGoToAdminUsers,
    onGoToAdminContent,
    onGoToAdminVerifications,
    onGoToAdminFinances,
    onGoToAdminSettings,
    onGoToAdminUserDetail,
    onGoToAdminReports,
    onGoToAdminAnnouncements,
    onGoToAdminAutoMod,
    onGoToAdminPostDetail,
    onGoToAdminSupport,
  };

  return <NavigationContext.Provider value={value}>{children}</NavigationContext.Provider>;
};

export const useNavigation = (): NavigationContextType => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};