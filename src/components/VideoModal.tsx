import React, { useEffect, useState } from 'react';
import { X, ExternalLink, Calendar, Clock, Tag, Share2, Check } from 'lucide-react';
import type { Video } from '../types/video.ts';
import { useLanguage } from '../context/LanguageContext.tsx';

interface VideoModalProps {
  video: Video | null;
  onClose: () => void;
}

export const VideoModal: React.FC<VideoModalProps> = ({ video, onClose }) => {
  const { isRTL, language } = useLanguage();
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (video) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [video, onClose]);

  if (!video) return null;

  const formattedDate = new Date(video.published_at).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const handleShare = async () => {
    const shareUrl = `https://www.youtube.com/watch?v=${video.youtube_id}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: video.title,
          text: video.description || video.title,
          url: shareUrl,
        });
        return;
      } catch {
        // Fallback to clipboard if share was canceled or failed
      }
    }

    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-sm transition-opacity"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className={`relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 ${
          isRTL ? 'text-right' : 'text-left'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2 text-xs text-stone-600">
            <span className="font-bold text-[#16A34A]">{video.category}</span>
            <span aria-hidden="true">·</span>
            <span>
              {language === 'ar' ? 'تمت المزامنة تلقائياً من قناة يوتيوب' : 'Synchronisé depuis la chaîne YouTube'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
            aria-label={language === 'ar' ? 'إغلاق' : 'Fermer'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Responsive YouTube Player Embed (Strictement en lecture seule sans téléchargement) */}
        <div className="relative w-full bg-black" style={{ paddingTop: '56.25%' }}>
          <iframe
            className="absolute top-0 left-0 w-full h-full"
            src={`https://www.youtube-nocookie.com/embed/${video.youtube_id}?autoplay=1&rel=0`}
            title={video.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>

        {/* Video Content & Details */}
        <div className="p-6 space-y-4 max-h-[40vh] overflow-y-auto">
          <div className="space-y-2">
            <h2 className="font-bold text-xl sm:text-2xl text-stone-900 leading-snug">
              {video.title}
            </h2>

            {/* Metadata */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-stone-400" />
                {language === 'ar' ? `نُشر في ${formattedDate}` : `Publié le ${formattedDate}`}
              </span>
              {video.duration && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    {language === 'ar' ? `المدة: ${video.duration}` : `Durée : ${video.duration}`}
                  </span>
                </>
              )}
              {video.category && (
                <>
                  <span aria-hidden="true">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Tag className="w-3.5 h-3.5 text-stone-400" />
                    {video.category}
                  </span>
                </>
              )}
            </div>
          </div>

          {/* Description */}
          {video.description && (
            <div className="pt-2 border-t border-stone-100 text-sm text-stone-600 leading-relaxed whitespace-pre-line">
              {video.description}
            </div>
          )}

          {/* Actions : Partager & Ouvrir sur YouTube */}
          <div className="pt-4 flex flex-wrap items-center justify-between gap-3 border-t border-stone-100 text-xs">
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>
                {copied
                  ? (language === 'ar' ? 'تم نسخ الرابط !' : 'Lien copié !')
                  : (language === 'ar' ? 'مشاركة الفيديو' : 'Partager la vidéo')}
              </span>
            </button>

            <a
              href={`https://www.youtube.com/watch?v=${video.youtube_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-bold text-red-600 hover:text-red-700 transition-colors"
            >
              <span>{language === 'ar' ? 'المشاهدة على يوتيوب مباشرة' : 'Ouvrir sur YouTube'}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
