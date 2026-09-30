import React, { useState } from 'react';
import { Video as VideoIcon, RefreshCw, Menu, X } from 'lucide-react';
import { DirectAidLogo } from './DirectAidLogo.tsx';
import type { SyncStatus } from '../types/video.ts';

interface NavbarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  syncStatus: SyncStatus | null;
  onOpenSyncModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  syncStatus,
  onOpenSyncModal,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { id: 'accueil', label: 'الرئيسية' },
    { id: 'ecole', label: 'عن المجمع' },
    { id: 'activites', label: 'الأنشطة' },
    { id: 'videos', label: 'الفيديوهات', hasBadge: true },
    { id: 'galerie', label: 'معرض الصور' },
    { id: 'actualites', label: 'الأخبار' },
    { id: 'contact', label: 'تواصل معنا' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      {/* Top Bar Contract: 3 zones */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Zone 1: Brand Zone with Official DirectAid Benin Logo */}
          <button
            onClick={() => {
              onSelectTab('accueil');
              setMobileMenuOpen(false);
            }}
            className="text-right group flex items-center gap-3 transition-opacity hover:opacity-90 cursor-pointer"
          >
            <DirectAidLogo />
          </button>

          {/* Zone 2: Navigation Links (Text with subtle hover state) */}
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
                  <span className="inline-flex items-center gap-1.5">
                    {link.label}
                    {link.hasBadge && (
                      <span className="inline-flex items-center px-1.5 py-0.2 text-[10px] font-bold bg-emerald-50 text-[#16A34A] rounded border border-emerald-200">
                        مزامنة تلقائية
                      </span>
                    )}
                  </span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#16A34A] rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Primary Actions */}
          <div className="flex items-center gap-3">
            {/* Status & Sync Drawer Button */}
            <button
              onClick={onOpenSyncModal}
              title="حالة المزامنة التلقائية مع يوتيوب وسوبابيس"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors border border-stone-200/80 cursor-pointer"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 text-stone-600 ${
                  syncStatus?.isSyncing ? 'animate-spin text-emerald-600' : ''
                }`}
              />
              <span className="hidden sm:inline">مزامنة يوتيوب</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-emerald-200" />
            </button>

            {/* Inscription CTA */}
            <button
              onClick={() => onSelectTab('contact')}
              className="px-4 py-2 text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803D] rounded-lg shadow-xs transition-colors cursor-pointer whitespace-nowrap"
            >
              التسجيل والزيارة
            </button>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-900 rounded-md focus:outline-none cursor-pointer"
              aria-label="القائمة الرئيسية"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-1 shadow-lg">
          {navLinks.map((link) => {
            const isActive = currentTab === link.id;
            return (
              <button
                key={link.id}
                onClick={() => {
                  onSelectTab(link.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-md text-base font-medium text-right transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-emerald-50 text-[#16A34A] font-bold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>{link.label}</span>
                {link.hasBadge && (
                  <span className="text-xs bg-emerald-50 text-[#16A34A] px-2 py-0.5 rounded border border-emerald-200 font-medium">
                    يوتيوب تلقائي
                  </span>
                )}
              </button>
            );
          })}
          <div className="pt-3 border-t border-stone-200">
            <button
              onClick={() => {
                onOpenSyncModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-sm font-medium text-stone-700 bg-stone-100 rounded-lg hover:bg-stone-200 transition-colors"
            >
              <RefreshCw className="w-4 h-4 text-stone-600" />
              <span>لوحة التحكم ومزامنة يوتيوب</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
