import mongoose, { Document, Schema } from 'mongoose';

export interface ILocation extends Document {
  name: string;
  description: string;
  type: 'building' | 'outdoor' | 'room' | 'poi';
  coordinates: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  arExperience: {
    type: 'object' | 'portal' | 'overlay' | 'game';
    modelUrl?: string;
    textures?: string[];
    animations?: {
      name: string;
      url: string;
    }[];
    interactionType: 'view' | 'tap' | 'gesture' | 'proximity';
    triggers?: {
      type: 'distance' | 'time' | 'quest';
      value: string | number;
    }[];
  };
  accessRequirements?: {
    level?: number;
    quests?: string[];
    roles?: string[];
  };
  isActive: boolean;
}

const locationSchema = new Schema<ILocation>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['building', 'outdoor', 'room', 'poi'],
    required: true,
  },
  coordinates: {
    latitude: {
      type: Number,
      required: true,
    },
    longitude: {
      type: Number,
      required: true,
    },
    altitude: Number,
  },
  arExperience: {
    type: {
      type: String,
      enum: ['object', 'portal', 'overlay', 'game'],
      required: true,
    },
    modelUrl: String,
    textures: [String],
    animations: [{
      name: String,
      url: String,
    }],
    interactionType: {
      type: String,
      enum: ['view', 'tap', 'gesture', 'proximity'],
      required: true,
    },
    triggers: [{
      type: {
        type: String,
        enum: ['distance', 'time', 'quest'],
      },
      value: Schema.Types.Mixed,
    }],
  },
  accessRequirements: {
    level: Number,
    quests: [String],
    roles: [String],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Add geospatial index for efficient location queries
locationSchema.index({ 'coordinates.longitude': 1, 'coordinates.latitude': 1 });

export const Location = mongoose.model<ILocation>('Location', locationSchema);