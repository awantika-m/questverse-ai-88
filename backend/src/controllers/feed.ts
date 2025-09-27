import { Response } from 'express';
import { Post } from '../models/post';
import { Guild } from '../models/guild';
import { User } from '../models/user';
import { asyncHandler } from '../middleware/async';
import { AppError } from '../utils/api-response';
import { AuthRequest } from '../middleware/auth';

// @desc    Get social feed
// @route   GET /api/feed
// @access  Private
export const getFeed = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type, guildOnly } = req.query;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  const query: any = {};

  // Filter by type if specified
  if (type) {
    query.type = type;
  }

  // Filter by visibility and guild membership
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (guildOnly === 'true' && user.guild) {
    query.$or = [
      { visibility: 'public' },
      { visibility: 'guild', 'metadata.guild': user.guild },
    ];
  } else {
    query.visibility = 'public';
  }

  const posts = await Post.find(query)
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('author', 'name avatar')
    .populate('metadata.quest', 'title')
    .populate('metadata.location', 'name')
    .populate('metadata.guild', 'name');

  const total = await Post.countDocuments(query);

  res.json({
    success: true,
    data: {
      posts,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    },
  });
});

// @desc    Create a post
// @route   POST /api/feed
// @access  Private
export const createPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    content,
    type,
    media,
    metadata,
    tags,
    visibility,
  } = req.body;

  const post = await Post.create({
    author: req.user.id,
    content,
    type,
    media,
    metadata,
    tags,
    visibility,
  });

  await post.populate('author', 'name avatar');

  res.status(201).json({
    success: true,
    data: post,
  });
});

// @desc    Like/unlike a post
// @route   POST /api/feed/:post_id/like
// @access  Private
export const toggleLike = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await Post.findById(req.params.post_id);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  const likeIndex = post.likes.indexOf(req.user.id);
  if (likeIndex === -1) {
    post.likes.push(req.user.id);
  } else {
    post.likes.splice(likeIndex, 1);
  }

  await post.save();

  res.json({
    success: true,
    data: {
      likes: post.likes.length,
      liked: likeIndex === -1,
    },
  });
});

// @desc    Comment on a post
// @route   POST /api/feed/:post_id/comment
// @access  Private
export const addComment = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { content } = req.body;

  const post = await Post.findById(req.params.post_id);
  if (!post) {
    throw new AppError('Post not found', 404);
  }

  post.comments.push({
    author: req.user.id,
    content,
    createdAt: new Date(),
  });

  await post.save();
  await post.populate('comments.author', 'name avatar');

  res.status(201).json({
    success: true,
    data: post.comments[post.comments.length - 1],
  });
});