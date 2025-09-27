import { Response } from 'express';
import { Avatar } from '../models/avatar';
import { asyncHandler } from '../middleware/async';
import { AppError } from '../utils/api-response';
import { AuthRequest } from '../middleware/auth';

// @desc    Get user's avatar
// @route   GET /api/avatars/me
// @access  Private
export const getMyAvatar = asyncHandler(async (req: AuthRequest, res: Response) => {
  const avatar = await Avatar.findOne({ user: req.user.id });

  if (!avatar) {
    // Create default avatar if none exists
    const defaultAvatar = await Avatar.create({
      user: req.user.id,
      style: {
        body: 'default',
        hair: 'default',
        eyes: 'default',
        outfit: 'default',
        accessories: [],
      },
      customization: {
        colors: {
          skin: '#F5D0C5',
          hair: '#4A4A4A',
          eyes: '#6B4F4F',
          outfit: ['#2E5090'],
        },
        scale: {
          height: 1,
          build: 1,
        },
      },
      equipment: {
        accessories: [],
      },
      animations: {
        idle: 'default_idle',
        walk: 'default_walk',
        run: 'default_run',
        emotes: [
          { name: 'wave', animation: 'default_wave' },
          { name: 'dance', animation: 'default_dance' },
        ],
      },
    });

    return res.status(201).json({
      success: true,
      data: defaultAvatar,
    });
  }

  res.json({
    success: true,
    data: avatar,
  });
});

// @desc    Update avatar customization
// @route   PUT /api/avatars/me
// @access  Private
export const updateAvatar = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { style, customization, equipment } = req.body;

  const avatar = await Avatar.findOne({ user: req.user.id });
  if (!avatar) {
    throw new AppError('Avatar not found', 404);
  }

  // Update only provided fields
  if (style) avatar.style = { ...avatar.style, ...style };
  if (customization) avatar.customization = { ...avatar.customization, ...customization };
  if (equipment) avatar.equipment = { ...avatar.equipment, ...equipment };

  await avatar.save();

  res.json({
    success: true,
    data: avatar,
    message: 'Avatar updated successfully',
  });
});

// @desc    Trigger avatar expression/animation
// @route   POST /api/avatars/me/express
// @access  Private
export const expressEmotion = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type, animation } = req.body;

  const avatar = await Avatar.findOne({ user: req.user.id });
  if (!avatar) {
    throw new AppError('Avatar not found', 404);
  }

  // Update last expression
  avatar.lastExpression = {
    type,
    timestamp: new Date(),
  };

  // Add new emote if provided and doesn't exist
  if (animation) {
    const existingEmote = avatar.animations.emotes.find(e => e.name === type);
    if (!existingEmote) {
      avatar.animations.emotes.push({
        name: type,
        animation,
      });
    }
  }

  await avatar.save();

  res.json({
    success: true,
    data: {
      expression: avatar.lastExpression,
      emotes: avatar.animations.emotes,
    },
    message: 'Expression triggered successfully',
  });
});