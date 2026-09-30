import React, { useState } from 'react';
import {
  Play,
  Calendar,
  Clock,
  Search,
  RefreshCw,
  Sparkles,
  ArrowUpDown,
  Youtube,
  AlertCircle
} from 'lucide-react';
import type { Video, VideoCategory, SyncStatus } from '../types/video.ts';

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
  onOpenSyncModal: () => void;
  syncStatus: SyncStatus | null;
  onRefresh: () => void;
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
  onOpenSyncModal,
  syncStatus,
  onRefresh,
}) => {
  const categoryFilters: VideoCategory[] = [
    'الكل',
    'الأنشطة التعليمية',
    'الأنشطة الثقافية',
    'الأنشطة الرياضية',
    'الرحلات المدرسية',
    'الحفلات والمناسبات',
  ];

  return (
    <div className="py-12 bg-stone-50 min-h-screen text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Header section with Editorial Typography */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-bold text-red-600 tracking-wider">
              <Youtube className="w-4 h-4" />
              <span>القناة الرسمية على يوتيوب · مزامنة ذكية وتلقائية</span>
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
              أنشطة مجمع العون المباشر في فيديوهات
            </h1>
            <p className="text-base text-stone-600 leading-relaxed">
              جميع التغطيات المصورة لحفلات التكريم، البطولات الرياضية، التجارب العلمية في المختبرات والرحلات المدرسية تُدرج تلقائياً هنا بمجرد نشرها على يوتيوب.
            </p>
          </div>

          {/* Quick sync diagnostic trigger */}
          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenSyncModal}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${syncStatus?.isSyncing ? 'animate-spin text-emerald-600' : ''}`} />
              <span>حالة المزامنة وقاعدة البيانات</span>
            </button>
          </div>
        </div>

        {/* Informative Auto-Sync Banner */}
        <div className="p-4 bg-white rounded-xl border border-stone-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
            <div className="text-xs text-stone-600">
              <span className="font-bold text-stone-900">المزامنة الآلية نشطة:</span> بمجرد نشر أي فيديو جديد على قناة يوتيوب للمجمع، يتم اكتشافه وحفظه وعرضه على الموقع فوراً دون أي تدخل بشري.
            </div>
          </div>
          <div className="text-xs text-stone-500 shrink-0 flex items-center gap-3">
            <span>آخر فحص: {syncStatus?.lastSyncAt ? new Date(syncStatus.lastSyncAt).toLocaleTimeString('ar-EG') : 'منذ قليل'}</span>
            <button
              onClick={onRefresh}
              className="text-[#16A34A] hover:text-[#15803D] underline font-bold cursor-pointer"
            >
              تحديث الآن
            </button>
          </div>
        </div>

        {/* Filter Bar & Search Controls */}
        <div className="space-y-4">
          {/* Category Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categoryFilters.map((cat) => {
              const isActive = selectedCategory === cat;
              const countObj = categories.find((c) => c.name === cat);
              const count = countObj ? countObj.count : 0;

              return (
                <button
                  key={cat}
                  onClick={() => onSelectCategory(cat)}
                  className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-colors cursor-pointer flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#16A34A] text-white shadow-xs'
                      : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <span>{cat}</span>
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded ${
                      isActive ? 'bg-[#15803D] text-white' : 'bg-stone-100 text-stone-500'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Search Input & Sort Selector */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="البحث باسم النشاط، المسابقة أو المناسبة..."
                className="w-full pr-10 pl-4 py-2 bg-white text-xs sm:text-sm text-stone-900 placeholder-stone-400 border border-stone-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] transition-shadow text-right"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange('')}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400 hover:text-stone-600"
                >
                  مسح
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 whitespace-nowrap">الترتيب:</span>
              <div className="relative inline-block">
                <select
                  value={sortOrder}
                  onChange={(e) => onSortChange(e.target.value as 'recent' | 'oldest')}
                  className="appearance-none bg-white text-xs font-semibold text-stone-800 border border-stone-200 rounded-lg pr-3 pl-8 py-2 focus:outline-none focus:ring-2 focus:ring-[#16A34A] cursor-pointer text-right"
                >
                  <option value="recent">الأحدث أولاً</option>
                  <option value="oldest">الأقدم أولاً</option>
                </select>
                <ArrowUpDown className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Video Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs animate-pulse"
              >
                <div className="aspect-video bg-stone-200" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-stone-200 rounded w-1/3 mr-auto" />
                  <div className="h-5 bg-stone-200 rounded w-4/5" />
                  <div className="h-3 bg-stone-100 rounded w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : videos.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-stone-300 p-12 text-center max-w-lg mx-auto space-y-4 my-8">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              لم يتم العثور على أي مقطع فيديو
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {searchQuery
                ? `لا توجد نتائج مطابقة لـ "${searchQuery}". جرب كلمة بحث أخرى أو أعد تعيين الفلاتر.`
                : 'لا توجد فيديوهات مسجلة في هذا التصنيف حالياً.'}
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  onSelectCategory('الكل');
                  onSearchChange('');
                }}
                className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition-colors cursor-pointer"
              >
                عرض جميع الفيديوهات
              </button>
              <button
                onClick={onOpenSyncModal}
                className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
              >
                محاكاة نشر فيديو
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {
              const formattedDate = new Date(video.published_at).toLocaleDateString('ar-EG', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div
                  key={video.id}
                  onClick={() => onSelectVideo(video)}
                  className="group bg-white rounded-xl border border-stone-200 hover:border-emerald-500 hover:shadow-md transition-all duration-200 overflow-hidden flex flex-col cursor-pointer text-right"
                >
                  {/* Thumbnail container */}
                  <div className="relative aspect-video bg-stone-900 overflow-hidden">
                    <img
                      src={video.thumbnail_url}
                      alt={video.title}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Gradient scrim for contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                    {/* Centered Play Button on hover */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600/90 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                        <Play className="w-5 h-5 fill-current ml-0.5" />
                      </div>
                    </div>

                    {/* Duration badge inset in video corner */}
                    {video.duration && (
                      <span className="absolute bottom-2.5 left-2.5 px-2 py-0.5 bg-black/80 text-white font-mono text-[11px] rounded tracking-wide font-medium">
                        {video.duration}
                      </span>
                    )}

                    {/* Category subtle label inset top right */}
                    <span className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-white/95 backdrop-blur-xs text-[#16A34A] text-[11px] font-bold rounded">
                      {video.category}
                    </span>
                  </div>

                  {/* Card Content */}
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

                      {video.description && (
                        <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                          {video.description}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500 font-medium">
                      <span className="inline-flex items-center gap-1 text-red-600 font-bold group-hover:underline">
                        <Play className="w-3 h-3 fill-current" />
                        <span>تشغيل الفيديو</span>
                      </span>
                      <span className="text-[11px] text-stone-400">
                        {video.duration || 'دقة عالية HD'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
