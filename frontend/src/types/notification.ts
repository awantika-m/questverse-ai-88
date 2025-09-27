export interface Notification {
  id: string;
  type: 'quest' | 'battle' | 'guild' | 'achievement' | 'friend' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
  metadata?: Record<string, any>;
}