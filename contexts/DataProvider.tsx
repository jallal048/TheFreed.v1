
import React, { createContext, useContext, useState, ReactNode, useEffect, useMemo, useCallback } from 'react';
import { useAuth, AgeVerificationReason } from './AuthContext';
import { AuthUser, UserRole, Creator, Post, Media, Notification, Conversation, Message, Comment, PostType, NotificationType, PostFormat, FanList, CreatorStats, ScheduledMessage, FreeTrialLink, SubscriptionPackage, UserSubscription, Story, StoryItem, RankConfig, SearchResults, Category, SearchResultHashtag, SearchResultPost, VerificationSubmission, Transaction, TransactionType, PlatformSettings, RankName, Report, Announcement, AutoModQueueItem, SupportTicket, SupportTicketStatus, OnboardingDataPayload, Achievement, PostInteractionMetrics } from '../types';
import { mockCreators as initialCreators, mockPosts as initialPosts, mockConversations as initialConversations, mockFanLists as initialFanLists, mockCreatorStats, mockScheduledMessages as initialScheduledMessages, mockFreeTrialLinks as initialFreeTrialLinks, mockStories, mockRankConfigs, mockCategories, mockTransactions, mockReports, mockAnnouncements, mockAutoModQueue, mockSupportTickets, mockVerificationSubmissions, mockAchievements, categoryRelationsGraph } from '../constants';
import { calculatePostScore, calculatePersonalizedPostScore } from '../services/feedAlgorithm';

interface DataContextType {
  posts: Post[];
  creators: Creator[];
  users: (AuthUser & { password?: string })[];
  stories: Story[];
  verificationSubmissions: VerificationSubmission[];
  transactions: Transaction[];
  platformSettings: PlatformSettings;
  reports: Report[];
  announcements: Announcement[];
  autoModQueue: AutoModQueueItem[];
  supportTickets: SupportTicket[];
  isBlocked: (user1Id: number, user2Id: number) => boolean;
  getPostsForCreator: (creatorId: number) => Post[];
  getFanListsForCreator: (creatorId: number) => FanList[];
  getCreatorStats: (creatorId: number) => CreatorStats | null;
  getScheduledPosts: () => Post[];
  getScheduledMessages: () => ScheduledMessage[];
  getFreeTrialLinksForCreator: (creatorId: number) => FreeTrialLink[];
  getConversations: () => Conversation[];
  getRankingsConfig: () => RankConfig[];
  getCategories: () => Category[];
  getPostsByHashtag: (tag: string) => Post[];
  getCreatorsByCategory: (slug: string) => Creator[];
  search: (query: string) => Promise<SearchResults>;
  getRelatedFeed: (postId: number) => Post[];
  getPostById: (postId: number) => Post | undefined;
  getSuggestedCreators: () => Creator[];
  getExpiredSubscriptionsForUser: (userId: number) => Creator[];
  getReferredUsers: (userId: number) => AuthUser[];
  getReferralEarnings: (userId: number) => number;

  createPost: (postData: { text: string, media: Media[], visibility: string, visibleToLists?: number[], scheduledAt?: string, ppvPrice?: number, goalAmount?: number, isNsfw?: boolean }) => void;
  editPost: (postId: number, newText: string) => void;
  deletePost: (postId: number) => Promise<void>;
  toggleLikePost: (postId: number, openAuthModal: () => void) => void;
  addComment: (postId: number, text: string, openAuthModal: () => void) => void;
  deleteComment: (postId: number, commentId: number) => void;
  toggleBookmark: (postId: number, openAuthModal: () => void) => void;
  boostPost: (postId: number) => void;
  unlockPost: (postId: number) => Promise<void>;
  
  subscribeToPackage: (creatorId: number, months: number) => Promise<void>;
  isSubscribedToCreator: (creatorId: number, user?: AuthUser | null) => boolean;
  isFollowingCreator: (creatorId: number, user?: AuthUser | null) => boolean;
  toggleFollowCreator: (creatorId: number, openAuthModal: () => void) => void;
  
  updateCreatorProfile: (creatorId: number, updatedData: Partial<Creator>) => Promise<void>;
  updateUserSettings: (userId: number, settings: Partial<AuthUser>) => Promise<void>;
  updatePassword: () => Promise<void>;
  deleteAccount: (userId: number) => Promise<void>;
  
  updateMonthlyPrice: (price: number) => Promise<void>;
  addSubscriptionPackage: (pkg: SubscriptionPackage) => Promise<void>;
  updateSubscriptionPackage: (pkgIndex: number, pkg: SubscriptionPackage) => Promise<void>;
  deleteSubscriptionPackage: (pkgIndex: number) => Promise<void>;
  
  createFreeTrialLink: (options: { uses: number | 'unlimited', expiresAt: string | null }) => void;
  deactivateFreeTrialLink: (linkId: string) => void;
  
  saveCard: (cardDetails: { last4: string; brand: string; }) => Promise<void>;
  removeCard: () => Promise<void>;
  sendTip: (creatorId: number, amount: number, onSuccess?: (amount: number) => void) => Promise<void>;
  contributeToGoal: (postId: number, amount: number) => Promise<void>;

  addNotification: (notificationData: {targetUserId: number, type: NotificationType, message: string, linkTo: string}) => void;
  markNotificationsAsRead: () => void;
  
  sendMessage: (conversationId: number, message: { content?: string, media?: Media[], tipAmount?: number, ppvPrice?: number }) => void;
  unlockMessage: (messageId: number) => Promise<void>;
  startOrGetConversation: (otherUserId: number) => Promise<number>;
  markConversationAsRead: (conversationId: number) => void;
  muteConversation: (conversationId: number, mute: boolean) => void;
  blockUser: (userId: number, block: boolean) => void;
  updateConversationNotes: (conversationId: number, notes: string) => void;

  createFanList: (name: string) => void;
  updateFanList: (listId: number, updatedFanIds: number[]) => void;
  
  scheduleMessage: (messageData: { content: string; target: { type: 'all' | 'lists'; listIds?: number[] }; scheduledAt: string; }) => void;
  editScheduledMessage: (messageId: number, updatedData: Parameters<DataContextType['scheduleMessage']>[0]) => void;
  cancelScheduledMessage: (messageId: number) => void;
  editScheduledPost: (postId: number, newText: string, newScheduledAt: string) => void;
  cancelScheduledPost: (postId: number) => void;
  
  completeOnboardingStep: (stepId: AuthUser['onboardingProgress'][number]['step']) => void;
  getDiscoverFeed: () => Post[];
  logPostInteraction: (postId: number, metric: keyof PostInteractionMetrics, value: number | boolean) => void;

  // Stories
  getActiveStories: () => Story[];
  getActiveStoriesForCreator: (creatorId: number) => StoryItem[];
  addStory: (media: Media, isNsfw: boolean) => void;
  markStoryAsViewed: (storyItemId: number) => void;
  
  // Gamification
  getAchievementsForUser: (userId: number) => Achievement[];
  getTopFanForCreator: (creatorId: number) => number | null;
  checkAndGrantAchievements: (userId: number, action: 'tip' | 'like' | 'subscribe', data?: any) => void;
  
  // Admin
  submitVerification: (submission: Omit<VerificationSubmission, 'id' | 'timestamp'>) => Promise<void>;
  processVerification: (submissionId: number, isApproved: boolean) => Promise<void>;
  processPayouts: () => Promise<void>;
  updatePlatformSettings: (settings: Partial<PlatformSettings>) => Promise<void>;
  getUserById: (userId: number) => AuthUser | undefined;
  getTransactionsForUser: (userId: number) => Transaction[];
  addReport: (reportData: Omit<Report, 'id' | 'timestamp' | 'reporterId' | 'status'>) => void;
  resolveReport: (reportId: number, action: 'dismiss' | 'delete_post' | 'suspend_1d' | 'suspend_7d' | 'ban') => void;
  createAnnouncement: (data: Omit<Announcement, 'id' | 'createdAt'>) => void;
  updateAnnouncement: (id: number, data: Partial<Omit<Announcement, 'id' | 'createdAt'>>) => void;
  deleteAnnouncement: (id: number) => void;
  resolveAutoModItem: (itemId: number, isApproved: boolean) => void;
  addCategory: (name: string, parentId: number | null) => void;
  editCategory: (categoryId: number, newName: string) => void;
  deleteCategory: (categoryId: number) => void;
  adminDeleteUser: (userId: number) => Promise<void>;
  suspendUser: (userId: number, durationDays: number | 'permanent') => Promise<void>;
  reactivateUser: (userId: number) => Promise<void>;
  adminCancelSubscription: (userId: number, creatorId: number) => Promise<void>;
  createSupportTicket: (ticketData: Omit<SupportTicket, 'id' | 'timestamp' | 'status' | 'userId' | 'username'>) => Promise<void>;
  updateSupportTicketStatus: (ticketId: number, status: SupportTicketStatus) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const simulateNetwork = (delay = 500) => new Promise(res => setTimeout(res, delay));

const initialPlatformSettings: PlatformSettings = {
    commissionRates: mockRankConfigs.reduce((acc, rank) => {
        acc[rank.rankName] = rank.commissionRate;
        return acc;
    }, {} as Record<RankName, number>),
    featuredCreatorIds: [1, 2, 3], // Default featured creators
};


export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, users, setUsers, creators, setCreators, finalizeUserVerification } = useAuth();
  
  const [posts, setPosts] = useState(initialPosts);
  const [conversations, setConversations] = useState(initialConversations);
  const [fanLists, setFanLists] = useState(initialFanLists);
  const [scheduledMessages, setScheduledMessages] = useState(initialScheduledMessages);
  const [freeTrialLinks, setFreeTrialLinks] = useState(initialFreeTrialLinks);
  const [stories, setStories] = useState(mockStories);
  const [verificationSubmissions, setVerificationSubmissions] = useState<VerificationSubmission[]>(mockVerificationSubmissions);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>(initialPlatformSettings);
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [autoModQueue, setAutoModQueue] = useState(mockAutoModQueue);
  const [categories, setCategories] = useState(mockCategories);
  const [supportTickets, setSupportTickets] = useState(mockSupportTickets);
  const [postInteractions, setPostInteractions] = useState<Record<number, PostInteractionMetrics>>({});

  useEffect(() => {
      // Pass the creators up to the AuthContext so it can be used for creator login simulation
      setCreators(initialCreators);
  }, [setCreators]);
  
  // Schedulers and Simulations
  useEffect(() => {
    // Post scheduler
    const postInterval = setInterval(() => {
      setPosts(currentPosts => 
        currentPosts.map(post => {
          if (post.scheduledAt && new Date(post.scheduledAt) <= new Date()) {
            const { scheduledAt, ...publishedPost } = post;
            return { ...publishedPost, timestamp: new Date().toISOString() };
          }
          return post;
        })
      );
    }, 10000);

    // Message scheduler logic remains complex and coupled, keeping it here for now
    const messageInterval = setInterval(() => {
       // ... message scheduling logic ...
    }, 15000);
    
    // Activity Simulation
    const activityInterval = setInterval(() => {
        setUsers(prevUsers => prevUsers.map(user => {
            if (user.id !== currentUser?.id && Math.random() < 0.1) {
                return { ...user, lastSeen: Math.random() < 0.2 ? 'online' : new Date(Date.now() - Math.random() * 2 * 3600 * 1000).toISOString() };
            }
            return user;
        }));
        setCreators(prevCreators => prevCreators.map(creator => {
            if (creator.id !== currentUser?.creatorId && Math.random() < 0.1) {
                return { ...creator, lastSeen: Math.random() < 0.2 ? 'online' : new Date(Date.now() - Math.random() * 2 * 3600 * 1000).toISOString() };
            }
            return creator;
        }));
    }, 20000);

    return () => {
      clearInterval(postInterval);
      clearInterval(messageInterval);
      clearInterval(activityInterval);
    };
  }, [currentUser, fanLists, users, creators, setUsers, setCreators]);
  
  const isBlocked = useCallback((user1Id: number, user2Id: number): boolean => {
    const user1 = users.find(u => u.id === user1Id);
    const user2 = users.find(u => u.id === user2Id);
    if (!user1 || !user2) return false;
    return user1.blockedUsers.includes(user2Id) || user2.blockedUsers.includes(user1Id);
  }, [users]);
  
  const addTransaction = useCallback((transactionData: Omit<Transaction, 'id' | 'platformFee' | 'creatorPayout'>) => {
    const creator = creators.find(c => c.id === transactionData.creatorId);
    if (!creator) return;

    const commissionRate = platformSettings.commissionRates[creator.rank] ?? 0.20; // Fallback to default
    const platformFee = transactionData.amount * commissionRate;
    const creatorPayout = transactionData.amount - platformFee;
    
    const newTransaction: Transaction = {
        ...transactionData,
        id: Date.now(),
        platformFee,
        creatorPayout,
    };
    setTransactions(prev => [newTransaction, ...prev]);

    // Referral Logic
    const creatorUser = users.find(u => u.creatorId === transactionData.creatorId);
    if (creatorUser && creatorUser.referredByUserId) {
        const referrer = users.find(u => u.id === creatorUser.referredByUserId);
        if (referrer) {
            const oneYearAgo = new Date();
            oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
            const registrationDate = new Date(creatorUser.registeredAt);

            if (registrationDate > oneYearAgo) {
                const commissionAmount = transactionData.amount * 0.05; // 5% commission
                const referralTransaction: Transaction = {
                    id: Date.now() + 1, // Avoid key collision
                    type: TransactionType.REFERRAL_PAYOUT,
                    amount: commissionAmount,
                    platformFee: 0,
                    creatorPayout: commissionAmount,
                    fanId: creatorUser.id, // The user who generated the revenue
                    creatorId: referrer.id, // The user receiving the payout
                    timestamp: new Date().toISOString(),
                    description: `Referral commission from ${creatorUser.username}`
                };
                setTransactions(prev => [referralTransaction, ...prev]);
            }
        }
    }
  }, [creators, users, platformSettings.commissionRates]);
  
  const addNotification = useCallback(({ targetUserId, type, message, linkTo }: { targetUserId: number, type: NotificationType, message: string, linkTo: string }) => {
    if (!currentUser) return;
    const targetUser = users.find(u => u.id === targetUserId);
    if (!targetUser || targetUser.blockedUsers.includes(currentUser.id)) return;

    const newNotification: Notification = {
      id: Date.now(), type, message, linkTo, read: false, timestamp: new Date().toISOString(),
      actor: { id: currentUser.id, username: currentUser.username, avatarUrl: currentUser.avatarUrl },
    };

    setUsers(prev => prev.map(u => u.id === targetUserId ? { ...u, userNotifications: [newNotification, ...u.userNotifications] } : u));
  }, [currentUser, users]);
  
  const isSubscribedToCreator = useCallback((creatorId: number, user: AuthUser | null = currentUser): boolean => {
    if (!user) return false;
    const sub = user.subscriptions.find(s => s.creatorId === creatorId);
    return sub ? new Date(sub.expiresAt) > new Date() : false;
  }, [currentUser]);

  const isFollowingCreator = useCallback((creatorId: number, user: AuthUser | null = currentUser): boolean => {
    if (!user) return false;
    return user.followingIds.includes(creatorId);
  }, [currentUser]);

  const toggleFollowCreator = useCallback((creatorId: number, openAuthModal: () => void) => {
    if (!currentUser) { openAuthModal(); return; }
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const isFollowing = u.followingIds.includes(creatorId);
        return { ...u, followingIds: isFollowing ? u.followingIds.filter(id => id !== creatorId) : [...u.followingIds, creatorId] };
      }
      return u;
    }));
  }, [currentUser, setUsers]);

  const completeOnboardingStep = useCallback((stepId: AuthUser['onboardingProgress'][number]['step']) => {
    if (!currentUser?.onboardingProgress) return;
    setUsers(prevUsers => prevUsers.map(user => {
      if (user.id === currentUser.id && user.onboardingProgress) {
        const step = user.onboardingProgress.find(s => s.step === stepId);
        if (step && !step.completed) {
          return {
            ...user,
            onboardingProgress: user.onboardingProgress.map(s =>
              s.step === stepId ? { ...s, completed: true } : s
            ),
          };
        }
      }
      return user;
    }));
  }, [currentUser, setUsers]);

  const createPost = useCallback((postData: { text: string, media: Media[], visibility: string, visibleToLists?: number[], scheduledAt?: string, ppvPrice?: number, goalAmount?: number, isNsfw?: boolean }) => {
    if (!currentUser?.creatorId) return;
    const creatorProfile = creators.find(c => c.id === currentUser.creatorId);
    if (!creatorProfile) return;
    
    const newPost: Post = {
        id: Date.now(),
        creator: creatorProfile,
        type: postData.ppvPrice && postData.ppvPrice > 0 ? PostType.PayPerView : (postData.visibility === 'public' ? PostType.Public : PostType.SubscriberOnly),
        format: postData.media.length > 0 ? PostFormat.Gallery : PostFormat.Text,
        text: postData.text,
        media: postData.media,
        likedBy: [],
        comments: [],
        timestamp: postData.scheduledAt || new Date().toISOString(),
        visibleToLists: postData.visibility === 'lists' ? postData.visibleToLists : [],
        scheduledAt: postData.scheduledAt,
        ppvPrice: postData.ppvPrice,
        goalAmount: postData.goalAmount,
        goalRaised: postData.goalAmount ? 0 : undefined,
        isNsfw: postData.isNsfw || false,
    };
    setPosts(prev => [newPost, ...prev]);
    completeOnboardingStep('first_post');
  }, [currentUser, creators, completeOnboardingStep]);

  const editPost = useCallback((postId: number, newText: string) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, text: newText } : p));
  }, []);
  
  const deletePost = useCallback(async (postId: number) => {
    await simulateNetwork();
    setPosts(prev => prev.filter(p => p.id !== postId));
  }, []);
  
  const checkAndGrantAchievements = useCallback((userId: number, action: 'tip' | 'like' | 'subscribe', data?: any) => {
      const user = users.find(u => u.id === userId);
      if (!user) return;
      
      const unlockedAchievementIds = new Set(user.achievements.map(a => a.achievementId));
      let newAchievements: string[] = [];
      
      const grant = (achievementId: string) => {
          if (!unlockedAchievementIds.has(achievementId)) {
              newAchievements.push(achievementId);
              unlockedAchievementIds.add(achievementId); // Prevent granting same achievement twice in one check
          }
      };

      if (user.role === UserRole.Fan) {
        if (action === 'tip') {
            grant('FIRST_TIP');
        }

        if (action === 'subscribe') {
            const subsCount = user.subscriptions.filter(s => new Date(s.expiresAt) > new Date()).length;
            if (subsCount >= 10) {
                grant('PATRON');
            }
            // Subscription streak logic would go here. For now, check loyalty.
            const sub = user.subscriptions.find(s => s.creatorId === data?.creatorId);
            if (sub) {
                const subMonths = (new Date().getTime() - new Date(sub.subscribedSince).getTime()) / (1000 * 3600 * 24 * 30.44);
                if (subMonths >= 3) {
                    grant('LOYAL_3_MONTHS');
                }
            }
        }
      }

      if (user.role === UserRole.Creator) {
        if (action === 'like') {
            const post: Post = data.post;
            const postOwner = users.find(u => u.creatorId === post.creator.id)!;
            if(user.id !== postOwner.id) return; // Action is on another creator, not the current one.
            
            // Check for VIRAL_POST
            const likesIn24h = post.likedBy.length + 1; // Simplified for demo, +1 for the like just added
            if (likesIn24h >= 100) {
                grant('VIRAL_POST');
            }
            
            // Check for FIRST_1000_LIKES
            const allPosts = posts.filter(p => p.creator.id === post.creator.id);
            const totalLikes = allPosts.reduce((sum, p) => sum + p.likedBy.length, 0) + 1;
            if (totalLikes >= 1000) {
                grant('FIRST_1000_LIKES');
            }
        }
      }

      if (newAchievements.length > 0) {
          setUsers(prev => prev.map(u => {
              if (u.id === userId) {
                  const newAchievementsToAdd = newAchievements.map(id => ({
                      achievementId: id,
                      unlockedAt: new Date().toISOString()
                  }));
                  return { ...u, achievements: [...u.achievements, ...newAchievementsToAdd] };
              }
              return u;
          }));
      }
  }, [users, posts, setUsers]);

  const toggleLikePost = useCallback((postId: number, openAuthModal: () => void) => {
    if (!currentUser) { openAuthModal(); return; }
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    
    const creatorUser = users.find(u => u.creatorId === post.creator.id);
    if (creatorUser && isBlocked(currentUser.id, creatorUser.id)) {
        alert("You cannot interact with this creator's posts.");
        return;
    }

    const isLiked = post.likedBy.includes(currentUser.id);
    const postOwner = users.find(u => u.creatorId === post.creator.id);
            
    if (!isLiked && postOwner && postOwner.id !== currentUser.id) {
        addNotification({ targetUserId: postOwner.id, type: 'like', message: `${currentUser.username} liked your post.`, linkTo: `/post/${postId}` });
        checkAndGrantAchievements(postOwner.id, 'like', { post });
    }
            
    setPosts(prev => prev.map(p => {
        if (p.id === postId) {
            return { ...p, likedBy: isLiked ? p.likedBy.filter(id => id !== currentUser.id) : [...p.likedBy, currentUser.id] };
        }
        return p;
    }));
  }, [currentUser, users, posts, checkAndGrantAchievements, addNotification, isBlocked]);
  
  const addComment = useCallback((postId: number, text: string, openAuthModal: () => void) => {
    if (!currentUser) { openAuthModal(); return; }
    
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const creatorUser = users.find(u => u.creatorId === post.creator.id);
    if (creatorUser && isBlocked(currentUser.id, creatorUser.id)) {
        alert("You cannot interact with this creator's posts.");
        return;
    }

    const newComment: Comment = {
      id: Date.now(), text, timestamp: new Date().toISOString(),
      user: { id: currentUser.id, username: currentUser.username, avatarUrl: currentUser.avatarUrl },
    };
    setPosts(prev => prev.map(p => {
        if (p.id === postId) {
            const postOwner = users.find(u => u.creatorId === p.creator.id);
            if (postOwner && postOwner.id !== currentUser.id) {
                addNotification({ targetUserId: postOwner.id, type: 'comment', message: `${currentUser.username} commented: "${text.substring(0, 30)}..."`, linkTo: `/post/${postId}` });
            }
            return { ...p, comments: [newComment, ...p.comments] };
        }
        return p;
    }));
  }, [currentUser, users, posts, addNotification, isBlocked]);
  
  const deleteComment = useCallback((postId: number, commentId: number) => {
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== commentId) } : p));
  }, []);

  const toggleBookmark = useCallback((postId: number, openAuthModal: () => void) => {
    if (!currentUser) { openAuthModal(); return; }
    setUsers(prev => prev.map(u => {
      if (u.id === currentUser.id) {
        const isBookmarked = u.bookmarkedPostIds.includes(postId);
        return { ...u, bookmarkedPostIds: isBookmarked ? u.bookmarkedPostIds.filter(id => id !== postId) : [...u.bookmarkedPostIds, postId] };
      }
      return u;
    }));
  }, [currentUser, setUsers]);
  
  const boostPost = useCallback((postId: number) => alert(`Post ${postId} has been boosted. (Simulated)`), []);
  
  const unlockPost = useCallback(async (postId: number) => {
    if (!currentUser) return;
    await simulateNetwork();
    const post = posts.find(p => p.id === postId);
    if(post && post.ppvPrice) {
      addTransaction({
          type: TransactionType.PPV,
          amount: post.ppvPrice,
          fanId: currentUser.id,
          creatorId: post.creator.id,
          timestamp: new Date().toISOString(),
          description: `PPV Post Unlock: #${postId}`
      });
    }
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, unlockedPosts: [...u.unlockedPosts, postId] } : u));
  }, [currentUser, posts, addTransaction, setUsers]);
  
  const subscribeToPackage = useCallback(async (creatorId: number, months: number) => {
    if (!currentUser) return;

    const creatorUser = users.find(u => u.creatorId === creatorId);
    if (!creatorUser) {
        console.error("Creator user profile not found");
        return;
    }
    if (isBlocked(currentUser.id, creatorUser.id)) {
        alert("Cannot subscribe to this creator.");
        return;
    }

    await simulateNetwork();
    const creator = creators.find(c => c.id === creatorId);
    if (!creator) return;

    const pkg = months === 1 
        ? { months: 1, price: creator.monthlyPrice } 
        : creator.subscriptionPackages.find(p => p.months === months);
    if (!pkg) return;

    addTransaction({
        type: TransactionType.Subscription,
        amount: pkg.price,
        fanId: currentUser.id,
        creatorId,
        timestamp: new Date().toISOString(),
        description: `${pkg.months}-Month Subscription`
    });

    const expiryDate = new Date();
    expiryDate.setMonth(expiryDate.getMonth() + months);
    const newSub: UserSubscription = { creatorId, expiresAt: expiryDate.toISOString(), subscribedSince: new Date().toISOString() };
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, subscriptions: [...u.subscriptions.filter(s => s.creatorId !== creatorId), newSub] } : u));
    
    if (creatorUser) {
        addNotification({ targetUserId: creatorUser.id, type: 'new_subscriber', message: `You have a new subscriber: ${currentUser.username}!`, linkTo: `/profile/${currentUser.id}` });
        checkAndGrantAchievements(currentUser.id, 'subscribe', { creatorId });
    }
  }, [currentUser, creators, users, addTransaction, setUsers, addNotification, checkAndGrantAchievements, isBlocked]);
  
  const updateCreatorProfile = useCallback(async (creatorId: number, updatedData: Partial<Creator>) => {
    await simulateNetwork();
    setCreators(prev => prev.map(c => c.id === creatorId ? {...c, ...updatedData} : c));
    
    const fullProfile = { ...creators.find(c => c.id === creatorId), ...updatedData };
    if (fullProfile.displayName && fullProfile.bio && fullProfile.location) {
        completeOnboardingStep('profile_basics');
    }
    if (fullProfile.mainCategory) {
        completeOnboardingStep('categorization');
    }
    if (fullProfile.socialLinks && fullProfile.socialLinks.length > 0 && fullProfile.socialLinks.some(l => l.url.trim() !== '')) {
        completeOnboardingStep('social_links');
    }
  }, [creators, setCreators, completeOnboardingStep]);
  
  const updateUserSettings = useCallback(async (userId: number, settings: Partial<AuthUser>) => {
    await simulateNetwork();
    setUsers(prev => prev.map(u => u.id === userId ? {...u, ...settings} : u));
  }, [setUsers]);
  
  const updatePassword = useCallback(async () => {
    await simulateNetwork();
    alert("Password updated successfully! (Simulated)");
  }, []);
  
  const deleteAccount = useCallback(async (userId: number) => {
    await simulateNetwork();
    setUsers(prev => prev.filter(u => u.id !== userId));
  }, [setUsers]);
  
  const updateMonthlyPrice = useCallback(async (price: number) => {
    if (!currentUser?.creatorId) return;
    await simulateNetwork();
    setCreators(prev => prev.map(c => c.id === currentUser.creatorId ? { ...c, monthlyPrice: price } : c));
    completeOnboardingStep('monetization');
  }, [currentUser, setCreators, completeOnboardingStep]);

  const addSubscriptionPackage = useCallback(async (pkg: SubscriptionPackage) => {
    if (!currentUser?.creatorId) return;
    await simulateNetwork();
    setCreators(prev => prev.map(c => c.id === currentUser.creatorId ? { ...c, subscriptionPackages: [...c.subscriptionPackages, pkg] } : c));
  }, [currentUser, setCreators]);
  
  const updateSubscriptionPackage = useCallback(async (pkgIndex: number, pkg: SubscriptionPackage) => {
    if (!currentUser?.creatorId) return;
    await simulateNetwork();
    setCreators(prev => prev.map(c => c.id === currentUser.creatorId ? { ...c, subscriptionPackages: c.subscriptionPackages.map((p, i) => i === pkgIndex ? pkg : p) } : c));
  }, [currentUser, setCreators]);
  
  const deleteSubscriptionPackage = useCallback(async (pkgIndex: number) => {
    if (!currentUser?.creatorId) return;
    await simulateNetwork();
    setCreators(prev => prev.map(c => c.id === currentUser.creatorId ? { ...c, subscriptionPackages: c.subscriptionPackages.filter((_, i) => i !== pkgIndex) } : c));
  }, [currentUser, setCreators]);
  
  const createFreeTrialLink = useCallback((options: { uses: number | 'unlimited', expiresAt: string | null }) => {
    if (!currentUser?.creatorId) return;
    const newLink: FreeTrialLink = {
      id: `trial-${Date.now()}`,
      creatorId: currentUser.creatorId,
      code: `${currentUser.username.toUpperCase()}_${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
      usesLeft: options.uses,
      expiresAt: options.expiresAt,
      isActive: true,
    };
    setFreeTrialLinks(prev => [newLink, ...prev]);
  }, [currentUser]);
  
  const deactivateFreeTrialLink = useCallback((linkId: string) => setFreeTrialLinks(prev => prev.map(link => link.id === linkId ? { ...link, isActive: false } : link)), []);

  const saveCard = useCallback(async (cardDetails: { last4: string; brand: string; }) => {
    if (!currentUser) return;
    await simulateNetwork();
    setUsers(prev => prev.map(u => u.id === currentUser.id ? {...u, savedCard: cardDetails} : u));
  }, [currentUser, setUsers]);
  
  const removeCard = useCallback(async () => {
    if (!currentUser) return;
    await simulateNetwork();
    setUsers(prev => prev.map(u => u.id === currentUser.id ? {...u, savedCard: null} : u));
  }, [currentUser, setUsers]);
  
  const sendTip = useCallback(async (creatorId: number, amount: number, onSuccess?: (amount: number) => void) => {
    if (!currentUser) return;
    await simulateNetwork();
    
    addTransaction({
        type: TransactionType.Tip,
        amount,
        fanId: currentUser.id,
        creatorId,
        timestamp: new Date().toISOString(),
        description: 'User Tip'
    });

    const creatorUser = users.find(u => u.creatorId === creatorId);
    if (creatorUser) {
      addNotification({ targetUserId: creatorUser.id, type: 'tip', message: `${currentUser.username} sent you a $${amount.toFixed(2)} tip!`, linkTo: `/messages` });
    }
    checkAndGrantAchievements(currentUser.id, 'tip');
    onSuccess?.(amount);
  }, [currentUser, users, addTransaction, addNotification, checkAndGrantAchievements]);

  const contributeToGoal = useCallback(async (postId: number, amount: number) => {
      await simulateNetwork();
      setPosts(prev => prev.map(p => {
          if (p.id === postId) {
              const postOwner = users.find(u => u.creatorId === p.creator.id);
               if (postOwner) {
                addNotification({
                    targetUserId: postOwner.id,
                    type: 'tip', // Using 'tip' notification type for contributions
                    message: `${currentUser?.username} contributed $${amount.toFixed(2)} to your goal!`,
                    linkTo: `/post/${postId}`
                });
               }
              return { ...p, goalRaised: (p.goalRaised || 0) + amount };
          }
          return p;
      }));
  }, [setPosts, users, addNotification, currentUser]);
  
  const markNotificationsAsRead = useCallback(() => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, userNotifications: u.userNotifications.map(n => ({...n, read: true})) } : u));
  }, [currentUser, setUsers]);
  
  const sendMessage = useCallback((conversationId: number, message: { content?: string, media?: Media[], tipAmount?: number, ppvPrice?: number }) => {
    if (!currentUser) return;

    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) return;
    
    const otherParticipant = conversation.participants.find(p => p.id !== currentUser.id);
    if (!otherParticipant) return;
    
    if (isBlocked(currentUser.id, otherParticipant.id)) {
        alert('Your message could not be sent because this user is blocked or has blocked you.');
        return;
    }

    if(message.tipAmount) {
        if (otherParticipant) {
             addTransaction({
                type: TransactionType.Tip,
                amount: message.tipAmount,
                fanId: currentUser.id,
                creatorId: otherParticipant.id,
                timestamp: new Date().toISOString(),
                description: 'Tip in DMs'
            });
            checkAndGrantAchievements(currentUser.id, 'tip');
        }
    }
    if (message.ppvPrice) {
       // Transaction is created when the fan unlocks the message
    }
    const newMessage: Message = { id: Date.now(), senderId: currentUser.id, isRead: false, timestamp: new Date().toISOString(), ...message };
    setConversations(prev => prev.map(c => {
      if (c.id === conversationId) {
        const otherUser = users.find(u => u.id === otherParticipant.id);
        if (otherParticipant && !otherUser?.mutedConversations.includes(c.id)) {
             addNotification({ targetUserId: otherParticipant.id, type: 'comment', message: `You have a new message from ${currentUser.username}.`, linkTo: `/messages/${c.id}` });
        }
        return { ...c, messages: [...c.messages, newMessage], lastMessageTimestamp: newMessage.timestamp };
      }
      return c;
    }));
  }, [currentUser, conversations, users, addTransaction, addNotification, checkAndGrantAchievements, isBlocked]);

  const unlockMessage = useCallback(async (messageId: number) => {
    if (!currentUser) return;
    await simulateNetwork();

    const conversation = conversations.find(c => c.messages.some(m => m.id === messageId));
    const message = conversation?.messages.find(m => m.id === messageId);

    if (conversation && message && message.ppvPrice) {
        addTransaction({
            type: TransactionType.PPV,
            amount: message.ppvPrice,
            fanId: currentUser.id,
            creatorId: message.senderId,
            timestamp: new Date().toISOString(),
            description: `PPV Message Unlock`
        });
    }

    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, unlockedMessages: [...u.unlockedMessages, messageId] } : u));
  }, [currentUser, conversations, addTransaction, setUsers]);
  
  const startOrGetConversation = useCallback(async (otherUserId: number): Promise<number> => {
    if (!currentUser) throw new Error("User not authenticated.");

    if (isBlocked(currentUser.id, otherUserId)) {
        alert("You cannot message this user.");
        throw new Error("User is blocked.");
    }
    
    const otherUser = users.find(u => u.id === otherUserId);
    if (!otherUser) throw new Error("User profile not found.");

    const existing = conversations.find(c => c.participants.some(p => p.id === currentUser.id) && c.participants.some(p => p.id === otherUserId));
    if (existing) return existing.id;

    const newConversation: Conversation = {
      id: Date.now(),
      participants: [
        { id: currentUser.id, username: currentUser.username, avatarUrl: currentUser.avatarUrl, lastSeen: currentUser.lastSeen },
        { id: otherUser.id, username: otherUser.username, avatarUrl: otherUser.avatarUrl, lastSeen: otherUser.lastSeen }
      ],
      messages: [], lastMessageTimestamp: new Date().toISOString(),
    };
    setConversations(prev => [...prev, newConversation]);
    return newConversation.id;
  }, [currentUser, conversations, users, isBlocked]);
  
  const markConversationAsRead = useCallback((conversationId: number) => {
    if (!currentUser || !(currentUser.sendReadReceipts ?? true)) return;
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, messages: c.messages.map(m => m.senderId !== currentUser.id ? { ...m, isRead: true } : m) } : c));
  }, [currentUser, setConversations]);
  
  const muteConversation = useCallback((conversationId: number, mute: boolean) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, mutedConversations: mute ? [...u.mutedConversations, conversationId] : u.mutedConversations.filter(id => id !== conversationId) } : u));
  }, [currentUser, setUsers]);
  
  const blockUser = useCallback((userId: number, block: boolean) => {
    if (!currentUser) return;
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, blockedUsers: block ? [...u.blockedUsers, userId] : u.blockedUsers.filter(id => id !== userId) } : u));
  }, [currentUser, setUsers]);

  const updateConversationNotes = useCallback((conversationId: number, notes: string) => {
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, notes } : c));
  }, []);
  
  const createFanList = useCallback((name: string) => {
    if (!currentUser?.creatorId) return;
    const newList: FanList = { id: Date.now(), name, creatorId: currentUser.creatorId, fanIds: [] };
    setFanLists(prev => [...prev, newList]);
  }, [currentUser]);
  
  const updateFanList = useCallback((listId: number, updatedFanIds: number[]) => setFanLists(prev => prev.map(l => l.id === listId ? { ...l, fanIds: updatedFanIds } : l)), []);
  
  const getCreatorStats = useCallback((creatorId: number) => {
    if (creatorId === 1) return mockCreatorStats;
    const creator = creators.find(c => c.id === creatorId);
    return {
      creatorId, totalSubscribers: creator ? parseInt(creator.stats.subscribers.replace('K', '000')) : 0,
      monthlyRevenue: 0, subscriberGrowth: [{ month: 'Jun', count: 0 }], topPosts: [], earningsBreakdown: [],
    } as CreatorStats;
  }, [creators]);

  const getScheduledPosts = useCallback(() => currentUser?.creatorId ? posts.filter(p => p.creator.id === currentUser.creatorId && p.scheduledAt) : [], [currentUser, posts]);
  
  const getScheduledMessages = useCallback(() => currentUser?.creatorId ? scheduledMessages.filter(m => m.creatorId === currentUser.creatorId) : [], [currentUser, scheduledMessages]);
  
  const scheduleMessage = useCallback((data: Parameters<DataContextType['scheduleMessage']>[0]) => {
    if (!currentUser?.creatorId) return;
    const targetDesc = data.target.type === 'all' ? 'All Subscribers' : fanLists.filter(l => data.target.listIds?.includes(l.id)).map(l => l.name).join(', ');
    const newMessage: ScheduledMessage = { id: Date.now(), creatorId: currentUser.creatorId, ...data, targetDescription: targetDesc };
    setScheduledMessages(prev => [newMessage, ...prev]);
  }, [currentUser, fanLists]);
  
  const editScheduledMessage = useCallback((id: number, data: Parameters<DataContextType['scheduleMessage']>[0]) => {
    const targetDesc = data.target.type === 'all' ? 'All Subscribers' : fanLists.filter(l => data.target.listIds?.includes(l.id)).map(l => l.name).join(', ');
    setScheduledMessages(prev => prev.map(m => m.id === id ? { ...m, ...data, targetDescription: targetDesc } : m));
  }, [fanLists]);
  
  const cancelScheduledMessage = useCallback((id: number) => setScheduledMessages(prev => prev.filter(m => m.id !== id)), []);
  
  const editScheduledPost = useCallback((id: number, newText: string, newScheduledAt: string) => setPosts(prev => prev.map(p => p.id === id ? { ...p, text: newText, scheduledAt: newScheduledAt, timestamp: newScheduledAt } : p)), []);
  
  const cancelScheduledPost = useCallback((id: number) => setPosts(prev => prev.filter(p => p.id !== id)), []);
  
  const logPostInteraction = useCallback((postId: number, metric: keyof PostInteractionMetrics, value: number | boolean) => {
    setPostInteractions(prev => {
        const current = prev[postId] || { dwellTime: 0, videoPlayCount: 0, videoCompletionCount: 0, textExpanded: false, profileClicked: false };
        if (metric === 'dwellTime' && typeof value === 'number') {
            current.dwellTime += value;
        } else if ((metric === 'videoPlayCount' || metric === 'videoCompletionCount') && typeof value === 'number') {
            current[metric] += value;
        } else if ((metric === 'textExpanded' || metric === 'profileClicked') && typeof value === 'boolean') {
            current[metric] = value;
        }
        return { ...prev, [postId]: current };
    });
  }, []);
  
  const getDiscoverFeed = useCallback((): Post[] => {
    const discoverablePosts = posts.filter(post => {
        const creatorUser = users.find(u => u.creatorId === post.creator.id);
        const creatorUserId = creatorUser ? creatorUser.id : post.creator.id;
        return !post.scheduledAt &&
            post.type === PostType.Public &&
            post.media && post.media.length > 0 &&
            (currentUser?.showSensitiveContent || !post.isNsfw) &&
            (!currentUser || !isBlocked(currentUser.id, creatorUserId));
    });

    if (!currentUser) {
        const scoredPosts = discoverablePosts.map(post => ({
            post,
            score: calculatePostScore(post, creators)
        }));
        scoredPosts.sort((a, b) => b.score - a.score);
        return scoredPosts.map(item => item.post);
    }
    
    const userInterests = new Map<string, number>();
    currentUser.subscriptions.forEach(sub => {
        if (new Date(sub.expiresAt) > new Date()) {
            const creator = creators.find(c => c.id === sub.creatorId);
            if (creator) {
                if (creator.mainCategory) {
                    userInterests.set(creator.mainCategory.slug, (userInterests.get(creator.mainCategory.slug) || 0) + 1);
                }
                creator.subCategories.forEach(subCat => {
                    userInterests.set(subCat.slug, (userInterests.get(subCat.slug) || 0) + 1);
                });
            }
        }
    });

    const scoredPosts = discoverablePosts.map(post => ({
        post,
        score: calculatePersonalizedPostScore(post, creators, userInterests, postInteractions[post.id])
    }));

    scoredPosts.sort((a, b) => b.score - a.score);
    return scoredPosts.map(item => item.post);
}, [posts, creators, currentUser, postInteractions, users, isBlocked]);

    const getRelatedFeed = useCallback((postId: number): Post[] => {
        const targetPost = posts.find(p => p.id === postId);
        if (!targetPost) {
            return getDiscoverFeed();
        }

        const discoverablePosts = posts.filter(post => {
            const creatorUser = users.find(u => u.creatorId === post.creator.id);
            const creatorUserId = creatorUser ? creatorUser.id : post.creator.id;
            return post.id !== postId &&
                !post.scheduledAt &&
                post.type === PostType.Public &&
                post.media && post.media.length > 0 &&
                (currentUser?.showSensitiveContent || !post.isNsfw) &&
                (!currentUser || !isBlocked(currentUser.id, creatorUserId));
        });

        const targetCreatorId = targetPost.creator.id;
        const targetMainCategoryId = targetPost.creator.mainCategory?.id;
        const targetSubCategoryIds = new Set(targetPost.creator.subCategories.map(sc => sc.id));

        const scoredPosts = discoverablePosts.map(post => {
            let score = 0;
            if (post.creator.id === targetCreatorId) score += 50;
            if (post.creator.mainCategory?.id === targetMainCategoryId) score += 30;
            post.creator.subCategories.forEach(sc => { if (targetSubCategoryIds.has(sc.id)) score += 15; });
            const targetMainCategorySlug = targetPost.creator.mainCategory?.slug;
            if (targetMainCategorySlug && categoryRelationsGraph[targetMainCategorySlug]) {
                const relatedSlugs = categoryRelationsGraph[targetMainCategorySlug];
                if (relatedSlugs.includes(post.creator.mainCategory.slug)) score += 20;
            }
            score += Math.random() * 5;
            score += post.likedBy.length + (post.comments.length * 2);
            return { post, score };
        });

        scoredPosts.sort((a, b) => b.score - a.score);
        return scoredPosts.map(item => item.post);
    }, [posts, currentUser, getDiscoverFeed, users, isBlocked]);

    const getPostById = useCallback((postId: number) => posts.find(p => p.id === postId), [posts]);
    const getPostsForCreator = useCallback((creatorId: number) => posts.filter(p => p.creator.id === creatorId && !p.scheduledAt).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [posts]);
    
    const getFanListsForCreator = useCallback((creatorId: number) => fanLists.filter(list => list.creatorId === creatorId), [fanLists]);
  
    const getConversations = useCallback(() => conversations, [conversations]);

    const getActiveStories = useCallback(() => {
        const now = new Date();
        return stories.map(story => {
            const activeItems = story.items.filter(item => (now.getTime() - new Date(item.timestamp).getTime()) < 24 * 60 * 60 * 1000);
            return { ...story, items: activeItems };
        }).filter(story => story.items.length > 0);
    }, [stories]);
    const getActiveStoriesForCreator = useCallback((creatorId: number) => getActiveStories().find(s => s.creatorId === creatorId)?.items || [], [getActiveStories]);
    const addStory = useCallback((media: Media, isNsfw: boolean) => {
        if (!currentUser?.creatorId) return;
        const newStoryItem: StoryItem = { id: Date.now(), media, timestamp: new Date().toISOString(), isNsfw };
        setStories(prev => {
            const existingStory = prev.find(s => s.creatorId === currentUser.creatorId);
            if (existingStory) {
                return prev.map(s => s.creatorId === currentUser.creatorId ? { ...s, items: [...s.items, newStoryItem] } : s);
            } else {
                return [...prev, { creatorId: currentUser.creatorId, items: [newStoryItem] }];
            }
        });
    }, [currentUser]);
    const markStoryAsViewed = useCallback((storyItemId: number) => {
        if (!currentUser || currentUser.viewedStories.includes(storyItemId)) return;
        setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, viewedStories: [...u.viewedStories, storyItemId] } : u));
    }, [currentUser, setUsers]);
    const getRankingsConfig = useCallback(() => mockRankConfigs, []);
    const getCategories = useCallback(() => categories, [categories]);
    
    const getPostsByHashtag = useCallback((tag: string) => {
        return posts.filter(p => {
            const creatorUser = users.find(u => u.creatorId === p.creator.id);
            const creatorUserId = creatorUser ? creatorUser.id : p.creator.id;
            return p.text?.toLowerCase().includes(`#${tag.toLowerCase()}`) &&
                   (!currentUser || !isBlocked(currentUser.id, creatorUserId));
        });
    }, [posts, currentUser, users, isBlocked]);

    const getCreatorsByCategory = useCallback((slug: string) => {
        let filteredCreators = creators.filter(c => c.mainCategory?.slug === slug || c.subCategories.some(sc => sc.slug === slug));
        if (!currentUser?.showSensitiveContent) {
            filteredCreators = filteredCreators.filter(c => c.mainCategory?.slug !== 'nsfw');
        }
        if (currentUser) {
            filteredCreators = filteredCreators.filter(creator => {
                const creatorUser = users.find(u => u.creatorId === creator.id);
                const creatorUserId = creatorUser ? creatorUser.id : creator.id;
                return !isBlocked(currentUser.id, creatorUserId);
            });
        }
        return filteredCreators;
    }, [creators, currentUser, users, isBlocked]);

    const search = useCallback(async (query: string): Promise<SearchResults> => {
        await simulateNetwork(300);
        const lowerCaseQuery = query.toLowerCase();
        
        const filteredCreators = creators.filter(c => {
            const creatorUser = users.find(u => u.creatorId === c.id);
            const creatorUserId = creatorUser ? creatorUser.id : c.id;
            return (currentUser?.showSensitiveContent || c.mainCategory.slug !== 'nsfw') &&
            (c.displayName.toLowerCase().includes(lowerCaseQuery) || c.username.toLowerCase().includes(lowerCaseQuery)) &&
            (!currentUser || !isBlocked(currentUser.id, creatorUserId));
        }).slice(0, 5).map(c => ({ userId: c.id, username: c.username, profileImageUrl: c.avatarUrl }));

        const filteredPosts: SearchResultPost[] = posts.filter(p => {
            const creatorUser = users.find(u => u.creatorId === p.creator.id);
            const creatorUserId = creatorUser ? creatorUser.id : p.creator.id;
            return p.text && p.text.toLowerCase().includes(lowerCaseQuery) && !p.scheduledAt &&
            (currentUser?.showSensitiveContent || !p.isNsfw) &&
            (!currentUser || !isBlocked(currentUser.id, creatorUserId));
        }).slice(0, 5).map(p => ({ postId: p.id, creatorUsername: p.creator.username, excerpt: p.text!.substring(0, 100) }));

        const hashtagRegex = /#(\w+)/g;
        const hashtags = new Map<string, number>();
        posts.forEach(p => {
            const matches = p.text?.match(hashtagRegex);
            if (matches) {
                matches.forEach(match => {
                    const tag = match.substring(1).toLowerCase();
                    if (tag.includes(lowerCaseQuery)) {
                        hashtags.set(tag, (hashtags.get(tag) || 0) + 1);
                    }
                });
            }
        });
        const filteredHashtags: SearchResultHashtag[] = Array.from(hashtags.entries())
            .map(([tag, postCount]) => ({ tag, postCount }))
            .sort((a, b) => b.postCount - a.postCount)
            .slice(0, 5);

        return { creators: filteredCreators, posts: filteredPosts, hashtags: filteredHashtags };
    }, [creators, posts, currentUser, users, isBlocked]);

    const getSuggestedCreators = useCallback((): Creator[] => {
      if (!currentUser) {
        return creators.sort((a, b) => b.creatorScore - a.creatorScore).slice(0, 5);
      }
      
      const subscribedCreatorIds = new Set(currentUser.subscriptions.map(s => s.creatorId));
      
      const suggestions = creators
        .filter(c => {
            const creatorUser = users.find(u => u.creatorId === c.id);
            const creatorUserId = creatorUser ? creatorUser.id : c.id;
            return c.id !== currentUser.creatorId && 
                !subscribedCreatorIds.has(c.id) &&
                (!c.mainCategory || c.mainCategory.slug !== 'nsfw' || currentUser.showSensitiveContent) &&
                !isBlocked(currentUser.id, creatorUserId);
        })
        .sort((a, b) => b.creatorScore - a.creatorScore)
        .slice(0, 5);
        
      return suggestions;
    }, [creators, currentUser, users, isBlocked]);
    
    // Gamification
    const getAchievementsForUser = useCallback((userId: number): Achievement[] => {
        const user = users.find(u => u.id === userId);
        if (!user) return [];
        return user.achievements.map(ua => mockAchievements.find(a => a.id === ua.achievementId)).filter((a): a is Achievement => !!a);
    }, [users]);

    const getTopFanForCreator = useCallback((creatorId: number): number | null => {
      const creatorSubs = users.filter(u => u.subscriptions.some(s => s.creatorId === creatorId && new Date(s.expiresAt) > new Date()));
      if (creatorSubs.length === 0) return null;
      
      let topFanId: number | null = null;
      let maxScore = -1;

      creatorSubs.forEach(fan => {
          const sub = fan.subscriptions.find(s => s.creatorId === creatorId)!;
          const subDays = (new Date().getTime() - new Date(sub.subscribedSince).getTime()) / (1000 * 3600 * 24);
          
          const tipsToCreator = transactions.filter(t => t.fanId === fan.id && t.creatorId === creatorId && t.type === TransactionType.Tip);
          const totalTipAmount = tipsToCreator.reduce((sum, t) => sum + t.amount, 0);
          
          // Score: 1 point per day subscribed + 2 points per dollar tipped
          const score = (subDays * 1) + (totalTipAmount * 2);
          
          if (score > maxScore) {
              maxScore = score;
              topFanId = fan.id;
          }
      });
      
      return topFanId;
    }, [users, transactions]);

    const getFreeTrialLinksForCreator = useCallback((creatorId: number) => {
        return freeTrialLinks.filter(link => link.creatorId === creatorId);
    }, [freeTrialLinks]);

    const getExpiredSubscriptionsForUser = useCallback((userId: number): Creator[] => {
        const user = users.find(u => u.id === userId);
        if (!user) return [];
        
        const expiredCreatorIds = user.subscriptions
          .filter(sub => new Date(sub.expiresAt) <= new Date())
          .map(sub => sub.creatorId);
          
        return creators.filter(creator => expiredCreatorIds.includes(creator.id));
    }, [users, creators]);

    const getReferredUsers = useCallback((userId: number) => {
        return users.filter(u => u.referredByUserId === userId);
    }, [users]);

    const getReferralEarnings = useCallback((userId: number) => {
        return transactions
            .filter(t => t.type === TransactionType.REFERRAL_PAYOUT && t.creatorId === userId)
            .reduce((sum, t) => sum + t.amount, 0);
    }, [transactions]);


    // Admin
    const submitVerification = useCallback(async (submission: Omit<VerificationSubmission, 'id' | 'timestamp'>) => {
        await simulateNetwork();
        const newSubmission: VerificationSubmission = { ...submission, id: Date.now(), timestamp: new Date().toISOString() };
        setVerificationSubmissions(prev => [newSubmission, ...prev]);
        alert('Verification submitted. An admin will review it shortly.');
    }, []);
    const processVerification = useCallback(async (submissionId: number, isApproved: boolean) => {
        await simulateNetwork();
        const submission = verificationSubmissions.find(s => s.id === submissionId);
        if (!submission) return;
        
        if (isApproved) {
            finalizeUserVerification(submission.userId, submission.reason, submission.onboardingData);
        } else {
            // In a real app, you'd notify the user of rejection.
            console.log(`Verification for user ${submission.userId} rejected.`);
        }
        setVerificationSubmissions(prev => prev.filter(s => s.id !== submissionId));
    }, [verificationSubmissions, finalizeUserVerification]);
    const processPayouts = useCallback(async () => { alert('Simulated payouts processed for all creators.'); }, []);
    const updatePlatformSettings = useCallback(async (settings: Partial<PlatformSettings>) => { await simulateNetwork(); setPlatformSettings(prev => ({ ...prev, ...settings })); }, []);
    const getUserById = useCallback((userId: number) => users.find(u => u.id === userId), [users]);
    const getTransactionsForUser = useCallback((userId: number) => transactions.filter(t => t.fanId === userId), [transactions]);
    const addReport = useCallback((reportData: Omit<Report, 'id' | 'timestamp' | 'reporterId' | 'status'>) => {
        if (!currentUser) return;
        const newReport: Report = { ...reportData, id: Date.now(), timestamp: new Date().toISOString(), reporterId: currentUser.id, status: 'pending' };
        setReports(prev => [newReport, ...prev]);
    }, [currentUser]);
    const resolveReport = useCallback((reportId: number, action: 'dismiss' | 'delete_post' | 'suspend_1d' | 'suspend_7d' | 'ban') => { console.log(`Report ${reportId} resolved with action: ${action}`); setReports(prev => prev.filter(r => r.id !== reportId)); }, []);
    const createAnnouncement = useCallback((data: Omit<Announcement, 'id' | 'createdAt'>) => setAnnouncements(prev => [{ ...data, id: Date.now(), createdAt: new Date().toISOString() }, ...prev]), []);
    const updateAnnouncement = useCallback((id: number, data: Partial<Omit<Announcement, 'id' | 'createdAt'>>) => setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...data } : a)), []);
    const deleteAnnouncement = useCallback((id: number) => setAnnouncements(prev => prev.filter(a => a.id !== id)), []);
    const resolveAutoModItem = useCallback((itemId: number, isApproved: boolean) => { console.log(`AutoMod item ${itemId} resolved. Approved: ${isApproved}`); setAutoModQueue(prev => prev.filter(i => i.id !== itemId)); }, []);
    const addCategory = useCallback((name: string, parentId: number | null) => {
        const newCat: Category = { id: Date.now(), name, slug: name.toLowerCase().replace(/\s+/g, '-'), children: [] };
        setCategories(prev => {
            if (parentId) {
                return prev.map(p => p.id === parentId ? { ...p, children: [...p.children, newCat] } : p);
            }
            return [...prev, newCat];
        });
    }, []);
    const editCategory = useCallback((categoryId: number, newName: string) => {
        const slug = newName.toLowerCase().replace(/\s+/g, '-');
        setCategories(prev => prev.map(p => {
            if (p.id === categoryId) return { ...p, name: newName, slug };
            return { ...p, children: p.children.map(c => c.id === categoryId ? { ...c, name: newName, slug } : c) };
        }));
    }, []);
    const deleteCategory = useCallback((categoryId: number) => setCategories(prev => prev.filter(c => c.id !== categoryId).map(p => ({ ...p, children: p.children.filter(c => c.id !== categoryId) })));, []);
    const adminDeleteUser = useCallback(async (userId: number) => { await simulateNetwork(); setUsers(prev => prev.filter(u => u.id !== userId)); }, [setUsers]);
    const suspendUser = useCallback(async (userId: number, durationDays: number | 'permanent') => {
        const expiry = new Date();
        if (durationDays === 'permanent') {
            expiry.setFullYear(9999);
        } else {
            expiry.setDate(expiry.getDate() + durationDays);
        }
        await updateUserSettings(userId, { suspendedUntil: expiry.toISOString() });
    }, [updateUserSettings]);
    const reactivateUser = useCallback(async (userId: number) => await updateUserSettings(userId, { suspendedUntil: undefined }), [updateUserSettings]);
    const adminCancelSubscription = useCallback(async (userId: number, creatorId: number) => { await simulateNetwork(); setUsers(prev => prev.map(u => u.id === userId ? { ...u, subscriptions: u.subscriptions.filter(s => s.creatorId !== creatorId) } : u)); }, [setUsers]);
    const createSupportTicket = useCallback(async (ticketData: Omit<SupportTicket, 'id' | 'timestamp' | 'status' | 'userId' | 'username'>) => {
        await simulateNetwork();
        const newTicket: SupportTicket = {
            ...ticketData,
            id: Date.now(),
            timestamp: new Date().toISOString(),
            status: SupportTicketStatus.Open,
            ...(currentUser && { userId: currentUser.id, username: currentUser.username })
        };
        setSupportTickets(prev => [newTicket, ...prev]);
    }, [currentUser]);
    const updateSupportTicketStatus = useCallback((ticketId: number, status: SupportTicketStatus) => setSupportTickets(prev => prev.map(t => t.id === ticketId ? { ...t, status } : t)), []);


  const value: DataContextType = {
    posts, creators, users, stories, verificationSubmissions, transactions, platformSettings, reports, announcements, autoModQueue, supportTickets, isBlocked,
    getPostsForCreator,
    getFanListsForCreator, getCreatorStats, getScheduledPosts, getScheduledMessages, getFreeTrialLinksForCreator, getConversations, getRankingsConfig, getCategories, getPostsByHashtag, getCreatorsByCategory, search, getRelatedFeed, getPostById, getSuggestedCreators, getExpiredSubscriptionsForUser, getReferredUsers, getReferralEarnings,
    createPost, editPost, deletePost, toggleLikePost, addComment, deleteComment, toggleBookmark, boostPost, unlockPost,
    subscribeToPackage, isSubscribedToCreator, isFollowingCreator, toggleFollowCreator,
    updateCreatorProfile, updateUserSettings, updatePassword, deleteAccount,
    updateMonthlyPrice, addSubscriptionPackage, updateSubscriptionPackage, deleteSubscriptionPackage,
    createFreeTrialLink, deactivateFreeTrialLink,
    saveCard, removeCard, sendTip, contributeToGoal,
    addNotification, markNotificationsAsRead,
    sendMessage, unlockMessage, startOrGetConversation, markConversationAsRead, muteConversation, blockUser, updateConversationNotes,
    createFanList, updateFanList,
    scheduleMessage, editScheduledMessage, cancelScheduledMessage, editScheduledPost, cancelScheduledPost,
    completeOnboardingStep, getDiscoverFeed, logPostInteraction,
    getActiveStories, getActiveStoriesForCreator, addStory, markStoryAsViewed,
    getAchievementsForUser, getTopFanForCreator, checkAndGrantAchievements,
    submitVerification, processVerification, processPayouts, updatePlatformSettings, getUserById, getTransactionsForUser, addReport, resolveReport, createAnnouncement, updateAnnouncement, deleteAnnouncement, resolveAutoModItem, addCategory, editCategory, deleteCategory, adminDeleteUser, suspendUser, reactivateUser, adminCancelSubscription, createSupportTicket, updateSupportTicketStatus,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};
