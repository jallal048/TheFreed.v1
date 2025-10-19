

import React, { useEffect, useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataProvider';
import { ModalProvider } from './contexts/ModalProvider';
import { NavigationProvider, useNavigation } from './contexts/NavigationProvider';

import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { SubscriptionModal } from './components/SubscriptionModal';
import { PpvModal } from './components/PpvModal';
import { TipModal } from './components/TipModal';
import { DiscoverPage } from './pages/DiscoverPage';
import { ProfilePage } from './pages/ProfilePage';
import { DashboardPage } from './pages/DashboardPage';
import { LandingPage } from './pages/LandingPage';
import { HomePage } from './pages/HomePage';
import { FanProfilePage } from './pages/FanProfilePage';
import { SettingsPage } from './pages/SettingsPage';
import { Lightbox } from './components/Lightbox';
import { SearchPage } from './pages/SearchPage';
import { MessagesPage } from './pages/MessagesPage';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { BookmarksPage } from './pages/BookmarksPage';
import { FanListsPage } from './pages/FanListsPage';
import { ConfirmationModal } from './components/ConfirmationModal';
import { EditPostModal } from './components/modals/EditPostModal';
import { AddCardModal } from './components/modals/AddCardModal';
import { SchedulePage } from './pages/SchedulePage';
import { ScheduleMessageModal } from './components/modals/ScheduleMessageModal';
import { AgeGateModal } from './components/AgeGateModal';
import { CreatorOnboardingPage } from './pages/CreatorOnboardingPage';
import { EditScheduledPostModal } from './components/modals/EditScheduledPostModal';
import { ExplorePage } from './pages/ExplorePage';
import { CreatePostModal } from './components/CreatePostForm';
import { PpvMessageModal } from './components/modals/PpvMessageModal';
import { StoryViewer } from './components/stories/StoryViewer';
import { AddStoryModal } from './components/modals/AddStoryModal';
import { RankingsPage } from './pages/RankingsPage';
import { LocaleProvider, useLocale } from './contexts/LocaleProvider';
import { HashtagPage } from './pages/HashtagPage';
import { CategoryPage } from './pages/CategoryPage';
import { AdminApp } from './AdminApp';
import { UserRole } from './types';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { ImpersonationBanner } from './components/ImpersonationBanner';
import { AnnouncementsBanner } from './components/AnnouncementsBanner';
import { SupportPage } from './pages/SupportPage';
import { useData } from './contexts/DataProvider';
import { Icon } from './components/Icon';
import { SuspensionPage } from './pages/SuspensionPage';
import { AchievementsModal } from './components/modals/AchievementsModal';

const LoggedInApp: React.FC = () => {
  const { view } = useNavigation();
  const { getPostsForCreator } = useData();

  const renderPage = () => {
    switch (view.page) {
      case 'home': return <HomePage />;
      case 'discover': return <DiscoverPage />;
      case 'explore': return <ExplorePage />;
      case 'rankings': return <RankingsPage />;
      case 'hashtag': return <HashtagPage />;
      case 'category': return <CategoryPage />;
      case 'profile':
        if (view.creator) {
          const creatorPosts = getPostsForCreator(view.creator.id);
          return <ProfilePage creator={view.creator} posts={creatorPosts} />;
        }
        return <HomePage />; // Fallback
      case 'dashboard': return <DashboardPage />;
      case 'fanProfile': return <FanProfilePage />;
      case 'settings': return <SettingsPage />;
      case 'search': return <SearchPage />;
      case 'messages': return <MessagesPage />;
      case 'bookmarks': return <BookmarksPage />;
      case 'fanLists': return <FanListsPage />;
      case 'schedule': return <SchedulePage />;
      case 'support': return <SupportPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black font-sans">
      <Sidebar />
      <div className="md:pl-64">
        <ImpersonationBanner />
        <AnnouncementsBanner />
        <Header />
        <main className="p-6 md:p-8 pb-20 md:pb-8">
          {renderPage()}
        </main>
      </div>
      <BottomNav />
      
      {/* Modals are rendered here but controlled by ModalProvider */}
      <AuthModal />
      <SubscriptionModal />
      <PpvModal />
      <TipModal />
      <Lightbox />
      <ConfirmationModal />
      <EditPostModal />
      <AddCardModal />
      <ScheduleMessageModal />
      <EditScheduledPostModal />
      <CreatePostModal />
      <PpvMessageModal />
      <StoryViewer />
      <AddStoryModal />
      <AchievementsModal />
    </div>
  )
}

const LoadingScreen: React.FC = () => (
    <div className="min-h-screen bg-white dark:bg-black flex items-center justify-center">
        <Icon name="logo" className="w-16 h-16 text-indigo-500 animate-pulse" />
    </div>
);

const AppContent: React.FC = () => {
  const { currentUser, creatorOnboardingUser, openAuthModal, originalAdminUser, navigationTrigger, clearNavigationTrigger } = useAuth();
  const navigation = useNavigation();
  const { view } = useNavigation();
  const { isLoading: isLocaleLoading } = useLocale();
  const [refCode, setRefCode] = useState<string | null>(null);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const ref = urlParams.get('ref');
    if (ref) {
        setRefCode(ref);
    }
  }, []);

  useEffect(() => {
    if (navigationTrigger) {
      if (navigationTrigger.page === 'home') {
        navigation.onGoToHome();
      } else if (navigationTrigger.page === 'adminDashboard') {
        navigation.onGoToAdminDashboard();
      }
      clearNavigationTrigger();
    }
  }, [navigationTrigger, navigation, clearNavigationTrigger]);

  if (isLocaleLoading) {
    return <LoadingScreen />;
  }

  if (creatorOnboardingUser) {
    return <CreatorOnboardingPage />;
  }
  
  // Handle Admin routing separately. If we are impersonating, we are NOT an admin for routing purposes.
  if (currentUser?.role === UserRole.Admin && !originalAdminUser) {
    return <AdminApp />;
  }
  
  if(view.page === 'adminLogin') {
    return <AdminLoginPage />;
  }

  if (view.page === 'support' && !currentUser) {
      return <SupportPage />;
  }

  if (!currentUser) {
    return (
      <>
        <AuthModal />
        <LandingPage 
          onCreatorJoinClick={() => openAuthModal('signup', UserRole.Creator, refCode || undefined)}
          onFanJoinClick={() => openAuthModal('signup', UserRole.Fan, refCode || undefined)}
          onLoginClick={() => openAuthModal('login')} 
        />
      </>
    );
  }

  if (currentUser.suspendedUntil && new Date(currentUser.suspendedUntil) > new Date()) {
    return <SuspensionPage />;
  }

  return <LoggedInApp />;
}


const App: React.FC = () => {
  return (
    <LocaleProvider>
        <AuthProvider>
            <DataProvider>
                <NavigationProvider>
                    <ModalProvider>
                        <AppContent />
                        <AgeGateModal />
                    </ModalProvider>
                </NavigationProvider>
            </DataProvider>
        </AuthProvider>
    </LocaleProvider>
  );
};

export default App;