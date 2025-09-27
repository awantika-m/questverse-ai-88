import mongoose, { Document, Schema } from 'mongoose';

export interface IArena extends Document {
  type: 'solo' | 'team' | 'guild';
  status: 'waiting' | 'in-progress' | 'completed';
  participants: {
    type: 'user' | 'guild';
    id: Schema.Types.ObjectId;
    team: 'A' | 'B';
    ready: boolean;
  }[];
  maxParticipants: number;
  rules: {
    timeLimit?: number;
    scoreLimit?: number;
    objectives?: string[];
  };
  scores: {
    teamA: number;
    teamB: number;
  };
  winner?: 'A' | 'B' | 'draw';
  startTime?: Date;
  endTime?: Date;
  location?: Schema.Types.ObjectId;
}

const arenaSchema = new Schema<IArena>({
  type: {
    type: String,
    enum: ['solo', 'team', 'guild'],
    required: true,
  },
  status: {
    type: String,
    enum: ['waiting', 'in-progress', 'completed'],
    default: 'waiting',
  },
  participants: [{
    type: {
      type: String,
      enum: ['user', 'guild'],
      required: true,
    },
    id: {
      type: Schema.Types.ObjectId,
      refPath: 'participants.type',
      required: true,
    },
    team: {
      type: String,
      enum: ['A', 'B'],
      required: true,
    },
    ready: {
      type: Boolean,
      default: false,
    },
  }],
  maxParticipants: {
    type: Number,
    required: true,
  },
  rules: {
    timeLimit: Number,
    scoreLimit: Number,
    objectives: [String],
  },
  scores: {
    teamA: {
      type: Number,
      default: 0,
    },
    teamB: {
      type: Number,
      default: 0,
    },
  },
  winner: {
    type: String,
    enum: ['A', 'B', 'draw'],
  },
  startTime: Date,
  endTime: Date,
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
  },
}, {
  timestamps: true,
});

// Add indexes for efficient querying
arenaSchema.index({ status: 1, type: 1 });
arenaSchema.index({ 'participants.id': 1, status: 1 });

export const Arena = mongoose.model<IArena>('Arena', arenaSchema);