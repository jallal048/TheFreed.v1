import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { AuthUser, UserRole, Creator, OnboardingDataPayload, NavigationTarget } from '../types';
import { myFanAccount, myCreatorAccount, newCreatorUser, anotherFanUser, anotherFanUser2, newCreatorDefaultPackages, adminUser, suspendedFan, bannedCreator, pendingVerificationFan, pendingVerificationCreator, generatedCreatorUsers } from '../constants';

// In a real app, you wouldn't store passwords like this. This is for simulation.
let initialUsers: (AuthUser & { password?: string })[] = [myFanAccount, myCreatorAccount, newCreatorUser, anotherFanUser, anotherFanUser2, adminUser, suspendedFan, bannedCreator, pendingVerificationFan, pendingVerificationCreator, ...generatedCreatorUsers];

type AuthModalView = 'login' | 'signup';
type Theme = 'light' | 'dark';
export type AgeVerificationReason = 'creator_onboarding' | 'fan_nsfw';

type OnboardingData = Partial<Creator> & { personalInfo: AuthUser['personalInfo'] };

interface AuthContextType {
  currentUser: AuthUser | null;
  users: (AuthUser & { password?: string })[];
  creators: Creator[];
  setUsers: React.Dispatch<React.SetStateAction<(AuthUser & { password?: string })[]>>;
  setCreators: React.Dispatch<React.SetStateAction<Creator[]>>;
  creatorOnboardingUser: (Partial<AuthUser> & Partial<Creator> & { password?: string, isUpgrade?: boolean }) | null;
  login: (email: string, password: string) => Promise<AuthUser | null>;
  logout: () => void;
  register: (details: { email: string; password: string; username: string; role: UserRole; }) => Promise<void>;
  upgradeToCreator: (userId: number) => Promise<void>;
  
  // Auth Modal specific
  isAuthModalOpen: boolean;
  openAuthModal: (view?: AuthModalView, role?: UserRole, refCode?: string) => void;
  closeAuthModal: () => void;
  authModalView: AuthModalView;
  setAuthModalView: (view: AuthModalView) => void;
  authModalInitialRole: UserRole;
  
  // Theme
  theme: Theme;
  toggleTheme: () => void;

  // Age Gate
  submitOnboardingData: (data: OnboardingData) => Promise<void>;
  isAgeGateModalOpen: boolean;
  closeAgeGateModal: () => void;
  finalizeUserVerification: (userId: number, reason: AgeVerificationReason, onboardingData?: OnboardingDataPayload) => void;
  startFanAgeVerification: () => void;
  ageVerificationReason: AgeVerificationReason | null;

  // Impersonation
  impersonatedUser: AuthUser | null;
  originalAdminUser: AuthUser | null;
  impersonateUser: (userToImpersonate: AuthUser) => void;
  stopImpersonation: () => void;

  // Navigation Trigger to solve circular dependency
  navigationTrigger: NavigationTarget | null;
  clearNavigationTrigger: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState(initialUsers);
  const [creators, setCreators] = useState<Creator[]>([]); // Will be initialized by DataProvider
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null);
  const [creatorOnboardingUser, setCreatorOnboardingUser] = useState<(Partial<AuthUser> & Partial<Creator> & { password?: string, isUpgrade?: boolean }) | null>(null);
  
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalView, setAuthModalView] = useState<AuthModalView>('login');
  const [authModalInitialRole, setAuthModalInitialRole] = useState<UserRole>(UserRole.Fan);
  const [authModalRefCode, setAuthModalRefCode] = useState<string | null>(null);
  
  const [isAgeGateModalOpen, setIsAgeGateModalOpen] = useState(false);
  const [ageVerificationReason, setAgeVerificationReason] = useState<AgeVerificationReason | null>(null);
  const [theme, setTheme] = useState<Theme>('dark');

  const [impersonatedUser, setImpersonatedUser] = useState<AuthUser | null>(null);
  const [originalAdminUser, setOriginalAdminUser] = useState<AuthUser | null>(null);

  const [navigationTrigger, setNavigationTrigger] = useState<NavigationTarget | null>(null);

  // Sync current user with master user list
  useEffect(() => {
    if (currentUser) {
      const updatedUserFromList = users.find(u => u.id === currentUser.id);
      if (updatedUserFromList) {
        if (JSON.stringify(currentUser) !== JSON.stringify(updatedUserFromList)) {
          setCurrentUser(updatedUserFromList);
        }
      } else {
        // User was deleted, log them out
        setCurrentUser(null);
      }
    }
  }, [users, currentUser]);

  // Theme management
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');
    setTheme(initialTheme);
  }, []);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => (prev === 'light' ? 'dark' : 'light'));

  const openAuthModal = (view: AuthModalView = 'login', role: UserRole = UserRole.Fan, refCode?: string) => {
    setAuthModalView(view);
    if (view === 'signup') {
        setAuthModalInitialRole(role);
    }
    setAuthModalRefCode(refCode || null);
    setIsAuthModalOpen(true);
  };
  const closeAuthModal = () => setIsAuthModalOpen(false);

  const openAgeGateModal = (reason: AgeVerificationReason) => {
    setAgeVerificationReason(reason);
    setIsAgeGateModalOpen(true);
  };
  const closeAgeGateModal = () => setIsAgeGateModalOpen(false);
  
  const startFanAgeVerification = () => {
    openAgeGateModal('fan_nsfw');
  };

  const submitOnboardingData = async (data: OnboardingData) => {
    setCreatorOnboardingUser(prev => prev ? { ...prev, ...data } : null);
    openAgeGateModal('creator_onboarding');
  };

  const finalizeUserVerification = (userId: number, reason: AgeVerificationReason, onboardingData?: OnboardingDataPayload) => {
    if (reason === 'fan_nsfw') {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isAgeVerified: true, showSensitiveContent: true } : u));
        return;
    }
    
    // Creator Onboarding Finalization
    if (reason === 'creator_onboarding' && !onboardingData) {
        console.error("Verification processed for creator, but no onboarding data was found.");
        return;
    }

    if (!onboardingData || !onboardingData.mainCategory) {
        console.error("Onboarding cannot complete without a main category.");
        return;
    };
  
    if (onboardingData.isUpgrade) {
      const userToUpgrade = users.find(u => u.id === userId);
      if (!userToUpgrade) return;
  
      const newCreatorId = Date.now();
      const newCreatorProfile: Creator = {
        id: newCreatorId,
        username: userToUpgrade.username,
        displayName: onboardingData.displayName || userToUpgrade.username,
        avatarUrl: userToUpgrade.avatarUrl,
        bannerUrl: `https://picsum.photos/seed/banner${newCreatorId}/1200/400`,
        bio: onboardingData.bio || `Welcome to my Topics page!`,
        location: onboardingData.location || '',
        socialLinks: onboardingData.socialLinks || [],
        mainCategory: onboardingData.mainCategory,
        subCategories: onboardingData.subCategories || [],
        monthlyPrice: onboardingData.monthlyPrice ?? 4.99,
        subscriptionPackages: newCreatorDefaultPackages,
        stats: { posts: 0, subscribers: '0' },
        payoutInfo: { iban: '', swiftBic: '', bankName: '' },
        lastSeen: 'online',
        rank: 'IRON',
        globalPercentile: null,
        creatorScore: 0,
      };
      setCreators(prev => [...prev, newCreatorProfile]);
  
      const upgradedUser: AuthUser = {
        ...userToUpgrade,
        personalInfo: onboardingData.personalInfo!,
        role: UserRole.Creator,
        creatorId: newCreatorId,
        isAgeVerified: true,
        showSensitiveContent: true,
        onboardingProgress: [
            { step: 'profile_basics', completed: true },
            { step: 'categorization', completed: true },
            { step: 'social_links', completed: true },
            { step: 'monetization', completed: true },
            { step: 'first_post', completed: false },
        ],
        lastSeen: 'online',
        registeredAt: userToUpgrade.registeredAt || new Date().toISOString(),
      };
      
      setUsers(prev => prev.map(u => u.id === upgradedUser.id ? upgradedUser : u));
      setCurrentUser(upgradedUser);
    } else {
      const newUserId = userId; // Use the ID from the verification submission
      const baseUser: Omit<AuthUser, 'id'> = {
        username: onboardingData.username!,
        email: onboardingData.email!,
        role: UserRole.Creator,
        avatarUrl: onboardingData.avatarUrl || `https://picsum.photos/seed/${newUserId}/40/40`,
        personalInfo: onboardingData.personalInfo!,
        subscriptions: [],
        followingIds: [],
        unlockedPosts: [],
        unlockedMessages: [],
        viewedStories: [],
        bookmarkedPostIds: [],
        savedCard: null,
        notifications: { newPosts: true, newComments: true, specialOffers: true },
        userNotifications: [], isProfilePrivate: false, allowFindByEmail: true,
        sendReadReceipts: true, mutedConversations: [], blockedUsers: [],
        billingInfo: { address: '', city: '', postalCode: '', country: '' },
        lastSeen: 'online',
        isAgeVerified: true,
        showSensitiveContent: true,
        registeredAt: new Date().toISOString(),
        achievements: [],
        referralCode: onboardingData.referralCode,
        referredByUserId: onboardingData.referredByUserId,
      };
  
      const newCreatorProfile: Creator = {
        id: newUserId,
        username: baseUser.username,
        displayName: onboardingData.displayName || baseUser.username,
        avatarUrl: baseUser.avatarUrl,
        bannerUrl: onboardingData.bannerUrl || `https://picsum.photos/seed/banner${newUserId}/1200/400`,
        bio: onboardingData.bio || `Welcome to my Topics page!`,
        location: onboardingData.location || '',
        socialLinks: onboardingData.socialLinks || [],
        mainCategory: onboardingData.mainCategory,
        subCategories: onboardingData.subCategories || [],
        monthlyPrice: onboardingData.monthlyPrice ?? 4.99,
        subscriptionPackages: newCreatorDefaultPackages,
        stats: { posts: 0, subscribers: '0' },
        payoutInfo: { iban: '', swiftBic: '', bankName: '' },
        lastSeen: 'online',
        rank: 'IRON',
        globalPercentile: null,
        creatorScore: 0,
      };
      setCreators(prev => [...prev, newCreatorProfile]);
  
      const newUser: AuthUser & { password?: string } = {
        ...baseUser,
        id: newUserId,
        creatorId: newUserId,
        password: onboardingData.password,
        onboardingProgress: [
            { step: 'profile_basics', completed: true },
            { step: 'categorization', completed: true },
            { step: 'social_links', completed: true },
            { step: 'monetization', completed: true },
            { step: 'first_post', completed: false },
        ],
      };
  
      setUsers(prev => [...prev, newUser]);
      setCurrentUser(newUser);
    }
  
    setCreatorOnboardingUser(null);
    setAgeVerificationReason(null);
  };

  const login = (email: string, password: string): Promise<AuthUser | null> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
          const loggedInUser = { ...user, lastSeen: 'online' as const };
          setCurrentUser(loggedInUser);
          setUsers(prev => prev.map(u => u.id === user.id ? loggedInUser : u));
          
          if(user.creatorId) {
             setCreators(prev => prev.map(c => c.id === user.creatorId ? { ...c, lastSeen: 'online' } : c));
          }
          resolve(loggedInUser);
        } else {
          reject(new Error('Invalid email or password.'));
          resolve(null);
        }
      }, 500);
    });
  };

  const register = (details: { email: string; password: string; username: string; role: UserRole; }): Promise<void> => {
     return new Promise((resolve) => {
      setTimeout(() => {
        const referrer = users.find(u => u.referralCode === authModalRefCode);
        const newReferralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
          
        if (details.role === UserRole.Fan) {
            const newUser: AuthUser & { password?: string } = {
                id: Date.now(),
                username: details.username,
                email: details.email,
                password: details.password,
                role: details.role,
                avatarUrl: `https://picsum.photos/seed/${Date.now()}/40/40`,
                subscriptions: [],
                followingIds: [],
                unlockedPosts: [],
                unlockedMessages: [],
                viewedStories: [],
                bookmarkedPostIds: [],
                savedCard: null,
                notifications: { newPosts: true, newComments: true, specialOffers: true },
                userNotifications: [],
                isProfilePrivate: false,
                allowFindByEmail: true,
                sendReadReceipts: true,
                isAgeVerified: false,
                showSensitiveContent: false,
                mutedConversations: [],
                blockedUsers: [],
                personalInfo: { fullName: '', dateOfBirth: '', address: '' },
                billingInfo: { address: '', city: '', postalCode: '', country: '' },
                lastSeen: 'online',
                registeredAt: new Date().toISOString(),
                achievements: [],
                referralCode: newReferralCode,
                referredByUserId: referrer?.id,
            };
            setUsers(prev => [...prev, newUser]);
            setCurrentUser(newUser);
        } else {
            const tempUser = {
                username: details.username,
                email: details.email,
                password: details.password,
                role: details.role,
                referralCode: newReferralCode,
                referredByUserId: referrer?.id,
            };
            setCreatorOnboardingUser(tempUser);
        }
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    if (originalAdminUser) {
        stopImpersonation();
        return;
    }
    if (currentUser) {
        const now = new Date().toISOString();
        setUsers(prev => prev.map(u => u.id === currentUser.id ? {...u, lastSeen: now} : u));
        if (currentUser.creatorId) {
            setCreators(prev => prev.map(c => c.id === currentUser.creatorId ? {...c, lastSeen: now} : c));
        }
    }
    setCurrentUser(null);
    setCreatorOnboardingUser(null);
  };
  
  const upgradeToCreator = async (userId: number) => {
    return new Promise<void>((resolve) => {
        const userToUpgrade = users.find(u => u.id === userId);
        if (!userToUpgrade || userToUpgrade.role === UserRole.Creator) {
            return resolve();
        }
        setCreatorOnboardingUser({ ...userToUpgrade, isUpgrade: true });
        resolve();
    });
  };

  const impersonateUser = (userToImpersonate: AuthUser) => {
    if (currentUser?.role === UserRole.Admin && !originalAdminUser) {
        setOriginalAdminUser(currentUser);
        setCurrentUser(userToImpersonate);
        setImpersonatedUser(userToImpersonate);
        setNavigationTrigger({ page: 'home' });
    }
  };

  const stopImpersonation = () => {
    if (originalAdminUser) {
        setCurrentUser(originalAdminUser);
        setOriginalAdminUser(null);
        setImpersonatedUser(null);
        setNavigationTrigger({ page: 'adminDashboard' });
    }
  };

  const clearNavigationTrigger = () => setNavigationTrigger(null);

  const value: AuthContextType = {
    currentUser,
    users,
    creators,
    setUsers,
    setCreators,
    creatorOnboardingUser,
    login,
    logout,
    register,
    upgradeToCreator,
    isAuthModalOpen,
    openAuthModal,
    closeAuthModal,
    authModalView,
    setAuthModalView,
    authModalInitialRole,
    theme,
    toggleTheme,
    submitOnboardingData,
    isAgeGateModalOpen,
    closeAgeGateModal,
    finalizeUserVerification,
    ageVerificationReason,
    startFanAgeVerification,
    impersonatedUser,
    originalAdminUser,
    impersonateUser,
    stopImpersonation,
    navigationTrigger,
    clearNavigationTrigger,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

const DataContext = createContext<any>(undefined); // Forward declaration

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};