import { Response } from 'express';
import { Guild } from '../models/guild';
import { User } from '../models/user';
import { asyncHandler } from '../middleware/async';
import { AppError } from '../utils/api-response';
import { AuthRequest } from '../middleware/auth';

// @desc    List all guilds
// @route   GET /api/guilds
// @access  Private
export const listGuilds = asyncHandler(async (req: AuthRequest, res: Response) => {
  const guilds = await Guild.find()
    .populate('leader', 'name avatar level')
    .select('name description level experience members isOpen');

  res.status(200).json({
    success: true,
    data: guilds,
  });
});

// @desc    Create a new guild
// @route   POST /api/guilds
// @access  Private
export const createGuild = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    name,
    description,
    emblem,
    requirements,
    isOpen,
  } = req.body;

  // Check if user is already in a guild
  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  if (user.guild) {
    throw new AppError('You are already in a guild', 400);
  }

  // Create guild
  const guild = await Guild.create({
    name,
    description,
    leader: req.user.id,
    officers: [],
    members: [req.user.id],
    emblem,
    requirements,
    isOpen,
  });

  // Update user's guild
  user.guild = guild._id;
  await user.save();

  res.status(201).json({
    success: true,
    data: guild,
  });
});

// @desc    Get guild details
// @route   GET /api/guilds/:guild_id
// @access  Private
export const getGuildDetails = asyncHandler(async (req: AuthRequest, res: Response) => {
  const guild = await Guild.findById(req.params.guild_id)
    .populate('leader', 'name avatar')
    .populate('officers', 'name avatar')
    .populate('members', 'name avatar level');

  if (!guild) {
    throw new AppError('Guild not found', 404);
  }

  res.json({
    success: true,
    data: guild,
  });
});

// @desc    Join a guild
// @route   POST /api/guilds/:guild_id/join
// @access  Private
export const joinGuild = asyncHandler(async (req: AuthRequest, res: Response) => {
  const guild = await Guild.findById(req.params.guild_id);
  if (!guild) {
    throw new AppError('Guild not found', 404);
  }

  const user = await User.findById(req.user.id);
  if (!user) {
    throw new AppError('User not found', 404);
  }

  // Check if user is already in a guild
  if (user.guild) {
    throw new AppError('You are already in a guild', 400);
  }

  // Check if guild is open
  if (!guild.isOpen) {
    throw new AppError('This guild is not accepting new members', 400);
  }

  // Check requirements
  if (guild.requirements) {
    if (guild.requirements.level && user.level < guild.requirements.level) {
      throw new AppError('You do not meet the level requirement for this guild', 400);
    }

    if (guild.requirements.achievements) {
      const missingAchievements = guild.requirements.achievements.filter(
        achievement => !user.achievements.includes(achievement)
      );
      if (missingAchievements.length > 0) {
        throw new AppError('You do not have all required achievements', 400);
      }
    }
  }

  // Add user to guild
  guild.members.push(req.user.id);
  user.guild = guild._id;

  await Promise.all([
    guild.save(),
    user.save(),
  ]);

  res.json({
    success: true,
    message: 'Successfully joined guild',
    data: guild,
  });
});