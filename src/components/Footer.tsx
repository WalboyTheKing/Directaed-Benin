import React from 'react';
import { Youtube, MapPin, Phone, Mail, Lock } from 'lucide-react';
import { AJMCLogo } from './AJMCLogo.tsx';
import { useLanguage } from '../context/LanguageContext.tsx';

interface FooterProps {
  onSelectTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab }) => {
  const { t, isRTL, language } = useLanguage();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 ${isRTL ? 'text-right' : 'text-left'}`}>
          {/* Col 1 : Présentation institutionnelle de l'AJMC */}
          <div className="space-y-4">
            <AJMCLogo variant="white" />
            <p className="text-sm text-stone-400 leading-relaxed pt-2">
              {t('footer_desc')}
            </p>
          </div>

          {/* Col 2 : Liens rapides */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-stone-100 tracking-wider">
              {t('footer_quick_links')}
            </h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button
                  onClick={() => onSelectTab('accueil')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t('nav_home')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('a-propos')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t('nav_about')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('activites')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t('nav_activities')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('actualites')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t('nav_news')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('projets')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t('nav_projects')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('mediatheque')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t('nav_media')}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('contact')}
                  className="hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  {t('nav_contact')}
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3 : Coordonnées officielles de l'A.J.M.C */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-stone-100 tracking-wider">
              {t('footer_contact_info')}
            </h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-1" />
                <span>{t('contact_address')}</span>
              </li>
              <li className="flex items-center gap-2.5" dir="ltr">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <a
                  href="tel:+2290197185822"
                  className="hover:text-emerald-300 transition-colors font-medium"
                >
                  +229 01 97 18 58 22
                </a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <a
                  href="mailto:Maguidram@gmail.com"
                  dir="ltr"
                  className="hover:text-emerald-300 transition-colors underline break-all"
                >
                  Maguidram@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4 : Chaîne YouTube officielle de l'A.J.M.C */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-stone-100 tracking-wider flex items-center gap-2">
              <Youtube className="w-4 h-4 text-red-500" />
              <span>{t('footer_youtube_title')}</span>
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              {language === 'ar'
                ? 'تابعوا المحاضرات والملتقيات والأنشطة الشبابية والثقافية عبر قناتنا الرسمية على يوتيوب.'
                : 'Retrouvez toutes les conférences, rencontres et activités culturelles sur notre chaîne YouTube officielle.'}
            </p>
            <div className="pt-2">
              <a
                href="https://www.youtube.com/@Madjid-r3c"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold transition-colors shadow-xs"
              >
                <Youtube className="w-4 h-4" />
                <span>{t('footer_youtube_btn')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Barre inférieure avec copyright */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs text-stone-500 gap-4">
          <p>{t('footer_rights')}</p>
          <div className="flex items-center gap-2">
            <span className="text-stone-400">A.J.M.C — Kandi</span>
            <span>·</span>
            <span className="text-stone-500">{t('org_country')}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
