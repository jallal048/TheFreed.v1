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
import { Lightbox } from './components/Lightbox';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { ConfirmationModal } from './components/ConfirmationModal';
import { AddCardModal } from './components/modals/AddCardModal';
import { AgeGateModal } from './components/AgeGateModal';
import { LocaleProvider, useLocale } from './contexts/LocaleProvider';
import { AdminLoginPage } from './pages/admin/AdminLoginPage';
import { ImpersonationBanner } from './components/ImpersonationBanner';
import { AnnouncementsBanner } from './components/AnnouncementsBanner';
import { SupportPage } from './pages/SupportPage';
import { useData } from './contexts/DataProvider';
import { Icon } from './components/Icon';
import { SuspensionPage } from './pages/SuspensionPage';
import { UserRole } from './types';

// Lazy-loaded pages and heavy components
const DiscoverPage = React.lazy(() => import('./pages/DiscoverPage'));
const ProfilePage = React.lazy(() => import('./pages/ProfilePage'));
const DashboardPage = React.lazy(() => import('./pages/DashboardPage'));
const LandingPage = React.lazy(() => import('./pages/LandingPage'));
const HomePage = React.lazy(() => import('./pages/HomePage'));
const FanProfilePage = React.lazy(() => import('./pages/FanProfilePage'));
const SettingsPage = React.lazy(() => import('./pages/SettingsPage'));
const SearchPage = React.lazy(() => import('./pages/SearchPage'));
const MessagesPage = React.lazy(() => import('./pages/MessagesPage'));
const BookmarksPage = React.lazy(() => import('./pages/BookmarksPage'));
const FanListsPage = React.lazy(() => import('./pages/FanListsPage'));
const SchedulePage = React.lazy(() => import('./pages/SchedulePage'));
const ExplorePage = React.lazy(() => import('./pages/ExplorePage'));
const CreatePostModal = React.lazy(() => import('./components/CreatePostForm'));
const PpvMessageModal = React.lazy(() => import('./components/modals/PpvMessageModal'));
const StoryViewer = React.lazy(() => import('./components/stories/StoryViewer'));
const AddStoryModal = React.lazy(() => import('./components/modals/AddStoryModal'));
const RankingsPage = React.lazy(() => import('./pages/RankingsPage'));
const HashtagPage = React.lazy(() => import('./pages/HashtagPage'));
const CategoryPage = React.lazy(() => import('./pages/CategoryPage'));
const AdminApp = React.lazy(() => import('./AdminApp'));
const EditPostModal = React.lazy(() => import('./components/modals/EditPostModal'));
const ScheduleMessageModal = React.lazy(() => import('./components/modals/ScheduleMessageModal'));
const EditScheduledPostModal = React.lazy(() => import('./components/modals/EditScheduledPostModal'));
const AchievementsModal = React.lazy(() => import('./components/modals/AchievementsModal'));

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
          <React.Suspense fallback={<LoadingScreen />}>
            {renderPage()}
          </React.Suspense>
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
      <React.Suspense fallback={null}>
        <EditPostModal />
        <AddCardModal />
        <ScheduleMessageModal />
        <EditScheduledPostModal />
        <CreatePostModal />
        <PpvMessageModal />
        <StoryViewer />
        <AddStoryModal />
        <AchievementsModal />
      </React.Suspense>
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
    const CreatorOnboardingPage = React.lazy(() => import('./pages/CreatorOnboardingPage'));
    return (
      <React.Suspense fallback={<LoadingScreen />}>
        <CreatorOnboardingPage />
      </React.Suspense>
    );
  }
  
  // Handle Admin routing separately. If we are impersonating, we are NOT an admin for routing purposes.
  if (currentUser?.role === UserRole.Admin && !originalAdminUser) {
    return (
      <React.Suspense fallback={<LoadingScreen />}>
        <AdminApp />
      </React.Suspense>
    );
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
        <React.Suspense fallback={<LoadingScreen />}>
          <LandingPage 
            onCreatorJoinClick={() => openAuthModal('signup', UserRole.Creator, refCode || undefined)}
            onFanJoinClick={() => openAuthModal('signup', UserRole.Fan, refCode || undefined)}
            onLoginClick={() => openAuthModal('login')} 
          />
        </React.Suspense>
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
