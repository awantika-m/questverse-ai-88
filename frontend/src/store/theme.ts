import { create } from 'zustand';

interface ThemeState {
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: {
    primary: '#6366F1', // Indigo for primary actions
    secondary: '#8B5CF6', // Purple for secondary elements
    accent: '#F59E0B', // Amber for accents/highlights
    background: '#F3F4F6', // Light gray background
    text: '#1F2937', // Dark gray text
  },
}));