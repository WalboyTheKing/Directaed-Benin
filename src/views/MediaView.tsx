import React, { useState, useEffect, useCallback } from 'react';
import {
  Play,
  Calendar,
  Clock,
  Search,
  ArrowUpDown,
  Film,
  Camera,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  Layers,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import type { Video, VideoCategory } from '../types/video.ts';
import type { GalleryAlbum, GalleryPhoto } from '../types/gallery.ts';
import { GALLERY_CATEGORIES } from '../types/gallery.ts';
import { PhotoLightbox } from '../components/PhotoLightbox.tsx';
import { PageHeader } from '../components/PageHeader.tsx';

interface MediaViewProps {
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

export const MediaView: React.FC<MediaViewProps> = ({
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
  const [activeTab, setActiveTab] = useState<'videos' | 'photos'>('videos');

  // État de la galerie dynamique
  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [isLoadingAlbums, setIsLoadingAlbums] = useState<boolean>(false);
  const [selectedAlbum, setSelectedAlbum] = useState<GalleryAlbum | null>(null);
  const [albumPhotos, setAlbumPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoadingPhotos, setIsLoadingPhotos] = useState<boolean>(false);

  // État de la visionneuse photo plein écran (Lightbox)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const ArrowBackIcon = isRTL ? ArrowRight : ArrowLeft;

  const categoryFilters: { key: VideoCategory; label: string }[] = [
    { key: 'الكل', label: t('cat_all') },
    { key: 'المحاضرات واللقاءات', label: t('cat_conferences') },
    { key: 'الأنشطة الدينية', label: t('cat_religious') },
    { key: 'أنشطة الشباب', label: t('cat_youth') },
    { key: 'الأنشطة الاجتماعية', label: t('cat_social') },
    { key: 'الأنشطة الثقافية', label: t('cat_culture') },
    { key: 'الأنشطة التعليمية', label: t('cat_education') },
    { key: 'الفعاليات والمناسبات', label: t('cat_events') },
  ];

  // Charger les albums publiés depuis l'API backend
  const fetchAlbums = useCallback(async () => {
    try {
      setIsLoadingAlbums(true);
      const res = await fetch('/api/gallery/albums');
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.albums)) {
          setAlbums(data.albums);
        }
      }
    } catch (err) {
      console.warn('[Gallery] Erreur lors du chargement des albums:', err);
    } finally {
      setIsLoadingAlbums(false);
    }
  }, []);

  // Charger les photos d'un album sélectionné
  const handleOpenAlbum = async (album: GalleryAlbum) => {
    setSelectedAlbum(album);
    try {
      setIsLoadingPhotos(true);
      const res = await fetch(`/api/gallery/albums/${album.id}`);
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.photos)) {
          setAlbumPhotos(data.photos);
        }
      }
    } catch (err) {
      console.warn('[Gallery Photos] Erreur:', err);
    } finally {
      setIsLoadingPhotos(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'photos') {
      fetchAlbums();
    }
  }, [activeTab, fetchAlbums]);

  // Libellé bilingue pour la catégorie de l'album
  const getCategoryLabel = (catName: string) => {
    const match = GALLERY_CATEGORIES.find((c) => c.id === catName);
    if (match) {
      return language === 'ar' ? match.name_ar : match.name_fr;
    }
    return catName;
  };

  return (
    <div className={`space-y-8 pb-20 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* En-tête atmosphérique et onglets intégrés */}
      <PageHeader
        title={t('nav_media')}
        subtitle={
          language === 'ar'
            ? 'تصفح كافة المحاضرات المسجلة، التغطيات الميدانية، ومعرض الصور والأنشطة الشبابية الموثقة تلقائياً.'
            : 'Retrouvez les enregistrements des conférences, les rencontres culturelles et les reportages photographiques de nos initiatives.'
        }
        kicker="A.J.M.C — Kandi · Chaîne YouTube & Archives Photographiques"
        icon={Film}
      >
        {/* Sous-onglets : Vidéos YouTube & Albums Photos intégrés à l'en-tête */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            onClick={() => {
              setActiveTab('videos');
              setSelectedAlbum(null);
            }}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
              activeTab === 'videos'
                ? 'bg-[#0F5132] text-white border border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                : 'bg-emerald-950/70 text-emerald-200 border border-emerald-800/60 hover:bg-emerald-900/60 backdrop-blur-xs'
            }`}
          >
            <Film className="w-4 h-4" />
            <span>{t('media_tab_videos')}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'videos' ? 'bg-emerald-900/90 text-white' : 'bg-emerald-900/50 text-emerald-300'
              }`}
            >
              YouTube
            </span>
          </button>

          <button
            onClick={() => setActiveTab('photos')}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 shadow-xs ${
              activeTab === 'photos'
                ? 'bg-[#0F5132] text-white border border-emerald-500/60 shadow-lg shadow-emerald-950/40'
                : 'bg-emerald-950/70 text-emerald-200 border border-emerald-800/60 hover:bg-emerald-900/60 backdrop-blur-xs'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>{t('media_tab_photos')}</span>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full ${
                activeTab === 'photos' ? 'bg-emerald-900/90 text-white' : 'bg-emerald-900/50 text-emerald-300'
              }`}
            >
              {albums.length > 0 ? `${albums.length}` : 'Albums'}
            </span>
          </button>
        </div>
      </PageHeader>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

        {/* ============================================================== */}
        {/* ONGLET 1 : VIDÉOS YOUTUBE                                      */}
        {/* ============================================================== */}
        {activeTab === 'videos' && (
          <div className="space-y-6">
            {/* Barre de recherche et de filtres */}
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                {/* Recherche textuelle */}
                <div className="relative flex-1">
                  <Search className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-stone-400`} />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    placeholder={t('media_search_placeholder')}
                    className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]/20 focus:border-[#0F5132] transition-all`}
                  />
                </div>

                {/* Tri temporel */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onSortChange(sortOrder === 'recent' ? 'oldest' : 'recent')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-xl text-xs font-semibold text-stone-700 transition-colors cursor-pointer"
                  >
                    <ArrowUpDown className="w-3.5 h-3.5 text-stone-500" />
                    <span>{sortOrder === 'recent' ? t('media_sort_recent') : t('media_sort_oldest')}</span>
                  </button>
                </div>
              </div>

              {/* Filtres de catégories */}
              <div className="flex items-center gap-2 pt-2 border-t border-stone-100 overflow-x-auto pb-1 sm:flex-wrap max-w-full">
                {categoryFilters.map((cat) => {
                  const isSelected = selectedCategory === cat.key;
                  return (
                    <button
                      key={cat.key}
                      onClick={() => onSelectCategory(cat.key)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                        isSelected
                          ? 'bg-[#0F5132] text-white shadow-xs'
                          : 'bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-stone-900 border border-stone-200/60'
                      }`}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Grille responsive des vidéos : 3 colonnes desktop, 2 tablette, 1 mobile */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs animate-pulse">
                    <div className="aspect-video bg-stone-200" />
                    <div className="p-5 space-y-3">
                      <div className="h-4 bg-stone-200 rounded-sm w-3/4" />
                      <div className="h-3 bg-stone-100 rounded-sm w-full" />
                      <div className="h-3 bg-stone-100 rounded-sm w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : videos.length === 0 ? (
              <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-[#0F5132] flex items-center justify-center mx-auto">
                  <Film className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-lg text-stone-800">{t('media_empty')}</h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  {language === 'ar'
                    ? 'لم يتم العثور على مقاطع فيديو مطابقة للبحث أو التصنيف المحدد.'
                    : 'Aucune vidéo ne correspond à votre recherche.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {videos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => onSelectVideo(video)}
                    className="group bg-white rounded-2xl border border-stone-200 hover:border-emerald-600/50 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col"
                  >
                    {/* Miniature 16:9 avec bouton play */}
                    <div className="relative aspect-video bg-stone-900 overflow-hidden">
                      <img
                        src={video.thumbnail_url}
                        alt={video.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-stone-950/20 group-hover:bg-stone-950/40 transition-colors" />

                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-red-600/95 text-white flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-white translate-x-0.5" />
                        </div>
                      </div>

                      {video.duration && (
                        <div
                          className={`absolute bottom-2.5 ${
                            isRTL ? 'right-2.5' : 'left-2.5'
                          } px-2 py-0.5 rounded bg-black/80 text-white text-[11px] font-mono font-medium flex items-center gap-1`}
                        >
                          <Clock className="w-3 h-3 text-stone-300" />
                          <span>{video.duration}</span>
                        </div>
                      )}

                      {video.category && (
                        <div className={`absolute top-2.5 ${isRTL ? 'left-2.5' : 'right-2.5'}`}>
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-white/95 text-stone-800 backdrop-blur-xs shadow-xs">
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
                              <span className="font-semibold text-emerald-800">{video.category}</span>
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

                        {video.description && (
                          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
                            {video.description}
                          </p>
                        )}
                      </div>

                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                        <span className="text-emerald-700 font-bold group-hover:underline flex items-center gap-1">
                          <span>{t('media_watch_btn')}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ============================================================== */}
        {/* ONGLET 2 : GALERIE PHOTOS & ALBUMS DYNAMIQUES                   */}
        {/* ============================================================== */}
        {activeTab === 'photos' && (
          <div className="space-y-8">
            {/* Cas A : Un album est ouvert -> Vue détaillée de l'album et ses photos */}
            {selectedAlbum ? (
              <div className="space-y-6 animate-fade-in">
                {/* Bouton retour aux albums */}
                <div>
                  <button
                    onClick={() => {
                      setSelectedAlbum(null);
                      setAlbumPhotos([]);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-stone-100 text-stone-700 border border-stone-200 rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-xs"
                  >
                    <ArrowBackIcon className="w-4 h-4" />
                    <span>{language === 'ar' ? 'العودة إلى كافة الألبومات' : 'Retour aux albums'}</span>
                  </button>
                </div>

                {/* En-tête de l'album */}
                <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-center gap-3 text-xs">
                    <span className="px-3 py-1 bg-emerald-50 text-[#0F5132] font-bold rounded-lg border border-emerald-200">
                      {getCategoryLabel(selectedAlbum.category)}
                    </span>
                    {selectedAlbum.event_date && (
                      <span className="flex items-center gap-1.5 text-stone-500 font-medium">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {new Date(selectedAlbum.event_date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'fr-FR', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5 text-stone-500 font-medium">
                      <Camera className="w-3.5 h-3.5 text-stone-400" />
                      {albumPhotos.length}{' '}
                      {language === 'ar'
                        ? (albumPhotos.length > 10 ? 'صورة' : 'صور')
                        : (albumPhotos.length > 1 ? 'photos' : 'photo')}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
                    {language === 'ar'
                      ? selectedAlbum.title_ar || selectedAlbum.title_fr
                      : selectedAlbum.title_fr}
                  </h2>

                  {(selectedAlbum.description_fr || selectedAlbum.description_ar) && (
                    <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-3xl">
                      {language === 'ar'
                        ? selectedAlbum.description_ar || selectedAlbum.description_fr
                        : selectedAlbum.description_fr || selectedAlbum.description_ar}
                    </p>
                  )}
                </div>

                {/* Grille de photos de l'album */}
                {isLoadingPhotos ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div key={n} className="aspect-4/3 bg-stone-200 rounded-2xl animate-pulse" />
                    ))}
                  </div>
                ) : albumPhotos.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
                    <Camera className="w-10 h-10 text-stone-300 mx-auto" />
                    <h3 className="font-bold text-base text-stone-800">
                      {language === 'ar' ? 'لا توجد صور في هذا الألبوم حالياً' : 'Aucune photo dans cet album'}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {language === 'ar'
                        ? 'سيتم إضافة وتوثيق صور هذا الحدث قريباً.'
                        : 'Les photographies de cet événement seront bientôt disponibles.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {albumPhotos.map((photo, idx) => {
                      const photoTitle =
                        language === 'ar'
                          ? photo.title_ar || photo.title_fr
                          : photo.title_fr || photo.title_ar;
                      const photoCaption =
                        language === 'ar'
                          ? photo.caption_ar || photo.caption_fr
                          : photo.caption_fr || photo.caption_ar;

                      return (
                        <div
                          key={photo.id}
                          onClick={() => setLightboxIndex(idx)}
                          className="group relative rounded-2xl overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer aspect-4/3 bg-stone-900 border border-stone-200/80"
                        >
                          <img
                            src={photo.public_url}
                            alt={photoTitle || 'Photo A.J.M.C'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity p-5 flex flex-col justify-end text-white">
                            {photoTitle && (
                              <h3 className="text-base font-bold leading-snug line-clamp-1">
                                {photoTitle}
                              </h3>
                            )}
                            {photoCaption && (
                              <p className="text-xs text-stone-300 line-clamp-2 mt-1 leading-relaxed">
                                {photoCaption}
                              </p>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ) : (
              /* Cas B : Liste des albums publiés */
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                      {language === 'ar' ? 'ألبومات الصور التوثيقية' : 'Albums photographiques'}
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500">
                      {language === 'ar'
                        ? 'اختر ألبوماً للاطلاع على كامل التغطية المصورة لأنشطة ومشاريع الجمعية.'
                        : 'Sélectionnez un album pour parcourir les photographies des activités et rencontres de l\'A.J.M.C.'}
                    </p>
                  </div>
                </div>

                {isLoadingAlbums ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map((n) => (
                      <div key={n} className="bg-white rounded-3xl border border-stone-200 overflow-hidden animate-pulse">
                        <div className="aspect-16/10 bg-stone-200" />
                        <div className="p-6 space-y-3">
                          <div className="h-4 bg-stone-200 rounded-sm w-3/4" />
                          <div className="h-3 bg-stone-100 rounded-sm w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : albums.length === 0 ? (
                  <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
                    <Camera className="w-12 h-12 text-stone-300 mx-auto" />
                    <h3 className="font-bold text-lg text-stone-800">
                      {language === 'ar' ? 'لا توجد ألبومات معروضة حالياً' : 'Aucun album publié pour le moment'}
                    </h3>
                    <p className="text-xs text-stone-500 max-w-sm mx-auto">
                      {language === 'ar'
                        ? 'سيتم نشر ألبومات الأنشطة والفعاليات قريباً فور الانتهاء من التوثيق.'
                        : 'Les albums photographiques seront publiés prochainement.'}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {albums.map((album) => {
                      const albumTitle =
                        language === 'ar'
                          ? album.title_ar || album.title_fr
                          : album.title_fr;
                      const albumDesc =
                        language === 'ar'
                          ? album.description_ar || album.description_fr
                          : album.description_fr || album.description_ar;

                      return (
                        <div
                          key={album.id}
                          onClick={() => handleOpenAlbum(album)}
                          className="group bg-white rounded-3xl border border-stone-200 hover:border-emerald-600/50 overflow-hidden shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                        >
                          {/* Image de couverture de l'album */}
                          <div className="relative aspect-16/10 bg-stone-900 overflow-hidden">
                            {album.cover_url ? (
                              <img
                                src={album.cover_url}
                                alt={albumTitle}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                loading="lazy"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-stone-800 text-stone-500">
                                <Camera className="w-12 h-12" />
                              </div>
                            )}

                            {/* Badge catégorie */}
                            <div className={`absolute top-3 ${isRTL ? 'left-3' : 'right-3'}`}>
                              <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/95 text-stone-800 shadow-xs backdrop-blur-xs">
                                {getCategoryLabel(album.category)}
                              </span>
                            </div>

                            {/* Nombre de photos */}
                            <div className={`absolute bottom-3 ${isRTL ? 'right-3' : 'left-3'}`}>
                              <span className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-black/75 text-white backdrop-blur-xs flex items-center gap-1.5">
                                <Camera className="w-3.5 h-3.5 text-emerald-400" />
                                <span>
                                  {album.photo_count || 0}{' '}
                                  {language === 'ar'
                                    ? (album.photo_count && album.photo_count > 10 ? 'صورة' : 'صور')
                                    : (album.photo_count && album.photo_count > 1 ? 'photos' : 'photo')}
                                </span>
                              </span>
                            </div>
                          </div>

                          {/* Détails de l'album */}
                          <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                            <div className="space-y-2">
                              {album.event_date && (
                                <div className="flex items-center gap-1.5 text-xs text-stone-500">
                                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                                  <span>
                                    {new Date(album.event_date).toLocaleDateString(
                                      language === 'ar' ? 'ar-EG' : 'fr-FR',
                                      { day: 'numeric', month: 'long', year: 'numeric' }
                                    )}
                                  </span>
                                </div>
                              )}

                              <h3 className="font-extrabold text-lg text-stone-900 group-hover:text-[#0F5132] transition-colors leading-snug">
                                {albumTitle}
                              </h3>

                              {albumDesc && (
                                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                                  {albumDesc}
                                </p>
                              )}
                            </div>

                            <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-[#0F5132] font-bold">
                              <span>
                                {language === 'ar' ? 'فتح الألبوم وعرض الصور' : 'Consulter l\'album'}
                              </span>
                              <ArrowBackIcon className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Visionneuse photo plein écran (Lightbox) */}
        <PhotoLightbox
          photos={albumPhotos}
          currentIndex={lightboxIndex !== null ? lightboxIndex : 0}
          isOpen={lightboxIndex !== null}
          onClose={() => setLightboxIndex(null)}
          onNavigate={(newIdx) => setLightboxIndex(newIdx)}
        />
      </div>
    </div>
  );
};
