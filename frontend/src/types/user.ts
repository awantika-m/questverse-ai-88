export interface User {
  id: string;
  username: string;
  email: string;
  role: 'student' | 'faculty' | 'admin';
  avatar?: string;
  level: number;
  xp: number;
  createdAt: string;
  updatedAt: string;
}