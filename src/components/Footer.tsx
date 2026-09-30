import React from 'react';
import { Youtube, MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { DirectAidLogo } from './DirectAidLogo.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenSyncModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenSyncModal }) => {
  const { t, isRTL } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Col 1: Institutional Presentation */}
          <div className="space-y-4">
            <DirectAidLogo variant="white" />
            <p className="text-sm text-stone-400 leading-relaxed pt-2">
              {t('footer_desc')}
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenSyncModal}
                className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors underline cursor-pointer"
              >
                <span>{t('footer_sync_link')}</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Col 2: Navigation rapide */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-stone-100 tracking-wider">
              {t('footer_quick_links')}
            </h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button
                  onClick={() => onSelectTab('accueil')}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  {t('nav_home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('ecole')}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  {t('nav_school')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('activites')}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  {t('nav_activities')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('videos')}
                  className="hover:text-stone-100 transition-colors cursor-pointer text-emerald-400 font-semibold flex items-center gap-1.5"
                >
                  <span>{t('nav_videos')}</span>
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">
                    {t('nav_auto_sync')}
                  </span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('galerie')}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  {t('nav_gallery')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('actualites')}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  {t('nav_news')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Coordinates */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-stone-100 tracking-wider">
              {t('footer_contact_info')}
            </h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span>{t('footer_address')}</span>
              </li>
              <li className="flex items-center gap-2.5" dir="ltr">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>+229 21 30 18 45 / +229 97 00 12 34</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span dir="ltr">contact@directaid-benin.org</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('footer_hours')}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Official YouTube Banner */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-stone-100 tracking-wider flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-500" />
              <span>{t('footer_youtube_title')}</span>
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              {t('footer_youtube_desc')}
            </p>
            <div className="pt-2">
              <a
                href="https://www.youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                <Youtube className="w-4 h-4" />
                <span>{t('footer_youtube_btn')}</span>
              </a>
            </div>
            <div className="p-3 bg-stone-800/80 rounded-lg border border-stone-700/60 text-[11px] text-stone-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span>YouTube Data API v3 & Supabase</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-800 text-center sm:flex sm:items-center sm:justify-between text-xs text-stone-400">
          <p>{t('footer_rights')}</p>
          <div className="mt-4 sm:mt-0 flex justify-center gap-6">
            <span className="text-stone-400 hover:text-stone-300">DirectAid International</span>
            <span>·</span>
            <span className="text-stone-400 hover:text-stone-300">Bénin</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
