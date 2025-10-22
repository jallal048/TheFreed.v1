import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { AuthUser, Creator, Post, Media, Comment as UIComment, PostType, PostFormat, FanList, CreatorStats, ScheduledMessage, FreeTrialLink, SubscriptionPackage, Story, StoryItem, RankConfig, SearchResults, Category, VerificationSubmission, Transaction, TransactionType, PlatformSettings, RankName, Report, Announcement, AutoModQueueItem, SupportTicket, SupportTicketStatus, Achievement, PostInteractionMetrics } from '../types';
import { mockCreators as initialCreators, mockPosts as initialPosts, mockFanLists as initialFanLists, mockCreatorStats, mockScheduledMessages as initialScheduledMessages, mockFreeTrialLinks as initialFreeTrialLinks, mockStories, mockRankConfigs, mockCategories, mockTransactions, mockReports, mockAnnouncements, mockAutoModQueue, mockSupportTickets, mockVerificationSubmissions } from '../constants';

interface DataContextType {
  posts: Post[];
  creators: Creator[];
  users: (AuthUser & { password?: string })[];
  announcements: Announcement[];
  reports: Report[];
  autoModQueue: AutoModQueueItem[];
  platformSettings: PlatformSettings;
  toggleLikePost: (postId: number, openAuthModal: () => void) => void;
  addComment: (postId: number, text: string, openAuthModal: () => void) => void;
  toggleFollowCreator: (creatorId: number, openAuthModal: () => void) => void;
  createAnnouncement: (data: Omit<Announcement, 'id' | 'createdAt'>) => void;
  updateAnnouncement: (id: number, data: Partial<Omit<Announcement, 'id' | 'createdAt'>>) => void;
  deleteAnnouncement: (id: number) => void;
  getDiscoverFeed: () => Post[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

const API_BASE = (import.meta as any).env?.VITE_API_URL || 'http://localhost:5174';

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { currentUser, users, setUsers, creators, setCreators } = useAuth();

  const [posts, setPosts] = useState(initialPosts);
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [reports, setReports] = useState<Report[]>(mockReports);
  const [autoModQueue, setAutoModQueue] = useState(mockAutoModQueue);
  const [platformSettings, setPlatformSettings] = useState<PlatformSettings>({
    commissionRates: mockRankConfigs.reduce((acc, rank) => { acc[rank.rankName] = rank.commissionRate; return acc; }, {} as Record<RankName, number>),
    featuredCreatorIds: [1,2,3]
  });

  useEffect(() => { setCreators(initialCreators); }, [setCreators]);

  const getDiscoverFeed = useCallback((): Post[] => posts.filter(p => p.type === PostType.Public && p.media?.length && !p.scheduledAt), [posts]);

  async function api(path: string, opts?: RequestInit) {
    const res = await fetch(`${API_BASE}${path}`, { headers: { 'Content-Type': 'application/json' }, ...opts });
    if (!res.ok) throw new Error(await res.text());
    return res.json();
  }

  const toggleLikePost = useCallback((postId: number, openAuthModal: () => void) => {
    if (!currentUser) { openAuthModal(); return; }
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likedBy: p.likedBy.includes(currentUser.id) ? p.likedBy.filter(id => id !== currentUser.id) : [...p.likedBy, currentUser.id] } : p));
    api('/api/like', { method: 'POST', body: JSON.stringify({ userId: String(currentUser.id), postId: String(postId) }) }).catch(() => {
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

  // Announcements no-ops reales
  const createAnnouncement = useCallback((data: Omit<Announcement, 'id' | 'createdAt'>) => {
    setAnnouncements(prev => [{ ...data, id: Date.now(), createdAt: new Date().toISOString() }, ...prev]);
  }, []);
  const updateAnnouncement = useCallback((id: number, data: Partial<Omit<Announcement, 'id' | 'createdAt'>>) => {
    setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...data } : a));
  }, []);
  const deleteAnnouncement = useCallback((id: number) => setAnnouncements(prev => prev.filter(a => a.id !== id)), []);

  const value: DataContextType = {
    posts,
    creators: initialCreators,
    users,
    announcements,
    reports,
    autoModQueue,
    platformSettings,
    toggleLikePost,
    addComment,
    toggleFollowCreator,
    createAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    getDiscoverFeed,
  } as any;

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useData = (): DataContextType => {
  const context = useContext(DataContext);
  if (context === undefined) throw new Error('useData must be used within a DataProvider');
  return context;
};
