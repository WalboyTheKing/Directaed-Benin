import React from 'react';
import {
  Play,
  Calendar,
  Clock,
  Search,
  ArrowUpDown,
  Film
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import type { Video, VideoCategory } from '../types/video.ts';

interface VideosViewProps {
  videos: Video[];
  categories: { name: string; count: number }[];
  selectedCategory: VideoCategory;
  onSelectCategory: (category: VideoCategory) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  sortOrder: 'recent' | 'oldest';
  onSortChange: (sort: 'recent' | 'oldest') => void;
  isLoading: boolean;
  onSelectVideo: (video: Video) => void;
}

export const VideosView: React.FC<VideosViewProps> = ({
  videos,
  categories,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  sortOrder,
  onSortChange,
  isLoading,
  onSelectVideo,
}) => {
  const { t, isRTL, language } = useLanguage();

  const categoryFilters: { key: VideoCategory; label: string }[] = [
    { key: 'الكل', label: t('cat_all') },
    { key: 'الأنشطة التعليمية', label: t('cat_pedagogy') },
    { key: 'الأنشطة الثقافية', label: t('cat_culture') },
    { key: 'الأنشطة الرياضية', label: t('cat_sports') },
    { key: 'الرحلات المدرسية', label: t('cat_trips') },
    { key: 'الحفلات والمناسبات', label: t('cat_ceremonies') },
  ];

  return (
    <div className={`py-12 bg-stone-50 min-h-screen ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header éditorial public */}
        <div className="border-b border-stone-200 pb-8 space-y-3 max-w-3xl">
          <div className="flex items-center gap-2 text-xs font-bold text-[#16A34A] tracking-wider uppercase">
            <Film className="w-4 h-4" />
            <span>{t('hero_badge_editorial')}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
            {t('videos_hero_title')}
          </h1>
          <p className="text-base text-stone-600 leading-relaxed">
            {t('videos_hero_desc')}
          </p>
        </div>

        {/* Filter Bar & Search Controls */}
        <div className="space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoryFilters.map((cat) => {
              const isActive = selectedCategory === cat.key;
              const countObj = categories.find((c) => c.name === cat.key);
              const count = countObj ? countObj.count : 0;

              return (
                <button
                  key={cat.key}
                  onClick={() => onSelectCategory(cat.key)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#16A34A] text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <span>{cat.label}</span>
                  {count > 0 && (
                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded ${
                        isActive ? 'bg-[#15803D] text-white' : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search Input & Sort Selector */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className={`absolute ${isRTL ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400`} />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder={t('videos_search_placeholder')}
                className={`w-full ${isRTL ? 'pr-10 pl-4 text-right' : 'pl-10 pr-4 text-left'} py-2 bg-white text-xs sm:text-sm text-stone-900 placeholder-stone-400 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] transition-shadow`}
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className={`absolute ${isRTL ? 'left-3' : 'right-3'} top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600`}
                >
                  ✕
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 whitespace-nowrap">
                {language === 'ar' ? 'الترتيب:' : language === 'fr' ? 'Trier par :' : 'Sort by:'}
              </span>
              <div className="relative inline-block">
                <select
                  value={sortOrder}
                  onChange={(e) => onSortChange(e.target.value as 'recent' | 'oldest')}
                  className={`appearance-none bg-white text-xs font-semibold text-stone-800 border border-stone-200 rounded-lg ${isRTL ? 'pr-3 pl-8 text-right' : 'pl-3 pr-8 text-left'} py-2 focus:outline-none focus:ring-2 focus:ring-[#16A34A] cursor-pointer`}
                >
                  <option value="recent">{t('videos_sort_recent')}</option>
                  <option value="oldest">{t('videos_sort_oldest')}</option>
                </select>
                <ArrowUpDown className={`absolute ${isRTL ? 'left-2.5' : 'right-2.5'} top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none`} />
              </div>
            </div>
          </div>
        </div>

        {/* Video Grid Responsive: Desktop 3, Tablet 2, Mobile 1 */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs animate-pulse"
              >
                <div className="aspect-video bg-stone-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-stone-200 rounded w-3/4" />
                  <div className="h-3 bg-stone-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center max-w-md mx-auto space-y-3 shadow-xs">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Film className="w-6 h-6 text-stone-400" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">
              {t('videos_empty')}
            </h3>
            {searchQuery && (
              <button
                onClick={() => {
                  onSelectCategory('الكل');
                  onSearchChange('');
                }}
                className="text-xs text-[#16A34A] hover:underline font-bold"
              >
                {language === 'ar' ? 'عرض جميع الفيديوهات' : language === 'fr' ? 'Effacer la recherche' : 'Clear search'}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => onSelectVideo(video)}
                className="group bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
              >
                {/* Thumbnail ratio 16:9 */}
                <div className="relative aspect-video bg-stone-900 overflow-hidden">
                  <img
                    src={video.thumbnail_url}
                    alt={video.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-stone-950/40 transition-colors" />

                  {/* Bouton Play */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-red-600/95 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                      <Play className="w-5 h-5 fill-white translate-x-0.5" />
                    </div>
                  </div>

                  {/* Durée */}
                  {video.duration && (
                    <div className={`absolute bottom-2.5 ${isRTL ? 'right-2.5' : 'left-2.5'} px-2 py-0.5 rounded bg-black/80 text-white text-[11px] font-mono font-medium flex items-center gap-1`}>
                      <Clock className="w-3 h-3 text-stone-300" />
                      <span>{video.duration}</span>
                    </div>
                  )}

                  {/* Catégorie */}
                  {video.category && (
                    <div className={`absolute top-2.5 ${isRTL ? 'left-2.5' : 'right-2.5'}`}>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/90 text-stone-800 backdrop-blur-xs shadow-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {video.category}
                      </span>
                    </div>
                  )}
                </div>

                {/* Contenu */}
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

                    {video.description && (
                      <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                        {video.description}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                    <span className="text-emerald-700 font-bold group-hover:underline flex items-center gap-1">
                      <span>{t('videos_watch_btn')}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
