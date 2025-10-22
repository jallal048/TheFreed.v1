import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback, useMemo } from 'react';
import { useAuth } from './AuthContext';
import { AuthUser, Creator, Post, Media, Comment as UIComment, PostType, PostFormat, FanList, CreatorStats, ScheduledMessage, FreeTrialLink, SubscriptionPackage, Story, StoryItem, RankConfig, SearchResults, Category, VerificationSubmission, Transaction, TransactionType, PlatformSettings, RankName, Report, Announcement, AutoModQueueItem, SupportTicket, SupportTicketStatus, Achievement, PostInteractionMetrics, Notification, NotificationType, SearchResultHashtag, SearchResultPost } from '../types';
import { mockCreators as initialCreators, mockPosts as initialPosts, mockConversations as initialConversations, mockFanLists as initialFanLists, mockCreatorStats, mockScheduledMessages as initialScheduledMessages, mockFreeTrialLinks as initialFreeTrialLinks, mockStories, mockRankConfigs, mockCategories, mockTransactions, mockReports, mockAnnouncements, mockAutoModQueue, mockSupportTickets, mockVerificationSubmissions } from '../constants';
import { calculatePostScore, calculatePersonalizedPostScore } from '../services/feedAlgorithm';

interface DataContextType {
  // Core data
  posts: Post[];
  creators: Creator[];
  users: (AuthUser & { password?: string })[];
  stories: Story[];
  announcements: Announcement[];
  reports: Report[];
  autoModQueue: AutoModQueueItem[];
  platformSettings: PlatformSettings;
  supportTickets: SupportTicket[];

  // Feeds & queries
  getDiscoverFeed: () => Post[];
  getRelatedFeed: (postId: number) => Post[];
  getPostsForCreator: (creatorId: number) => Post[];
  getPostById: (postId: number) => Post | undefined;
  getCategories: () => Category[];
  getPostsByHashtag: (tag: string) => Post[];
  getCreatorsByCategory: (slug: string) => Creator[];
  search: (query: string) => Promise<SearchResults>;

  // Stories
  getActiveStories: () => Story[];
  getActiveStoriesForCreator: (creatorId: number) => StoryItem[];
  addStory: (media: Media, isNsfw: boolean) => void;
  markStoryAsViewed: (storyItemId: number) => void;

  // Social actions
  toggleLikePost: (postId: number, openAuthModal: () => void) => void;
  addComment: (postId: number, text: string, openAuthModal: () => void) => void;
  toggleFollowCreator: (creatorId: number, openAuthModal: () => void) => void;

  // Messaging (safe no-ops)
  getConversations: () => any[];
  sendMessage: (conversationId: number, message: { content?: string, media?: Media[], tipAmount?: number, ppvPrice?: number }) => void;
  startOrGetConversation: (otherUserId: number) => Promise<number>;
  markConversationAsRead: (conversationId: number) => void;
  muteConversation: (conversationId: number, mute: boolean) => void;
  updateConversationNotes: (conversationId: number, notes: string) => void;
  unlockMessage: (messageId: number) => Promise<void>;

  // Admin/Announcements
  createAnnouncement: (data: Omit<Announcement, 'id' | 'createdAt'>) => void;
  updateAnnouncement: (id: number, data: Partial<Omit<Announcement, 'id' | 'createdAt'>>) => void;
  deleteAnnouncement: (id: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5174';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, users, setUsers, creators, setCreators } = useAuth();

  // State (mocks por ahora; API para like/comment/follow)
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [stories, setStories] = useState<Story[]>(mockStories);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [autoModQueue, setAutoModQueue] = useState<AutoModQueueItem[]>(mockAutoModQueue);
  const [supportTickets, setSupportTickets] = useState<SupportTicket[]>(mockSupportTickets);
  const [categories] = useState<Category[]>(mockCategories);
  const [conversations, setConversations] = useState<any[]>(initialConversations);
  const [postInteractions, setPostInteractions] = useState<Record<number, PostInteractionMetrics>>({});
  const [platformSettings] = useState<PlatformSettings>({
    commissionRates: mockRankConfigs.reduce((acc, rank) => { acc[rank.rankName] = rank.commissionRate; return acc; }, {} as Record<RankName, number>),
    featuredCreatorIds: [1,2,3]
  });

  useEffect(() => { setCreators(initialCreators); }, [setCreators]);

  // Helpers
  const api = async (path: string, opts?: RequestInit) => {
    const res = await fetch(`${API_BASE}${path}`, { headers: { 'Content-Type': 'application/json' }, ...opts });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  };

  // Feeds
  const getDiscoverFeed = useCallback((): Post[] => {
    const discoverable = posts.filter(p => !p.scheduledAt && p.type === PostType.Public && (p.media?.length || 0) > 0 && (currentUser?.showSensitiveContent || !p.isNsfw));
    if (!currentUser) {
      return discoverable
        .map(post => ({ post, score: calculatePostScore(post, creators || initialCreators) }))
        .sort((a, b) => b.score - a.score)
        .map(x => x.post);
    }
    const interests = new Map<string, number>();
    currentUser.subscriptions.forEach(sub => {
      if (new Date(sub.expiresAt) > new Date()) {
        const c = (creators || initialCreators).find(cc => cc.id === sub.creatorId);
        if (c?.mainCategory) interests.set(c.mainCategory.slug, (interests.get(c.mainCategory.slug) || 0) + 1);
        c?.subCategories.forEach(sc => interests.set(sc.slug, (interests.get(sc.slug) || 0) + 1));
      }
    });
    return discoverable
      .map(post => ({ post, score: calculatePersonalizedPostScore(post, creators || initialCreators, interests, postInteractions[post.id]) }))
      .sort((a, b) => b.score - a.score)
      .map(x => x.post);
  }, [posts, creators, currentUser, postInteractions]);

  const getRelatedFeed = useCallback((postId: number): Post[] => {
    const base = getDiscoverFeed();
    const target = posts.find(p => p.id === postId);
    if (!target) return base;
    // Simple heuristic mock
    return base.filter(p => p.creator.id === target.creator.id || p.creator.mainCategory?.id === target.creator.mainCategory?.id).slice(0, 12);
  }, [posts, getDiscoverFeed]);

  const getPostsForCreator = useCallback((creatorId: number) => posts.filter(p => p.creator.id === creatorId && !p.scheduledAt).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()), [posts]);
  const getPostById = useCallback((postId: number) => posts.find(p => p.id === postId), [posts]);
  const getCategories = useCallback(() => categories, [categories]);
  const getPostsByHashtag = useCallback((tag: string) => posts.filter(p => p.text?.toLowerCase().includes(`#${tag.toLowerCase()}`)), [posts]);
  const getCreatorsByCategory = useCallback((slug: string) => (creators || initialCreators).filter(c => c.mainCategory?.slug === slug || c.subCategories.some(sc => sc.slug === slug)), [creators]);
  const search = useCallback(async (query: string): Promise<SearchResults> => {
    const q = query.toLowerCase();
    const creatorResults = (creators || initialCreators)
      .filter(c => c.displayName.toLowerCase().includes(q) || c.username.toLowerCase().includes(q))
      .slice(0, 5)
      .map(c => ({ userId: c.id, username: c.username, profileImageUrl: c.avatarUrl }));
    const postResults: SearchResultPost[] = posts
      .filter(p => p.text && p.text.toLowerCase().includes(q) && !p.scheduledAt && (currentUser?.showSensitiveContent || !p.isNsfw))
      .slice(0, 5)
      .map(p => ({ postId: p.id, creatorUsername: p.creator.username, excerpt: p.text!.substring(0, 100) }));
    const hashtagsMap = new Map<string, number>();
    posts.forEach(p => p.text?.match(/#(\w+)/g)?.forEach(m => { const t = m.substring(1).toLowerCase(); if (t.includes(q)) hashtagsMap.set(t, (hashtagsMap.get(t) || 0) + 1); }));
    const hashtags: SearchResultHashtag[] = Array.from(hashtagsMap.entries()).map(([tag, postCount]) => ({ tag, postCount })).sort((a, b) => b.postCount - a.postCount).slice(0, 5);
    return { creators: creatorResults, posts: postResults, hashtags };
  }, [posts, creators, currentUser]);

  // Stories
  const getActiveStories = useCallback(() => stories, [stories]);
  const getActiveStoriesForCreator = useCallback((creatorId: number) => stories.find(s => s.creatorId === creatorId)?.items || [], [stories]);
  const addStory = useCallback((media: Media, isNsfw: boolean) => {
    if (!currentUser?.creatorId) return;
    setStories(prev => {
      const existing = prev.find(s => s.creatorId === currentUser.creatorId);
      const newItem: StoryItem = { id: Date.now(), media, isNsfw, timestamp: new Date().toISOString(), viewers: [] };
      if (existing) {
        return prev.map(s => s.creatorId === currentUser.creatorId ? { ...s, items: [newItem, ...s.items] } : s);
      }
      return [{ creatorId: currentUser.creatorId, items: [newItem] }, ...prev];
    });
  }, [currentUser]);
  const markStoryAsViewed = useCallback((storyItemId: number) => {
    if (!currentUser) return;
    setStories(prev => prev.map(s => ({ ...s, items: s.items.map(i => i.id === storyItemId ? { ...i, viewers: i.viewers.includes(currentUser.id) ? i.viewers : [...i.viewers, currentUser.id] } : i) })));
  }, [currentUser]);

  // Social (persistencia real via API, UI optimista)
  const toggleLikePost = useCallback((postId: number, openAuthModal: () => void) => {
    if (!currentUser) { openAuthModal(); return; }
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likedBy: p.likedBy.includes(currentUser.id) ? p.likedBy.filter(id => id !== currentUser.id) : [...p.likedBy, currentUser.id] } : p));
    api('/api/like', { method: 'POST', body: JSON.stringify({ userId: String(currentUser.id), postId: String(postId) }) }).catch(() => {
      // revert
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likedBy: p.likedBy.includes(currentUser.id) ? p.likedBy.filter(id => id !== currentUser.id) : [...p.likedBy, currentUser.id] } : p));
    });
  }, [currentUser]);

  const addComment = useCallback((postId: number, text: string, openAuthModal: () => void) => {
    if (!currentUser) { openAuthModal(); return; }
    const temp: UIComment = { id: Date.now(), text, timestamp: new Date().toISOString(), user: { id: currentUser.id, username: currentUser.username, avatarUrl: currentUser.avatarUrl } };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [temp, ...p.comments] } : p));
    api('/api/comment', { method: 'POST', body: JSON.stringify({ userId: String(currentUser.id), postId: String(postId), text }) }).catch(() => {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== temp.id) } : p));
    });
  }, [currentUser]);

  const toggleFollowCreator = useCallback((creatorId: number, openAuthModal: () => void) => {
    if (!currentUser) { openAuthModal(); return; }
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, followingIds: u.followingIds.includes(creatorId) ? u.followingIds.filter(id => id !== creatorId) : [...u.followingIds, creatorId] } : u));
    api('/api/follow', { method: 'POST', body: JSON.stringify({ followerUserId: String(currentUser.id), followingCreatorId: String(creatorId) }) }).catch(() => {
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, followingIds: u.followingIds.includes(creatorId) ? u.followingIds.filter(id => id !== creatorId) : [...u.followingIds, creatorId] } : u));
    });
  }, [currentUser, setUsers]);

  // Mensajería (no-ops seguros)
  const getConversations = useCallback(() => conversations, [conversations]);
  const sendMessage = useCallback((conversationId: number, message: { content?: string, media?: Media[], tipAmount?: number, ppvPrice?: number }) => {
    // mock: agregar mensaje local
    setConversations(prev => prev.map(c => c.id === conversationId ? { ...c, messages: [{ id: Date.now(), senderId: currentUser?.id, content: message.content || '', timestamp: new Date().toISOString() }, ...c.messages] } : c));
  }, [currentUser]);
  const startOrGetConversation = useCallback(async (otherUserId: number) => {
    const existing = conversations.find(c => c.participants.includes(otherUserId) && c.participants.includes(currentUser?.id || -1));
    if (existing) return existing.id;
    const id = Date.now();
    setConversations(prev => [{ id, participants: [currentUser?.id, otherUserId].filter(Boolean), messages: [] }, ...prev]);
    return id;
  }, [conversations, currentUser]);
  const markConversationAsRead = useCallback((conversationId: number) => {}, []);
  const muteConversation = useCallback((conversationId: number, mute: boolean) => {}, []);
  const updateConversationNotes = useCallback((conversationId: number, notes: string) => {}, []);
  const unlockMessage = useCallback(async (messageId: number) => {}, []);

  // Announcements
  const createAnnouncement = useCallback((data: Omit<Announcement, 'id' | 'createdAt'>) => {
    setAnnouncements(prev => [{ ...data, id: Date.now(), createdAt: new Date().toISOString() }, ...prev]);
  }, []);
  const updateAnnouncement = useCallback((id: number, data: Partial<Omit<Announcement, 'id' | 'createdAt'>>) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  }, []);
  const deleteAnnouncement = useCallback((id: number) => setAnnouncements(prev => prev.filter(a => a.id !== id)), []);

  const value: DataContextType = useMemo(() => ({
    posts,
    creators: creators || initialCreators,
    users,
    stories,
    announcements,
    reports,
    autoModQueue,
    platformSettings,
    supportTickets,

    getDiscoverFeed,
    getRelatedFeed,
    getPostsForCreator,
    getPostById,
    getCategories,
    getPostsByHashtag,
    getCreatorsByCategory,
    search,

    getActiveStories,
    getActiveStoriesForCreator,
    addStory,
    markStoryAsViewed,

    toggleLikePost,
    addComment,
    toggleFollowCreator,

    getConversations,
    sendMessage,
    startOrGetConversation,
    markConversationAsRead,
    muteConversation,
    updateConversationNotes,
    unlockMessage,

    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
  }), [
    posts, creators, users, stories, announcements, reports, autoModQueue, platformSettings, supportTickets,
    getDiscoverFeed, getRelatedFeed, getPostsForCreator, getPostById, getCategories, getPostsByHashtag, getCreatorsByCategory, search,
    getActiveStories, getActiveStoriesForCreator, addStory, markStoryAsViewed,
    toggleLikePost, addComment, toggleFollowCreator,
    getConversations, sendMessage, startOrGetConversation, markConversationAsRead, muteConversation, updateConversationNotes, unlockMessage,
    createAnnouncement, updateAnnouncement, deleteAnnouncement
  ]);

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
};
