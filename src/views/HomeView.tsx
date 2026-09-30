import React from 'react';
import {
  Play,
  ArrowLeft,
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
  return (
    <div className="space-y-20 pb-20 text-right">
      {/* 1. Hero Section */}
      <section className="relative bg-stone-900 text-stone-100 overflow-hidden">
        {/* Background photo with measured contrast scrim */}
        <div className="absolute inset-0">
          <img
            src={SCHOOL_IMAGES.heroCampus}
            alt="حرم مجمع العون المباشر التعليمي في بنين"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-45 scale-105 animate-fade-in"
          />
          <div className="absolute inset-0 bg-gradient-to-l from-stone-950/95 via-stone-950/80 to-transparent" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-32 lg:py-36">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2.5 text-xs font-bold tracking-widest uppercase text-emerald-400">
              <span className="w-6 h-0.5 bg-[#16A34A]" />
              <span>جمعية العون المباشر · جمهورية بنين</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              نعلّم لنرتقي، <br />
              <span className="italic font-normal text-emerald-300">ونبني مستقبلاً يليق بأبنائنا.</span>
            </h1>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed max-w-2xl font-medium">
              في مجمع العون المباشر التعليمي في بنين، نوفر بيئة تربوية رائدة تجمع بين التفوق الأكاديمي، إتقان اللغتين العربية والفرنسية، والتربية الأخلاقية ورعاية المواهب من مرحلة الروضة إلى الثانوية والتأهيل المهني.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => onSelectTab('contact')}
                className="px-6 py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-sm font-bold shadow-lg transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <span>طلب التسجيل والمعلومات</span>
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectTab('videos')}
                className="px-6 py-3.5 bg-stone-800/80 hover:bg-stone-700/90 text-white rounded-xl text-sm font-semibold border border-stone-700 transition-all cursor-pointer inline-flex items-center gap-2"
              >
                <Youtube className="w-4 h-4 text-red-500" />
                <span>مشاهدة أنشطتنا المصورة</span>
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
              <span>مزامنة مباشرة من قناة يوتيوب</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              أحدث التغطيات المرئية من المجمع
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              يتم تحديث هذه القائمة تلقائياً بأحدث الفيديوهات المنشورة على قناة يوتيوب الرسمية.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => onSelectTab('videos')}
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#16A34A] hover:text-[#15803D] transition-colors cursor-pointer"
            >
              <span>مشاهدة جميع الفيديوهات</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Video Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {latestVideos.slice(0, 3).map((video) => {
            const formattedDate = new Date(video.published_at).toLocaleDateString('ar-EG', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            });

            return (
              <div
                key={video.id}
                onClick={() => onSelectVideo(video)}
                className="group bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md hover:border-emerald-500 transition-all cursor-pointer flex flex-col"
              >
                <div className="relative aspect-video bg-stone-950 overflow-hidden">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-80" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-current ml-0.5" />
                    </div>
                  </div>
                  {video.duration && (
                    <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-black/80 text-white font-mono text-[11px] rounded">
                      {video.duration}
                    </span>
                  )}
                  <span className="absolute top-2.5 right-2.5 px-2 py-0.5 bg-white/90 text-[#16A34A] text-[10px] font-bold rounded">
                    {video.category}
                  </span>
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-xs text-stone-500">
                      <span className="font-bold text-[#16A34A]">{video.category}</span>
                      <span aria-hidden="true">·</span>
                      <span>{formattedDate}</span>
                    </div>
                    <h3 className="font-bold text-base text-stone-900 group-hover:text-[#16A34A] transition-colors line-clamp-2 leading-snug">
                      {video.title}
                    </h3>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="text-red-600 font-bold group-hover:underline inline-flex items-center gap-1">
                      <Play className="w-3 h-3 fill-current" />
                      <span>مشاهدة الآن</span>
                    </span>
                    <span className="text-[11px] text-stone-400">مشغل يوتيوب</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. The 4 Educational Pillars */}
      <section className="bg-stone-100/70 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
            <span className="text-xs font-bold text-[#16A34A] uppercase tracking-widest">
              الرؤية التربوية
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900">
              ركائز التعليم في مجمع العون المباشر
            </h2>
            <p className="text-sm text-stone-600">
              منهج متكامل يجمع بين التحصيل العلمي الرصين، وغرس الفضائل، واكتشاف إبداعات كل طالب.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3 text-right">
              <div className="w-10 h-10 rounded-lg bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                التفوق الأكاديمي واللغات
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                تدريس وفق المعايير الرسمية لوزارة التعليم في بنين، مع عناية فائقة بإتقان اللغات العربية والفرنسية والإنجليزية.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3 text-right">
              <div className="w-10 h-10 rounded-lg bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                القرآن الكريم والآداب
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                حلقات يومية لتحفيظ القرآن الكريم وتجويده، وتعليم الأخلاق السامية وفنون الخطابة والإلقاء.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3 text-right">
              <div className="w-10 h-10 rounded-lg bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                كفالة الأيتام والعدالة
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                رعاية شاملة للأيتام والمحتاجين تشمل التعليم المجاني، الزي المدرسي، التغذية والمتابعة الصحية المستمرة.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3 text-right">
              <div className="w-10 h-10 rounded-lg bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                العلوم والابتكار التقني
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                مختبرات حاسوب متطورة وورش تطبيقية في الفيزياء والكيمياء وعلوم الروبوت لإعداد كوادر المستقبل.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Activities Teaser with Real Generated Photos */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
          <div>
            <span className="text-xs font-bold text-[#16A34A] uppercase tracking-widest">
              الحياة المدرسية
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 mt-1">
              أنشطة غنية ومتنوعة
            </h2>
          </div>
          <button
            onClick={() => onSelectTab('activites')}
            className="text-xs sm:text-sm font-bold text-[#16A34A] hover:text-[#15803D] transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>استكشاف جميع الأنشطة المدرسية</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            onClick={() => onSelectTab('activites', 'الأنشطة التعليمية')}
            className="group rounded-xl border border-stone-200 overflow-hidden bg-white hover:shadow-md transition-all cursor-pointer flex flex-col"
          >
            <div className="aspect-4/3 overflow-hidden bg-stone-100">
              <img
                src={SCHOOL_IMAGES.activityPedagogique}
                alt="الأنشطة التعليمية"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-stone-900 group-hover:text-[#16A34A] transition-colors">
                  الأنشطة التعليمية
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  مختبرات الحاسوب والعلوم ومسابقات الرياضيات واللغات.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#16A34A] pt-2 inline-flex items-center gap-1">
                المزيد <ArrowLeft className="w-3 h-3" />
              </span>
            </div>
          </div>

          <div
            onClick={() => onSelectTab('activites', 'الأنشطة الثقافية')}
            className="group rounded-xl border border-stone-200 overflow-hidden bg-white hover:shadow-md transition-all cursor-pointer flex flex-col"
          >
            <div className="aspect-4/3 overflow-hidden bg-stone-100">
              <img
                src={SCHOOL_IMAGES.activityCulturelle}
                alt="الأنشطة الثقافية"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-stone-900 group-hover:text-[#16A34A] transition-colors">
                  الأنشطة الثقافية والقرآنية
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  حفظ القرآن الكريم، المسرح الهادف وفنون الخطابة.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#16A34A] pt-2 inline-flex items-center gap-1">
                المزيد <ArrowLeft className="w-3 h-3" />
              </span>
            </div>
          </div>

          <div
            onClick={() => onSelectTab('activites', 'الأنشطة الرياضية')}
            className="group rounded-xl border border-stone-200 overflow-hidden bg-white hover:shadow-md transition-all cursor-pointer flex flex-col"
          >
            <div className="aspect-4/3 overflow-hidden bg-stone-100">
              <img
                src={SCHOOL_IMAGES.activitySportive}
                alt="الأنشطة الرياضية"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-stone-900 group-hover:text-[#16A34A] transition-colors">
                  الأنشطة الرياضية
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  دوري كرة القدم، ألعاب القوى والبطولات بين المراكز.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#16A34A] pt-2 inline-flex items-center gap-1">
                المزيد <ArrowLeft className="w-3 h-3" />
              </span>
            </div>
          </div>

          <div
            onClick={() => onSelectTab('activites', 'الرحلات المدرسية')}
            className="group rounded-xl border border-stone-200 overflow-hidden bg-white hover:shadow-md transition-all cursor-pointer flex flex-col"
          >
            <div className="aspect-4/3 overflow-hidden bg-stone-100">
              <img
                src={SCHOOL_IMAGES.activitySortie}
                alt="الرحلات المدرسية"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-4 space-y-1.5 flex-1 flex flex-col justify-between">
              <div>
                <h3 className="font-bold text-stone-900 group-hover:text-[#16A34A] transition-colors">
                  الرحلات الاستكشافية
                </h3>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                  زيارة المتاحف الوطنية والمعالم التاريخية والبيئية في بنين.
                </p>
              </div>
              <span className="text-[11px] font-bold text-[#16A34A] pt-2 inline-flex items-center gap-1">
                المزيد <ArrowLeft className="w-3 h-3" />
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Key Numbers & Institutional Trust */}
      <section className="bg-stone-900 text-stone-100 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="space-y-1">
              <p className="text-4xl sm:text-5xl font-extrabold text-[#16A34A] tabular-nums">
                100%
              </p>
              <p className="text-xs sm:text-sm text-stone-400">
                نسبة النجاح في الامتحانات الرسمية (BEPC & BAC)
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl sm:text-5xl font-extrabold text-[#16A34A] tabular-nums">
                +3,500
              </p>
              <p className="text-xs sm:text-sm text-stone-400">
                طالب وطالبة يستفيدون من التعليم والرعاية
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl sm:text-5xl font-extrabold text-[#16A34A] tabular-nums">
                15
              </p>
              <p className="text-xs sm:text-sm text-stone-400">
                مركزاً ومجمعاً تعليمياً تابعاً للعون المباشر
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-4xl sm:text-5xl font-extrabold text-[#16A34A] tabular-nums">
                3 لغات
              </p>
              <p className="text-xs sm:text-sm text-stone-400">
                تعليم ثنائي وثلاثي اللغة (عربي، فرنسي، إنجليزي)
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action / Admissions */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl font-extrabold text-stone-900">
          انضموا إلى مجمع العون المباشر التعليمي في بنين
        </h2>
        <p className="text-stone-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
          التسجيل متاح للأفواج الجديدة والمحولين. ندعوكم للتواصل مع الإدارة التعليمية للاطلاع على شروط القبول وبرامج المنح والكفالات المتاحة.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            onClick={() => onSelectTab('contact')}
            className="px-6 py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-sm font-bold shadow-xs transition-colors cursor-pointer"
          >
            استمارة طلب التسجيل والزيارة
          </button>
          <button
            onClick={() => onSelectTab('ecole')}
            className="px-6 py-3.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-xl text-sm font-semibold transition-colors cursor-pointer"
          >
            التعرف على رؤية العون المباشر
          </button>
        </div>
      </section>
    </div>
  );
};
