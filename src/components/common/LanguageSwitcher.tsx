import { useTranslation } from '@/contexts/translation.context';
import { LANGUAGE_NAMES, SupportedLanguage } from '@/utils/locale.util';
import React from 'react';
interface LanguageSwitcherProps {
  className?: string;
}

/**
 * A component that allows users to switch between supported languages
 */
const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({ className = '' }) => {
  const { language, setLanguage } = useTranslation();

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as SupportedLanguage);
  };

  return (
    <div className={`language-switcher ${className}`}>
      <select
        value={language}
        onChange={handleChange}
        className="px-3 py-2 border rounded bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-700"
        aria-label="Select language"
      >
        {Object.entries(LANGUAGE_NAMES).map(([code, name]) => (
          <option key={code} value={code}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LanguageSwitcher;
