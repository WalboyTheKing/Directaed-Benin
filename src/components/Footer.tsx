import React from 'react';
import { Youtube, MapPin, Phone, Mail, Clock, Lock } from 'lucide-react';
import { DirectAidLogo } from './DirectAidLogo.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenAdmin }) => {
  const { t, isRTL, language } = useLanguage();

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
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  {t('nav_videos')}
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
              <li>
                <button
                  onClick={() => onSelectTab('contact')}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  {t('nav_contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Coordinates avec liens tel: et mailto: */}
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
                <div className="flex gap-2">
                  <a href="tel:+22921301845" className="hover:text-stone-100 transition-colors">
                    +229 21 30 18 45
                  </a>
                  <span>/</span>
                  <a href="tel:+22997001234" className="hover:text-stone-100 transition-colors">
                    +229 97 00 12 34
                  </a>
                </div>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <a
                  href="mailto:contact@directaid-benin.org"
                  dir="ltr"
                  className="hover:text-stone-100 transition-colors underline"
                >
                  contact@directaid-benin.org
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>{t('footer_hours')}</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Chaîne YouTube Officielle exacte (@Madjid-r3c) */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-stone-100 tracking-wider flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-500" />
              <span>{t('footer_youtube_title')}</span>
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              {language === 'ar'
                ? 'تابعوا أحدث التغطيات المصورة والمناسبات الرسمية عبر قناتنا الرسمية على يوتيوب.'
                : language === 'fr'
                ? 'Retrouvez toutes les cérémonies et activités scolaires sur notre chaîne YouTube officielle.'
                : 'Follow all academic ceremonies and events on our official YouTube channel.'}
            </p>
            <div className="pt-2">
              <a
                href="https://www.youtube.com/@Madjid-r3c"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                <Youtube className="w-4 h-4" />
                <span>{t('footer_youtube_btn')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar avec lien discret pour l'espace administration */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-stone-500 gap-4">
          <p>{t('footer_rights')}</p>
          <div className="flex items-center gap-4">
            <span className="text-stone-400">DirectAid International · Bénin</span>
            <span>·</span>
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 text-stone-500 hover:text-stone-300 transition-colors cursor-pointer"
              title="Espace administration"
            >
              <Lock className="w-3 h-3" />
              <span>{language === 'ar' ? 'الإدارة' : language === 'fr' ? 'Administration' : 'Admin'}</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
