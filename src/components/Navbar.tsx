import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { AJMCLogo } from './AJMCLogo.tsx';
import { LanguageSelector } from './LanguageSelector.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, onSelectTab }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, isRTL } = useLanguage();

  const navLinks = [
    { id: 'accueil', label: t('nav_home') },
    { id: 'a-propos', label: t('nav_about') },
    { id: 'activites', label: t('nav_activities') },
    { id: 'actualites', label: t('nav_news') },
    { id: 'projets', label: t('nav_projects') },
    { id: 'mediatheque', label: t('nav_media') },
    { id: 'contact', label: t('nav_contact') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-2">
          {/* Logo officiel A.J.M.C */}
          <button
            onClick={() => {
              onSelectTab('accueil');
              setMobileMenuOpen(false);
            }}
            className="group flex items-center transition-opacity hover:opacity-90 cursor-pointer min-w-0 shrink"
          >
            <AJMCLogo />
          </button>

          {/* Navigation desktop principale (7 rubriques associatives) */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-sm font-medium text-stone-700 shrink-0">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectTab(link.id)}
                  className={`relative py-1.5 transition-colors hover:text-[#0F5132] cursor-pointer whitespace-nowrap ${
                    isActive ? 'text-[#0F5132] font-bold' : 'text-stone-600'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0F5132] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Actions : Sélecteur de langue bilingue (FR | العربية) & CTA & Hamburger */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            <LanguageSelector />

            <button
              onClick={() => onSelectTab('contact')}
              className="hidden sm:inline-flex px-3.5 sm:px-4 py-2 text-xs font-bold text-white bg-[#0F5132] hover:bg-[#16A34A] rounded-xl shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              {t('nav_cta_join')}
            </button>

            {/* Menu Hamburger mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 sm:p-2 text-stone-700 hover:text-stone-900 rounded-lg focus:outline-none cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu mobile responsive */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-xl animate-fade-in max-h-[85vh] overflow-y-auto">
          <div className="pb-3 mb-2 border-b border-stone-100 flex items-center justify-between">
            <span className="text-xs font-bold text-stone-600">
              {isRTL ? 'اختر لغة الموقع :' : 'Langue du site :'}
            </span>
            <LanguageSelector />
          </div>

          <div className="space-y-1">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => {
                    onSelectTab(link.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-base font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-emerald-50 text-[#0F5132] font-bold border-s-4 border-[#0F5132]'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && <span className="w-2 h-2 rounded-full bg-[#0F5132]" />}
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-stone-200">
            <button
              onClick={() => {
                onSelectTab('contact');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3.5 text-center text-sm font-bold text-white bg-[#0F5132] rounded-xl hover:bg-[#16A34A] transition-colors shadow-sm"
            >
              {t('nav_cta_join')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
