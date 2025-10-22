import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import prisma from '../lib/db'

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/health', (_, res) => res.json({ ok: true }))

app.get('/api/posts', async (_req, res) => {
  const posts = await prisma.post.findMany({
    include: { creator: { include: { user: true } }, author: true },
    orderBy: { timestamp: 'desc' },
    take: 100
  })
  res.json(posts)
})

app.post('/api/like', async (req, res) => {
  const { userId, postId } = req.body
  if (!userId || !postId) return res.status(400).json({ error: 'Missing userId or postId' })
  const existing = await prisma.like.findUnique({ where: { userId_postId: { userId, postId } } })
  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } })
    await prisma.post.update({ where: { id: postId }, data: { likeCount: { decrement: 1 } } })
    return res.json({ liked: false })
  }
  await prisma.like.create({ data: { userId, postId } })
  await prisma.post.update({ where: { id: postId }, data: { likeCount: { increment: 1 } } })
  return res.json({ liked: true })
})

app.post('/api/comment', async (req, res) => {
  const { userId, postId, text } = req.body
  if (!userId || !postId || !text) return res.status(400).json({ error: 'Missing fields' })
  const comment = await prisma.comment.create({ data: { userId, postId, text } })
  await prisma.post.update({ where: { id: postId }, data: { commentCount: { increment: 1 } } })
  res.json(comment)
})

app.post('/api/follow', async (req, res) => {
  const { followerUserId, followingCreatorId } = req.body
  if (!followerUserId || !followingCreatorId) return res.status(400).json({ error: 'Missing fields' })
  const existing = await prisma.follow.findUnique({ where: { followerId_followingId: { followerId: followerUserId, followingId: followingCreatorId } } })
  if (existing) {
    await prisma.follow.delete({ where: { id: existing.id } })
    return res.json({ following: false })
  }
  await prisma.follow.create({ data: { followerId: followerUserId, followingId: followingCreatorId } })
  res.json({ following: true })
})

const PORT = process.env.API_PORT || 5174
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})
