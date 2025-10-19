
import React from 'react';
import { useLocale } from '../contexts/LocaleProvider';
import { Icon } from './Icon';

export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage } = useLocale();

  return (
    <div className="relative">
      <Icon name="globe-alt" className="w-5 h-5 text-gray-500 dark:text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value as 'en' | 'es')}
        aria-label="Change language"
        className="bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-md py-1.5 pl-9 pr-4 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-gray-900 focus:ring-indigo-500 appearance-none"
      >
        <option value="en">English</option>
        <option value="es">Español</option>
      </select>
    </div>
  );
};