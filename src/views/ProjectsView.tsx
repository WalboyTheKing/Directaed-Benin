import React, { useState } from 'react';
import {
  FolderKanban,
  BookOpen,
  Sparkles,
  Users,
  Heart,
  Globe2,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Target
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { PageHeader } from '../components/PageHeader.tsx';

interface ProjectCategory {
  id: string;
  name: { fr: string; ar: string };
  icon: any;
  description: { fr: string; ar: string };
  initiatives: { fr: string[]; ar: string[] };
}

const PROJECTS_DATA: ProjectCategory[] = [
  {
    id: 'educ',
    name: { fr: 'Projets éducatifs', ar: 'المشاريع التعليمية' },
    icon: BookOpen,
    description: {
      fr: 'Programmes d\'accompagnement intellectuel, de soutien à l\'apprentissage et de valorisation du mérite chez les jeunes.',
      ar: 'برامج لدعم التحصيل المعرفي، تعزيز المهارات الدراسية، وتشجيع التفوق وحب القراءة.',
    },
    initiatives: {
      fr: [
        'Mise en place d\'un fonds de soutien aux manuels et fournitures',
        'Organisation de sessions de mentorat par les aînés',
        'Ateliers d\'initiation aux outils numériques et à la bureautique',
      ],
      ar: [
        'مشروع توفير وتيسير الكتب والمراجع للشباب',
        'جلسات إرشاد وتوجيه بالتعاون مع المتخرجين والأساتذة',
        'دورات تدريبية دورية في استخدام الحاسوب والتقنيات الحديثة',
      ],
    },
  },
  {
    id: 'culture',
    name: { fr: 'Projets culturels', ar: 'المشاريع الثقافية' },
    icon: Sparkles,
    description: {
      fr: 'Initiatives valorisant le patrimoine moral, l\'art oratoire, la poésie et la préservation de la culture islamique éclairée.',
      ar: 'مبادرات هادفة لحفظ التراث الفكري، فن الخطابة، الشعر، والإنشاد الهادف الرصين.',
    },
    initiatives: {
      fr: [
        'Festival culturel et concours d\'éloquence de Kandi',
        'Création d\'un espace de bibliothèque communautaire',
        'Rencontres et débats intergénérationnels',
      ],
      ar: [
        'الملتقى الثقافي ومسابقة الخطابة السنوية بمدينة كاندي',
        'مشروع تأسيس مكتبة ثقافية مفتوحة للعموم',
        'جلسات حوارية تجمع الشباب بالوجهاء والشخصيات الملهمة',
      ],
    },
  },
  {
    id: 'youth',
    name: { fr: 'Projets jeunesse & Épanouissement', ar: 'مشاريع الشباب' },
    icon: Users,
    description: {
      fr: 'Actions axées sur le sport sain, la cohésion fraternelle, le leadership citoyen et la prévention des dérives.',
      ar: 'أنشطة تركز على الرياضة الهادفة، التآخي والتعاون، تعزيز روح القيادة والمواطنة الإيجابية.',
    },
    initiatives: {
      fr: [
        'Tournoi annuel de football de la Fraternité',
        'Séjours d\'immersion et retraites de ressourcement moral',
        'Campagnes de sensibilisation contre la délinquance juvénile',
      ],
      ar: [
        'دوري الأخوة السنوي في كرة القدم لشباب المنطقة',
        'مخيمات ورحلات لتجديد النشاط وغرس القيم التربوية',
        'حملات توعوية دورية للوقاية من الانحراف السلوكي',
      ],
    },
  },
  {
    id: 'social',
    name: { fr: 'Initiatives sociales & Solidarité', ar: 'المبادرات الاجتماعية' },
    icon: Heart,
    description: {
      fr: 'Actions humanitaires directes auprès des familles vulnérables, des malades et des orphelins de la région.',
      ar: 'مشاريع إنسانية ملموسة لمساندة الأسر المتعففة، زيارة المرضى، ورعاية الأيتام في كاندي.',
    },
    initiatives: {
      fr: [
        'Distribution de paniers alimentaires lors des périodes festives',
        'Soutien matériel d\'urgence aux ménages en difficulté',
        'Journées de bénévolat et d\'embellissement de l\'espace public',
      ],
      ar: [
        'مشروع السلال التضامنية وتوزيع المعونات في المواسم المباركة',
        'صندوق الطوارئ للإعانة الإنسانية المباشرة للحالات الصعبة',
        'أيام تطوعية للنظافة العامة وخدمة الأحياء في كاندي',
      ],
    },
  },
];

interface ProjectsViewProps {
  onSelectTab: (tab: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ onSelectTab }) => {
  const { isRTL, language } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className={`space-y-12 pb-20 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* En-tête atmosphérique */}
      <PageHeader
        title={language === 'ar' ? 'مشاريع ومبادرات الجمعية' : 'Projets & Initiatives'}
        subtitle={
          language === 'ar'
            ? 'خطط عمل ميدانية ومشاريع تنموية مستدامة تخدم شباب وأسر مدينة كاندي.'
            : 'Des actions concrètes et structurantes au service de la jeunesse, de l\'éducation et de la solidarité locale.'
        }
        kicker="A.J.M.C — Kandi · Développement Communautaire"
        icon={FolderKanban}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Grille des catégories de projets avec fond chaleureux */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {PROJECTS_DATA.map((cat) => {
            const Icon = cat.icon;
            return (
              <div
                key={cat.id}
                className="bg-white/95 rounded-3xl border border-stone-200/90 p-5 sm:p-8 md:p-10 shadow-sm hover:shadow-md hover:border-emerald-700/30 transition-all duration-300 flex flex-col justify-between space-y-5 sm:space-y-6 backdrop-blur-xs"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#0F5132] flex items-center justify-center border border-emerald-100 shadow-xs">
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-snug">
                      {cat.name[language]}
                    </h3>
                  </div>

                  <p className="text-sm text-stone-600 leading-relaxed font-medium">
                    {cat.description[language]}
                  </p>

                  <div className="space-y-2.5 pt-2 border-t border-stone-100">
                    <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
                      {language === 'ar' ? 'محاور العمل الرئيسية :' : 'Actions prioritaires :'}
                    </span>
                    <ul className="space-y-2">
                      {cat.initiatives[language].map((init, idx) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-stone-600">
                          <CheckCircle2 className="w-4 h-4 text-[#16A34A] shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{init}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-stone-100">
                  <button
                    onClick={() => onSelectTab('contact')}
                    className="text-xs font-bold text-[#0F5132] hover:text-[#16A34A] transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <span>
                      {language === 'ar'
                        ? 'المساهمة أو التطوع في هذه المشاريع'
                        : 'Soutenir ou participer à ces projets'}
                    </span>
                    <ArrowIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bannière d'appel à projet */}
        <div className="bg-gradient-to-r from-[#061f14] via-[#093321] to-[#051a10] text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-emerald-800/40 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl relative z-10">
            <h3 className="text-xl sm:text-2xl font-extrabold text-white">
              {language === 'ar'
                ? 'هل لديك فكرة مشروع أو مبادرة تخدم شباب كاندي؟'
                : 'Vous avez une idée de projet ou d\'initiative pour Kandi ?'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed font-medium">
              {language === 'ar'
                ? 'ترحب جمعية الشباب المسلم للثقافة بكافة المقترحات البناءة، الشراكات المثمرة، والمساهمات التطوعية.'
                : 'L\'A.J.M.C est à l\'écoute de toutes les propositions constructives et partenariats en faveur de notre communauté.'}
            </p>
          </div>

          <button
            onClick={() => onSelectTab('contact')}
            className="px-6 py-3.5 bg-white hover:bg-stone-100 text-[#0F5132] rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer whitespace-nowrap shrink-0 inline-flex items-center gap-2"
          >
            <span>{language === 'ar' ? 'تواصل معنا الآن' : 'Proposer une initiative'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
