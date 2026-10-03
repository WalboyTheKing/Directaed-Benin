import React from 'react';
import {
  Play,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Sparkles,
  Users,
  Compass,
  Heart,
  MessageSquare,
  Calendar,
  Youtube,
  Clock,
  Film,
  CheckCircle2,
  ShieldCheck,
  Award
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import type { Video } from '../types/video.ts';
import heroBgImage from '../assets/images/hero_ajmc_culture_bg_1790847624430.jpg';

interface HomeViewProps {
  onSelectTab: (tab: string, categoryFilter?: string) => void;
  latestVideos: Video[];
  onSelectVideo: (video: Video) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTab,
  latestVideos,
  onSelectVideo,
}) => {
  const { t, isRTL, language } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className={`space-y-12 sm:space-y-16 lg:space-y-20 pb-16 sm:pb-20 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* 1. HERO SECTION AVEC FOND VISUEL MAJESTUEUX & AMBIANCE ÉMERAUDE */}
      <section className="relative bg-[#061e14] text-stone-100 overflow-hidden border-b border-emerald-950/80">
        {/* Arrière-plan photographique et lumineux authentique */}
        <div className="absolute inset-0 z-0 select-none pointer-events-none">
          <img
            src={heroBgImage}
            alt="Arrière-plan A.J.M.C"
            className="w-full h-full object-cover object-center scale-105 filter brightness-90 contrast-105"
          />
          {/* Dégradés superposés pour profondeur et lisibilité sans égal */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#041a11]/96 via-[#07281b]/88 to-[#041a11]/92" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#04170f] via-transparent to-[#04170f]/70" />
          <div className="absolute inset-0 bg-[radial-gradient(#16A34A_1px,transparent_1px)] [background-size:28px_28px] opacity-20" />
          {/* Lueurs chaleureuses ambrées et émeraude */}
          <div className="absolute -top-24 right-1/4 w-[32rem] h-[32rem] bg-amber-400/12 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 left-1/4 w-[36rem] h-[36rem] bg-emerald-500/18 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-28">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Colonne Principale : Titres, Message & CTA */}
            <div className="lg:col-span-7 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-700/60 text-[10px] sm:text-xs font-bold tracking-wider uppercase text-emerald-300 backdrop-blur-xs max-w-full">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <span className="truncate">{t('org_name')} · {t('org_location')}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-snug sm:leading-tight">
                {t('hero_title_line1')} <br />
                <span className="italic font-normal text-emerald-300 drop-shadow-md">{t('hero_title_line2')}</span>
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-stone-200 leading-relaxed max-w-2xl font-medium drop-shadow-xs">
                {t('hero_desc')}
              </p>

              {/* Deux CTA distincts avec espacement net */}
              <div className="pt-2 sm:pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <button
                  onClick={() => onSelectTab('a-propos')}
                  className="px-6 py-3.5 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl text-xs sm:text-sm font-bold shadow-xl shadow-emerald-950/50 hover:shadow-emerald-700/30 transition-all cursor-pointer inline-flex items-center justify-center gap-2 transform hover:-translate-y-0.5"
                >
                  <span>{t('hero_btn_about')}</span>
                  <ArrowIcon className="w-4 h-4 shrink-0" />
                </button>

                <button
                  onClick={() => onSelectTab('activites')}
                  className="px-6 py-3.5 bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-100 rounded-xl text-xs sm:text-sm font-semibold border border-emerald-700/50 backdrop-blur-md transition-all cursor-pointer inline-flex items-center justify-center gap-2"
                >
                  <span>{t('hero_btn_activities')}</span>
                </button>
              </div>

              {/* Repères d'impact associatif */}
              <div className="pt-4 sm:pt-6 border-t border-emerald-900/50 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg text-stone-300">
                <div className="p-2 sm:p-0">
                  <div className="text-lg sm:text-2xl font-black text-white">6</div>
                  <div className="text-[10px] sm:text-xs text-emerald-300/90 font-medium leading-tight">
                    {language === 'ar' ? 'مجالات رئيسية' : 'Pôles d\'activités'}
                  </div>
                </div>
                <div className="p-2 sm:p-0">
                  <div className="text-lg sm:text-2xl font-black text-white">100%</div>
                  <div className="text-[10px] sm:text-xs text-emerald-300/90 font-medium leading-tight">
                    {language === 'ar' ? 'تطوع وعطاء' : 'Bénévolat'}
                  </div>
                </div>
                <div className="p-2 sm:p-0">
                  <div className="text-lg sm:text-2xl font-black text-white">Kandi</div>
                  <div className="text-[10px] sm:text-xs text-emerald-300/90 font-medium leading-tight">
                    {language === 'ar' ? 'بنين' : 'Bénin'}
                  </div>
                </div>
              </div>
            </div>

            {/* Colonne Droite : Carte institutionnelle valorisante */}
            <div className="lg:col-span-5 hidden lg:block">
              <div className="relative bg-gradient-to-b from-emerald-900/40 to-stone-900/60 border border-emerald-600/30 rounded-3xl p-7 backdrop-blur-md shadow-2xl shadow-emerald-950/60 space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-emerald-800/40">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                      {language === 'ar' ? 'ميثاق ورسالة الجمعية' : 'Mission & Valeurs'}
                    </span>
                  </div>
                  <span className="text-[11px] font-mono text-stone-400">A.J.M.C</span>
                </div>

                <div className="space-y-4 text-xs text-stone-200 leading-relaxed">
                  <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 flex items-start gap-3">
                    <BookOpen className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {language === 'ar' ? 'الثقافة والمعرفة' : 'Culture & Éducation'}
                      </h4>
                      <p className="text-stone-300 mt-0.5">
                        {language === 'ar'
                          ? 'بناء جيل واعٍ متسلح بالعلم والأخلاق الفاضلة.'
                          : 'Former une jeunesse épanouie, éclairée par le savoir et l\'éthique.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 flex items-start gap-3">
                    <Users className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {language === 'ar' ? 'التآخي والتكافل' : 'Fraternité & Solidarité'}
                      </h4>
                      <p className="text-stone-300 mt-0.5">
                        {language === 'ar'
                          ? 'تعزيز روح المبادرة والعمل التطوعي لخدمة المجتمع في كاندي.'
                          : 'Unir les énergies pour le rayonnement solidaire de notre communauté.'}
                      </p>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/50 flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-amber-300 shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-white text-sm">
                        {language === 'ar' ? 'التميز والريادة' : 'Épanouissement & Jeunesse'}
                      </h4>
                      <p className="text-stone-300 mt-0.5">
                        {language === 'ar'
                          ? 'مسابقات، ملتقيات ومحاضرات توجيهية هادفة على مدار العام.'
                          : 'Conférences, concours d\'éloquence et projets communautaires durables.'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 text-center">
                  <span className="text-[11px] text-emerald-300/80 font-medium">
                    {language === 'ar'
                      ? 'مرحباً بكم في الموقع الرسمي لجمعية الشباب المسلم للثقافة'
                      : 'Bienvenue sur le portail institutionnel de l\'A.J.M.C Kandi'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. PRÉSENTATION COURTE : QUI SOMMES-NOUS ? */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-stone-200 p-5 sm:p-8 md:p-12 shadow-sm space-y-6">
          <div className="max-w-3xl space-y-2">
            <span className="text-xs font-bold text-[#0F5132] tracking-wider uppercase">
              {t('about_summary_title')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {t('about_summary_subtitle')}
            </h2>
            <p className="text-base text-stone-600 leading-relaxed pt-2">
              {t('about_summary_text')}
            </p>
          </div>

          <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-stone-100">
            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#0F5132] flex items-center justify-center font-bold shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  {language === 'ar' ? 'شباب واعٍ ومبادر' : 'Jeunesse engagée'}
                </h4>
                <p className="text-xs text-stone-500">
                  {language === 'ar' ? 'طاقات تطوعية في خدمة المجتمع' : 'Énergie bénévole au service de tous'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#0F5132] flex items-center justify-center font-bold shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  {language === 'ar' ? 'ثقافة وعلم نافع' : 'Culture & Savoir'}
                </h4>
                <p className="text-xs text-stone-500">
                  {language === 'ar' ? 'محاضرات، دورات وندوات توعوية' : 'Conférences et formations éthiques'}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl">
              <div className="w-10 h-10 rounded-lg bg-emerald-50 text-[#0F5132] flex items-center justify-center font-bold shrink-0">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">
                  {language === 'ar' ? 'تضامن وعمل اجتماعي' : 'Solidarité active'}
                </h4>
                <p className="text-xs text-stone-500">
                  {language === 'ar' ? 'مبادرات إنسانية وتكافل مجتمعي' : 'Actions d\'entraide à Kandi'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DOMAINES D'ACTION ASSOCIATIFS */}
      <section className="bg-stone-100/70 border-y border-stone-200 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-[#0F5132] tracking-wider uppercase">
              {language === 'ar' ? 'محاور عمل الجمعية' : 'Nos Domaines d\'Action'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {language === 'ar' ? 'رسالة شاملة في خدمة الشباب والمجتمع' : 'Un champ d\'action complet et structuré'}
            </h2>
            <p className="text-sm text-stone-600">
              {language === 'ar'
                ? 'تعمل الجمعية على تفعيل محاور رئيسية تعزز حضور الشباب الإيجابي وتسهم في ترسيخ القيم والأخلاق.'
                : 'L\'A.J.M.C déploie ses initiatives à travers des commissions et des projets adaptés aux besoins locaux.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* 1. Éducation */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-stone-900">{t('domain_education_title')}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t('domain_education_desc')}</p>
            </div>

            {/* 2. Culture */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-stone-900">{t('domain_culture_title')}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t('domain_culture_desc')}</p>
            </div>

            {/* 3. Jeunesse */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-stone-900">{t('domain_youth_title')}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t('domain_youth_desc')}</p>
            </div>

            {/* 4. Religieux */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-stone-900">{t('domain_religious_title')}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t('domain_religious_desc')}</p>
            </div>

            {/* 5. Social */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-stone-900">{t('domain_social_title')}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t('domain_social_desc')}</p>
            </div>

            {/* 6. Conférences */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3 hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F5132] flex items-center justify-center">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-stone-900">{t('domain_conferences_title')}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t('domain_conferences_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. DERNIÈRES ACTUALITÉS DE L'ASSOCIATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#0F5132] tracking-wider uppercase">
              {language === 'ar' ? 'متابعة ميدانية' : 'Informations Récentes'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              {t('news_page_title')}
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('actualites')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0F5132] hover:text-[#16A34A] transition-colors cursor-pointer"
          >
            <span>{language === 'ar' ? 'عرض كافة الأخبار' : 'Voir toutes les actualités'}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#0F5132] border border-emerald-200">
              {language === 'ar' ? 'نشاط ثقافي' : 'Activité culturelle'}
            </span>
            <h3 className="font-bold text-base text-stone-900">
              {language === 'ar'
                ? 'تنظيم ملتقى الشباب الثقافي السنوي بمدينة كاندي'
                : 'Tenue de la rencontre culturelle annuelle des jeunes à Kandi'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'ar'
                ? 'مناقشة دور الثقافة الإسلامية في ترسيخ قيم التسامح والمسؤولية المجتمعية لدى الأجيال الصاعدة.'
                : 'Échanges fraternels et ateliers sur le rôle de la culture dans l\'engagement civique et moral de la jeunesse.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#0F5132] border border-emerald-200">
              {language === 'ar' ? 'عمل اجتماعي' : 'Action sociale'}
            </span>
            <h3 className="font-bold text-base text-stone-900">
              {language === 'ar'
                ? 'مبادرة التضامن والتكافل لمساندة الأسر المحتاجة'
                : 'Initiative de solidarité communautaire en faveur des familles'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'ar'
                ? 'حملة ميدانية لتوزيع المساعدات وتعزيز روابط الأخوة والتراحم بين أبناء المنطقة.'
                : 'Mobilisation des membres bénévoles pour apporter une assistance matérielle et morale aux plus vulnérables.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-[#0F5132] border border-emerald-200">
              {language === 'ar' ? 'محاضرة عامة' : 'Conférence'}
            </span>
            <h3 className="font-bold text-base text-stone-900">
              {language === 'ar'
                ? 'سلسلة لقاءات فكرية وتوجيهية لفائدة الشباب'
                : 'Cycle de conférences et débats sur les enjeux de l\'éducation'}
            </h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'ar'
                ? 'استضافة أساتذة ومربين لتناول قضايا النجاح في الحياة والتمسك بالقيم النبيلة.'
                : 'Des interventions inspirantes d\'universitaires et de guides communautaires pour orienter les jeunes vers la réussite.'}
            </p>
          </div>
        </div>
      </section>

      {/* 5. DERNIÈRES VIDÉOS YOUTUBE (SYNCHRONISÉES AUTOMATIQUEMENT) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F5132] uppercase tracking-wider">
              <Film className="w-4 h-4" />
              <span>{language === 'ar' ? 'توثيق مرئي ومحاضرات' : 'Médiathèque officielle'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              {t('media_section_title')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {t('media_section_subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('mediatheque')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#0F5132] hover:text-[#16A34A] transition-colors cursor-pointer"
            >
              <span>{t('media_section_btn')}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Grille de vidéos ou message sobre */}
        {latestVideos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-lg mx-auto space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0F5132] flex items-center justify-center mx-auto">
              <Youtube className="w-6 h-6 text-red-500" />
            </div>
            <h3 className="font-bold text-stone-800 text-base">
              {t('media_empty')}
            </h3>
            <p className="text-xs text-stone-500">
              {language === 'ar'
                ? 'تابعوا أنشطتنا وندواتنا عبر القناة الرسمية للجمعية على يوتيوب.'
                : 'Retrouvez prochainement les enregistrements vidéo de nos conférences et événements sur notre chaîne.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestVideos.slice(0, 3).map((video) => (
              <div
                key={video.id}
                onClick={() => onSelectVideo(video)}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
              >
                <div className="relative aspect-video bg-stone-900 overflow-hidden">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-stone-950/40 transition-colors" />

                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/95 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white translate-x-0.5" />
                    </div>
                  </div>

                  {video.duration && (
                    <div className={`absolute bottom-2.5 ${isRTL ? 'right-2.5' : 'left-2.5'} px-2 py-0.5 rounded bg-black/80 text-white text-[11px] font-mono font-medium flex items-center gap-1`}>
                      <Clock className="w-3 h-3 text-stone-300" />
                      <span>{video.duration}</span>
                    </div>
                  )}

                  {video.category && (
                    <div className={`absolute top-2.5 ${isRTL ? 'left-2.5' : 'right-2.5'}`}>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-stone-800 backdrop-blur-xs shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {video.category}
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      {video.category && (
                        <>
                          <span className="font-semibold text-emerald-700">{video.category}</span>
                          <span>·</span>
                        </>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(video.published_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-stone-900 group-hover:text-[#0F5132] transition-colors line-clamp-2 leading-snug">
                      {video.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="text-emerald-700 font-bold group-hover:underline flex items-center gap-1">
                      <span>{t('media_watch_btn')}</span>
                      <ArrowIcon className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 6. APPEL À PARTICIPATION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-linear-to-r from-[#0F5132] via-[#16A34A] to-emerald-800 text-white p-6 sm:p-10 lg:p-12 overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              {t('call_action_title')}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              {t('call_action_desc')}
            </p>
            <div className="pt-2">
              <button
                onClick={() => onSelectTab('contact')}
                className="px-6 py-3.5 bg-white text-[#0F5132] hover:bg-stone-100 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span>{t('call_action_btn')}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
