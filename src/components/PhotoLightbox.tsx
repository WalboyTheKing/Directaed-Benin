import React, { useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import type { GalleryPhoto } from '../types/gallery.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface PhotoLightboxProps {
  photos: GalleryPhoto[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (index: number) => void;
}

export const PhotoLightbox: React.FC<PhotoLightboxProps> = ({
  photos,
  currentIndex,
  isOpen,
  onClose,
  onNavigate,
}) => {
  const { isRTL, language } = useLanguage();

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      onNavigate(currentIndex - 1);
    } else {
      onNavigate(photos.length - 1);
    }
  }, [currentIndex, photos.length, onNavigate]);

  const handleNext = useCallback(() => {
    if (currentIndex < photos.length - 1) {
      onNavigate(currentIndex + 1);
    } else {
      onNavigate(0);
    }
  }, [currentIndex, photos.length, onNavigate]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (isRTL) handleNext();
        else handlePrev();
      } else if (e.key === 'ArrowRight') {
        if (isRTL) handlePrev();
        else handleNext();
      }
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, handlePrev, handleNext, isRTL]);

  if (!isOpen || !photos[currentIndex]) return null;

  const currentPhoto = photos[currentIndex];
  const photoTitle =
    language === 'ar'
      ? currentPhoto.title_ar || currentPhoto.title_fr
      : currentPhoto.title_fr || currentPhoto.title_ar;

  const photoCaption =
    language === 'ar'
      ? currentPhoto.caption_ar || currentPhoto.caption_fr
      : currentPhoto.caption_fr || currentPhoto.caption_ar;

  return (
    <div
      className="fixed inset-0 z-50 bg-stone-950/95 backdrop-blur-md flex flex-col justify-between select-none animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      {/* Barre supérieure : Index & Fermeture */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 text-white z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono tracking-wider bg-white/10 px-3 py-1 rounded-full text-stone-300">
            {currentIndex + 1} / {photos.length}
          </span>
          {photoTitle && (
            <span className="hidden sm:inline-block text-sm font-semibold truncate max-w-md text-stone-200">
              {photoTitle}
            </span>
          )}
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-stone-200 hover:text-white transition-colors cursor-pointer"
          aria-label={language === 'ar' ? 'إغلاق' : 'Fermer'}
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Zone centrale : Image et navigation précédente/suivante */}
      <div className="relative flex-1 flex items-center justify-center px-2 sm:px-16 overflow-hidden">
        {/* Bouton Précédent */}
        <button
          onClick={isRTL ? handleNext : handlePrev}
          className="absolute left-2 sm:left-4 z-10 p-2.5 sm:p-3 rounded-full bg-stone-900/80 hover:bg-emerald-700/90 text-white transition-all transform hover:scale-105 shadow-lg cursor-pointer"
          aria-label={language === 'ar' ? 'السابق' : 'Précédent'}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Image principale */}
        <div className="max-w-5xl max-h-[75vh] flex items-center justify-center p-2">
          <img
            src={currentPhoto.public_url}
            alt={photoTitle || 'Photo de la galerie A.J.M.C'}
            className="max-h-[70vh] sm:max-h-[75vh] w-auto max-w-full object-contain rounded-lg shadow-2xl transition-all"
          />
        </div>

        {/* Bouton Suivant */}
        <button
          onClick={isRTL ? handlePrev : handleNext}
          className="absolute right-2 sm:right-4 z-10 p-2.5 sm:p-3 rounded-full bg-stone-900/80 hover:bg-emerald-700/90 text-white transition-all transform hover:scale-105 shadow-lg cursor-pointer"
          aria-label={language === 'ar' ? 'التالي' : 'Suivant'}
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Barre inférieure : Légende & Titre */}
      <div className={`px-4 sm:px-8 py-4 bg-stone-900/90 border-t border-stone-800 text-stone-200 ${isRTL ? 'text-right' : 'text-left'}`}>
        <div className="max-w-4xl mx-auto space-y-1">
          {photoTitle && (
            <h4 className="font-bold text-base sm:text-lg text-white">
              {photoTitle}
            </h4>
          )}
          {photoCaption ? (
            <p className="text-xs sm:text-sm text-stone-400 leading-relaxed">
              {photoCaption}
            </p>
          ) : (
            <p className="text-xs text-stone-500 italic">
              {language === 'ar'
                ? 'جمعية الشباب المسلم للثقافة (A.J.M.C — كاندي)'
                : 'Association des Jeunes Musulmans pour la Culture (A.J.M.C — Kandi)'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
