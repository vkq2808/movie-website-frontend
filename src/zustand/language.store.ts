import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Language } from './types';

type LanguageState = {
  currentLanguage: Language;
  setLanguage: (language: Language) => void;
};

export const SUPPORTED_LANGUAGES = [
  { iso_639_1: 'en', name: 'English' },
  { iso_639_1: 'vi', name: 'Vietnamese' }
];

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      currentLanguage: SUPPORTED_LANGUAGES[1],
      setLanguage: (language) => set({ currentLanguage: language }),
    }),
    {
      name: 'language-store',
    }
  )
);
