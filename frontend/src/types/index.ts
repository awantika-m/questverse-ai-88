export interface User {
  id: string;
  email: string;
  name: string;
  role: 'student' | 'faculty' | 'admin' | 'moderator';
  avatar: string;
  campus: string;
  level: number;
  experience: number;
  achievements: Achievement[];
  guild?: Guild;
  stats: {
    questsCompleted: number;
    achievementsEarned: number;
    battlesWon: number;
    experienceGained: number;
  };
  adminPrivileges?: AdminPrivileges;
}

export interface Quest {
  id: string;
  title: string;
  description: string;
  type: 'solo' | 'group' | 'boss';
  difficulty: 'easy' | 'medium' | 'hard';
  rewards: {
    experience: number;
    achievements?: Achievement[];
    items?: Item[];
  };
  requirements: {
    level: number;
    items?: Item[];
    quests?: string[];
  };
  location?: Location;
  progress?: {
    status: 'not-started' | 'in-progress' | 'completed';
    currentStep: number;
    totalSteps: number;
  };
}

export interface Location {
  id: string;
  name: string;
  description: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  type: 'quest' | 'shop' | 'arena' | 'guild';
  arExperience?: {
    type: 'model' | 'game' | 'puzzle';
    content: string;
  };
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  image: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  requirements: {
    type: string;
    value: number;
  };
  rewards: {
    experience: number;
    items?: Item[];
  };
}

export interface Guild {
  id: string;
  name: string;
  description: string;
  level: number;
  members: User[];
  achievements: Achievement[];
  quests: Quest[];
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: 'consumable' | 'equipment' | 'cosmetic';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  effects?: {
    type: string;
    value: number;
  }[];
}

export interface Post {
  id: string;
  author: User;
  content: string;
  media?: string;
  likes: number;
  comments: Comment[];
  createdAt: string;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  createdAt: string;
}

export interface AdminPrivileges {
  canManageUsers: boolean;
  canManageQuests: boolean;
  canManageGuilds: boolean;
  canModerate: boolean;
  canConfigureRewards: boolean;
  accessLevel: number;
}

export interface SystemMetrics {
  users: {
    total: number;
    new: number;
    byRole: { [key: string]: number };
  };
  quests: {
    active: number;
    completed: number;
    completionRate: number;
  };
  engagement: {
    averageLevel: number;
    postsPerUser: number;
    activeUsers: number;
  };
  moderation: {
    openReports: number;
    resolvedReports: number;
  };
}