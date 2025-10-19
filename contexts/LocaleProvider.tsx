
import React, { createContext, useContext, useState, ReactNode, useEffect, useCallback } from 'react';

type Language = 'en' | 'es';

interface LocaleContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, replacements?: { [key: string]: string | number }) => string;
  isLoading: boolean;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

// Helper function to get nested properties from an object
const getNested = (obj: any, path: string): string | undefined => {
  return path.split('.').reduce((acc, part) => acc && acc[part], obj);
};

export const LocaleProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<any>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTranslations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/locales/${language}.json`);
        if (!response.ok) {
          throw new Error(`Could not load ${language}.json`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error("Failed to load translations:", error);
        // Fallback to English if the selected language fails
        if (language !== 'en') {
            setLanguage('en');
        } else {
            setTranslations({});
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchTranslations();
  }, [language]);

  const setLanguageHandler = (lang: Language) => {
    setLanguage(lang);
  };

  const t = useCallback((key: string, replacements?: { [key: string]: string | number }): string => {
    let translation = getNested(translations, key);

    if (translation === undefined) {
      if (!isLoading) { // Only warn if not in a loading state
        console.warn(`Translation key "${key}" not found.`);
      }
      return key; // Return the key itself as a fallback
    }

    if (replacements) {
      Object.keys(replacements).forEach(placeholder => {
        const value = replacements[placeholder];
        translation = translation.replace(`\${{${placeholder}}}`, String(value));
      });
    }

    return translation;
  }, [translations, isLoading]);

  const value: LocaleContextType = {
    language,
    setLanguage: setLanguageHandler,
    t,
    isLoading,
  };

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
};

export const useLocale = (): LocaleContextType => {
  const context = useContext(LocaleContext);
  if (context === undefined) {
    throw new Error('useLocale must be used within a LocaleProvider');
  }
  return context;
};
