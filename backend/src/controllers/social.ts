import { Response } from 'express';
import { Post } from '../models/post';
import { asyncHandler } from '../middleware/async';
import { AppError } from '../utils/api-response';
import { AuthRequest } from '../middleware/auth';

// @desc    Create a new post
// @route   POST /api/social/posts
// @access  Private
export const createPost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { content, type, media, metadata, tags, visibility } = req.body;

  const post = await Post.create({
    author: req.user.id,
    content,
    type,
    media,
    metadata,
    tags,
    visibility: visibility || 'public',
    likes: [],
    comments: [],
  });

  await post.populate('author', 'name avatar');

  res.status(201).json({
    success: true,
    data: post,
  });
});

// @desc    Get social feed
// @route   GET /api/social/feed
// @access  Private
export const getFeed = asyncHandler(async (req: AuthRequest, res: Response) => {
  const posts = await Post.find({
    $or: [
      { visibility: 'public' },
      { author: req.user.id },
      {
        visibility: 'guild',
        'metadata.guild': req.user.guild,
      },
    ],
  })
    .populate('author', 'name avatar')
    .populate('metadata.quest', 'title description')
    .populate('metadata.guild', 'name')
    .sort({ createdAt: -1 })
    .limit(20);

  res.status(200).json({
    success: true,
    data: posts,
  });
});

// @desc    Like a post
// @route   POST /api/social/posts/:post_id/like
// @access  Private
export const likePost = asyncHandler(async (req: AuthRequest, res: Response) => {
  const post = await Post.findById(req.params.post_id);

  if (!post) {
    throw new AppError('Post not found', 404);
  }

  // Check if user already liked the post
  if (post.likes.includes(req.user.id)) {
    // Unlike
    post.likes = post.likes.filter(
      (id) => id.toString() !== req.user.id.toString()
    );
  } else {
    // Like
    post.likes.push(req.user.id);
  }

  await post.save();

  res.status(200).json({
    success: true,
    data: post,
  });
});

// @desc    Comment on a post
// @route   POST /api/social/posts/:post_id/comment
// @access  Private
export const commentOnPost = asyncHandler(async (req: AuthRequest, res: Response) => {
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

  res.status(200).json({
    success: true,
    data: post,
  });
});