import { Post, User, Creator, PostType, UserRole, Category } from '../types'
import { Post as DBPost, Creator as DBCreator, User as DBUser, PostType as DBPostType, UserRole as DBUserRole } from '@prisma/client'

type DBPostWithRelations = DBPost & {
  creator: DBCreator & { user: DBUser }
  author: DBUser
}

type DBCreatorWithUser = DBCreator & {
  user: DBUser
}

// Helper para crear categoria mock desde string
function createCategoryFromString(categoryStr: string | null): Category | undefined {
  if (!categoryStr) return undefined
  return {
    id: categoryStr,
    name: categoryStr.charAt(0).toUpperCase() + categoryStr.slice(1),
    slug: categoryStr,
    children: []
  }
}

// Convertir User de BD a tipo de la app
export function adaptUser(dbUser: DBUser): User {
  return {
    id: dbUser.id,
    email: dbUser.email,
    username: dbUser.username,
    role: dbUser.role as UserRole,
    avatarUrl: dbUser.avatarUrl || '',
    showSensitiveContent: dbUser.showSensitiveContent,
    creatorId: dbUser.creatorId || undefined,
    suspendedUntil: dbUser.suspendedUntil?.toISOString()
  }
}

// Convertir Creator de BD a tipo de la app
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
    subCategories: [], // Por ahora vacío, luego añadiremos tabla de relaciones
    monthlyPrice: dbCreator.monthlyPrice,
    isVerified: dbCreator.isVerified,
    followerCount: dbCreator.followerCount
  }
}

// Convertir Post de BD a tipo de la app
export function adaptPost(dbPost: DBPostWithRelations): Post {
  // Parsear mediaJson
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
    ppvPrice: undefined, // Por implementar
    timestamp: dbPost.timestamp.toISOString(),
    scheduledAt: dbPost.scheduledAt?.toISOString(),
    type: dbPost.type as PostType,
    media,
    creator: adaptCreator(dbPost.creator as DBCreatorWithUser),
    likedBy: [], // Por implementar cuando añadamos tabla de likes
    comments: [] // Por implementar cuando añadamos tabla de comments
  }
}