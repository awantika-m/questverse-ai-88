import { Response } from 'express';
import { Arena } from '../models/arena';
import { User } from '../models/user';
import { Guild } from '../models/guild';
import { asyncHandler } from '../middleware/async';
import { AppError } from '../utils/api-response';
import { AuthRequest } from '../middleware/auth';

// @desc    Join arena battle lobby
// @route   POST /api/arena/join
// @access  Private
export const joinArena = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { type = 'solo', team = 'A' } = req.body;

  // Find an available arena or create a new one
  let arena = await Arena.findOne({
    type,
    status: 'waiting',
    'participants.id': { $ne: req.user.id },
  });

  if (!arena) {
    // Create new arena
    arena = await Arena.create({
      type,
      maxParticipants: type === 'solo' ? 2 : 6,
      participants: [{
        type: 'user',
        id: req.user.id,
        team,
        ready: false,
      }],
    });
  } else {
    // Join existing arena
    const balancedTeam = arena.participants.reduce((acc, p) => ({
      A: acc.A + (p.team === 'A' ? 1 : 0),
      B: acc.B + (p.team === 'B' ? 1 : 0),
    }), { A: 0, B: 0 });

    const assignedTeam = balancedTeam.A <= balancedTeam.B ? 'A' : 'B';

    arena.participants.push({
      type: 'user',
      id: req.user.id,
      team: assignedTeam,
      ready: false,
    });

    // Check if arena is full
    if (arena.participants.length === arena.maxParticipants) {
      arena.status = 'in-progress';
      arena.startTime = new Date();
    }

    await arena.save();
  }

  await arena.populate('participants.id', 'name avatar level');

  res.status(201).json({
    success: true,
    data: arena,
  });
});

// @desc    Mark ready in arena
// @route   POST /api/arena/:arena_id/ready
// @access  Private
export const setReady = asyncHandler(async (req: AuthRequest, res: Response) => {
  const arena = await Arena.findById(req.params.arena_id);
  if (!arena) {
    throw new AppError('Arena not found', 404);
  }

  const participant = arena.participants.find(p => 
    p.type === 'user' && p.id.toString() === req.user.id
  );

  if (!participant) {
    throw new AppError('You are not in this arena', 400);
  }

  participant.ready = true;

  // Check if all participants are ready
  const allReady = arena.participants.every(p => p.ready);
  if (allReady) {
    arena.status = 'in-progress';
    arena.startTime = new Date();
  }

  await arena.save();
  await arena.populate('participants.id', 'name avatar level');

  res.json({
    success: true,
    data: arena,
  });
});

// @desc    Update arena score
// @route   POST /api/arena/:arena_id/score
// @access  Private
export const updateScore = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { points, team } = req.body;

  const arena = await Arena.findById(req.params.arena_id);
  if (!arena) {
    throw new AppError('Arena not found', 404);
  }

  if (arena.status !== 'in-progress') {
    throw new AppError('Arena is not in progress', 400);
  }

  // Verify user is in this arena
  const participant = arena.participants.find(p => 
    p.type === 'user' && p.id.toString() === req.user.id
  );

  if (!participant) {
    throw new AppError('You are not in this arena', 400);
  }

  // Update score
  if (team === 'A') {
    arena.scores.teamA += points;
  } else {
    arena.scores.teamB += points;
  }

  // Check win conditions
  if (arena.rules?.scoreLimit) {
    if (arena.scores.teamA >= arena.rules.scoreLimit) {
      arena.status = 'completed';
      arena.winner = 'A';
      arena.endTime = new Date();
    } else if (arena.scores.teamB >= arena.rules.scoreLimit) {
      arena.status = 'completed';
      arena.winner = 'B';
      arena.endTime = new Date();
    }
  }

  await arena.save();

  res.json({
    success: true,
    data: arena,
  });
});