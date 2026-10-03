import React from 'react';
import { Calendar, Tag, ArrowRight, ArrowLeft, Bell, Newspaper, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { PageHeader } from '../components/PageHeader.tsx';

interface NewsArticle {
  id: string;
  category: { fr: string; ar: string };
  date: { fr: string; ar: string };
  title: { fr: string; ar: string };
  excerpt: { fr: string; ar: string };
}

const NEWS_DATA: NewsArticle[] = [
  {
    id: 'n1',
    category: { fr: 'Activité culturelle', ar: 'نشاط ثقافي' },
    date: { fr: '25 Septembre 2026', ar: '25 سبتمبر 2026' },
    title: {
      fr: 'Succès de la rencontre annuelle de la jeunesse musulmane à Kandi',
      ar: 'نجاح متميز للملتقى السنوي للشباب المسلم بمدينة كاندي',
    },
    excerpt: {
      fr: 'Une journée riche en échanges fraternels, conférences thématiques et ateliers collaboratifs autour de la transmission des valeurs et du rôle des jeunes dans la cité.',
      ar: 'يوم حافل بالنقاشات المثمرة والمحاضرات التوجيهية وورش العمل التفاعلية حول دور الشباب في خدمة المجتمع والتمسك بالقيم الفاضلة.',
    },
  },
  {
    id: 'n2',
    category: { fr: 'Action sociale & Solidarité', ar: 'عمل اجتماعي' },
    date: { fr: '18 Septembre 2026', ar: '18 سبتمبر 2026' },
    title: {
      fr: 'Mobilisation solidaire pour soutenir les familles vulnérables de la commune',
      ar: 'حملة تضامنية لدعم الأسر المتعففة ومساندتها في بلدية كاندي',
    },
    excerpt: {
      fr: 'Grâce à la générosité des sympathisants et à l\'implication bénévole des membres de l\'A.J.M.C, des kits alimentaires et des soutiens de première nécessité ont été distribués.',
      ar: 'بفضل تكاتف الأعضاء ودعم المحسنين، قامت الجمعية بتوزيع معونات عينية ومساعدات أساسية لتعزيز أواصر التكافل والتراحم الاجتماعي.',
    },
  },
  {
    id: 'n3',
    category: { fr: 'Éducation & Formation', ar: 'تعليم وتأهيل' },
    date: { fr: '10 Septembre 2026', ar: '10 سبتمبر 2026' },
    title: {
      fr: 'Lancement des ateliers de formation pratique et d\'initiation informatique',
      ar: 'انطلاق دورات التدريب الميداني والمهارات الرقمية للناشئة والشباب',
    },
    excerpt: {
      fr: 'Des sessions gratuites destinées à familiariser les élèves et jeunes de Kandi avec les outils numériques essentiels, la méthodologie de recherche et l\'expression écrite.',
      ar: 'سلسلة ورش مجانية لتمكين تلاميذ وشباب كاندي من أساسيات المعلوميات، مناهج البحث العلمي وإتقان مهارات التواصل.',
    },
  },
  {
    id: 'n4',
    category: { fr: 'Compétition & Savoir', ar: 'مسابقات ومعارف' },
    date: { fr: '28 Août 2026', ar: '28 أغسطس 2026' },
    title: {
      fr: 'Clôture solennelle du concours annuel de mémorisation du Saint Coran',
      ar: 'الحفل الختامي لتكريم الفائزين في مسابقة حفظ القرآن الكريم وتجويده',
    },
    excerpt: {
      fr: 'Une célébration fraternelle en présence des parents, dignitaires locaux et sympathisants pour récompenser les lauréats et encourager l\'attachement aux valeurs morales.',
      ar: 'أجواء إيمانية مبهجة بحضور أولياء الأمور ووجهاء المنطقة لتكريم حفظة كتاب الله وتحفيز الأجيال الصاعدة على التمسك بالأخلاق الكريمة.',
    },
  },
];

export const NewsView: React.FC = () => {
  const { t, isRTL, language } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className={`space-y-12 pb-20 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* En-tête atmosphérique */}
      <PageHeader
        title={t('nav_news')}
        subtitle={
          language === 'ar'
            ? 'متابعة حية وشاملة لكافة فعاليات، مبادرات ومحطات جمعية الشباب المسلم للثقافة في كاندي.'
            : 'Suivez le fil des actions, rencontres et communiqués officiels de l\'A.J.M.C à Kandi.'
        }
        kicker="A.J.M.C — Kandi · Vie Associative & Communiqués"
        icon={Newspaper}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Grille des articles avec fond chaleureux */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          {NEWS_DATA.map((article) => (
            <article
              key={article.id}
              className="bg-white/95 rounded-3xl border border-stone-200/90 p-5 sm:p-8 shadow-sm hover:shadow-md hover:border-emerald-700/30 transition-all duration-300 flex flex-col justify-between space-y-4 sm:space-y-5 backdrop-blur-xs"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span className="font-bold text-[#0F5132] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/60">
                    {article.category[language]}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    <span>{article.date[language]}</span>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-stone-900 leading-snug">
                  {article.title[language]}
                </h3>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-medium">
                  {article.excerpt[language]}
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold text-emerald-800">A.J.M.C — Kandi</span>
                <span className="text-emerald-700 font-bold inline-flex items-center gap-1">
                  <span>{language === 'ar' ? 'تقرير ميداني' : 'Actualité associative'}</span>
                  <ArrowIcon className="w-3 h-3" />
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};
