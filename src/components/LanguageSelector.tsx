import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import type { Language } from '../i18n/translations.ts';

export const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="inline-flex items-center bg-stone-100/90 hover:bg-stone-200/80 p-1 rounded-xl border border-stone-200/80 transition-colors">
      <div className="px-1.5 text-stone-500">
        <Globe className="w-3.5 h-3.5" />
      </div>
      <button
        onClick={() => setLanguage('fr')}
        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer ${
          language === 'fr'
            ? 'bg-[#0F5132] text-white shadow-xs'
            : 'text-stone-700 hover:text-stone-900'
        }`}
        title="Passer en Français"
      >
        FR
      </button>
      <span className="text-stone-300 text-xs px-0.5">|</span>
      <button
        onClick={() => setLanguage('ar')}
        className={`px-2.5 py-1 text-xs font-bold rounded-lg transition-all cursor-pointer font-cairo ${
          language === 'ar'
            ? 'bg-[#0F5132] text-white shadow-xs'
            : 'text-stone-700 hover:text-stone-900'
        }`}
        title="التحويل إلى العربية"
      >
        العربية
      </button>
    </div>
  );
};
