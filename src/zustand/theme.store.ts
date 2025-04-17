import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () => {
        document.documentElement.classList.toggle('dark', !document.documentElement.classList.contains('dark'));
        document.documentElement.classList.toggle('light', !document.documentElement.classList.contains('light'));
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        }))
      },
    }),
    {
      name: 'theme-storage', // unique name
    }
  )
);
export default useThemeStore;