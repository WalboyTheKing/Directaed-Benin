import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import type { Language } from '../i18n/translations.ts';

const LANGUAGES: { code: Language; label: string; subLabel: string; flag: string }[] = [
  { code: 'ar', label: 'العربية', subLabel: 'Arabic (افتراضي)', flag: '🇸🇦' },
  { code: 'fr', label: 'Français', subLabel: 'French (Bénin)', flag: '🇫🇷' },
  { code: 'en', label: 'English', subLabel: 'International', flag: '🇬🇧' },
];

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentLang = LANGUAGES.find((l) => l.code === language) || LANGUAGES[0];

  return (
    <div className="relative inline-block text-right" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200/90 cursor-pointer"
        aria-expanded={isOpen}
        aria-haspopup="true"
        title="تغيير لغة العرض / Changer la langue / Change language"
      >
        <Globe className="w-3.5 h-3.5 text-stone-600" />
        <span className="font-semibold">{currentLang.label}</span>
        <ChevronDown className={`w-3 h-3 text-stone-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 mt-1.5 w-44 rounded-xl bg-white shadow-xl border border-stone-200 py-1.5 text-xs overflow-hidden animate-fade-in ${
            isRTL ? 'right-0 origin-top-right' : 'left-0 origin-top-left'
          }`}
        >
          <div className="px-3 py-1.5 border-b border-stone-100 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            {language === 'ar' ? 'اختر اللغة' : language === 'fr' ? 'Choisir la langue' : 'Select Language'}
          </div>
          {LANGUAGES.map((item) => {
            const isSelected = item.code === language;
            return (
              <button
                key={item.code}
                onClick={() => {
                  setLanguage(item.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 text-right transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-50 text-[#16A34A] font-bold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{item.flag}</span>
                  <div>
                    <span className="block leading-tight">{item.label}</span>
                    <span className="block text-[10px] text-stone-400 font-normal">{item.subLabel}</span>
                  </div>
                </div>
                {isSelected && <Check className="w-3.5 h-3.5 text-[#16A34A] shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
