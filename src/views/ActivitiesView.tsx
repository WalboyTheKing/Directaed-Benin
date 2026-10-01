import React, { useState } from 'react';
import {
  BookOpen,
  Sparkles,
  Compass,
  Users,
  Heart,
  MessageSquare,
  Calendar,
  ArrowRight,
  ArrowLeft,
  Film,
  Layers,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import type { VideoCategory } from '../types/video.ts';
import { PageHeader } from '../components/PageHeader.tsx';

interface ActivitiesViewProps {
  onSelectTab: (tab: string, categoryFilter?: string) => void;
  defaultSubCategory?: string;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  onSelectTab,
  defaultSubCategory = 'all',
}) => {
  const { t, isRTL, language } = useLanguage();
  const [selectedSubTab, setSelectedSubTab] = useState<string>(defaultSubCategory || 'all');
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const categories = [
    {
      id: 'all',
      label: t('cat_all'),
      title: language === 'ar' ? 'كافة أنشطة الجمعية' : 'Toutes nos activités associatives',
      desc: language === 'ar'
        ? 'برامج وأنشطة متنوعة تهدف لخدمة شباب كاندي وتنمية المجتمع.'
        : 'Un éventail complet d\'initiatives éducatives, culturelles, sociales et communautaires.',
    },
    {
      id: 'education',
      label: t('cat_education'),
      filterKey: 'الأنشطة التعليمية',
      icon: BookOpen,
      title: t('domain_education_title'),
      desc: t('domain_education_desc'),
      points: language === 'ar'
        ? ['دورات تقوية ومساندة دراسية مجانية للطلاب', 'ورش تدريبية في المعلوميات وتطوير الذات', 'مكتبة للمطالعة وقاعات مجهزة للبحث']
        : ['Cours de soutien et tutorat scolaire gratuit', 'Ateliers méthodologiques et compétences numériques', 'Espaces de lecture et d\'apprentissage partagé'],
    },
    {
      id: 'culture',
      label: t('cat_culture'),
      filterKey: 'الأنشطة الثقافية',
      icon: Sparkles,
      title: t('domain_culture_title'),
      desc: t('domain_culture_desc'),
      points: language === 'ar'
        ? ['ملتقيات ثقافية ومهرجانات أدبية سنوية', 'مسابقات في الخطابة والشعر والإنشاد الهادف', 'معارض للتعريف بالحضارة والتراث الإسلامي']
        : ['Grandes rencontres et forums culturels annuels', 'Concours d\'éloquence et compétitions littéraires', 'Expositions thématiques sur les valeurs et le patrimoine'],
    },
    {
      id: 'religious',
      label: t('cat_religious'),
      filterKey: 'الأنشطة الدينية',
      icon: Compass,
      title: t('domain_religious_title'),
      desc: t('domain_religious_desc'),
      points: language === 'ar'
        ? ['دروس دورية في الفقه، العقيدة والسيرة النبوية', 'مسابقات سنوية لحفظ وتجويد القرآن الكريم', 'إحياء المناسبات الدينية وبرامج رمضانية مميزة']
        : ['Enseignements réguliers sur les fondamentaux éthiques', 'Concours annuel de mémorisation du Saint Coran', 'Conférences spirituelles et programmes fraternels'],
    },
    {
      id: 'youth',
      label: t('cat_youth'),
      filterKey: 'أنشطة الشباب',
      icon: Users,
      title: t('domain_youth_title'),
      desc: t('domain_youth_desc'),
      points: language === 'ar'
        ? ['دوريات رياضية لتعزيز الأخوة والروح الرياضية', 'خرجات ترفيهية ومخيمات شبابية هادفة', 'حلقات نقاش وتبادل تجارب ملهمة']
        : ['Tournois sportifs et cohésion fraternelle', 'Sorties de découverte et retraites شباب', 'Espaces d\'échange et mentorat entre jeunes'],
    },
    {
      id: 'social',
      label: t('cat_social'),
      filterKey: 'الأنشطة الاجتماعية',
      icon: Heart,
      title: t('domain_social_title'),
      desc: t('domain_social_desc'),
      points: language === 'ar'
        ? ['قوافل إغاثية ومساعدات عينية للأسر المتعففة', 'حملات تطوعية للنظافة والعناية بالبيئة في كاندي', 'زيارات تضامنية للمرضى والمحتاجين']
        : ['Actions solidaires envers les familles démunies', 'Journées citoyennes de salubrité publique à Kandi', 'Visites de soutien et réconfort communautaire'],
    },
    {
      id: 'conferences',
      label: t('cat_conferences'),
      filterKey: 'المحاضرات واللقاءات',
      icon: MessageSquare,
      title: t('domain_conferences_title'),
      desc: t('domain_conferences_desc'),
      points: language === 'ar'
        ? ['محاضرات عامة يحاضر فيها أساتذة ومصلحون', 'ندوات تفاعلية لمعالجة تحديات الشباب المعاصرة', 'لقاءات مفتوحة لتعزيز التعايش والسلم الأهلي']
        : ['Grandes conférences publiques avec des intervenants de référence', 'Colloques thématiques sur les défis contemporains', 'Débats ouverts promouvant la paix et le vivre-ensemble'],
    },
    {
      id: 'events',
      label: t('cat_events'),
      filterKey: 'الفعاليات والمناسبات',
      icon: Calendar,
      title: t('domain_events_title'),
      desc: t('domain_events_desc'),
      points: language === 'ar'
        ? ['حفل سنوي لتكريم المتميزين والمتفوقين', 'المشاركة الفاعلة في المناسبات الوطنية والمجتمعية', 'ملتقيات إقليمية للشباب المسلم']
        : ['Cérémonie d\'excellence récompensant les jeunes méritants', 'Participation aux célébrations d\'intérêt général', 'Rassemblements régionaux de jeunesse'],
    },
  ];

  const displayedCategories =
    selectedSubTab === 'all'
      ? categories.filter((c) => c.id !== 'all')
      : categories.filter((c) => c.id === selectedSubTab);

  return (
    <div className={`space-y-12 pb-20 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* En-tête de page atmosphérique */}
      <PageHeader
        title={t('nav_activities')}
        subtitle={
          language === 'ar'
            ? 'تتنوع مبادرات الجمعية لتشمل الجوانب الثقافية، التعليمية، الاجتماعية والشبابية لبناء جيل نافع لمجتمعه.'
            : 'Découvrez l\'ensemble des programmes déployés par l\'A.J.M.C pour dynamiser la vie culturelle et sociale à Kandi.'
        }
        kicker="A.J.M.C — Kandi · Pôles d'Action & Initiatives"
        icon={Layers}
      >
        {/* Onglets de sous-catégories intégrés à l'en-tête */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none pt-2">
          {categories.map((sub) => {
            const isActive = selectedSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubTab(sub.id)}
                className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer shadow-xs ${
                  isActive
                    ? 'bg-[#0F5132] text-white border border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                    : 'bg-emerald-950/70 text-emerald-200 border border-emerald-800/60 hover:bg-emerald-900/60 backdrop-blur-xs'
                }`}
              >
                <span>{sub.label}</span>
              </button>
            );
          })}
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Grille des activités avec surfaces chaleureuses */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {displayedCategories.map((item) => {
            const Icon = item.icon || Layers;
            return (
              <div
                key={item.id}
                className="bg-white/95 rounded-3xl border border-stone-200/90 p-8 sm:p-10 shadow-sm hover:shadow-md hover:border-emerald-700/30 transition-all duration-300 flex flex-col justify-between space-y-6 backdrop-blur-xs"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-[#0F5132] flex items-center justify-center shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200/60">
                      {item.label}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-sm text-stone-600 leading-relaxed font-medium">
                    {item.desc}
                  </p>

                  {/* Points clés */}
                  {item.points && (
                    <ul className="space-y-2.5 pt-2 border-t border-stone-100">
                      {item.points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-600">
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{pt}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Lien vers vidéos associées */}
                {item.filterKey && (
                  <div className="pt-4 border-t border-stone-100">
                    <button
                      onClick={() => onSelectTab('mediatheque', item.filterKey)}
                      className="text-xs font-bold text-[#0F5132] hover:text-[#16A34A] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Film className="w-3.5 h-3.5" />
                      <span>
                        {language === 'ar'
                          ? `مشاهدة تغطيات ${item.label} على يوتيوب`
                          : `Voir les enregistrements : ${item.label}`}
                      </span>
                      <ArrowIcon className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
