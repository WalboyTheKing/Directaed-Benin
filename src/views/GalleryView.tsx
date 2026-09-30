import React, { useState } from 'react';
import { Camera, X, ZoomIn, Calendar, Tag } from 'lucide-react';
import { SCHOOL_IMAGES } from '../assets/images.ts';

interface GalleryPhoto {
  id: string;
  title: string;
  category: string;
  date: string;
  url: string;
}

const GALLERY_PHOTOS: GalleryPhoto[] = [
  {
    id: 'p1',
    title: 'إطلالة على الحرم المدرسي والساحة الخضراء لمجمع العون المباشر',
    category: 'المجمع والساحات',
    date: 'سبتمبر 2026',
    url: SCHOOL_IMAGES.heroCampus,
  },
  {
    id: 'p2',
    title: 'درس تطبيقي في مختبر العلوم والمجهر الإلكتروني',
    category: 'التعليم',
    date: 'سبتمبر 2026',
    url: SCHOOL_IMAGES.activityPedagogique,
  },
  {
    id: 'p3',
    title: 'حفل تلاوة وتكريم حفظة القرآن الكريم في قاعة المجمع',
    category: 'الثقافة والقرآن',
    date: 'سبتمبر 2026',
    url: SCHOOL_IMAGES.activityCulturelle,
  },
  {
    id: 'p4',
    title: 'لقطة حماسية من دوري كرة القدم بين فرق المراكز التعليمية',
    category: 'الرياضة',
    date: 'يونيو 2026',
    url: SCHOOL_IMAGES.activitySportive,
  },
  {
    id: 'p5',
    title: 'رحلة استكشافية وتدوين ملاحظات في متحف ويداه التاريخي',
    category: 'الرحلات',
    date: 'مايو 2026',
    url: SCHOOL_IMAGES.activitySortie,
  },
  {
    id: 'p6',
    title: 'فرحة الطلاب باستلام شهادات النجاح في الامتحانات الرسمية',
    category: 'المناسبات والتكريم',
    date: 'يوليو 2026',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'p7',
    title: 'الأمسية الثقافية السنوية ومسرحية الآداب الإسلامية',
    category: 'الثقافة والقرآن',
    date: 'ديسمبر 2025',
    url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=900&auto=format&fit=crop&q=80',
  },
  {
    id: 'p8',
    title: 'تدريب تفاعلي في معمل الحاسوب وتكنولوجيا التعليم',
    category: 'التعليم',
    date: 'فبراير 2026',
    url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900&auto=format&fit=crop&q=80',
  },
];

export const GalleryView: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('الكل');
  const [activePhoto, setActivePhoto] = useState<GalleryPhoto | null>(null);

  const categories = ['الكل', 'المجمع والساحات', 'التعليم', 'الثقافة والقرآن', 'الرياضة', 'الرحلات', 'المناسبات والتكريم'];

  const filteredPhotos =
    selectedCategory === 'الكل'
      ? GALLERY_PHOTOS
      : GALLERY_PHOTOS.filter((p) => p.category === selectedCategory);

  return (
    <div className="py-12 bg-stone-50 min-h-screen text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 border-b border-stone-200 pb-8">
          <span className="text-xs font-bold text-[#16A34A] uppercase tracking-widest">
            ذاكرة المجمع واللحظات المتميزة
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
            معرض الصور الفوتوغرافية
          </h1>
          <p className="text-base text-stone-600 leading-relaxed">
            جولة بصرية توثق مسيرة التعلم والإنجازات والأنشطة المشتركة لأبنائنا وبناتنا في مجمع العون المباشر بنين.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-[#16A34A] text-white shadow-xs'
                  : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Photos Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPhotos.map((photo) => (
            <div
              key={photo.id}
              onClick={() => setActivePhoto(photo)}
              className="group relative bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col text-right"
            >
              <div className="aspect-4/3 bg-stone-100 overflow-hidden relative">
                <img
                  src={photo.url}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-stone-950/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-10 h-10 rounded-full bg-white/90 text-stone-900 flex items-center justify-center shadow-lg">
                    <ZoomIn className="w-5 h-5" />
                  </div>
                </div>
              </div>
              <div className="p-4 space-y-1">
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-bold text-[#16A34A]">{photo.category}</span>
                  <span>{photo.date}</span>
                </div>
                <h3 className="text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-[#16A34A] transition-colors">
                  {photo.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activePhoto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/90 backdrop-blur-sm"
          onClick={() => setActivePhoto(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-stone-900 rounded-2xl overflow-hidden shadow-2xl border border-stone-800 text-right"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative max-h-[75vh] flex items-center justify-center bg-black">
              <img
                src={activePhoto.url}
                alt={activePhoto.title}
                referrerPolicy="no-referrer"
                className="max-h-[75vh] w-auto object-contain"
              />
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 left-4 p-2 rounded-full bg-black/60 text-white hover:bg-black/90 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-5 text-white flex items-center justify-between border-t border-stone-800">
              <div>
                <h3 className="text-base font-bold">{activePhoto.title}</h3>
                <div className="flex items-center gap-2 text-xs text-stone-400 mt-0.5">
                  <span className="text-[#16A34A] font-bold">{activePhoto.category}</span>
                  <span aria-hidden="true">·</span>
                  <span>{activePhoto.date}</span>
                </div>
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className="px-4 py-2 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                إغلاق
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
