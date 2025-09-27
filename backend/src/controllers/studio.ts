import { Response } from 'express';
import { Quest } from '../models/quest';
import { QuestProgress } from '../models/quest-progress';
import { asyncHandler } from '../middleware/async';
import { AppError } from '../utils/api-response';
import { AuthRequest } from '../middleware/auth';

// @desc    Create custom quest
// @route   POST /api/studio/quests
// @access  Private (Faculty Only)
export const createCustomQuest = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Verify faculty role
  if (req.user.role !== 'faculty') {
    throw new AppError('Not authorized to access faculty studio', 403);
  }

  const {
    title,
    description,
    type,
    difficulty,
    location,
    requirements,
    rewards,
    objectives,
  } = req.body;

  const quest = await Quest.create({
    title,
    description,
    type,
    difficulty,
    creator: req.user.id,
    location,
    requirements,
    rewards,
    objectives,
    aiGenerated: false,
  });

  res.status(201).json({
    success: true,
    data: quest,
  });
});

// @desc    Edit quest
// @route   PUT /api/studio/quests/:quest_id
// @access  Private (Faculty Only)
export const editQuest = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Verify faculty role
  if (req.user.role !== 'faculty') {
    throw new AppError('Not authorized to access faculty studio', 403);
  }

  const quest = await Quest.findById(req.params.quest_id);
  if (!quest) {
    throw new AppError('Quest not found', 404);
  }

  // Verify ownership
  if (quest.creator.toString() !== req.user.id) {
    throw new AppError('Not authorized to edit this quest', 403);
  }

  const {
    title,
    description,
    type,
    difficulty,
    location,
    requirements,
    rewards,
    objectives,
    isActive,
  } = req.body;

  // Update fields
  if (title) quest.title = title;
  if (description) quest.description = description;
  if (type) quest.type = type;
  if (difficulty) quest.difficulty = difficulty;
  if (location) quest.location = location;
  if (requirements) quest.requirements = requirements;
  if (rewards) quest.rewards = rewards;
  if (objectives) quest.objectives = objectives;
  if (typeof isActive === 'boolean') quest.isActive = isActive;

  await quest.save();

  res.json({
    success: true,
    data: quest,
  });
});

// @desc    Get quest analytics
// @route   GET /api/studio/analytics
// @access  Private (Faculty Only)
export const getAnalytics = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Verify faculty role
  if (req.user.role !== 'faculty') {
    throw new AppError('Not authorized to access faculty studio', 403);
  }

  const { startDate, endDate } = req.query;
  const dateQuery: any = {};

  if (startDate) {
    dateQuery.createdAt = { $gte: new Date(startDate as string) };
  }
  if (endDate) {
    dateQuery.createdAt = { ...dateQuery.createdAt, $lte: new Date(endDate as string) };
  }

  // Get quests created by faculty
  const facultyQuests = await Quest.find({
    creator: req.user.id,
    ...dateQuery,
  });

  // Get quest progress stats
  const questIds = facultyQuests.map(q => q._id);
  const progress = await QuestProgress.find({
    quest: { $in: questIds },
    ...dateQuery,
  });

  // Calculate analytics
  const analytics = {
    totalQuests: facultyQuests.length,
    activeQuests: facultyQuests.filter(q => q.isActive).length,
    questStats: questIds.map(questId => {
      const questProgress = progress.filter(p => p.quest.toString() === questId.toString());
      return {
        questId,
        totalAttempts: questProgress.length,
        completions: questProgress.filter(p => p.status === 'completed').length,
        abandonedRate: questProgress.filter(p => p.status === 'abandoned').length / questProgress.length,
      };
    }),
    engagement: {
      totalParticipants: new Set(progress.map(p => p.user.toString())).size,
      averageCompletionTime: progress
        .filter(p => p.status === 'completed' && p.completedAt)
        .reduce((acc, p) => {
          const duration = p.completedAt!.getTime() - p.startedAt.getTime();
          return acc + duration;
        }, 0) / progress.filter(p => p.status === 'completed').length,
    },
  };

  res.json({
    success: true,
    data: analytics,
  });
});