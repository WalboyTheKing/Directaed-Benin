import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { DirectAidLogo } from './DirectAidLogo.tsx';
import { LanguageSelector } from './LanguageSelector.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, isRTL } = useLanguage();

  const navLinks = [
    { id: 'accueil', label: t('nav_home') },
    { id: 'ecole', label: t('nav_school') },
    { id: 'activites', label: t('nav_activities') },
    { id: 'videos', label: t('nav_videos') },
    { id: 'galerie', label: t('nav_gallery') },
    { id: 'actualites', label: t('nav_news') },
    { id: 'contact', label: t('nav_contact') },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Zone 1: Logo officiel DirectAid Bénin */}
          <button
            onClick={() => {
              onSelectTab('accueil');
              setMobileMenuOpen(false);
            }}
            className={`group flex items-center gap-3 transition-opacity hover:opacity-90 cursor-pointer ${
              isRTL ? 'text-right' : 'text-left'
            }`}
          >
            <DirectAidLogo />
          </button>

          {/* Zone 2: Navigation publique propre */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-stone-700">
            {navLinks.map((link) => {
              const isActive = currentTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => onSelectTab(link.id)}
                  className={`relative py-1 transition-colors hover:text-[#16A34A] cursor-pointer ${
                    isActive ? 'text-[#16A34A] font-bold' : 'text-stone-600'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#16A34A] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Sélecteur de langue & Action Inscription */}
          <div className="flex items-center gap-3">
            {/* Sélecteur de langue propre (Arabe par défaut, Français, Anglais) */}
            <LanguageSelector />

            {/* Bouton d'inscription institutionnel */}
            <button
              onClick={() => onSelectTab('contact')}
              className="px-4 py-2 text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              {t('nav_enroll_btn')}
            </button>

            {/* Menu Hamburger Mobile */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900 rounded-md focus:outline-none cursor-pointer"
              aria-label="Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Menu Mobile */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <div className="pb-2 mb-2 border-b border-stone-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500">اللغة / Langue :</span>
            <LanguageSelector />
          </div>

          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onSelectTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-base font-medium transition-colors cursor-pointer ${
                  isRTL ? 'text-right' : 'text-left'
                } ${
                  isActive
                    ? 'bg-emerald-50 text-[#16A34A] font-bold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>{link.label}</span>
              </button>
            );
          })}

          <div className="pt-3 border-t border-stone-200">
            <button
              onClick={() => {
                onSelectTab('contact');
                setMobileMenuOpen(false);
              }}
              className="w-full py-3 text-center text-sm font-bold text-white bg-[#16A34A] rounded-lg hover:bg-[#15803D] transition-colors"
            >
              {t('nav_enroll_btn')}
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
