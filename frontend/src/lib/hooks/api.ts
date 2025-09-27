import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { User } from '@/types/user';

// Auth APIs
export const useLogin = () => {
  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const response = await api.post('/auth/login', credentials);
      localStorage.setItem('token', response.data.token);
      return response.data;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (userData: {
      name: string;
      email: string;
      password: string;
      role?: 'student' | 'faculty' | 'admin' | 'moderator';
    }) => {
      const response = await api.post('/auth/register', userData);
      localStorage.setItem('token', response.data.data.token);
      return response.data.data;
    },
  });
};

// User APIs
export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['currentUser'],
    queryFn: async () => {
      const response = await api.get('/users/me');
      return response.data;
    },
  });
};

// Quest APIs
export const useQuests = () => {
  return useQuery({
    queryKey: ['quests'],
    queryFn: async () => {
      const response = await api.get('/quests');
      return response.data;
    },
  });
};

export const useQuestById = (questId: string) => {
  return useQuery({
    queryKey: ['quests', questId],
    queryFn: async () => {
      const response = await api.get(`/quests/${questId}`);
      return response.data;
    },
    enabled: !!questId,
  });
};

export const useCreateQuest = () => {
  return useMutation({
    mutationFn: async (questData: any) => {
      const response = await api.post('/quests', questData);
      return response.data;
    },
  });
};

// Location APIs
export const useLocations = () => {
  return useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const response = await api.get('/locations');
      return response.data;
    },
  });
};

// Guild APIs
export const useGuilds = () => {
  return useQuery({
    queryKey: ['guilds'],
    queryFn: async () => {
      const response = await api.get('/guilds');
      return response.data;
    },
  });
};

export const useCreateGuild = () => {
  return useMutation({
    mutationFn: async (guildData: any) => {
      const response = await api.post('/guilds', guildData);
      return response.data;
    },
  });
};

// Arena APIs
export const useArenaMatches = () => {
  return useQuery({
    queryKey: ['arena', 'matches'],
    queryFn: async () => {
      const response = await api.get('/arena/matches');
      return response.data;
    },
  });
};

// Achievement APIs
export const useAchievements = () => {
  return useQuery({
    queryKey: ['achievements'],
    queryFn: async () => {
      const response = await api.get('/achievements');
      return response.data;
    },
  });
};