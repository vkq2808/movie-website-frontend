import { Language } from '@/types/api.types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type LanguageState = {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
};


export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: { id: '', iso_639_1: 'vi', name: 'Vietnamese' },
      setLanguage: (language) => set({ currentLanguage: language }),
    }),
    {
      name: 'language-store',
    }
  )
);
