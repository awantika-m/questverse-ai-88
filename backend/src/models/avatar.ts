import mongoose, { Document, Schema } from 'mongoose';

export interface IAvatar extends Document {
  user: Schema.Types.ObjectId;
  style: {
    body: string;
    hair: string;
    eyes: string;
    outfit: string;
    accessories: string[];
  };
  customization: {
    colors: {
      skin: string;
      hair: string;
      eyes: string;
      outfit: string[];
    };
    scale: {
      height: number;
      build: number;
    };
  };
  equipment: {
    head?: string;
    body?: string;
    hands?: string;
    feet?: string;
    accessories: string[];
  };
  animations: {
    idle: string;
    walk: string;
    run: string;
    emotes: {
      name: string;
      animation: string;
    }[];
  };
  voiceModel?: string;
  lastExpression?: {
    type: string;
    timestamp: Date;
  };
}

const avatarSchema = new Schema<IAvatar>({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  style: {
    body: {
      type: String,
      required: true,
    },
    hair: {
      type: String,
      required: true,
    },
    eyes: {
      type: String,
      required: true,
    },
    outfit: {
      type: String,
      required: true,
    },
    accessories: [String],
  },
  customization: {
    colors: {
      skin: {
        type: String,
        required: true,
      },
      hair: {
        type: String,
        required: true,
      },
      eyes: {
        type: String,
        required: true,
      },
      outfit: [String],
    },
    scale: {
      height: {
        type: Number,
        default: 1,
        min: 0.8,
        max: 1.2,
      },
      build: {
        type: Number,
        default: 1,
        min: 0.8,
        max: 1.2,
      },
    },
  },
  equipment: {
    head: String,
    body: String,
    hands: String,
    feet: String,
    accessories: [String],
  },
  animations: {
    idle: {
      type: String,
      required: true,
    },
    walk: {
      type: String,
      required: true,
    },
    run: {
      type: String,
      required: true,
    },
    emotes: [{
      name: String,
      animation: String,
    }],
  },
  voiceModel: String,
  lastExpression: {
    type: {
      type: String,
      enum: ['happy', 'sad', 'excited', 'thinking', 'confused', 'neutral'],
    },
    timestamp: Date,
  },
}, {
  timestamps: true,
});

export const Avatar = mongoose.model<IAvatar>('Avatar', avatarSchema);