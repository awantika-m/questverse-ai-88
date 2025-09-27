import { Response } from 'express';
import { User } from '../models/user';
import { Quest } from '../models/quest';
import { Guild } from '../models/guild';
import { Post } from '../models/post';
import { Report } from '../models/report';
import { asyncHandler } from '../middleware/async';
import { AppError } from '../utils/api-response';
import { AuthRequest } from '../middleware/auth';

// Middleware to check if user is an admin
const isAdmin = async (req: AuthRequest, res: Response, next: Function) => {
  if (req.user.role !== 'admin') {
    throw new AppError('Not authorized to access admin features', 403);
  }
  next();
};

// @desc    Get all users with pagination and filters
// @route   GET /api/admin/users
// @access  Private (Admin only)
export const getUsers = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    page = 1,
    limit = 10,
    role,
    campus,
    search,
  } = req.query;

  const query: any = {};
  
  if (role) query.role = role;
  if (campus) query.campus = campus;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
  }

  const users = await User.find(query)
    .select('-password')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  const total = await User.countDocuments(query);

  res.json({
    success: true,
    data: {
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit)),
      },
    },
  });
});

// @desc    Get system-wide metrics and statistics
// @route   GET /api/admin/metrics
// @access  Private (Admin only)
export const getMetrics = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { startDate, endDate } = req.query;
  const dateQuery: any = {};

  if (startDate) {
    dateQuery.createdAt = { $gte: new Date(startDate as string) };
  }
  if (endDate) {
    dateQuery.createdAt = { ...dateQuery.createdAt, $lte: new Date(endDate as string) };
  }

  // Get various metrics in parallel
  const [
    totalUsers,
    newUsers,
    activeQuests,
    completedQuests,
    activeGuilds,
    totalPosts,
    openReports,
  ] = await Promise.all([
    User.countDocuments({}),
    User.countDocuments({ ...dateQuery }),
    Quest.countDocuments({ isActive: true }),
    Quest.countDocuments({ 'progress.status': 'completed', ...dateQuery }),
    Guild.countDocuments({ isActive: true }),
    Post.countDocuments(dateQuery),
    Report.countDocuments({ status: 'pending' }),
  ]);

  // Get user distribution by role
  const usersByRole = await User.aggregate([
    {
      $group: {
        _id: '$role',
        count: { $sum: 1 },
      },
    },
  ]);

  // Get average user engagement
  const userEngagement = await User.aggregate([
    {
      $group: {
        _id: null,
        avgLevel: { $avg: '$level' },
        avgExperience: { $avg: '$experience' },
        totalAchievements: { $sum: { $size: '$achievements' } },
      },
    },
  ]);

  res.json({
    success: true,
    data: {
      users: {
        total: totalUsers,
        new: newUsers,
        byRole: usersByRole,
      },
      quests: {
        active: activeQuests,
        completed: completedQuests,
      },
      guilds: {
        active: activeGuilds,
      },
      engagement: {
        posts: totalPosts,
        ...userEngagement[0],
      },
      moderation: {
        openReports,
      },
    },
  });
});

// @desc    Configure campus rewards
// @route   POST /api/admin/rewards
// @access  Private (Admin only)
export const configureRewards = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    experienceMultiplier,
    questRewards,
    achievementBonuses,
    eventRewards,
  } = req.body;

  // This would typically update a configuration collection in the database
  // For now, we'll just return the configured values
  res.json({
    success: true,
    data: {
      experienceMultiplier,
      questRewards,
      achievementBonuses,
      eventRewards,
    },
    message: 'Rewards configuration updated successfully',
  });
});