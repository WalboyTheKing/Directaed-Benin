import React from 'react';
import {
  Users,
  Compass,
  Heart,
  ShieldCheck,
  Target,
  Sparkles,
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Award,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { PageHeader } from '../components/PageHeader.tsx';

interface AboutViewProps {
  onSelectTab: (tab: string) => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onSelectTab }) => {
  const { t, isRTL, language } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className={`space-y-12 pb-20 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* En-tête atmosphérique et solennel */}
      <PageHeader
        title={t('about_page_title')}
        subtitle={t('about_page_subtitle')}
        kicker={language === 'ar' ? 'عن جمعية الشباب المسلم للثقافة' : 'À propos de l\'A.J.M.C'}
        icon={Users}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section 1 : Qui sommes-nous ? */}
        <div className="bg-white/95 rounded-3xl border border-stone-200/90 p-8 sm:p-12 shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center backdrop-blur-xs">
          <div className="lg:col-span-8 space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F5132] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              <span>{language === 'ar' ? 'التعريف بالجمعية' : 'Présentation institutionnelle'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-snug">
              {t('about_who_title')}
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-medium">
              {t('about_who_desc1')}
            </p>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              {t('about_who_desc2')}
            </p>
          </div>

          <div className="lg:col-span-4 bg-gradient-to-br from-emerald-950/5 to-amber-900/5 rounded-2xl p-6 border border-emerald-900/10 space-y-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-700/10 text-[#0F5132] flex items-center justify-center mx-auto shadow-xs">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">
                {language === 'ar' ? 'طاقات شبابية تطوعية' : 'Engagement Bénévole'}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {language === 'ar'
                  ? 'أعضاء ناشطون يعملون بروح الفريق لخدمة مدينة كاندي ومجتمعنا.'
                  : 'Des jeunes engagés unis par la volonté de faire rayonner la culture et la fraternité.'}
              </p>
            </div>
            <button
              onClick={() => onSelectTab('contact')}
              className="w-full py-2.5 px-4 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center justify-center gap-2 shadow-xs"
            >
              <span>{t('nav_cta_join')}</span>
              <ArrowIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Section 2 : Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission */}
          <div className="bg-white/95 p-8 sm:p-10 rounded-3xl border border-stone-200/90 shadow-sm space-y-4 hover:border-emerald-700/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center shadow-xs">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">
              {t('about_mission_title')}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {t('about_mission_desc')}
            </p>
          </div>

          {/* Vision */}
          <div className="bg-white/95 p-8 sm:p-10 rounded-3xl border border-stone-200/90 shadow-sm space-y-4 hover:border-emerald-700/30 transition-colors">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center shadow-xs">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-stone-900">
              {t('about_vision_title')}
            </h3>
            <p className="text-sm text-stone-600 leading-relaxed">
              {t('about_vision_desc')}
            </p>
          </div>
        </div>

        {/* Section 3 : Nos Valeurs */}
        <div className="bg-white/95 rounded-3xl border border-stone-200/90 p-8 sm:p-12 shadow-sm space-y-8">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-bold text-[#0F5132] uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
              <span>{language === 'ar' ? 'المرجعية الأخلاقية' : 'Principes Fondateurs'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {t('about_values_title')}
            </h2>
            <p className="text-sm text-stone-600">
              {t('about_values_desc')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Valeur 1 */}
            <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-3 hover:border-emerald-600/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0F5132] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-stone-900">
                {language === 'ar' ? 'الثقافة والمعرفة' : 'Culture & Savoir'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'ar'
                  ? 'غرس قيم التعلم المستمر والانفتاح الفكري الرصين.'
                  : 'Cultiver la recherche de la connaissance et l\'éveil intellectuel.'}
              </p>
            </div>

            {/* Valeur 2 */}
            <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-3 hover:border-emerald-600/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0F5132] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-stone-900">
                {language === 'ar' ? 'الأخوة والتآخي' : 'Fraternité'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'ar'
                  ? 'بناء روابط مودة وتعاون صادق بين شباب المجتمع.'
                  : 'Tisser des liens d\'entraide et de concorde mutuelle.'}
              </p>
            </div>

            {/* Valeur 3 */}
            <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-3 hover:border-emerald-600/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0F5132] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-stone-900">
                {language === 'ar' ? 'التكافل الاجتماعي' : 'Solidarité'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'ar'
                  ? 'مساندة الأسر الضعيفة والمساهمة الفاعلة في تنمية كاندي.'
                  : 'Agir concrètement pour soutenir les initiatives citoyennes.'}
              </p>
            </div>

            {/* Valeur 4 */}
            <div className="p-6 rounded-2xl bg-stone-50/80 border border-stone-200/80 space-y-3 hover:border-emerald-600/40 transition-colors">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-[#0F5132] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-base text-stone-900">
                {language === 'ar' ? 'التميز الأخلاقي' : 'Excellence'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {language === 'ar'
                  ? 'السعي الدائم للإتقان وتقديم الأفضل في كل ميدان.'
                  : 'Rechercher la bienveillance et l\'élévation personnelle.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
