

import { Creator, Post, PostType, AuthUser, UserRole, Notification, Conversation, Message, PostFormat, FanList, CreatorStats, ScheduledMessage, FreeTrialLink, SubscriptionPackage, Story, RankConfig, RankName, Category, Transaction, TransactionType, Report, Announcement, AutoModQueueItem, SupportTicket, SupportTicketStatus, VerificationSubmission, Achievement } from './types';

const now = new Date();

export const mockCategories: Category[] = [
    { id: 1, name: "Art", slug: "art", children: [
        { id: 2, name: "Digital Art", slug: "digital-art", children: [] },
        { id: 10, name: "Illustration", slug: "illustration", children: [] },
        { id: 42, name: "Painting", slug: "painting", children: [] },
        { id: 43, name: "Sculpture", slug: "sculpture", children: [] },
    ]},
    { id: 3, name: "Fitness", slug: "fitness", children: [
        { id: 18, name: "Workouts", slug: "workouts", children: [] },
        { id: 19, name: "Nutrition", slug: "nutrition", children: [] },
        { id: 44, name: "Yoga", slug: "yoga", children: [] },
        { id: 45, name: "Bodybuilding", slug: "bodybuilding", children: [] },
    ]},
    { id: 4, name: "Food & Cooking", slug: "food-cooking", children: [
        { id: 20, name: "Recipes", slug: "recipes", children: [] },
        { id: 21, name: "Restaurant Reviews", slug: "restaurant-reviews", children: [] },
        { id: 46, name: "Baking", slug: "baking", children: [] },
        { id: 47, name: "Vegan Cooking", slug: "vegan-cooking", children: [] },
    ]},
    { id: 5, name: "Gaming", slug: "gaming", children: [
        { id: 22, name: "Streaming", slug: "streaming", children: [] },
        { id: 23, name: "Esports", slug: "esports", children: [] },
        { id: 48, name: "Game Development", slug: "game-development", children: [] },
        { id: 49, name: "Retro Gaming", slug: "retro-gaming", children: [] },
    ]},
    { id: 6, name: "Music", slug: "music", children: [
        { id: 24, name: "Production", slug: "production", children: [] },
        { id: 25, name: "Live Performance", slug: "live-performance", children: [] },
        { id: 50, name: "DJing", slug: "djing", children: [] },
        { id: 51, name: "Songwriting", slug: "songwriting", children: [] },
    ]},
    { id: 7, name: "Travel", slug: "travel", children: [
        { id: 26, name: "Vlogs", slug: "vlogs", children: [] },
        { id: 27, name: "Guides", slug: "guides", children: [] },
        { id: 52, name: "Backpacking", slug: "backpacking", children: [] },
        { id: 53, name: "Luxury Travel", slug: "luxury-travel", children: [] },
    ]},
    { id: 11, name: "Lifestyle", slug: "lifestyle", children: [
        { id: 28, name: "Fashion", slug: "fashion", children: [] },
        { id: 29, name: "Vlogs", slug: "lifestyle-vlogs", children: [] },
        { id: 54, name: "Home Decor", slug: "home-decor", children: [] },
        { id: 55, name: "Minimalism", slug: "minimalism", children: [] },
    ]},
    { id: 12, name: "Comedy", slug: "comedy", children: [
        { id: 30, name: "Sketches", slug: "sketches", children: [] },
        { id: 31, name: "Stand-up", slug: "stand-up", children: [] },
        { id: 56, name: "Improv", slug: "improv", children: [] },
        { id: 57, name: "Satire", slug: "satire", children: [] },
    ]},
    { id: 13, name: "Education", slug: "education", children: [
        { id: 32, name: "Tutorials", slug: "tutorials", children: [] },
        { id: 33, name: "Documentaries", slug: "documentaries", children: [] },
        { id: 58, name: "Science", slug: "science", children: [] },
        { id: 59, name: "History", slug: "history", children: [] },
    ]},
    { id: 14, name: "ASMR", slug: "asmr", children: [
        { id: 34, name: "Tingles", slug: "tingles", children: [] },
        { id: 35, name: "Roleplay", slug: "roleplay", children: [] },
        { id: 60, name: "No Talking", slug: "no-talking", children: [] },
        { id: 61, name: "Tapping", slug: "tapping", children: [] },
    ]},
    { id: 15, name: "Dance & Theater", slug: "dance-theater", children: [
        { id: 36, name: "Choreography", slug: "choreography", children: [] },
        { id: 37, name: "Behind the Scenes", slug: "behind-the-scenes", children: [] },
        { id: 62, name: "Ballet", slug: "ballet", children: [] },
        { id: 63, name: "Musical Theater", slug: "musical-theater", children: [] },
    ]},
    { id: 16, name: "Writing", slug: "writing", children: [
        { id: 38, name: "Fiction", slug: "fiction", children: [] },
        { id: 39, name: "Poetry", slug: "poetry", children: [] },
        { id: 64, name: "Journalism", slug: "journalism", children: [] },
        { id: 65, name: "Screenwriting", slug: "screenwriting", children: [] },
    ]},
    // A special, top-level category
    { id: 17, name: "NSFW", slug: "nsfw", children: [
        { id: 40, name: "Artistic Nudity", slug: "artistic-nudity", children: [] },
        { id: 41, name: "Boudoir", slug: "boudoir", children: [] },
        { id: 66, name: "Erotic Fiction", slug: "erotic-fiction", children: [] },
        { id: 67, name: "Lingerie", slug: "lingerie", children: [] },
    ]},
];

export const mockRankConfigs: RankConfig[] = [
    { rankName: 'PLATINUM', minScore: 9500, commissionRate: 0.05, freeBoostsPerMonth: 5 },
    { rankName: 'DIAMOND', minScore: 8000, commissionRate: 0.08, freeBoostsPerMonth: 2 },
    { rankName: 'GOLD', minScore: 6000, commissionRate: 0.10, freeBoostsPerMonth: 1 },
    { rankName: 'SILVER', minScore: 4000, commissionRate: 0.12, freeBoostsPerMonth: 0 },
    { rankName: 'BRONZE', minScore: 2000, commissionRate: 0.15, freeBoostsPerMonth: 0 },
    { rankName: 'IRON', minScore: 0, commissionRate: 0.20, freeBoostsPerMonth: 0 },
];

export const mockAchievements: Achievement[] = [
  // Phase 1: The Launch
  { id: 'PROFILE_LAUNCHPAD', name: 'Launchpad', description: 'Your profile is 100% complete! The world is ready to meet you.', icon: 'rocket-launch' },
  { id: 'ICE_BREAKER', name: 'Ice Breaker', description: 'You\'ve published your first piece of content! The journey to your freedom has begun.', icon: 'pencil-square' },
  { id: 'FIRST_BELIEVER', name: 'First Believer', description: 'Your first fan has arrived. This is just the beginning of your community!', icon: 'users' },
  { id: 'FIRST_APPLAUSE', name: 'First Applause', description: 'You\'ve received your first "like". Your content is already resonating.', icon: 'like' },
  { id: 'OPENING_DEBATE', name: 'Opening the Debate', description: 'The conversation has started! You\'ve received your first comment.', icon: 'comment' },

  // Tiered: Tribe Leader (Subscribers)
  { id: 'TRIBE_LEADER_1', name: 'Group Leader', description: 'You\'ve gathered your first 10 loyal subscribers.', icon: 'users' },
  { id: 'TRIBE_LEADER_2', name: 'Tribe Chief', description: 'Fifty fans follow your work. You\'re building a movement!', icon: 'users' },
  { id: 'TRIBE_LEADER_3', name: 'Community Warlord', description: 'One hundred fans! You\'ve created a solid and growing community.', icon: 'users' },
  { id: 'TRIBE_LEADER_4', name: 'Commander of Legions', description: 'Five hundred subscribers! You have the attention of a massive audience.', icon: 'users' },
  { id: 'TRIBE_LEADER_5', name: 'Sovereign of the Empire', description: 'One thousand subscribers follow you. You have built a true digital empire.', icon: 'users' },

  // Tiered: Content Factory (Total Posts)
  { id: 'CONTENT_FACTORY_1', name: 'Consistent Creator', description: '10 posts and counting. Consistency is key.', icon: 'pencil-square' },
  { id: 'CONTENT_FACTORY_2', name: 'Prolific Author', description: '25 posts. Your voice resonates strongly on the platform.', icon: 'pencil-square' },
  { id: 'CONTENT_FACTORY_3', name: 'Source of Inspiration', description: 'Fifty posts! You are an endless source of content.', icon: 'pencil-square' },
  { id: 'CONTENT_FACTORY_4', name: 'Creative Marathoner', description: 'One hundred posts! Your dedication makes you a pillar of TheFreed.', icon: 'pencil-square' },
  { id: 'CONTENT_FACTORY_5', name: 'Content Legend', description: '250 posts. Your archive is a treasure for your community.', icon: 'pencil-square' },
  
  // Tiered: Like Magnet (Total Likes)
  { id: 'LIKE_MAGNET_1', name: 'Initial Recognition', description: 'You have accumulated 100 "likes". Your content is liked and connects.', icon: 'like' },
  { id: 'LIKE_MAGNET_2', name: 'Fan Favorite', description: '500 "likes" demonstrate the love of your growing community.', icon: 'like' },
  { id: 'LIKE_MAGNET_3', name: 'Applause Generator', description: 'A thousand "likes" show the real impact you are making.', icon: 'like' },
  { id: 'LIKE_MAGNET_4', name: 'Engagement Phenomenon', description: 'Five thousand "likes"! Your community values and supports every step you take.', icon: 'like' },
  { id: 'LIKE_MAGNET_5', name: 'Heart of the Platform', description: 'Ten thousand "likes"! You have created a massive and lasting connection.', icon: 'like' },

  // Tiered: Streak Master (Posting Streak)
  { id: 'STREAK_MASTER_1', name: 'Unstoppable Streak', description: 'One month posting at least once a week. Your discipline is incredible!', icon: 'rocket-launch' },
  { id: 'STREAK_MASTER_2', name: 'Steel Commitment', description: 'Two consecutive months of weekly posting. You are a reliable creator.', icon: 'rocket-launch' },
  { id: 'STREAK_MASTER_3', name: 'Elite Rhythm', description: 'A whole quarter of weekly consistency. Your community knows they can count on you.', icon: 'rocket-launch' },
  { id: 'STREAK_MASTER_4', name: 'Champion\'s Habit', description: 'Six months posting every week. Creation is part of your DNA.', icon: 'rocket-launch' },
  { id: 'STREAK_MASTER_5', name: 'Anniversary of Fire', description: 'A whole year of weekly posts! You are the definition of dedication.', icon: 'rocket-launch' },

  // Tiered: Unbreakable Bond (Fan Loyalty)
  { id: 'UNBREAKABLE_BOND_1', name: 'Loyal Fan', description: 'A fan has been subscribed for 3 months. You are building relationships, not just followers.', icon: 'key' },
  { id: 'UNBREAKABLE_BOND_2', name: 'Veteran Fan', description: 'Six months of loyalty from a fan! Some are already a fundamental part of your journey.', icon: 'key' },
  { id: 'UNBREAKABLE_BOND_3', name: 'Trusted Ally', description: 'Nine months of uninterrupted support from a fan. It\'s a solid connection.', icon: 'key' },
  { id: 'UNBREAKABLE_BOND_4', name: 'Loyalty Anniversary', description: 'A fan has celebrated a year with you! That is a true and powerful connection.', icon: 'key' },
  { id: 'UNBREAKABLE_BOND_5', name: 'Pillar of the Community', description: 'Two years! You have fans whose loyalty has transcended time.', icon: 'key' },

  // Special & Tool Mastery Achievements (Single Level)
  { id: 'VERSATILE_CREATOR', name: 'Versatile', description: 'You have shown your versatility by publishing texts, image galleries, and videos.', icon: 'collection' },
  { id: 'TIME_MASTER', name: 'Time Master', description: 'You used the scheduling feature. Work smarter, not harder!', icon: 'calendar-days' },
  { id: 'COMMUNITY_CONNECTOR', name: 'Community Connector', description: 'You mentioned another creator, strengthening TheFreed\'s network of freedom.', icon: 'link' },
  { id: 'BRAND_AMBASSADOR', name: 'Brand Ambassador', description: 'Your first fan joined through a free trial link! You are your best marketing.', icon: 'ticket' },
  { id: 'COMMUNITY_STRATEGIST', name: 'Community Strategist', description: 'You have created and used your first Fan List. Segmenting your audience is a pro move!', icon: 'list' },
  { id: 'THE_CONVERSATIONALIST', name: 'The Conversationalist', description: 'You have responded to over 100 comments. You show that your community really matters to you.', icon: 'chat' },
  { id: 'PLATFORM_ICON', name: 'Platform Icon', description: 'You are part of the top 10% of the most successful creators. You are a benchmark.', icon: 'sparkles' },
  { id: 'THEFREED_ELITE', name: 'TheFreed Elite', description: 'You have reached PLATINUM rank. The top is yours, you are an icon.', icon: 'diamond' },
];


const assignRank = (score: number): { rank: RankName, percentile: number | null } => {
    for (const config of mockRankConfigs) {
        if (score >= config.minScore) {
            let percentile: number | null = null;
            if (config.rankName === 'PLATINUM') percentile = 1;
            else if (config.rankName === 'DIAMOND') percentile = 5;
            return { rank: config.rankName, percentile };
        }
    }
    return { rank: 'IRON', percentile: null };
};

const auroraCreator: Creator = {
  id: 1,
  username: 'aurora_arts',
  displayName: 'Aurora',
  avatarUrl: 'https://picsum.photos/id/1027/200/200',
  bannerUrl: 'https://picsum.photos/id/1015/1200/400',
  bio: 'Digital artist & storyteller creating vibrant worlds from my imagination. Welcome to my creative universe! ✨ Subscribers get exclusive artwork, process videos, tutorials, and a peek behind the scenes of my projects.',
  location: 'Stockholm, Sweden',
  socialLinks: [
    { type: 'instagram', url: 'https://instagram.com' },
    { type: 'twitter', url: 'https://twitter.com' },
    { type: 'website', url: 'https://auroraarts.com' },
  ],
  monthlyPrice: 9.99,
  subscriptionPackages: [
      { months: 3, price: 24.99 }, // ~16% off
      { months: 6, price: 44.99 }, // ~25% off
  ],
  stats: {
    posts: 124,
    subscribers: '15.7K',
  },
  payoutInfo: {
    iban: 'ES8021000000000000001234',
    swiftBic: 'CAIXESBBXXX',
    bankName: 'CaixaBank'
  },
  lastSeen: new Date(now.getTime() - 5 * 60 * 1000).toISOString(),
  rank: 'PLATINUM',
  globalPercentile: 1,
  creatorScore: 9850,
  mainCategory: mockCategories[0],
  subCategories: [mockCategories[0].children[0], mockCategories[0].children[1]]
};

const leoFitnessCreator: Creator = {
  id: 2,
  username: 'leo_fitness',
  displayName: 'Leo Fitness',
  avatarUrl: 'https://picsum.photos/id/1062/200/200',
  bannerUrl: 'https://picsum.photos/id/103/1200/400',
  bio: 'Certified personal trainer on a mission to make fitness accessible and fun. Helping you reach your goals with custom workout plans, nutrition tips, and live Q&A sessions. Let\'s get stronger together!',
  location: 'Miami, USA',
  socialLinks: [
    { type: 'youtube', url: 'https://youtube.com' },
    { type: 'instagram', url: 'https://instagram.com' },
  ],
  monthlyPrice: 14.99,
  subscriptionPackages: [
      { months: 3, price: 39.99 } // ~11% off
  ],
  stats: {
    posts: 350,
    subscribers: '22.1K',
  },
  payoutInfo: {
    iban: 'ES8021000000000000005678',
    swiftBic: 'BSABESBBXXX',
    bankName: 'Banco Sabadell'
  },
  lastSeen: 'online',
  rank: 'DIAMOND',
  globalPercentile: 5,
  creatorScore: 8900,
  mainCategory: mockCategories[1],
  subCategories: [mockCategories[1].children[0], mockCategories[1].children[1]]
};

const culinaryGemsCreator: Creator = {
    id: 3,
    username: 'culinary_gems',
    displayName: 'Culinary Gems',
    avatarUrl: 'https://picsum.photos/id/1080/200/200',
    bannerUrl: 'https://picsum.photos/id/211/1200/400',
    bio: 'Professional chef exploring the world one dish at a time. Join me for exclusive recipes from my travels, private virtual cooking classes, and my curated list of secret ingredients that will elevate your cooking.',
    location: 'Paris, France',
    socialLinks: [],
    monthlyPrice: 7.50,
    subscriptionPackages: [
        { months: 6, price: 37.50 }, // 1 month free
        { months: 12, price: 75.00 } // 2 months free
    ],
    stats: {
        posts: 210,
        subscribers: '18.5K',
    },
    payoutInfo: {
        iban: 'ES8021000000000000009101',
        swiftBic: 'BBVAESMMXXX',
        bankName: 'BBVA'
    },
    lastSeen: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    rank: 'GOLD',
    globalPercentile: null,
    creatorScore: 7500,
    mainCategory: mockCategories[2],
    subCategories: [mockCategories[2].children[0], mockCategories[2].children[2]]
};

const pixelPilotCreator: Creator = {
  id: 4,
  username: 'pixel_pilot',
  displayName: 'Pixel Pilot',
  avatarUrl: 'https://picsum.photos/id/1/200/200',
  bannerUrl: 'https://picsum.photos/id/10/1200/400',
  bio: 'Pro gamer and streamer. Join my squad for exclusive gameplay, tips & tricks, and early access to my stream highlights. Let\'s get this W!',
  location: 'Seoul, South Korea',
  socialLinks: [{ type: 'youtube', url: 'https://youtube.com' }],
  monthlyPrice: 0,
  subscriptionPackages: [],
  stats: { posts: 89, subscribers: '5.2K' },
  payoutInfo: { iban: 'ES8021000000000000001111', swiftBic: 'INGDESMMXXX', bankName: 'ING' },
  lastSeen: new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString(),
  rank: 'GOLD',
  globalPercentile: null,
  creatorScore: 6800,
  mainCategory: mockCategories[3],
  subCategories: [mockCategories[3].children[0]]
};

const melodyMuseCreator: Creator = {
  id: 5,
  username: 'melody_muse',
  displayName: 'Melody Muse',
  avatarUrl: 'https://picsum.photos/id/431/200/200',
  bannerUrl: 'https://picsum.photos/id/201/1200/400',
  bio: 'Indie musician and songwriter. Subscribers get my new songs before anyone else, acoustic versions, and my personal songwriting journal.',
  location: 'Nashville, USA',
  socialLinks: [],
  monthlyPrice: 6.99,
  subscriptionPackages: [{ months: 6, price: 35.99 }],
  stats: { posts: 45, subscribers: '8.9K' },
  payoutInfo: { iban: 'ES8021000000000000002222', swiftBic: 'SABESBBXXX', bankName: 'Banco Sabadell' },
  lastSeen: 'online',
  rank: 'SILVER',
  globalPercentile: null,
  creatorScore: 5100,
  mainCategory: mockCategories[4],
  subCategories: [mockCategories[4].children[3]]
};

const wanderlustQuestCreator: Creator = {
  id: 6,
  username: 'wanderlust_quest',
  displayName: 'Wanderlust Quest',
  avatarUrl: 'https://picsum.photos/id/836/200/200',
  bannerUrl: 'https://picsum.photos/id/99/1200/400',
  bio: 'Traveling the world and sharing my adventures. Get my secret travel guides, uncensored vlogs, and Q&As from exotic locations!',
  location: 'On The Road',
  socialLinks: [{ type: 'instagram', url: 'https://instagram.com' }],
  monthlyPrice: 8.50,
  subscriptionPackages: [{ months: 12, price: 85.00 }],
  stats: { posts: 152, subscribers: '12.4K' },
  payoutInfo: { iban: 'ES8021000000000000003333', swiftBic: 'BBVAESMMXXX', bankName: 'BBVA' },
  lastSeen: new Date(now.getTime() - 10 * 60 * 1000).toISOString(),
  rank: 'SILVER',
  globalPercentile: null,
  creatorScore: 4500,
  mainCategory: mockCategories[5],
  subCategories: [mockCategories[5].children[1]]
};

const mysticMuseCreator: Creator = {
  id: 7,
  username: 'mystic_muse',
  displayName: 'Mystic Muse',
  avatarUrl: 'https://picsum.photos/id/435/200/200',
  bannerUrl: 'https://picsum.photos/id/536/1200/400',
  bio: 'Exploring the art of the human form through photography and digital art. 18+ only. Subscribers get access to my full uncensored gallery.',
  location: 'Berlin, Germany',
  socialLinks: [{ type: 'instagram', url: 'https://instagram.com' }],
  monthlyPrice: 19.99,
  subscriptionPackages: [{ months: 3, price: 49.99 }],
  stats: { posts: 25, subscribers: '31.2K' },
  payoutInfo: { iban: '', swiftBic: '', bankName: '' },
  lastSeen: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
  rank: 'PLATINUM',
  globalPercentile: 1,
  creatorScore: 9600,
  mainCategory: mockCategories.find(c => c.slug === 'nsfw')!,
  subCategories: [mockCategories.find(c => c.slug === 'nsfw')!.children[0], mockCategories.find(c => c.slug === 'nsfw')!.children[1]]
};


export const newCreatorDefaultPackages: Omit<SubscriptionPackage, 'id'|'creatorId'>[] = [
    { months: 3, price: 12.99 },
    { months: 6, price: 24.99 },
];

let initialCreators: Creator[] = [auroraCreator, leoFitnessCreator, culinaryGemsCreator, pixelPilotCreator, melodyMuseCreator, wanderlustQuestCreator, mysticMuseCreator];

let initialPosts: Post[] = [
  // Posts for Aurora
  {
    id: 1,
    creator: auroraCreator,
    type: PostType.Public,
    format: PostFormat.Gallery,
    text: "Just a little sneak peek of what I'm working on! The full piece will be available for my amazing subscribers tomorrow. Thank you all for your support! ❤️ @leo_fitness #art #digitalart",
    media: [{ type: 'image', url: 'https://picsum.photos/id/1060/800/600'}],
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    likedBy: [2, 3],
    comments: [],
    isNsfw: false,
  },
  {
    id: 2,
    creator: auroraCreator,
    type: PostType.SubscriberOnly,
    format: PostFormat.Gallery,
    text: "Here it is! My latest piece, 'Cosmic Ocean'. I poured so much into this one. Subscribers get access to the high-res version and a time-lapse video of the creation process. Hope you love it! #illustration",
    media: [
      { type: 'image', url: 'https://picsum.photos/id/1079/800/1000' },
      { type: 'image', url: 'https://picsum.photos/id/1078/800/1000' },
      { type: 'image', url: 'https://picsum.photos/id/1077/800/1000' },
    ],
    timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likedBy: [1],
    comments: [],
    isNsfw: false,
  },
  {
    id: 3,
    creator: auroraCreator,
    type: PostType.PayPerView,
    format: PostFormat.Gallery,
    text: 'Unlock a never-before-seen exclusive video tutorial on my special lighting techniques. A deep dive for my biggest supporters!',
    media: [{ type: 'image', url: 'https://picsum.photos/id/433/800/800'}],
    ppvPrice: 15.00,
    timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    likedBy: [],
    comments: [],
    isNsfw: false,
  },
  // Posts for Leo Fitness
  {
    id: 4,
    creator: leoFitnessCreator,
    type: PostType.Public,
    format: PostFormat.Gallery,
    text: "Monday Motivation! Let's crush this week together. What's one fitness goal you're setting for yourself? Let me know below! 👇 #fitness #motivation",
    media: [{ type: 'image', url: 'https://picsum.photos/id/119/800/600'}],
    timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
    likedBy: [1, 3],
    comments: [],
    isNsfw: false,
  },
   {
    id: 5,
    creator: leoFitnessCreator,
    type: PostType.SubscriberOnly,
    format: PostFormat.Gallery,
    text: "Full-body HIIT workout just dropped for all subscribers! No equipment needed, 30 minutes of pure sweat. Let's get that heart rate up and feel the burn. Check it out in the video library now! #fitness",
    media: [{ type: 'video', url: '#'}, { type: 'image', url: 'https://picsum.photos/id/136/800/1000' }],
    timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    likedBy: [],
    comments: [],
    isNsfw: false,
  },
  // Posts for Culinary Gems
  {
    id: 6,
    creator: culinaryGemsCreator,
    type: PostType.Public,
    format: PostFormat.Gallery,
    text: "The perfect sourdough bread. The smell in my kitchen is incredible! Thinking about sharing the starter recipe with my subscribers. What do you think? #baking #food",
    media: [{ type: 'image', url: 'https://picsum.photos/id/292/800/600' }],
    timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likedBy: [1, 2],
    comments: [],
    isNsfw: false,
  },
  {
    id: 7,
    creator: culinaryGemsCreator,
    type: PostType.SubscriberOnly,
    format: PostFormat.Gallery,
    text: "This month's exclusive recipe is my secret to the perfect Italian Tiramisu. It's creamy, rich, and surprisingly easy. Full recipe and video guide are now live for all my wonderful subscribers! #recipe #food",
    media: [{ type: 'image', url: 'https://picsum.photos/id/326/800/800' }],
    timestamp: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    likedBy: [1],
    comments: [],
    isNsfw: false,
  },
   {
    id: 8,
    creator: auroraCreator,
    type: PostType.SubscriberOnly,
    format: PostFormat.Text,
    text: "A special thank you to my VIP fans! Here's a little text post with some thoughts on my upcoming projects, just for you. This will be automatically posted next week!",
    media: [],
    timestamp: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    scheduledAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    likedBy: [],
    comments: [],
    visibleToLists: [101], // Only visible to VIP Fans list
    isNsfw: false,
  },
  // Posts for Pixel Pilot
  {
    id: 9,
    creator: pixelPilotCreator,
    type: PostType.Public,
    format: PostFormat.Gallery,
    text: "New setup is finally complete! What do you guys think? Full tour for subscribers coming this week. #gaming #setup",
    media: [{ type: 'image', url: 'https://picsum.photos/id/26/800/600'}],
    timestamp: new Date(now.getTime() - 10 * 60 * 60 * 1000).toISOString(),
    likedBy: [1, 3],
    comments: [],
    isNsfw: false,
  },
  {
    id: 10,
    creator: pixelPilotCreator,
    type: PostType.SubscriberOnly,
    format: PostFormat.Gallery,
    text: "Exclusive gameplay footage of the new update. I found a secret area, check it out before I post it on YouTube! #gaming",
    media: [{ type: 'video', url: '#'}],
    timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likedBy: [1],
    comments: [],
    isNsfw: false,
  },
  // Posts for Melody Muse
  {
    id: 11,
    creator: melodyMuseCreator,
    type: PostType.Public,
    format: PostFormat.Text,
    text: "Just wrote a new lyric that I can't get out of my head... 'Chasing echoes in a silent room'. What does that make you think of? #music #songwriting",
    media: [],
    timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    likedBy: [1, 2],
    comments: [],
    isNsfw: false,
  },
  {
    id: 12,
    creator: melodyMuseCreator,
    type: PostType.SubscriberOnly,
    format: PostFormat.Gallery,
    text: "Here's the demo for my new song 'Silent Room'. It's raw and just on my acoustic guitar. Hope you feel it. ❤️ #music",
    media: [{ type: 'video', url: '#'}],
    timestamp: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    likedBy: [],
    comments: [],
    isNsfw: false,
  },
  // Posts for Wanderlust Quest
  {
    id: 13,
    creator: wanderlustQuestCreator,
    type: PostType.Public,
    format: PostFormat.Gallery,
    text: "Sunrise in the mountains of Peru. This was one of the most incredible moments of my life. Can't wait to share the full vlog! #travel #peru",
    media: [{ type: 'image', url: 'https://picsum.photos/id/1018/800/600'}],
    timestamp: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    likedBy: [1, 2, 3],
    comments: [],
    isNsfw: false,
  },
  {
    id: 14,
    creator: wanderlustQuestCreator,
    type: PostType.SubscriberOnly,
    format: PostFormat.Gallery,
    text: "My complete guide to backpacking through Peru on a budget. All my secret spots, best hostels, and safety tips are in this post for subscribers only! #travelguide #travel",
    media: [{ type: 'image', url: 'https://picsum.photos/id/1016/800/1000'}, { type: 'image', url: 'https://picsum.photos/id/1019/800/1000'}],
    timestamp: new Date(now.getTime() - 6 * 24 * 60 * 60 * 1000).toISOString(),
    likedBy: [],
    comments: [],
    isNsfw: false,
  },
  // Posts for Mystic Muse (NSFW Creator)
  {
    id: 15,
    creator: mysticMuseCreator,
    type: PostType.Public,
    format: PostFormat.Gallery,
    text: "A look from my recent 'Shadows & Light' series. Safe for work, but a taste of what you'll find on my subscriber feed. #art #photography",
    media: [{ type: 'image', url: 'https://picsum.photos/id/212/800/600'}],
    timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
    likedBy: [1, 2, 3],
    comments: [],
    isNsfw: false,
  },
  {
    id: 16,
    creator: mysticMuseCreator,
    type: PostType.SubscriberOnly,
    format: PostFormat.Gallery,
    text: "Uncensored piece from 'Rebirth'. Thank you for your support which allows me to create freely.",
    media: [{ type: 'image', url: 'https://picsum.photos/id/357/800/1000'}],
    timestamp: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    likedBy: [],
    comments: [],
    isNsfw: true,
  },
  {
    id: 17,
    creator: auroraCreator,
    type: PostType.Public,
    format: PostFormat.Text,
    text: "Working on a huge new commission! To help fund the supplies, I've set up a goal. Any contribution helps bring this piece to life! #art #fundraiser",
    media: [],
    timestamp: new Date(now.getTime() - 12 * 60 * 60 * 1000).toISOString(),
    likedBy: [2,3,4,5],
    comments: [],
    goalAmount: 250,
    goalRaised: 75,
    isNsfw: false,
  },
  {
    id: 18,
    creator: leoFitnessCreator,
    type: PostType.Public,
    format: PostFormat.Gallery,
    text: "New equipment fund! Help me get a new set of kettlebells for our workout videos. Every dollar helps and gets us closer to more varied and intense workouts for everyone. Let's do this! #fitness #fundraiser",
    media: [{ type: 'image', url: 'https://picsum.photos/id/145/800/600'}],
    timestamp: new Date(now.getTime() - 20 * 60 * 60 * 1000).toISOString(),
    likedBy: [1,3,4,5,6],
    comments: [],
    goalAmount: 500,
    goalRaised: 125,
    isNsfw: false,
  }
];

export let generatedCreatorUsers: (AuthUser & { password?: string })[] = [];

// --- START DATA GENERATION ---

const creatorNames = ["Zenith Climber", "Retro Rhythms", "Urban Eats", "Crafty Hands", "Cosmic Coder", "Silent Sculptor", "Vivid Voyager", "Quantum Quill", "Echoing Artist", "Midnight Chef", "Pixel Painter", "Synthwave Surfer", "Gourmet Nomad", "Terra Tinkerer", "Astro Architect", "Bio Bard", "Chrono Weaver", "Data Diva", "Ember Explorer", "Forge Master", "Giga Gardener", "Helio Sculptor", "Iron Illustrator", "Jolt Jockey", "Kinetic King", "Laser Lyricist", "Meta Musician", "Nano Navigator", "Omega Observer", "Pulse Poet", "Quasar Queen", "Rift Runner", "Solar Scribe", "Terraformer", "Ultra Urbanist", "Void Voyager", "Wave Writer", "Xeno Xenologist", "Yotta Yachtsman", "Zetta Zookeeper", "Alpha Artist", "Beta Builder", "Gamma Gamer", "Delta Designer", "Epsilon Editor", "Zeta Zealot", "Eta Etcher", "Theta Thinker", "Iota Inventor", "Kappa Knight"];
const bios = ["Exploring the world from new heights.", "Spinning vinyls and good vibes.", "Finding the best street food, one bite at a time.", "DIY projects and handmade happiness.", "Coding the future, one line at a time.", "Letting the stone speak for itself.", "Chasing sunsets and new horizons.", "Writing stories from alternate realities.", "Painting with sound and silence.", "Late night recipes for the soul.", "Creating 8-bit masterpieces.", "Riding the digital waves of sound.", "Taste-testing the globe's hidden gems.", "Building gadgets that might just work.", "Designing habitats for the stars.", "Singing the songs of the forest.", "Mending the timelines.", "Dancing with data.", "Searching for the planet's last dragons.", "Crafting legends from steel and fire.", "Cultivating digital jungles.", "Shaping light into art.", "Drawing heroes and villains.", "Harnessing the power of the storm.", "Movement is my medium.", "Weaving words with laser precision.", "Composing the soundtrack for the metaverse.", "Sailing the microscopic seas.", "Cataloging the cosmos.", "The rhythm of the city is my inspiration.", "The ruler of the farthest stars.", "Exploring the tears in reality.", "Documenting the life of our sun.", "Making new worlds from old ones.", "The future of city life.", "Charting the empty spaces.", "Telling tales of the ocean.", "Studying alien life, one planet at a time.", "Sailing the data streams.", "Caretaker of the universe's strangest creatures.", "The first and the last.", "Building tomorrow's dreams.", "Leveling up in reality.", "Designing a better world.", "Curating the best of the web.", "A passion for the extraordinary.", "Carving stories in code.", "Contemplating the digital void.", "Bringing impossible ideas to life.", "A warrior of the digital age."];
const postTexts = ["Just dropped something new for my subscribers!", "A little glimpse of what's coming soon.", "Public post! Hope you all enjoy this one.", "Exclusive content is now live on the page.", "Here's a throwback to one of my favorite projects.", "Working on something special... can you guess what it is?", "Your support makes all of this possible. Thank you!", "This one took a while, but I'm so proud of the result.", "Subscriber-only! Check your feeds.", "A quick update for everyone."];
const locations = ["New York, USA", "London, UK", "Tokyo, Japan", "Berlin, Germany", "Sydney, Australia", "Toronto, Canada", "Los Angeles, USA"];

let creatorIdCounter = 8;
let postIdCounter = 19;

for (let i = 0; i < 50; i++) {
    const creatorName = creatorNames[i];
    const monthlyPrice = parseFloat((Math.random() * (20 - 4.99) + 4.99).toFixed(2));
    const creatorScore = Math.floor(Math.random() * 9500);
    const rankInfo = assignRank(creatorScore);
    const mainCat = mockCategories[i % mockCategories.length];
    const creator: Creator = {
        id: creatorIdCounter,
        username: creatorName.toLowerCase().replace(/\s+/g, '_') + `_${creatorIdCounter}`,
        displayName: creatorName,
        avatarUrl: `https://picsum.photos/seed/${creatorIdCounter}/200/200`,
        bannerUrl: `https://picsum.photos/seed/b${creatorIdCounter}/1200/400`,
        bio: bios[i],
        location: locations[i % locations.length],
        socialLinks: Math.random() > 0.5 ? [{ type: 'instagram', url: '#' }] : [],
        monthlyPrice,
        subscriptionPackages: [{ months: 3, price: parseFloat((monthlyPrice * 3 * 0.85).toFixed(2)) }],
        stats: { posts: 0, subscribers: `${(Math.random() * 20).toFixed(1)}K` },
        payoutInfo: { iban: '', swiftBic: '', bankName: '' },
        lastSeen: Math.random() > 0.3 ? new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 48).toISOString() : 'online',
        rank: rankInfo.rank,
        globalPercentile: rankInfo.percentile,
        creatorScore,
        mainCategory: mainCat,
        subCategories: mainCat.children.length > 0 && Math.random() > 0.5 ? [mainCat.children[0]] : [],
    };
    initialCreators.push(creator);

    const creatorUser: AuthUser & { password?: string } = {
        id: creator.id,
        email: `${creator.username}@test.com`,
        password: 'password',
        username: creator.username,
        role: UserRole.Creator,
        creatorId: creator.id,
        avatarUrl: creator.avatarUrl,
        subscriptions: [],
        followingIds: [],
        unlockedPosts: [],
        unlockedMessages: [],
        viewedStories: [],
        bookmarkedPostIds: [],
        savedCard: null,
        notifications: { newPosts: true, newComments: true, specialOffers: false },
        userNotifications: [],
        isProfilePrivate: false,
        allowFindByEmail: true,
        sendReadReceipts: true,
        isAgeVerified: true,
        showSensitiveContent: true,
        mutedConversations: [],
        blockedUsers: [],
        personalInfo: {
            fullName: creator.displayName,
            dateOfBirth: '1990-01-01',
            address: creator.location
        },
        billingInfo: {
            address: '',
            city: '',
            postalCode: '',
            country: ''
        },
        lastSeen: creator.lastSeen,
        rank: creator.rank,
        globalPercentile: creator.globalPercentile,
        registeredAt: new Date(now.getTime() - (Math.random() * 300 + 30) * 24 * 60 * 60 * 1000).toISOString(),
        achievements: [],
        referralCode: creator.username.toUpperCase().substring(0, 10),
    };
    generatedCreatorUsers.push(creatorUser);

    const numPosts = Math.floor(Math.random() * 10) + 10; // 10 to 19 posts
    creator.stats.posts = numPosts;

    for (let j = 0; j < numPosts; j++) {
        const hasText = Math.random() > 0.2;
        const mediaCount = Math.ceil(Math.random() * 5);
        const mediaType = Math.random() > 0.8 ? 'video' : 'image';

        const post: Post = {
            id: postIdCounter,
            creator: creator,
            type: Math.random() > 0.4 ? PostType.Public : PostType.SubscriberOnly,
            format: mediaCount > 0 ? PostFormat.Gallery : PostFormat.Text,
            text: hasText ? `${postTexts[j % postTexts.length]}` : undefined,
            media: Array.from({ length: mediaCount }, (_, k) => ({
                type: mediaType,
                url: mediaType === 'image' ? `https://picsum.photos/id/${(postIdCounter + k) % 1000}/800/${600 + (k*50)}` : '#'
            })),
            timestamp: new Date(now.getTime() - Math.random() * 1000 * 60 * 60 * 24 * 60).toISOString(), // up to 60 days ago
            likedBy: [],
            comments: [],
            isNsfw: false,
        };
        initialPosts.push(post);
        postIdCounter++;
    }
    creatorIdCounter++;
}

export const mockCreators = initialCreators;
export const mockPosts = initialPosts;

// --- END DATA GENERATION ---


export let mockFanLists: FanList[] = [
    {
        id: 101,
        name: 'VIP Fans',
        creatorId: 1, // Aurora's List
        fanIds: [1, 101, 102] // MyFan is a VIP
    },
    {
        id: 102,
        name: 'Early Supporters',
        creatorId: 1,
        fanIds: [1]
    }
];

export const mockCreatorStats: CreatorStats = {
    creatorId: 1, // Aurora's Stats
    totalSubscribers: 15721,
    monthlyRevenue: 4823.50,
    subscriberGrowth: [
        { month: 'Jan', count: 12000 },
        { month: 'Feb', count: 12500 },
        { month: 'Mar', count: 13200 },
        { month: 'Apr', count: 14100 },
        { month: 'May', count: 14800 },
        { month: 'Jun', count: 15721 },
    ],
    topPosts: [
        { postId: 2, title: "Here it is! My latest piece, 'Cosmic Ocean'...", likes: 8300, comments: 1200 },
        { postId: 1, title: "Just a little sneak peek...", likes: 5400, comments: 450 },
    ],
    earningsBreakdown: [
        { name: 'Subscriptions', value: 3990.50 },
        { name: 'Tips', value: 433.00 },
        { name: 'PPV', value: 400.00 }
    ],
};

export const mockScheduledMessages: ScheduledMessage[] = [
    {
        id: 201,
        creatorId: 1, // Aurora
        content: "Hey everyone! Just a heads up, I'll be doing a live Q&A session this Friday at 8 PM EST. Get your questions ready!",
        target: { type: 'all' },
        targetDescription: 'All Subscribers',
        scheduledAt: new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
        id: 202,
        creatorId: 1, // Aurora
        content: "Special offer for my VIPs! For the next 24 hours, get 50% off my latest PPV video tutorial. Thanks for your amazing support!",
        target: { type: 'lists', listIds: [101] },
        targetDescription: 'VIP Fans',
        scheduledAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString()
    }
];


// --- START NOTIFICATION DATA ---
const mockNotifications: Notification[] = [
  {
    id: 1,
    type: 'like',
    actor: { id: 2, username: 'leo_fitness', avatarUrl: leoFitnessCreator.avatarUrl },
    read: false,
    message: 'Leo Fitness liked your post.',
    linkTo: '/post/1',
    timestamp: new Date(now.getTime() - 15 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    type: 'comment',
    actor: { id: 3, username: 'culinary_gems', avatarUrl: culinaryGemsCreator.avatarUrl },
    read: false,
    message: 'Culinary Gems commented: "Looks delicious!"',
    linkTo: '/post/6',
    timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    type: 'new_subscriber',
    actor: { id: 4, username: 'RandomUser', avatarUrl: `https://picsum.photos/id/40/40/40` },
    read: true,
    message: 'You have a new subscriber!',
    linkTo: '/profile/4',
    timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString()
  },
];
// --- END NOTIFICATION DATA ---

const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
const today1032 = new Date(); today1032.setHours(10, 32, 0, 0);
const today1033 = new Date(); today1033.setHours(10, 33, 0, 0);
const today1035 = new Date(); today1035.setHours(10, 35, 0, 0);
const today1040 = new Date(); today1040.setHours(10, 40, 0, 0);
const today1045 = new Date(); today1045.setHours(10, 45, 0, 0);
const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000);

// --- START MESSAGING DATA ---
export const mockConversations: Conversation[] = [
  {
    id: 1,
    participants: [
      { id: 1, username: 'myfan', avatarUrl: 'https://picsum.photos/id/237/40/40', lastSeen: 'online' },
      { id: 2, username: 'leo_fitness', avatarUrl: leoFitnessCreator.avatarUrl, lastSeen: leoFitnessCreator.lastSeen },
    ],
    messages: [
      { id: 1, senderId: 2, content: 'Hey! Thanks for subscribing. Let me know if you have any questions about the workout plans.', timestamp: yesterday.toISOString(), isRead: true },
      { id: 2, senderId: 1, content: 'Awesome, thanks Leo! I\'m excited to start.', timestamp: today1032.toISOString(), isRead: true },
      { id: 3, senderId: 2, content: 'I just posted a new full-body workout. Let me know what you think!', timestamp: today1033.toISOString(), isRead: false },
      { id: 4, senderId: 1, tipAmount: 5, timestamp: today1035.toISOString(), isRead: false },
      { id: 5, senderId: 2, media: [{ type: 'image', url: 'https://picsum.photos/id/136/400/300' }], content: 'This is the one!', timestamp: today1040.toISOString(), isRead: false },
      { id: 8, senderId: 2, media: [{ type: 'image', url: 'https://picsum.photos/id/146/400/300' }], content: 'Special content just for you!', ppvPrice: 9.99, timestamp: today1045.toISOString(), isRead: false },
    ],
    lastMessageTimestamp: today1045.toISOString()
  },
  {
    id: 2,
    participants: [
      { id: 1, username: 'myfan', avatarUrl: 'https://picsum.photos/id/237/40/40', lastSeen: 'online' },
      { id: 3, username: 'culinary_gems', avatarUrl: culinaryGemsCreator.avatarUrl, lastSeen: culinaryGemsCreator.lastSeen },
    ],
    messages: [
      { id: 3, senderId: 3, content: 'Just sent you a special recipe for being a top fan!', timestamp: twoDaysAgo.toISOString(), isRead: false },
    ],
    lastMessageTimestamp: twoDaysAgo.toISOString()
  },
  {
    id: 3,
    participants: [
      { id: 1, username: 'myfan', avatarUrl: 'https://picsum.photos/id/237/40/40', lastSeen: 'online' },
      { id: 4, username: 'pixel_pilot', avatarUrl: pixelPilotCreator.avatarUrl, lastSeen: pixelPilotCreator.lastSeen },
    ],
    messages: [
      { id: 6, senderId: 4, content: 'Thanks for subbing! Ready to level up?', timestamp: twoDaysAgo.toISOString(), isRead: true },
      { id: 7, senderId: 1, content: 'Heck yeah! Love your streams.', timestamp: today1032.toISOString(), isRead: false },
    ],
    lastMessageTimestamp: today1032.toISOString()
  }
];
// --- END MESSAGING DATA ---

export const myFanAccount: AuthUser & { password?: string } = {
  id: 1,
  email: 'myfan@test.com',
  password: 'password',
  username: 'MyFan',
  role: UserRole.Fan,
  avatarUrl: 'https://picsum.photos/id/237/40/40',
  subscriptions: [
      { creatorId: 1, expiresAt: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString(), subscribedSince: new Date(now.getTime() - 100 * 24 * 60 * 60 * 1000).toISOString() }, // Subscribed to Aurora
      { creatorId: 2, expiresAt: new Date(now.getTime() + 28 * 24 * 60 * 60 * 1000).toISOString(), subscribedSince: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString() }, // Subscribed to Leo Fitness
      { creatorId: 3, expiresAt: new Date(now.getTime() + 15 * 24 * 60 * 60 * 1000).toISOString(), subscribedSince: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString() }, // Subscribed to Culinary Gems
      { creatorId: 4, expiresAt: new Date(now.getTime() + 20 * 24 * 60 * 60 * 1000).toISOString(), subscribedSince: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString() }, // Subscribed to Pixel Pilot
      { creatorId: 6, expiresAt: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(), subscribedSince: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() }, // Subscribed to Wanderlust Quest
  ],
  followingIds: [5, 6], // Follows Melody Muse & Wanderlust Quest
  unlockedPosts: [],
  unlockedMessages: [],
  viewedStories: [1001], // Viewed one of Aurora's stories
  bookmarkedPostIds: [1, 7, 13],
  savedCard: { brand: 'Visa', last4: '4242' },
  notifications: { newPosts: true, newComments: false, specialOffers: true },
  userNotifications: mockNotifications,
  isProfilePrivate: false,
  allowFindByEmail: true,
  sendReadReceipts: true,
  isAgeVerified: false,
  showSensitiveContent: false,
  mutedConversations: [],
  blockedUsers: [],
  personalInfo: {
    fullName: 'John Fan Doe',
    dateOfBirth: '1990-05-15',
    address: '123 Pixel Lane, Apt 4B'
  },
  billingInfo: {
    address: '123 Pixel Lane, Apt 4B',
    city: 'Webville',
    postalCode: '98765',
    country: 'United States'
  },
  lastSeen: 'online',
  registeredAt: new Date(now.getTime() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  achievements: [],
  referralCode: 'MYFAN123',
};

export const myCreatorAccount: AuthUser & { password?: string } = {
  id: 2,
  email: 'mycreator@test.com',
  password: 'password',
  username: 'aurora_arts',
  role: UserRole.Creator,
  creatorId: 1, // This user's creator profile is auroraCreator (id: 1)
  avatarUrl: 'https://picsum.photos/id/1027/40/40',
  subscriptions: [
      { creatorId: 2, expiresAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(), subscribedSince: new Date(now.getTime() - 35 * 24 * 60 * 60 * 1000).toISOString() } // Expired subscription to Leo
  ],
  followingIds: [2],
  unlockedPosts: [],
  unlockedMessages: [],
  viewedStories: [],
  bookmarkedPostIds: [4],
  savedCard: null,
  notifications: { newPosts: true, newComments: true, specialOffers: false },
  userNotifications: [],
  isProfilePrivate: false,
  allowFindByEmail: true,
  sendReadReceipts: true,
  isAgeVerified: true,
  showSensitiveContent: true,
  mutedConversations: [],
  blockedUsers: [],
  personalInfo: {
    fullName: 'Aurora Painter',
    dateOfBirth: '1985-10-20',
    address: '456 Canvas Court'
  },
  billingInfo: {
    address: '456 Canvas Court',
    city: 'Artburg',
    postalCode: '12345',
    country: 'Canada'
  },
  lastSeen: 'online',
  rank: 'PLATINUM',
  globalPercentile: 1,
  registeredAt: new Date(now.getTime() - 300 * 24 * 60 * 60 * 1000).toISOString(),
  achievements: [
      { achievementId: 'THEFREED_ELITE', unlockedAt: new Date().toISOString() },
      { achievementId: 'ICE_BREAKER', unlockedAt: new Date().toISOString() },
      { achievementId: 'TRIBE_LEADER_5', unlockedAt: new Date().toISOString() },
      { achievementId: 'LIKE_MAGNET_5', unlockedAt: new Date().toISOString() },
      { achievementId: 'CONTENT_FACTORY_4', unlockedAt: new Date().toISOString() },
  ],
  referralCode: 'AURORA456',
};

export const newCreatorUser: AuthUser & { password?: string } = {
    id: 5,
    email: 'new@test.com',
    password: 'password',
    username: 'NewbieCreator',
    role: UserRole.Creator,
    creatorId: 5,
    avatarUrl: 'https://picsum.photos/seed/newbie/40/40',
    subscriptions: [],
    followingIds: [],
    unlockedPosts: [],
    unlockedMessages: [],
    viewedStories: [],
    bookmarkedPostIds: [],
    savedCard: null,
    notifications: { newPosts: true, newComments: true, specialOffers: true },
    userNotifications: [],
    onboardingProgress: [
        { step: 'profile_basics', completed: false },
        { step: 'categorization', completed: false },
        { step: 'social_links', completed: false },
        { step: 'monetization', completed: false },
        { step: 'first_post', completed: false },
    ],
    isProfilePrivate: false,
    allowFindByEmail: true,
    sendReadReceipts: true,
    isAgeVerified: false,
    showSensitiveContent: false,
    mutedConversations: [],
    blockedUsers: [],
    personalInfo: {
        fullName: '',
        dateOfBirth: '',
        address: ''
    },
    billingInfo: {
        address: '',
        city: '',
        postalCode: '',
        country: ''
    },
    lastSeen: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    rank: 'IRON',
    globalPercentile: null,
    registeredAt: new Date(now.getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    achievements: [],
    referralCode: 'NEWBIE789',
};

export const anotherFanUser: AuthUser & { password?: string } = {
    id: 101, email: 'fan2@test.com', password: 'password', username: 'SuperFan99', role: UserRole.Fan, avatarUrl: 'https://picsum.photos/seed/fan2/40/40',
    subscriptions: [{ creatorId: 1, expiresAt: new Date(now.getTime() + 25 * 24 * 60 * 60 * 1000).toISOString(), subscribedSince: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString() }],
    followingIds: [], unlockedPosts: [], unlockedMessages: [], viewedStories: [], bookmarkedPostIds: [2], savedCard: null, notifications: { newPosts: true, newComments: true, specialOffers: true }, userNotifications: [],
    isProfilePrivate: false, allowFindByEmail: true, sendReadReceipts: true, isAgeVerified: false, showSensitiveContent: false, mutedConversations: [], blockedUsers: [],
    personalInfo: { fullName: 'Jane F. Doe', dateOfBirth: '1992-03-21', address: '' },
    billingInfo: { address: '', city: '', postalCode: '', country: '' },
    lastSeen: new Date(now.getTime() - 15 * 60 * 1000).toISOString(),
    registeredAt: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    achievements: [],
    referralCode: 'SUPERFAN99',
};

export const anotherFanUser2: AuthUser & { password?: string } = {
    id: 102, email: 'fan3@test.com', password: 'password', username: 'ArtLover21', role: UserRole.Fan, avatarUrl: 'https://picsum.photos/seed/fan3/40/40',
    subscriptions: [
        { creatorId: 1, expiresAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(), subscribedSince: new Date(now.getTime() - 370 * 24 * 60 * 60 * 1000).toISOString() }, 
        { creatorId: 5, expiresAt: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(), subscribedSince: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString() }
    ],
    followingIds: [], unlockedPosts: [], unlockedMessages: [], viewedStories: [], bookmarkedPostIds: [], savedCard: { brand: 'Mastercard', last4: '1234' }, notifications: { newPosts: true, newComments: true, specialOffers: true }, userNotifications: [],
    isProfilePrivate: false, allowFindByEmail: true, sendReadReceipts: true, isAgeVerified: false, showSensitiveContent: false, mutedConversations: [], blockedUsers: [],
    personalInfo: { fullName: 'Sam Artman', dateOfBirth: '1988-11-01', address: '' },
    billingInfo: { address: '', city: '', postalCode: '', country: '' },
    lastSeen: 'online',
    registeredAt: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    achievements: [
        { achievementId: 'LOYAL_3_MONTHS', unlockedAt: new Date().toISOString() },
    ],
    referralCode: 'ARTLOVER21',
};

// --- START NEW ADMIN DATA ---
export const suspendedFan: AuthUser & { password?: string } = {
    id: 103, email: 'suspended@test.com', password: 'password', username: 'SuspendedFan', role: UserRole.Fan, avatarUrl: 'https://picsum.photos/seed/suspended/40/40',
    subscriptions: [], followingIds: [], unlockedPosts: [], unlockedMessages: [], viewedStories: [], bookmarkedPostIds: [], savedCard: null, notifications: { newPosts: true, newComments: true, specialOffers: true }, userNotifications: [],
    isProfilePrivate: false, allowFindByEmail: true, sendReadReceipts: true, isAgeVerified: true, showSensitiveContent: false, mutedConversations: [], blockedUsers: [],
    personalInfo: { fullName: 'Temp Ban', dateOfBirth: '1995-01-01', address: '' },
    billingInfo: { address: '', city: '', postalCode: '', country: '' },
    lastSeen: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    registeredAt: new Date(now.getTime() - 20 * 24 * 60 * 60 * 1000).toISOString(),
    suspendedUntil: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Suspended for 7 days
    achievements: [],
    referralCode: 'SUSPENDED1',
};

export const bannedCreator: AuthUser & { password?: string } = {
    id: 104, email: 'banned@test.com', password: 'password', username: 'BannedCreator', role: UserRole.Creator, creatorId: 99, avatarUrl: 'https://picsum.photos/seed/banned/40/40',
    subscriptions: [], followingIds: [], unlockedPosts: [], unlockedMessages: [], viewedStories: [], bookmarkedPostIds: [], savedCard: null, notifications: { newPosts: true, newComments: true, specialOffers: true }, userNotifications: [],
    isProfilePrivate: true, allowFindByEmail: false, sendReadReceipts: true, isAgeVerified: true, showSensitiveContent: false, mutedConversations: [], blockedUsers: [],
    personalInfo: { fullName: 'Perma Ban', dateOfBirth: '1991-01-01', address: '' },
    billingInfo: { address: '', city: '', postalCode: '', country: '' },
    lastSeen: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    registeredAt: new Date(now.getTime() - 50 * 24 * 60 * 60 * 1000).toISOString(),
    suspendedUntil: new Date('9999-12-31').toISOString(), // Banned
    achievements: [],
    referralCode: 'BANNED4EVR',
};
initialCreators.push({ id: 99, username: 'BannedCreator', displayName: 'Banned Creator', avatarUrl: 'https://picsum.photos/seed/banned/200/200', bannerUrl: '', bio: 'This creator was banned.', location: '', socialLinks: [], monthlyPrice: 0, subscriptionPackages: [], stats: { posts: 0, subscribers: '0' }, payoutInfo: { iban: '', swiftBic: '', bankName: '' }, lastSeen: '', rank: 'IRON', globalPercentile: null, creatorScore: 0, mainCategory: mockCategories[0], subCategories: [] });

export const pendingVerificationFan: AuthUser & { password?: string } = {
    id: 105, email: 'pendingfan@test.com', password: 'password', username: 'PendingFan', role: UserRole.Fan, avatarUrl: 'https://picsum.photos/seed/pendingfan/40/40',
    subscriptions: [], followingIds: [], unlockedPosts: [], unlockedMessages: [], viewedStories: [], bookmarkedPostIds: [], savedCard: null, notifications: { newPosts: true, newComments: true, specialOffers: true }, userNotifications: [],
    isProfilePrivate: false, allowFindByEmail: true, sendReadReceipts: true, isAgeVerified: false, showSensitiveContent: false, mutedConversations: [], blockedUsers: [],
    personalInfo: { fullName: 'Pending Fan', dateOfBirth: '1998-01-01', address: '' },
    billingInfo: { address: '', city: '', postalCode: '', country: '' },
    lastSeen: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
    registeredAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    achievements: [],
    referralCode: 'PENDINGFAN',
};

export const pendingVerificationCreator: AuthUser & { password?: string } = {
    id: 106, email: 'pendingcreator@test.com', password: 'password', username: 'PendingCreator', role: UserRole.Creator, avatarUrl: 'https://picsum.photos/seed/pendingcreator/40/40',
    subscriptions: [], followingIds: [], unlockedPosts: [], unlockedMessages: [], viewedStories: [], bookmarkedPostIds: [], savedCard: null, notifications: { newPosts: true, newComments: true, specialOffers: true }, userNotifications: [],
    isProfilePrivate: false, allowFindByEmail: true, sendReadReceipts: true, isAgeVerified: false, showSensitiveContent: false, mutedConversations: [], blockedUsers: [],
    personalInfo: { fullName: 'Pending Creator', dateOfBirth: '1993-01-01', address: '' },
    billingInfo: { address: '', city: '', postalCode: '', country: '' },
    lastSeen: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    registeredAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    achievements: [],
    referralCode: 'PENDINGCREATE',
};

export const mockVerificationSubmissions: VerificationSubmission[] = [
    { id: 1001, userId: 105, username: 'PendingFan', avatarUrl: 'https://picsum.photos/seed/pendingfan/40/40', reason: 'fan_nsfw', idImageUrl: 'https://picsum.photos/seed/id1/400/250', selfieImageUrl: 'https://picsum.photos/seed/selfie1/400/400', timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString() },
    { id: 1002, userId: 106, username: 'PendingCreator', avatarUrl: 'https://picsum.photos/seed/pendingcreator/40/40', reason: 'creator_onboarding', idImageUrl: 'https://picsum.photos/seed/id2/400/250', selfieImageUrl: 'https://picsum.photos/seed/selfie2/400/400', timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString() },
    { id: 1003, userId: 101, username: 'SuperFan99', avatarUrl: 'https://picsum.photos/seed/fan2/40/40', reason: 'fan_nsfw', idImageUrl: 'https://picsum.photos/seed/id3/400/250', selfieImageUrl: 'https://picsum.photos/seed/selfie3/400/400', timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString() }
];

let generatedTransactions: Transaction[] = [];
for (let i = 0; i < 30; i++) { // Last 30 days
    const transactionsPerDay = Math.floor(Math.random() * 15) + 5;
    for (let j = 0; j < transactionsPerDay; j++) {
        const creator = initialCreators[Math.floor(Math.random() * initialCreators.length)];
        const amount = parseFloat(((Math.random() * 20) + 5).toFixed(2));
        generatedTransactions.push({
            id: Date.now() + i * 100 + j,
            type: TransactionType.Subscription,
            amount,
            platformFee: amount * 0.1,
            creatorPayout: amount * 0.9,
            fanId: 1, // Simplified for charts
            creatorId: creator.id,
            timestamp: new Date(now.getTime() - i * 24 * 60 * 60 * 1000).toISOString(),
            description: '1-Month Subscription'
        });
    }
}
// --- END NEW ADMIN DATA ---


export const adminUser: AuthUser & { password?: string } = {
  id: 999,
  email: 'admin@test.com',
  password: 'password',
  username: 'AdminUser',
  role: UserRole.Admin,
  avatarUrl: 'https://picsum.photos/seed/admin/40/40',
  subscriptions: [],
  followingIds: [],
  unlockedPosts: [],
  unlockedMessages: [],
  viewedStories: [],
  bookmarkedPostIds: [],
  savedCard: null,
  notifications: { newPosts: true, newComments: true, specialOffers: true },
  userNotifications: [],
  isProfilePrivate: true,
  allowFindByEmail: false,
  sendReadReceipts: true,
  isAgeVerified: true,
  showSensitiveContent: true,
  mutedConversations: [],
  blockedUsers: [],
  personalInfo: {
    fullName: 'Admin',
    dateOfBirth: '1980-01-01',
    address: '123 Server Rack, Silicon Valley'
  },
  billingInfo: {
    address: '',
    city: '',
    postalCode: '',
    country: ''
  },
  lastSeen: 'online',
  registeredAt: new Date(now.getTime() - 1000 * 24 * 60 * 60 * 1000).toISOString(),
  achievements: [],
  referralCode: 'ADMINREF',
};


export let mockFreeTrialLinks: FreeTrialLink[] = [
    {
        id: 'trial-1',
        creatorId: 1,
        code: 'AURORA_VIP_TRIAL',
        usesLeft: 18,
        expiresAt: new Date(new Date().getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: true,
    },
    {
        id: 'trial-2',
        creatorId: 1,
        code: 'FRIENDOFLEO',
        usesLeft: 'unlimited',
        expiresAt: null,
        isActive: true,
    },
    {
        id: 'trial-3',
        creatorId: 1,
        code: 'EXPIREDLINK',
        usesLeft: 0,
        expiresAt: new Date(new Date().getTime() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        isActive: false,
    }
];

export let mockStories: Story[] = [
    {
        creatorId: 1, // Aurora
        items: [
            { id: 1001, media: { type: 'image', url: 'https://picsum.photos/id/10/1080/1920' }, timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), isNsfw: false },
            { id: 1002, media: { type: 'image', url: 'https://picsum.photos/id/11/1080/1920' }, timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(), isNsfw: false },
            { id: 1003, media: { type: 'image', url: 'https://picsum.photos/id/12/1080/1920' }, timestamp: new Date(now.getTime() - 1 * 30 * 60 * 1000).toISOString(), isNsfw: true },
        ]
    },
    {
        creatorId: 2, // Leo Fitness
        items: [
            { id: 2001, media: { type: 'image', url: 'https://picsum.photos/id/20/1080/1920' }, timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), isNsfw: false },
        ]
    },
    {
        creatorId: 4, // Pixel Pilot
        items: [
            // This story is expired and should not be shown
            { id: 4001, media: { type: 'image', url: 'https://picsum.photos/id/40/1080/1920' }, timestamp: new Date(now.getTime() - 25 * 60 * 60 * 1000).toISOString(), isNsfw: false },
        ]
    }
];

export let mockTransactions: Transaction[] = [
    ...generatedTransactions,
    { id: 1, type: TransactionType.Subscription, amount: 9.99, platformFee: 0.50, creatorPayout: 9.49, fanId: 1, creatorId: 1, timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(), description: '1-Month Subscription' },
    { id: 2, type: TransactionType.Tip, amount: 5.00, platformFee: 0.40, creatorPayout: 4.60, fanId: 1, creatorId: 2, timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(), description: 'Tip in DMs' },
    { id: 3, type: TransactionType.PPV, amount: 15.00, platformFee: 0.75, creatorPayout: 14.25, fanId: 101, creatorId: 1, timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(), description: 'PPV Post #3' },
    { id: 4, type: TransactionType.Subscription, amount: 39.99, platformFee: 3.20, creatorPayout: 36.79, fanId: 102, creatorId: 2, timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(), description: '3-Month Subscription' },
];

export let mockReports: Report[] = [
    {
        id: 1,
        reporterId: 1, // MyFan
        targetType: 'post',
        targetId: 9, // Pixel Pilot's post
        reason: 'Spam or misleading',
        timestamp: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
    },
    {
        id: 2,
        reporterId: 101, // SuperFan99
        targetType: 'post',
        targetId: 13, // Wanderlust Quest's post
        reason: 'Inappropriate content',
        timestamp: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
    },
    {
        id: 3,
        reporterId: 102,
        targetType: 'post',
        targetId: 1,
        reason: 'Copyright infringement',
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
    }
];

export let mockAnnouncements: Announcement[] = [
    {
        id: 1,
        title: 'Platform Maintenance Scheduled',
        content: 'Topics will be undergoing scheduled maintenance tonight from 2 AM to 3 AM EST. The platform may be temporarily unavailable.',
        target: 'all',
        isActive: true,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        title: 'New Feature: Fan Lists!',
        content: 'You can now create custom fan lists to send targeted content and messages. Check it out in your dashboard!',
        target: 'CREATOR',
        isActive: false, // Inactive, won't show
        createdAt: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    }
];

export let mockAutoModQueue: AutoModQueueItem[] = [
    {
        id: 1,
        postId: 14, // Wanderlust Quest's subscriber post
        reason: 'Potential NSFW content in SFW category.',
        confidence: 0.88,
        timestamp: new Date(now.getTime() - 30 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        postId: 10, // Pixel Pilot's subscriber post
        reason: 'Detected potential spam link in content.',
        confidence: 0.95,
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 3,
        postId: 6,
        reason: 'Text analysis flagged potential hate speech.',
        confidence: 0.78,
        timestamp: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
    }
];

export let mockSupportTickets: SupportTicket[] = [
    {
        id: 1,
        userId: 1,
        username: 'MyFan',
        category: 'BILLING',
        subject: 'Question about my subscription',
        message: 'Hi, I was charged twice for my subscription to Aurora. Can you please check?',
        status: SupportTicketStatus.Open,
        timestamp: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 2,
        userId: 101,
        username: 'SuperFan99',
        category: 'TECHNICAL',
        subject: 'Video not loading',
        message: 'I can\'t seem to load any videos on the site today. My internet connection is fine.',
        status: SupportTicketStatus.InProgress,
        timestamp: new Date(now.getTime() - 8 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 3,
        email: 'guest@example.com',
        category: 'GENERAL',
        subject: 'Question about your platform',
        message: 'Is it possible for creators to offer physical goods through your service?',
        status: SupportTicketStatus.Closed,
        timestamp: new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 4,
        userId: 102,
        username: 'ArtLover21',
        category: 'ACCOUNT',
        subject: 'Cannot change my password',
        message: 'The password reset link seems to be broken. Can you help?',
        status: SupportTicketStatus.Open,
        timestamp: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
    }
];

export const categoryRelationsGraph: Record<string, string[]> = {
    // Arts & Creativity
    "art": ["illustration", "painting", "digital-art", "writing", "music", "lifestyle"],
    "writing": ["art", "education", "lifestyle"],
    "music": ["art", "dance-theater", "lifestyle", "comedy"],
    "dance-theater": ["music", "fitness", "lifestyle"],

    // Lifestyle & Wellness
    "fitness": ["nutrition", "workouts", "yoga", "food-cooking", "lifestyle"],
    "food-cooking": ["recipes", "travel", "lifestyle", "fitness"],
    "travel": ["vlogs", "guides", "lifestyle", "food-cooking"],
    "lifestyle": ["fashion", "home-decor", "travel", "fitness", "food-cooking"],

    // Entertainment
    "gaming": ["streaming", "esports", "comedy", "education"],
    "comedy": ["sketches", "stand-up", "gaming", "music"],
    
    // Niche & Other
    "education": ["tutorials", "documentaries", "writing", "gaming"],
    "asmr": ["lifestyle"],
    
    // Cross-pollination
    "digital-art": ["gaming", "art"],
    "illustration": ["writing", "art"],
    "workouts": ["fitness", "nutrition"],
    "nutrition": ["fitness", "food-cooking"],
    "recipes": ["food-cooking", "lifestyle"],
    "streaming": ["gaming", "comedy"],
    "vlogs": ["travel", "lifestyle"],
};