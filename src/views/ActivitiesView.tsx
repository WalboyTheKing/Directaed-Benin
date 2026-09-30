import React, { useState } from 'react';
import {
  Play,
  ArrowLeft,
  BookOpen,
  Music,
  Trophy,
  Compass,
  Check,
  Calendar,
  Sparkles,
  Youtube
} from 'lucide-react';
import { SCHOOL_IMAGES } from '../assets/images.ts';
import type { VideoCategory } from '../types/video.ts';

interface ActivitiesViewProps {
  onSelectTab: (tab: string, categoryFilter?: string) => void;
  defaultSubCategory?: string;
}

export const ActivitiesView: React.FC<ActivitiesViewProps> = ({
  onSelectTab,
  defaultSubCategory = 'all',
}) => {
  const [selectedSubTab, setSelectedSubTab] = useState<string>(defaultSubCategory || 'all');

  const subCategories = [
    { id: 'all', label: 'جميع الأنشطة' },
    { id: 'pedagogique', label: 'الأنشطة التعليمية', categoryName: 'الأنشطة التعليمية' },
    { id: 'culturelle', label: 'الأنشطة الثقافية والقرآنية', categoryName: 'الأنشطة الثقافية' },
    { id: 'sportive', label: 'الأنشطة الرياضية', categoryName: 'الأنشطة الرياضية' },
    { id: 'sortie', label: 'الرحلات المدرسية', categoryName: 'الرحلات المدرسية' },
  ];

  return (
    <div className="py-12 bg-stone-50 min-h-screen space-y-12 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 border-b border-stone-200 pb-8">
          <span className="text-xs font-bold text-[#16A34A] uppercase tracking-widest">
            الأنشطة المدرسية واللاصفية
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
            أنشطة مجمع العون المباشر
          </h1>
          <p className="text-base text-stone-600 leading-relaxed">
            لأن التعليم بناء شامل للشخصية، نقدم برامج حيوية تشمل المسابقات القرآنية، نوادي الروبوت، دوريات كرة القدم والرحلات الثقافية الهادفة.
          </p>
        </div>

        {/* Sub-navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-stone-200">
          {subCategories.map((sub) => {
            const isActive = selectedSubTab === sub.id;
            return (
              <button
                key={sub.id}
                onClick={() => setSelectedSubTab(sub.id)}
                className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-[#16A34A] text-white shadow-xs'
                    : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
                }`}
              >
                {sub.label}
              </button>
            );
          })}
        </div>

        {/* 1. Activités Pédagogiques */}
        {(selectedSubTab === 'all' || selectedSubTab === 'pedagogique') && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 rounded-xl overflow-hidden aspect-4/3 bg-stone-100 shadow-sm">
              <img
                src={SCHOOL_IMAGES.activityPedagogique}
                alt="الأنشطة العلمية والمختبرات"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
                <BookOpen className="w-4 h-4 text-[#16A34A]" />
                <span>العلوم، التكنولوجيا واللغات</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                الأنشطة العلمية والتطبيقية
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                نوفر بيئة تفاعلية لاكتساب المهارات الرقمية والبحث العلمي من خلال التجارب المعملية والنوادي التكنولوجية ومسابقات المناظرة اللغوية.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 pt-1">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>نادي البرمجة والحاسوب للمبتدئين والمتقدمين</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>أولمبياد الرياضيات والعلوم الطبيعية</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>نادي المناظرة باللغتين العربية والفرنسية</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>دروس التقوية والمتابعة الأكاديمية المجانية</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onSelectTab('videos', 'الأنشطة التعليمية')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  <span>مشاهدة فيديوهات الأنشطة العلمية</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Activités Culturelles */}
        {(selectedSubTab === 'all' || selectedSubTab === 'culturelle') && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 lg:order-2 rounded-xl overflow-hidden aspect-4/3 bg-stone-100 shadow-sm">
              <img
                src={SCHOOL_IMAGES.activityCulturelle}
                alt="المسابقات الثقافية والقرآنية"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-7 lg:order-1 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#16A34A]">
                <Music className="w-4 h-4 text-[#16A34A]" />
                <span>القرآن الكريم، الفنون والخطابة</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                الأنشطة الثقافية والقرآنية
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                يحتل حفظ القرآن الكريم وتعلم قواعد التجويد مكانة مركزية في مسار طلابنا، إلى جانب الخط العربي والمسرح التعليمي الهادف وفنون الإنشاد.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 pt-1">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>المسابقة الوطنية السنوية لحفظ وتجويد القرآن الكريم</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>ورش الخط العربي والزخرفة الإسلامية</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>فرقة المسرح المدرسي والاسكتشات التربوية</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>الأناشيد الهادفة وإلقاء الشعر العربي الفصيح</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onSelectTab('videos', 'الأنشطة الثقافية')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  <span>مشاهدة مسابقات القرآن والخطابة</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 3. Activités Sportives */}
        {(selectedSubTab === 'all' || selectedSubTab === 'sportive') && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 rounded-xl overflow-hidden aspect-4/3 bg-stone-100 shadow-sm">
              <img
                src={SCHOOL_IMAGES.activitySportive}
                alt="البطولات الرياضية وكرة القدم"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-700">
                <Trophy className="w-4 h-4 text-blue-700" />
                <span>الرياضة المدرسية واللياقة البدنية</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                الأنشطة والبطولات الرياضية
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                العقل السليم في الجسم السليم؛ ينظم المجمع دوريات دورية في كرة القدم وألعاب القوى تزرع روح التآخي والتعاون والمنافسة الإيجابية.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 pt-1">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>دوري العون المباشر السنوي لكرة القدم بين الفروع</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>سباقات الجري والعدو الريفي السنوي</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>دوري كرة اليد وكرة السلة للبنين والبنات</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>اليوم الرياضي العائلي المفتوح</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onSelectTab('videos', 'الأنشطة الرياضية')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  <span>مشاهدة أهداف ومباريات المجمع</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 4. Sorties Scolaires */}
        {(selectedSubTab === 'all' || selectedSubTab === 'sortie') && (
          <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 lg:order-2 rounded-xl overflow-hidden aspect-4/3 bg-stone-100 shadow-sm">
              <img
                src={SCHOOL_IMAGES.activitySortie}
                alt="الرحلات المدرسية الميدانية"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="lg:col-span-7 lg:order-1 space-y-4">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700">
                <Compass className="w-4 h-4 text-amber-700" />
                <span>الرحلات والاستكشاف الميداني</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                الرحلات والزيارات الميدانية
              </h2>
              <p className="text-sm text-stone-600 leading-relaxed">
                ترسيخاً لربط التعليم بالحياة الواقعية، ينظم المجمع رحلات تعليمية واستطلاعية للتعرف على معالم بنين التاريخية والطبيعية والاقتصادية.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-stone-700 pt-1">
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>زيارة المعالم والمتاحف التاريخية في مدينة ويداه</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>جولة استكشافية للقرية العائمة في جانفييه (Ganvié)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>رحلات علمية للمحميات الطبيعية ومزارع الإنتاج</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="w-3.5 h-3.5 text-[#16A34A]" />
                  <span>مخيمات كشفية وتربوية لتعزيز الاعتماد على النفس</span>
                </li>
              </ul>
              <div className="pt-2">
                <button
                  onClick={() => onSelectTab('videos', 'الرحلات المدرسية')}
                  className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-900 hover:bg-stone-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  <Youtube className="w-3.5 h-3.5 text-red-500" />
                  <span>مشاهدة تسجيلات وتقارير الرحلات</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
