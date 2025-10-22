import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { AuthUser, Creator, Post, Media, Comment as UIComment, PostType, PostFormat, FanList, CreatorStats, ScheduledMessage, FreeTrialLink, SubscriptionPackage, Story, StoryItem, RankConfig, SearchResults, Category, VerificationSubmission, Transaction, TransactionType, PlatformSettings, RankName, Report, Announcement, AutoModQueueItem, SupportTicket, SupportTicketStatus, Achievement, PostInteractionMetrics } from '../types';
import { mockCreators as initialCreators, mockPosts as initialPosts, mockConversations as initialConversations, mockFanLists as initialFanLists, mockCreatorStats, mockScheduledMessages as initialScheduledMessages, mockFreeTrialLinks as initialFreeTrialLinks, mockStories, mockRankConfigs, mockCategories, mockTransactions, mockReports, mockAnnouncements, mockAutoModQueue, mockSupportTickets, mockVerificationSubmissions } from '../constants';

interface DataContextType {
  posts: Post[];
  creators: Creator[];
  users: (AuthUser & { password?: string })[];
  toggleLikePost: (postId: number, openAuthModal: () => void) => void;
  addComment: (postId: number, text: string, openAuthModal: () => void) => void;
  toggleFollowCreator: (creatorId: number, openAuthModal: () => void) => void;
  getDiscoverFeed: () => Post[];
  // ... resto igual que antes (omitido por brevedad)
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5174';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, users, setUsers, creators, setCreators } = useAuth();

  const [posts, setPosts] = useState(initialPosts);
  const [fanLists] = useState(initialFanLists);
  const [scheduledMessages] = useState(initialScheduledMessages);
  const [freeTrialLinks] = useState(initialFreeTrialLinks);
  const [stories, setStories] = useState(mockStories);
  const [verificationSubmissions, setVerificationSubmissions] = useState<VerificationSubmission[]>(mockVerificationSubmissions);
  const [transactions, setTransactions] = useState<Transaction[]>(mockTransactions);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    commissionRates: mockRankConfigs.reduce((acc, rank) => { acc[rank.rankName] = rank.commissionRate; return acc; }, {} as Record<RankName, number>),
    featuredCreatorIds: [1,2,3]
  });
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [autoModQueue, setAutoModQueue] = useState(mockAutoModQueue);
  const [categories, setCategories] = useState(mockCategories);
  const [supportTickets, setSupportTickets] = useState(mockSupportTickets);
  const [postInteractions, setPostInteractions] = useState<Record<number, PostInteractionMetrics>>({});

  useEffect(() => { setCreators(initialCreators); }, [setCreators]);

  const getDiscoverFeed = useCallback((): Post[] => {
    return posts.filter(p => p.type === PostType.Public && p.media?.length && !p.scheduledAt);
  }, [posts]);

  // Helper fetch
  async function api(path: string, opts?: RequestInit) {
    const res = await fetch(`${API_BASE}${path}`, { headers: { 'Content-Type': 'application/json' }, ...opts });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  // LIKE with optimistic update
  const toggleLikePost = useCallback((postId: number, openAuthModal: () => void) => {
    if (!currentUser) { openAuthModal(); return; }
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likedBy: p.likedBy.includes(currentUser.id) ? p.likedBy.filter(id => id !== currentUser.id) : [...p.likedBy, currentUser.id] } : p));
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    // Encontrar el ID real del post en BD no está mapeado (usabas ints), así que por ahora no sincronizamos el contador desde el backend
    // En un paso siguiente, alinearemos IDs con BD o haremos un mapa idUI->idDB
    api('/api/like', { method: 'POST', body: JSON.stringify({ userId: String(currentUser.id), postId: String(postId) }) }).catch(() => {
      // revertir si falla
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, likedBy: p.likedBy.includes(currentUser.id) ? p.likedBy.filter(id => id !== currentUser.id) : [...p.likedBy, currentUser.id] } : p));
    });
  }, [currentUser, posts]);

  // COMMENT with optimistic update
  const addComment = useCallback((postId: number, text: string, openAuthModal: () => void) => {
    if (!currentUser) { openAuthModal(); return; }
    const tempComment: UIComment = { id: Date.now(), text, timestamp: new Date().toISOString(), user: { id: currentUser.id, username: currentUser.username, avatarUrl: currentUser.avatarUrl } };
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [tempComment, ...p.comments] } : p));
    api('/api/comment', { method: 'POST', body: JSON.stringify({ userId: String(currentUser.id), postId: String(postId), text }) }).catch(() => {
      // revertir si falla
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments.filter(c => c.id !== tempComment.id) } : p));
    });
  }, [currentUser]);

  // FOLLOW with optimistic update
  const toggleFollowCreator = useCallback((creatorId: number, openAuthModal: () => void) => {
    if (!currentUser) { openAuthModal(); return; }
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, followingIds: u.followingIds.includes(creatorId) ? u.followingIds.filter(id => id !== creatorId) : [...u.followingIds, creatorId] } : u));
    const creator = creators.find(c => c.id === creatorId);
    api('/api/follow', { method: 'POST', body: JSON.stringify({ followerUserId: String(currentUser.id), followingCreatorId: creator ? String(creator.id) : String(creatorId) }) }).catch(() => {
      // revertir si falla
      setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, followingIds: u.followingIds.includes(creatorId) ? u.followingIds.filter(id => id !== creatorId) : [...u.followingIds, creatorId] } : u));
    });
  }, [currentUser, creators, setUsers]);

  const value: DataContextType = {
    posts,
    creators,
    users,
    toggleLikePost,
    addComment,
    toggleFollowCreator,
    getDiscoverFeed,
  } as any;

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
};
