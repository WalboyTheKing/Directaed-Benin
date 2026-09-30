import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations, type Language, type Translations } from '../i18n/translations.ts';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: keyof Translations) => string;
  isRTL: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Arabe par défaut comme demandé formellement
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('directaid_language');
    if (saved === 'ar' || saved === 'fr' || saved === 'en') {
      return saved;
    }
    return 'ar'; // Défaut absolu: Arabe
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('directaid_language', lang);
  };

  const isRTL = language === 'ar';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr';
  }, [language, isRTL]);

  const t = (key: keyof Translations): string => {
    const currentDict = translations[language];
    if (currentDict && currentDict[key]) {
      return currentDict[key];
    }
    // Fallback vers l'arabe si clé manquante
    return translations.ar[key] || '';
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, isRTL }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
