import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { User, Quest, Location, Achievement, Guild, Post, SystemMetrics } from '../types';

// Auth hooks
export const useLogin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (credentials: { email: string; password: string }) =>
      api.post('/auth/login', credentials),
    onSuccess: (data) => {
      localStorage.setItem('token', data.token);
      queryClient.setQueryData(['user'], data.user);
    },
  });
};

interface RegisterData {
  email: string;
  password: string;
  name: string;
  role?: 'student' | 'faculty' | 'admin' | 'moderator';
}

export const useRegister = () => {
  return useMutation({
    mutationFn: (userData: RegisterData) =>
      api.post('/auth/register', userData),
  });
};

// User hooks
export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => api.get<User>('/users/me'),
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (userData: Partial<User>) => api.put('/users/me', userData),
    onSuccess: (data) => {
      queryClient.setQueryData(['user'], data);
    },
  });
};

// Quest hooks
export const useQuests = () => {
  return useQuery({
    queryKey: ['quests'],
    queryFn: () => api.get<Quest[]>('/quests'),
  });
};

export const useQuest = (questId: string) => {
  return useQuery({
    queryKey: ['quests', questId],
    queryFn: () => api.get<Quest>(`/quests/${questId}`),
    enabled: !!questId,
  });
};

export const useStartQuest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questId: string) => api.post(`/quests/${questId}/start`),
    onSuccess: () => {
      queryClient.invalidateQueries(['quests']);
      queryClient.invalidateQueries(['user']);
    },
  });
};

export const useCompleteQuest = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questId: string) => api.post(`/quests/${questId}/complete`),
    onSuccess: () => {
      queryClient.invalidateQueries(['quests']);
      queryClient.invalidateQueries(['user']);
    },
  });
};

// Location hooks
export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: () => api.get<Location[]>('/locations'),
  });
};

export const useLocation = (locationId: string) => {
  return useQuery({
    queryKey: ['locations', locationId],
    queryFn: () => api.get<Location>(`/locations/${locationId}`),
    enabled: !!locationId,
  });
};

// Achievement hooks
export const useAchievements = () => {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: () => api.get<Achievement[]>('/achievements'),
  });
};

export const useClaimAchievement = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (achievementId: string) =>
      api.post(`/achievements/${achievementId}/claim`),
    onSuccess: () => {
      queryClient.invalidateQueries(['achievements']);
      queryClient.invalidateQueries(['user']);
    },
  });
};

// Guild hooks
export const useGuilds = () => {
  return useQuery({
    queryKey: ['guilds'],
    queryFn: () => api.get<Guild[]>('/guilds'),
  });
};

export const useGuild = (guildId: string) => {
  return useQuery({
    queryKey: ['guilds', guildId],
    queryFn: () => api.get<Guild>(`/guilds/${guildId}`),
    enabled: !!guildId,
  });
};

export const useCreateGuild = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (guildData: { name: string; description: string }) =>
      api.post('/guilds', guildData),
    onSuccess: () => {
      queryClient.invalidateQueries(['guilds']);
    },
  });
};

// Feed hooks
export const useFeed = () => {
  return useQuery({
    queryKey: ['feed'],
    queryFn: () => api.get<Post[]>('/feed'),
  });
};

export const useCreatePost = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postData: { content: string; media?: string }) =>
      api.post('/feed', postData),
    onSuccess: () => {
      queryClient.invalidateQueries(['feed']);
    },
  });
};

// Admin hooks
export const useAdminMetrics = () => {
  return useQuery({
    queryKey: ['admin', 'metrics'],
    queryFn: () => api.get<SystemMetrics>('/admin/metrics'),
  });
};

export const useAdminUsers = () => {
  return useQuery({
    queryKey: ['admin', 'users'],
    queryFn: () => api.get<User[]>('/admin/users'),
  });
};