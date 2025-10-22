import { Post, User, Creator, PostType, UserRole, Category } from '../types'
import { Post as DBPost, Creator as DBCreator, User as DBUser } from '@prisma/client'

type DBPostWithRelations = DBPost & {
  creator: DBCreator & { user: DBUser }
  author: DBUser
}

type DBCreatorWithUser = DBCreator & {
  user: DBUser
}

function createCategoryFromString(categoryStr: string | null): Category | undefined {
  if (!categoryStr) return undefined
  return {
    id: categoryStr,
    name: categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1),
    slug: categoryStr,
    children: []
  }
}

export function adaptUser(dbUser: DBUser): User {
  return {
    id: dbUser.id,
    email: dbUser.email,
    username: dbUser.username,
    role: dbUser.role as unknown as UserRole,
    avatarUrl: dbUser.avatarUrl || '',
    showSensitiveContent: dbUser.showSensitiveContent,
    creatorId: dbUser.creatorId || undefined,
    suspendedUntil: dbUser.suspendedUntil?.toISOString()
  }
}

export function adaptCreator(dbCreator: DBCreatorWithUser): Creator {
  return {
    id: dbCreator.id,
    displayName: dbCreator.displayName,
    username: dbCreator.user.username,
    bio: dbCreator.bio || '',
    location: dbCreator.location || '',
    avatarUrl: dbCreator.avatarUrl || dbCreator.user.avatarUrl || '',
    coverUrl: dbCreator.coverUrl || '',
    mainCategory: createCategoryFromString(dbCreator.mainCategory),
    subCategories: [],
    monthlyPrice: dbCreator.monthlyPrice,
    isVerified: dbCreator.isVerified,
    followerCount: dbCreator.followerCount
  }
}

export function adaptPost(dbPost: DBPostWithRelations): Post {
  let media: any[] = []
  try {
    if (typeof dbPost.mediaJson === 'string') {
      media = JSON.parse(dbPost.mediaJson)
    } else if (Array.isArray(dbPost.mediaJson)) {
      media = dbPost.mediaJson
    }
  } catch {
    media = []
  }

  return {
    id: dbPost.id,
    text: dbPost.text || '',
    isNsfw: dbPost.isNsfw,
    ppvPrice: undefined,
    timestamp: dbPost.timestamp.toISOString(),
    scheduledAt: dbPost.scheduledAt?.toISOString(),
    type: dbPost.type as unknown as PostType,
    media,
    creator: adaptCreator(dbPost.creator as DBCreatorWithUser),
    likedBy: [],
    comments: []
  }
}
