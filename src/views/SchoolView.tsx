import React from 'react';
import {
  BookOpen,
  Award,
  Users,
  Compass,
  CheckCircle2,
  Calendar,
  Building,
  GraduationCap,
  ShieldCheck,
  HeartHandshake,
  Globe2,
  Sparkles
} from 'lucide-react';
import { SCHOOL_IMAGES } from '../assets/images.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface SchoolViewProps {
  onSelectTab: (tab: string) => void;
}

export const SchoolView: React.FC<SchoolViewProps> = ({ onSelectTab }) => {
  const { t, isRTL, language } = useLanguage();

  return (
    <div className={`py-12 space-y-16 bg-stone-50 min-h-screen ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 border-b border-stone-200 pb-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
            <span className="text-xs font-bold text-[#16A34A] uppercase tracking-widest">
              DirectAid International · Bénin
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
            {t('school_hero_title')}
          </h1>
          <p className="text-base text-stone-600 leading-relaxed">
            {t('school_hero_desc')}
          </p>
        </div>

        {/* Mot de la Direction */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#16A34A] shadow-inner bg-stone-100">
              <img
                src={SCHOOL_IMAGES.heroCampus}
                alt="Direction DirectAid Bénin"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">
                {t('school_director_name')}
              </h3>
              <p className="text-xs text-stone-500">
                Direct Aid · République du Bénin
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-xl font-bold text-stone-900">
              {t('school_director_title')}
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed font-serif italic">
              « {t('school_director_message')} »
            </p>
            <div className="pt-2">
              <button
                onClick={() => onSelectTab('contact')}
                className="px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
              >
                {t('nav_enroll_btn')}
              </button>
            </div>
          </div>
        </div>

        {/* History & Mission */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#16A34A] uppercase tracking-wider">
              {t('school_hero_tag')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {t('school_history_title')}
            </h2>
            <p className="text-sm text-stone-600 leading-relaxed">
              {t('school_history_p1')}
            </p>
            <p className="text-sm text-stone-600 leading-relaxed">
              {t('school_history_p2')}
            </p>
          </div>

          <div className="rounded-2xl overflow-hidden shadow-lg border border-stone-200 aspect-video">
            <img
              src={SCHOOL_IMAGES.activityPedagogique}
              alt="Classe DirectAid Bénin"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
