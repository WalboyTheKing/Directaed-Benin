import React from 'react';
import {
  Play,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Award,
  Users,
  Compass,
  CheckCircle2,
  Calendar,
  Youtube,
  Clock,
  Sparkles
} from 'lucide-react';
import { SCHOOL_IMAGES } from '../assets/images.ts';
import { useLanguage } from '../context/LanguageContext.tsx';
import type { Video } from '../types/video.ts';

interface HomeViewProps {
  onSelectTab: (tab: string, categoryFilter?: string) => void;
  latestVideos: Video[];
  onSelectVideo: (video: Video) => void;
  onOpenSyncModal: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onSelectTab,
  latestVideos,
  onSelectVideo,
  onOpenSyncModal,
}) => {
  const { t, isRTL, language } = useLanguage();
  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  return (
    <div className={`space-y-20 pb-20 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* 1. Hero Section */}
      <section className="relative bg-stone-900 text-stone-100 overflow-hidden">
        {/* Background photo */}
        <div className="absolute inset-0">
          <img
            src={SCHOOL_IMAGES.heroCampus}
            alt="Campus DirectAid Bénin"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-45 scale-105 animate-fade-in"
          />
          <div className={`absolute inset-0 bg-gradient-to-${isRTL ? 'l' : 'r'} from-stone-950/95 via-stone-950/80 to-transparent`} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-36">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2.5 text-xs font-bold tracking-widest uppercase text-emerald-400">
              <span className="w-6 h-0.5 bg-[#16A34A]" />
              <span>{t('hero_org')}</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {t('hero_title_line1')} <br />
              <span className="italic font-normal text-emerald-300">{t('hero_title_line2')}</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl font-medium">
              {t('hero_desc')}
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onSelectTab('contact')}
                className="px-6 py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-sm font-bold shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>{t('hero_btn_enroll')}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectTab('videos')}
                className="px-6 py-3.5 bg-stone-800/80 hover:bg-stone-700/90 text-white rounded-xl text-sm font-semibold border border-stone-700 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Youtube className="w-4 h-4 text-red-500" />
                <span>{t('hero_btn_videos')}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Automated YouTube Video Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 uppercase tracking-wider">
              <Youtube className="w-4 h-4" />
              <span>{t('hero_badge_sync')}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              {t('section_videos_title')}
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              {t('section_videos_subtitle')}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('videos')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#16A34A] hover:text-[#15803D] transition-colors cursor-pointer"
            >
              <span>{t('section_videos_btn')}</span>
              <ArrowIcon className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {latestVideos.slice(0, 3).map((video) => (
            <div
              key={video.id}
              onClick={() => onSelectVideo(video)}
              className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
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

                <div className={`absolute top-2.5 ${isRTL ? 'left-2.5' : 'right-2.5'}`}>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-stone-800 backdrop-blur-xs shadow-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    {video.category}
                  </span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="font-semibold text-emerald-700">{video.category}</span>
                    <span>·</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(video.published_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : language === 'fr' ? 'fr-FR' : 'en-US', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-stone-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug">
                    {video.title}
                  </h3>
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="text-emerald-700 font-bold group-hover:underline flex items-center gap-1">
                    <span>{t('videos_watch_btn')}</span>
                    <ArrowIcon className="w-3 h-3" />
                  </span>
                  <span className="text-[11px] text-stone-400">YouTube Player</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Educational Vision Section */}
      <section className="bg-stone-100/70 border-y border-stone-200 py-16 sm:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-[#16A34A] tracking-wider uppercase">
              {t('section_vision_tag')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
              {t('section_vision_title')}
            </h2>
            <p className="text-sm text-stone-600">
              {t('section_vision_subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center font-bold">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-stone-900">{t('vision_item1_title')}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t('vision_item1_desc')}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center font-bold">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-stone-900">{t('vision_item2_title')}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t('vision_item2_desc')}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center font-bold">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-stone-900">{t('vision_item3_title')}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t('vision_item3_desc')}</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#16A34A] flex items-center justify-center font-bold">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-base text-stone-900">{t('vision_item4_title')}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{t('vision_item4_desc')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Activities Showcase with Authentic Images */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-[#16A34A] tracking-wider uppercase">
              {t('section_activities_tag')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              {t('section_activities_title')}
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('activites')}
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#16A34A] hover:text-[#15803D] transition-colors cursor-pointer"
          >
            <span>{t('section_activities_btn')}</span>
            <ArrowIcon className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            onClick={() => onSelectTab('activites', 'pedagogiques')}
            className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer aspect-4/5"
          >
            <img
              src={SCHOOL_IMAGES.activityPedagogique}
              alt="Activités pédagogiques DirectAid Bénin"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent p-5 flex flex-col justify-end text-white">
              <span className="text-xs font-bold text-emerald-400">{t('cat_pedagogy')}</span>
              <h3 className="text-lg font-bold mt-1">
                {language === 'ar' ? 'الأنشطة التعليمية والمختبرات' : language === 'fr' ? 'Activités Pédagogiques & Labos' : 'Academic & Science Labs'}
              </h3>
              <p className="text-xs text-stone-300 line-clamp-2 mt-1">
                {language === 'ar' ? 'معامل الحاسوب والعلوم ومسابقات الرياضيات واللغات.' : language === 'fr' ? 'Laboratoires de sciences, informatique et concours de langues.' : 'Computer labs, science workshops, and mathematics competitions.'}
              </p>
            </div>
          </div>

          <div
            onClick={() => onSelectTab('activites', 'culturelles')}
            className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer aspect-4/5"
          >
            <img
              src={SCHOOL_IMAGES.activityCulturelle}
              alt="Activités culturelles DirectAid Bénin"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent p-5 flex flex-col justify-end text-white">
              <span className="text-xs font-bold text-emerald-400">{t('cat_culture')}</span>
              <h3 className="text-lg font-bold mt-1">
                {language === 'ar' ? 'الأنشطة الثقافية والقرآنية' : language === 'fr' ? 'Activités Culturelles & Coran' : 'Cultural & Quranic Events'}
              </h3>
              <p className="text-xs text-stone-300 line-clamp-2 mt-1">
                {language === 'ar' ? 'حفظ القرآن الكريم، المسرح الهادف وفنون الخطابة.' : language === 'fr' ? 'Mémorisation du Coran, théâtre et art oratoire.' : 'Quran memorization circles, theatre, and public speaking.'}
              </p>
            </div>
          </div>

          <div
            onClick={() => onSelectTab('activites', 'sportives')}
            className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer aspect-4/5"
          >
            <img
              src={SCHOOL_IMAGES.activitySportive}
              alt="Activités sportives DirectAid Bénin"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent p-5 flex flex-col justify-end text-white">
              <span className="text-xs font-bold text-emerald-400">{t('cat_sports')}</span>
              <h3 className="text-lg font-bold mt-1">
                {language === 'ar' ? 'الأنشطة والبطولات الرياضية' : language === 'fr' ? 'Tournois Sportifs' : 'Sports & Athletics'}
              </h3>
              <p className="text-xs text-stone-300 line-clamp-2 mt-1">
                {language === 'ar' ? 'دوري كرة القدم، ألعاب القوى والبطولات بين المراكز.' : language === 'fr' ? 'Ligue de football, athlétisme et championnats inter-centres.' : 'Football league, athletics, and inter-center championships.'}
              </p>
            </div>
          </div>

          <div
            onClick={() => onSelectTab('activites', 'sorties')}
            className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all cursor-pointer aspect-4/5"
          >
            <img
              src={SCHOOL_IMAGES.activitySortie}
              alt="Sorties scolaires DirectAid Bénin"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent p-5 flex flex-col justify-end text-white">
              <span className="text-xs font-bold text-emerald-400">{t('cat_trips')}</span>
              <h3 className="text-lg font-bold mt-1">
                {language === 'ar' ? 'الرحلات الاستكشافية' : language === 'fr' ? 'Excursions & Sorties' : 'Excursions & Field Trips'}
              </h3>
              <p className="text-xs text-stone-300 line-clamp-2 mt-1">
                {language === 'ar' ? 'زيارات المتاحف الوطنية والمعالم التاريخية والبيئية في بنين.' : language === 'fr' ? 'Visites des musées, sites historiques et patrimoniaux du Bénin.' : 'Visits to national museums, historical sites, and eco-parks.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Key Statistics */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-stone-800">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-stone-800">
            <div className="space-y-1 pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">{t('stat_success_rate')}</p>
              <p className="text-xs sm:text-sm text-stone-400">{t('stat_success_label')}</p>
            </div>
            <div className="space-y-1 pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">{t('stat_students_count')}</p>
              <p className="text-xs sm:text-sm text-stone-400">{t('stat_students_label')}</p>
            </div>
            <div className="space-y-1 pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">{t('stat_centers_count')}</p>
              <p className="text-xs sm:text-sm text-stone-400">{t('stat_centers_label')}</p>
            </div>
            <div className="space-y-1 pt-4 lg:pt-0">
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-400 font-mono">{t('stat_languages_count')}</p>
              <p className="text-xs sm:text-sm text-stone-400">{t('stat_languages_label')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action (Inscription) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-linear-to-r from-[#16A34A] to-emerald-700 text-white p-8 sm:p-12 overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
              {t('cta_join_title')}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
              {t('cta_join_desc')}
            </p>
            <div className="pt-2">
              <button
                onClick={() => onSelectTab('contact')}
                className="px-6 py-3.5 bg-white text-[#16A34A] hover:bg-stone-100 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-colors cursor-pointer inline-flex items-center gap-2"
              >
                <span>{t('cta_join_btn')}</span>
                <ArrowIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
