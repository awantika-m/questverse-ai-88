import mongoose, { Document, Schema } from 'mongoose';

export interface IGuild extends Document {
  name: string;
  description: string;
  leader: Schema.Types.ObjectId;
  officers: Schema.Types.ObjectId[];
  members: Schema.Types.ObjectId[];
  level: number;
  experience: number;
  emblem?: {
    image: string;
    colors: string[];
  };
  achievements: string[];
  stats: {
    questsCompleted: number;
    battlesWon: number;
    totalExperience: number;
  };
  requirements?: {
    level: number;
    achievements: string[];
  };
  isOpen: boolean;
}

const guildSchema = new Schema<IGuild>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  leader: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  officers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  members: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  level: {
    type: Number,
    default: 1,
  },
  experience: {
    type: Number,
    default: 0,
  },
  emblem: {
    image: String,
    colors: [String],
  },
  achievements: [String],
  stats: {
    questsCompleted: {
      type: Number,
      default: 0,
    },
    battlesWon: {
      type: Number,
      default: 0,
    },
    totalExperience: {
      type: Number,
      default: 0,
    },
  },
  requirements: {
    level: Number,
    achievements: [String],
  },
  isOpen: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Add indexes for efficient querying
guildSchema.index({ name: 1 });
guildSchema.index({ level: -1 });
guildSchema.index({ 'stats.totalExperience': -1 });

export const Guild = mongoose.model<IGuild>('Guild', guildSchema);