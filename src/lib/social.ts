import prisma from '../lib/db'
import { Like, Comment, Follow } from '@prisma/client'

export async function toggleLike(userId: string, postId: string) {
  const existing = await prisma.like.findUnique({ where: { userId_postId: { userId, postId } } })
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
    await prisma.post.update({ where: { id: postId }, data: { likeCount: { decrement: 1 } } })
    return { liked: false }
  } else {
    await prisma.like.create({ data: { userId, postId } })
    await prisma.post.update({ where: { id: postId }, data: { likeCount: { increment: 1 } } })
    return { liked: true }
  }
}

export async function addPostComment(userId: string, postId: string, text: string) {
  const comment = await prisma.comment.create({ data: { userId, postId, text } })
  await prisma.post.update({ where: { id: postId }, data: { commentCount: { increment: 1 } } })
  return comment
}

export async function toggleFollow(followerUserId: string, followingCreatorId: string) {
  const existing = await prisma.follow.findUnique({ where: { followerId_followingId: { followerId: followerUserId, followingId: followingCreatorId } } })
  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } })
    return { following: false }
  } else {
    await prisma.follow.create({ data: { followerId: followerUserId, followingId: followingCreatorId } })
    return { following: true }
  }
}
