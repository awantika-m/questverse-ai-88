import mongoose, { Document, Schema } from 'mongoose';

export interface ILocationInteraction extends Document {
  user: Schema.Types.ObjectId;
  location: Schema.Types.ObjectId;
  type: 'view' | 'interact' | 'complete';
  duration?: number;
  details?: {
    action?: string;
    questId?: Schema.Types.ObjectId;
    achievement?: string;
  };
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

const locationInteractionSchema = new Schema<ILocationInteraction>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: Schema.Types.ObjectId,
    ref: 'Location',
    required: true,
  },
  type: {
    type: String,
    enum: ['view', 'interact', 'complete'],
    required: true,
  },
  duration: Number,
  details: {
    action: String,
    questId: {
      type: Schema.Types.ObjectId,
      ref: 'Quest',
    },
    achievement: String,
  },
  coordinates: {
    latitude: Number,
    longitude: Number,
  },
}, {
  timestamps: true,
});

// Add indexes for analytics queries
locationInteractionSchema.index({ location: 1, type: 1, createdAt: 1 });
locationInteractionSchema.index({ user: 1, createdAt: 1 });

export const LocationInteraction = mongoose.model<ILocationInteraction>('LocationInteraction', locationInteractionSchema);