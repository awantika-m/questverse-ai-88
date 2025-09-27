import { Response } from 'express';
import { Location } from '../models/location';
import { LocationInteraction } from '../models/location-interaction';
import { asyncHandler } from '../middleware/async';
import { AppError } from '../utils/api-response';
import { AuthRequest } from '../middleware/auth';

// @desc    Get all AR-enabled locations
// @route   GET /api/locations
// @access  Private
export const getLocations = asyncHandler(async (req: AuthRequest, res: Response) => {
  const { latitude, longitude, radius = 1000 } = req.query; // radius in meters
  
  let query: any = { isActive: true };
  
  // If coordinates provided, find locations within radius
  if (latitude && longitude) {
    query = {
      ...query,
      'coordinates.latitude': {
        $gte: Number(latitude) - (radius / 111320), // Convert meters to degrees
        $lte: Number(latitude) + (radius / 111320),
      },
      'coordinates.longitude': {
        $gte: Number(longitude) - (radius / (111320 * Math.cos(Number(latitude) * (Math.PI / 180)))),
        $lte: Number(longitude) + (radius / (111320 * Math.cos(Number(latitude) * (Math.PI / 180)))),
      },
    };
  }

  const locations = await Location.find(query)
    .select('-arExperience.modelUrl -arExperience.textures -arExperience.animations');

  res.json({
    success: true,
    data: locations,
  });
});

// @desc    Get specific location's AR experience metadata
// @route   GET /api/locations/:location_id/experience
// @access  Private
export const getLocationExperience = asyncHandler(async (req: AuthRequest, res: Response) => {
  const location = await Location.findById(req.params.location_id);

  if (!location) {
    throw new AppError('Location not found', 404);
  }

  // Check access requirements
  if (location.accessRequirements) {
    const { level, roles } = location.accessRequirements;
    
    if (level && req.user.level < level) {
      throw new AppError('Insufficient level to access this location', 403);
    }
    
    if (roles && roles.length > 0 && !roles.includes(req.user.role)) {
      throw new AppError('Unauthorized role for this location', 403);
    }
  }

  // Create view interaction
  await LocationInteraction.create({
    user: req.user.id,
    location: location._id,
    type: 'view',
  });

  res.json({
    success: true,
    data: {
      id: location._id,
      name: location.name,
      type: location.type,
      arExperience: location.arExperience,
      coordinates: location.coordinates,
    },
  });
});

// @desc    Log user interaction with AR object
// @route   POST /api/locations/:location_id/interact
// @access  Private
export const logInteraction = asyncHandler(async (req: AuthRequest, res: Response) => {
  const {
    type = 'interact',
    duration,
    details,
    coordinates,
  } = req.body;

  const location = await Location.findById(req.params.location_id);
  if (!location) {
    throw new AppError('Location not found', 404);
  }

  const interaction = await LocationInteraction.create({
    user: req.user.id,
    location: location._id,
    type,
    duration,
    details,
    coordinates,
  });

  // If this interaction is part of a quest, update quest progress here
  if (details?.questId) {
    // Quest progress update logic would go here
  }

  res.json({
    success: true,
    data: interaction,
    message: 'Interaction logged successfully',
  });
});