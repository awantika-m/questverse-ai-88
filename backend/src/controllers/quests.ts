import { Request, Response } from 'express';
import { Quest } from '../models/quest';
import { QuestProgress } from '../models/quest-progress';
import { User } from '../models/user';
import { asyncHandler } from '../middleware/async';
import { AppError } from '../utils/api-response';
import { AuthRequest } from '../middleware/auth';

// @desc    Create a new quest
// @route   POST /api/quests
// @access  Private
export const createQuest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    title,
    description,
    type,
    difficulty,
    objectives,
    rewards,
    requirements,
    location,
    startDate,
    endDate,
  } = req.body;

  // Check user role
  const user = await User.findById(req.user.id);
  if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
    throw new AppError('Only faculty and admin can create quests', 403);
  }

  // Create quest
  const quest = await Quest.create({
    title,
    description,
    type,
    difficulty,
    objectives,
    rewards,
    requirements,
    location,
    startDate,
    endDate,
    creator: req.user.id,
    isActive: true,
    aiGenerated: false,
  });

  res.status(201).json({
    success: true,
    data: quest,
  });
});

// @desc    Get all available quests (filtered by location/time)
// @route   GET /api/quests
// @access  Private
export const getQuests = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { location, type, difficulty } = req.query;
  const query: any = { isActive: true };

  if (location) query.location = location;
  if (type) query.type = type;
  if (difficulty) query.difficulty = difficulty;

  // Add time-based filtering
  const now = new Date();
  query.$or = [
    { startDate: { $exists: false } },
    {
      $and: [
        { startDate: { $lte: now } },
        { endDate: { $gte: now } },
      ],
    },
  ];

  const quests = await Quest.find(query)
    .populate('location', 'name coordinates')
    .populate('creator', 'name role');

  res.json({
    success: true,
    data: quests,
  });
});

// @desc    Get specific quest details
// @route   GET /api/quests/:quest_id
// @access  Private
export const getQuestDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
  const quest = await Quest.findById(req.params.quest_id)
    .populate('location', 'name coordinates description')
    .populate('creator', 'name role');

  if (!quest) {
    throw new AppError('Quest not found', 404);
  }

  res.json({
    success: true,
    data: quest,
  });
});

// @desc    Start a quest
// @route   POST /api/quests/:quest_id/start
// @access  Private
export const startQuest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const quest = await Quest.findById(req.params.quest_id);
  if (!quest) {
    throw new AppError('Quest not found', 404);
  }

  // Check if user already has an active instance of this quest
  const existingProgress = await QuestProgress.findOne({
    user: req.user.id,
    quest: quest._id,
    status: 'active',
  });

  if (existingProgress) {
    throw new AppError('You already have this quest active', 400);
  }

  // Check quest requirements
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (quest.requirements?.level && user.level < quest.requirements.level) {
    throw new AppError('You do not meet the level requirement for this quest', 400);
  }

  // Create quest progress
  const questProgress = await QuestProgress.create({
    user: req.user.id,
    quest: quest._id,
    progress: quest.objectives.map((_, index) => ({
      objectiveIndex: index,
      quantity: 0,
      completed: false,
    })),
  });

  res.json({
    success: true,
    data: questProgress,
    message: 'Quest started successfully',
  });
});

// @desc    Complete a quest
// @route   POST /api/quests/:quest_id/complete
// @access  Private
export const completeQuest = asyncHandler(async (req: AuthRequest, res: Response) => {
  const questProgress = await QuestProgress.findOne({
    user: req.user.id,
    quest: req.params.quest_id,
    status: 'active',
  }).populate('quest');

  if (!questProgress) {
    throw new AppError('Active quest progress not found', 404);
  }

  // Check if all objectives are completed
  const allObjectivesCompleted = questProgress.progress.every(p => p.completed);
  if (!allObjectivesCompleted) {
    throw new AppError('Not all quest objectives are completed', 400);
  }

  // Update user's experience and rewards
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  const quest = questProgress.quest as any;
  user.experience += quest.rewards.experience;

  // Level up logic (example: every 1000 exp)
  const newLevel = Math.floor(user.experience / 1000) + 1;
  if (newLevel > user.level) {
    user.level = newLevel;
  }

  // Update quest progress
  questProgress.status = 'completed';
  questProgress.completedAt = new Date();
  questProgress.earnedRewards = true;

  await Promise.all([
    user.save(),
    questProgress.save(),
  ]);

  res.json({
    success: true,
    data: {
      questProgress,
      rewards: quest.rewards,
      newExperience: user.experience,
      newLevel: user.level,
    },
    message: 'Quest completed successfully',
  });
});

// @desc    Generate a dynamic quest using AI
// @route   POST /api/quests/generate
// @access  Private
export const generateQuest = asyncHandler(async (req: AuthRequest, res: Response) => {
  // Here you would integrate with an AI service to generate quest content
  // For now, we'll create a simple exploration quest
  
  const quest = await Quest.create({
    title: 'Generated Quest',
    description: 'This is an AI-generated quest',
    type: 'exploration',
    difficulty: 'medium',
    creator: req.user.id,
    rewards: {
      experience: 100,
    },
    objectives: [{
      description: 'Explore a new location',
      type: 'visit',
      quantity: 1,
    }],
    aiGenerated: true,
    isActive: true,
  });

  res.json({
    success: true,
    data: quest,
    message: 'Quest generated successfully',
  });
});