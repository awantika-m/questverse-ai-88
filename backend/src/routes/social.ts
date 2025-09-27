import express from 'express';
import { auth } from '../middleware/auth';
import { Post } from '../models/post';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Get feed
router.get('/feed', async (req: AuthRequest, res) => {
  try {
    const posts = await Post.find()
      .populate('author', 'name avatar')
      .sort('-createdAt')
      .limit(20);

    res.json({
      success: true,
      data: posts,
    });
  } catch (error) {
    console.error('Feed error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
});

// Create post
router.post('/posts', async (req: AuthRequest, res) => {
  try {
    const post = await Post.create({
      ...req.body,
      author: req.user.id,
    });

    await post.populate('author', 'name avatar');

    res.status(201).json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
});

// Like/unlike post
router.post('/posts/:postId/likes', async (req: AuthRequest, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    const likeIndex = post.likes.indexOf(req.user.id);
    if (likeIndex > -1) {
      // Unlike
      post.likes.splice(likeIndex, 1);
    } else {
      // Like
      post.likes.push(req.user.id);
    }

    await post.save();
    await post.populate('author', 'name avatar');

    res.json({
      success: true,
      data: post,
    });
  } catch (error) {
    console.error('Like/unlike error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
});

// Add comment
router.post('/posts/:postId/comments', async (req: AuthRequest, res) => {
  try {
    const { content } = req.body;
    if (!content) {
      return res.status(400).json({
        success: false,
        error: 'Comment content is required',
      });
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        error: 'Post not found',
      });
    }

    post.comments.push({
      author: req.user.id,
      content,
      createdAt: new Date()
    });

    await post.save();
    const updatedPost = await Post.findById(post._id)
      .populate('author', 'name avatar')
      .populate('comments.author', 'name avatar');

    res.status(201).json({
      success: true,
      data: updatedPost,
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error',
    });
  }
});

export default router;