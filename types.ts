

export enum UserRole {
  Fan = 'FAN',
  Creator = 'CREATOR',
  Admin = 'ADMIN',
}

export interface SubscriptionPackage {
  months: number;
  price: number;
}

export interface UserSubscription {
    creatorId: number;
    expiresAt: string; // ISO Date string
    subscribedSince: string; // ISO Date string
}

export type RankName = 'PLATINUM' | 'DIAMOND' | 'GOLD' | 'SILVER' | 'BRONZE' | 'IRON';

export interface RankConfig {
  rankName: RankName;
  minScore: number;
  commissionRate: number;
  freeBoostsPerMonth: number;
}

export interface CreatorRankInfo {
  userId: number;
  username: string;
  rank: RankName;
  globalPercentile: number | null;
  creatorScore: number;
  profileImageUrl: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface UserAchievement {
  achievementId: string;
  unlockedAt: string; // ISO Date string
}

export interface AuthUser {
  id: number;
  email: string;
  username: string;
  role: UserRole;
  avatarUrl: string;
  creatorId?: number; // Link to the Creator profile ID if role is Creator
  subscriptions: UserSubscription[]; // Array of active subscriptions
  followingIds: number[]; // Array of creator IDs the user follows
  unlockedPosts: number[]; // Array of post IDs for PPV content
  unlockedMessages: number[]; // Array of message IDs for PPV DMs
  savedCard: {
    last4: string;
    brand: string;
  } | null;
  notifications: {
    newPosts: boolean;
    newComments: boolean;
    specialOffers: boolean;
  };
  userNotifications: Notification[];
  bookmarkedPostIds: number[];
  onboardingProgress?: { step: 'profile_basics' | 'categorization' | 'social_links' | 'monetization' | 'first_post'; completed: boolean }[];
  isProfilePrivate: boolean;
  allowFindByEmail: boolean;
  sendReadReceipts: boolean;
  showSensitiveContent: boolean;
  isAgeVerified: boolean;
  mutedConversations: number[];
  blockedUsers: number[];
  personalInfo: {
    fullName: string;
    dateOfBirth: string; // YYYY-MM-DD
    address: string;
  };
  billingInfo: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  lastSeen: 'online' | string; // ISO Date string
  viewedStories: number[]; // Array of StoryItem IDs
  rank?: RankName;
  globalPercentile?: number | null;
  suspendedUntil?: string; // ISO date string for temporary suspensions
  registeredAt: string; // ISO date string
  achievements: UserAchievement[];
  referralCode: string;
  referredByUserId?: number;
}

export enum PostType {
  Public,
  SubscriberOnly,
  PayPerView,
}

export enum PostFormat {
  Text = 'text',
  Gallery = 'gallery'
}

export interface Media {
  type: 'image' | 'video';
  url: string; // Can be a remote URL or a local data URL
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  children: Category[];
}

export interface SocialLink {
  type: 'twitter' | 'instagram' | 'youtube' | 'website';
  url: string;
}

export interface Creator {
  id: number; // Added for unique identification
  username: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  bio: string;
  location: string;
  socialLinks: SocialLink[];
  monthlyPrice: number;
  subscriptionPackages: SubscriptionPackage[];
  stats: {
    posts: number;
    subscribers: string;
  };
  payoutInfo: {
    iban: string;
    swiftBic: string;
    bankName: string;
  };
  lastSeen: 'online' | string; // ISO Date string
  rank: RankName;
  globalPercentile: number | null;
  creatorScore: number;
  mainCategory: Category;
  subCategories: Category[];
}

export interface Comment {
    id: number;
    user: {
        id: number;
        username: string;
        avatarUrl: string;
    };
    text: string;
    timestamp: string;
}

export interface Post {
  id: number;
  creator: Creator;
  type: PostType;
  format: PostFormat;
  text?: string;
  media: Media[];
  ppvPrice?: number;
  goalAmount?: number;
  goalRaised?: number;
  timestamp: string;
  likedBy: number[];
  comments: Comment[];
  visibleToLists?: number[]; // Array of FanList IDs
  scheduledAt?: string;
  isNsfw?: boolean;
}

// Notifications
export type NotificationType = 'like' | 'comment' | 'new_subscriber' | 'tip';
export interface Notification {
  id: number;
  type: NotificationType;
  actor: { // The user who performed the action
    id: number;
    username: string;
    avatarUrl: string;
  };
  read: boolean;
  message: string;
  linkTo: string; // e.g., /post/123
  timestamp: string;
}

// Messaging
export interface Conversation {
  id: number;
  participants: { id: number; username: string; avatarUrl: string; lastSeen: 'online' | string }[];
  messages: Message[];
  lastMessageTimestamp: string;
  notes?: string;
}

export interface Message {
  id: number;
  senderId: number;
  content?: string;
  media?: Media[];
  tipAmount?: number;
  ppvPrice?: number;
  timestamp: string;
  isRead: boolean;
}

// Fan Lists
export interface FanList {
    id: number;
    name: string;
    creatorId: number;
    fanIds: number[];
}

export interface ScheduledMessage {
  id: number;
  creatorId: number;
  content: string;
  target: {
    type: 'all' | 'lists';
    listIds?: number[];
  };
  targetDescription: string; // e.g., "All Subscribers", "VIP Fans"
  scheduledAt: string;
}

// Creator Stats
export interface CreatorStats {
    creatorId: number;
    totalSubscribers: number;
    monthlyRevenue: number;
    subscriberGrowth: { month: string, count: number }[];
    topPosts: { postId: number, title: string, likes: number, comments: number }[];
    earningsBreakdown: ({ name: 'Subscriptions', value: number } | { name: 'Tips', value: number } | { name: 'PPV', value: number })[];
}

export interface FreeTrialLink {
  id: string;
  code: string;
  usesLeft: number | 'unlimited';
  expiresAt: string | null;
  isActive: boolean;
  creatorId: number;
}

// Stories
export interface StoryItem {
    id: number;
    media: Media;
    timestamp: string; // ISO Date string
    isNsfw?: boolean;
}
export interface Story {
    creatorId: number;
    items: StoryItem[];
}


// Settings
export type SettingsSection = 'profile' | 'account' | 'monetization' | 'personal' | 'billing' | 'payout' | 'wallet' | 'notifications' | 'privacy' | 'support' | 'referrals';

// Dropdown Menu Item
export interface DropdownItem {
  label?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  isDestructive?: boolean;
  type?: 'separator';
}

export interface ConfirmationModalOptions {
  title: string;
  message: string;
  confirmText: string;
  onConfirm: () => void | Promise<void>;
  confirmRequiresInput?: string;
}

// Search & Discovery
export interface SearchResultCreator {
  userId: number;
  username: string;
  profileImageUrl: string;
}
export interface SearchResultPost {
  postId: number;
  creatorUsername: string;
  excerpt: string;
}
export interface SearchResultHashtag {
  tag: string; 
  postCount: number;
}

export interface SearchResults {
  creators: SearchResultCreator[];
  posts: SearchResultPost[];
  hashtags: SearchResultHashtag[];
}

export type OnboardingDataPayload = Partial<Creator> & {
    personalInfo: AuthUser['personalInfo'];
    password?: string;
    email?: string;
    isUpgrade?: boolean;
    username?: string;
    avatarUrl?: string;
    referralCode?: string;
    referredByUserId?: number;
};

// Admin
export interface VerificationSubmission {
    id: number;
    userId: number;
    username: string;
    avatarUrl: string;
    reason: 'creator_onboarding' | 'fan_nsfw';
    idImageUrl: string;
    selfieImageUrl: string;
    timestamp: string;
    onboardingData?: OnboardingDataPayload;
}

export enum TransactionType {
  Subscription = 'SUBSCRIPTION',
  Tip = 'TIP',
  PPV = 'PPV',
  REFERRAL_PAYOUT = 'REFERRAL_PAYOUT',
}

export interface Transaction {
    id: number;
    type: TransactionType;
    amount: number;
    platformFee: number;
    creatorPayout: number;
    fanId: number;
    creatorId: number;
    timestamp: string;
    description: string;
}

export interface PlatformSettings {
    commissionRates: Record<RankName, number>;
    featuredCreatorIds: number[];
}

export interface Report {
    id: number;
    reporterId: number;
    targetType: 'post' | 'user';
    targetId: number;
    reason: string;
    timestamp: string;
    status: 'pending' | 'resolved';
}

export interface Announcement {
    id: number;
    title: string;
    content: string;
    target: 'all' | 'CREATOR' | 'FAN';
    isActive: boolean;
    createdAt: string;
}

export interface AutoModQueueItem {
    id: number;
    postId: number;
    reason: string;
    confidence: number; // 0 to 1
    timestamp: string;
}

export enum SupportTicketStatus {
    Open = 'OPEN',
    InProgress = 'IN_PROGRESS',
    Closed = 'CLOSED',
}

export type SupportTicketCategory = 'BILLING' | 'TECHNICAL' | 'ACCOUNT' | 'GENERAL';

export interface SupportTicket {
    id: number;
    userId?: number;
    email?: string; // For guest users
    username?: string; // For logged-in users
    category: SupportTicketCategory;
    subject: string;
    message: string;
    status: SupportTicketStatus;
    timestamp: string;
}

export type NavigationTarget = { page: 'home' } | { page: 'adminDashboard' };

export type ViewStateAdminUsers = {
  page: 'adminUsers';
  filters?: {
    role?: UserRole;
    status?: 'active' | 'suspended';
  }
};


export type ViewState = { 
  page: 'home' | 'discover' | 'profile' | 'dashboard' | 'fanProfile' | 'settings' | 'search' | 'messages' | 'bookmarks' | 'fanLists' | 'schedule' | 'explore' | 'rankings' | 'post' | 'hashtag' | 'category' | 'adminLogin' | 'adminDashboard' | 'adminContent' | 'adminVerifications' | 'adminFinances' | 'adminSettings' | 'adminUserDetail' | 'adminReports' | 'adminAnnouncements' | 'adminAutoMod' | 'adminPostDetail' | 'support' | 'adminSupport'; 
  creator?: Creator; 
  searchResults?: { creators: Creator[], posts: Post[] }; 
  searchQuery?: string;
  preSelectedConversationId?: number;
  activeSection?: SettingsSection;
  explorePostId?: number;
  postId?: number;
  hashtag?: string;
  categorySlug?: string;
  userId?: number;
} | ViewStateAdminUsers;

export interface PostInteractionMetrics {
  dwellTime: number; // in milliseconds
  videoPlayCount: number;
  videoCompletionCount: number;
  textExpanded: boolean;
  profileClicked: boolean;
}