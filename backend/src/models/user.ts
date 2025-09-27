import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  role: 'student' | 'faculty' | 'admin' | 'moderator';
  avatar?: string;
  campus?: string;
  level: number;
  experience: number;
  achievements: Schema.Types.ObjectId[];
  guild?: Schema.Types.ObjectId;
  stats: {
    questsCompleted: number;
    achievementsEarned: number;
    battlesWon: number;
    experienceGained: number;
  };
  socialProfile: {
    posts: Schema.Types.ObjectId[];
    followers: Schema.Types.ObjectId[];
    following: Schema.Types.ObjectId[];
  };
  moderationStatus: {
    isBanned: boolean;
    banReason?: string;
    warnings: number;
    reportsFiled: number;
  };
  adminPrivileges?: {
    canManageUsers: boolean;
    canManageQuests: boolean;
    canManageGuilds: boolean;
    canModerate: boolean;
    canConfigureRewards: boolean;
    accessLevel: number;
  };
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAuthToken(): string;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 },
  name: { type: String, required: true, trim: true },
  role: { type: String, enum: ['student', 'faculty', 'admin', 'moderator'], default: 'student' },
  avatar: { type: String },
  campus: { type: String },
  level: { type: Number, default: 1 },
  experience: { type: Number, default: 0 },
  achievements: [{ type: Schema.Types.ObjectId, ref: 'Achievement' }],
  guild: { type: Schema.Types.ObjectId, ref: 'Guild' },
  stats: {
    questsCompleted: { type: Number, default: 0 },
    achievementsEarned: { type: Number, default: 0 },
    battlesWon: { type: Number, default: 0 },
    experienceGained: { type: Number, default: 0 }
  },
  socialProfile: {
    posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    following: [{ type: Schema.Types.ObjectId, ref: 'User' }]
  },
  moderationStatus: {
    isBanned: { type: Boolean, default: false },
    banReason: String,
    warnings: { type: Number, default: 0 },
    reportsFiled: { type: Number, default: 0 }
  },
  adminPrivileges: {
    canManageUsers: { type: Boolean, default: false },
    canManageQuests: { type: Boolean, default: false },
    canManageGuilds: { type: Boolean, default: false },
    canModerate: { type: Boolean, default: false },
    canConfigureRewards: { type: Boolean, default: false },
    accessLevel: { type: Number, default: 0 }
  }
});

// Password hashing middleware
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (err) {
    next(err as Error);
  }
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

// Generate JWT token
userSchema.methods.generateAuthToken = function(): string {
  return jwt.sign(
    { id: this._id, email: this.email, role: this.role },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '24h' }
  );
};

export const User = mongoose.model<IUser>('User', userSchema);