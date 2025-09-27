import { Response } from 'express';
import { Achievement } from '../models/achievement';
import { User } from '../models/user';
import { asyncHandler } from '../middleware/async';
import { AppError } from '../utils/api-response';
import { AuthRequest } from '../middleware/auth';

// Mock blockchain interaction - Replace with actual blockchain integration
const mintNFTBadge = async (achievement: any, userId: string) => {
  // Simulate blockchain minting
  const tokenId = Math.floor(Math.random() * 1000000).toString();
  return {
    tokenId,
    transactionHash: '0x' + Math.random().toString(36).substring(2),
  };
};

// @desc    Get user achievements
// @route   GET /api/achievements
// @access  Private
export const getAchievements = asyncHandler(async (req: AuthRequest, res: Response) => {
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Get all achievements and mark which ones the user has
  const achievements = await Achievement.find();
  const userAchievements = achievements.map(achievement => ({
    ...achievement.toObject(),
    earned: user.achievements.includes(achievement.id),
  }));

  res.json({
    success: true,
    data: userAchievements,
  });
});

// @desc    Claim achievement reward
// @route   POST /api/achievements/:achievement_id/claim
// @access  Private
export const claimAchievement = asyncHandler(async (req: AuthRequest, res: Response) => {
  const achievement = await Achievement.findOne({ id: req.params.achievement_id });
  if (!achievement) {
    throw new AppError('Achievement not found', 404);
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if already claimed
  if (user.achievements.includes(achievement.id)) {
    throw new AppError('Achievement already claimed', 400);
  }

  // Verify requirements
  for (const requirement of achievement.requirements) {
    switch (requirement.type) {
      case 'level':
        if (user.level < requirement.target) {
          throw new AppError('Level requirement not met', 400);
        }
        break;
      case 'quest':
        // Quest completion verification would go here
        break;
      case 'location':
        // Location visit verification would go here
        break;
      // Add other requirement type verifications
    }
  }

  // If this is a blockchain badge, mint it
  let badgeData;
  if (achievement.isOnChain && achievement.rewards.badge) {
    try {
      badgeData = await mintNFTBadge(achievement, user.id);
      achievement.chainTokenId = badgeData.tokenId;
      await achievement.save();
    } catch (error) {
      throw new AppError('Failed to mint blockchain badge', 500);
    }
  }

  // Award achievement
  user.achievements.push(achievement.id);
  user.experience += achievement.rewards.experience;

  // Check for level up
  const newLevel = Math.floor(user.experience / 1000) + 1;
  if (newLevel > user.level) {
    user.level = newLevel;
  }

  await user.save();

  res.json({
    success: true,
    data: {
      achievement,
      badgeData,
      newExperience: user.experience,
      newLevel: user.level,
    },
    message: 'Achievement claimed successfully',
  });
});

// @desc    Get global leaderboard
// @route   GET /api/leaderboard
// @access  Private
export const getLeaderboard = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type = 'experience', limit = 10 } = req.query;
  
  let sortCriteria: any = {};
  
  switch (type) {
    case 'experience':
      sortCriteria = { experience: -1 };
      break;
    case 'achievements':
      sortCriteria = { achievements: -1 };
      break;
    case 'guild':
      // Special handling for guild leaderboard
      const guildLeaderboard = await User.aggregate([
        { $match: { guild: { $exists: true } } },
        {
          $group: {
            _id: '$guild',
            totalExperience: { $sum: '$experience' },
            memberCount: { $sum: 1 },
            achievements: { $push: '$achievements' },
          },
        },
        { $sort: { totalExperience: -1 } },
        { $limit: Number(limit) },
      ]);

      return res.json({
        success: true,
        data: guildLeaderboard,
      });
  }

  const leaderboard = await User.find()
    .select('name avatar level experience achievements guild')
    .sort(sortCriteria)
    .limit(Number(limit));

  res.json({
    success: true,
    data: leaderboard,
  });
});