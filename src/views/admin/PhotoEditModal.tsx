import React, { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { GalleryPhoto } from '../../types/gallery.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface PhotoEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  photo: GalleryPhoto | null;
  onSave: (photoId: string, updates: Partial<GalleryPhoto>) => Promise<void>;
}

export const PhotoEditModal: React.FC<PhotoEditModalProps> = ({
  isOpen,
  onClose,
  photo,
  onSave,
}) => {
  const { isRTL, language } = useLanguage();

  const [titleFr, setTitleFr] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [captionFr, setCaptionFr] = useState('');
  const [captionAr, setCaptionAr] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isPublished, setIsPublished] = useState(true);

  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (photo) {
      setTitleFr(photo.title_fr || '');
      setTitleAr(photo.title_ar || '');
      setCaptionFr(photo.caption_fr || '');
      setCaptionAr(photo.caption_ar || '');
      setSortOrder(photo.sort_order || 0);
      setIsPublished(photo.is_published);
    }
    setErrorMsg(null);
  }, [photo, isOpen]);

  if (!isOpen || !photo) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSaving(true);
      setErrorMsg(null);

      await onSave(photo.id, {
        title_fr: titleFr.trim() || null,
        title_ar: titleAr.trim() || null,
        caption_fr: captionFr.trim() || null,
        caption_ar: captionAr.trim() || null,
        sort_order: Number(sortOrder) || 0,
        is_published: isPublished,
      });

      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la mise à jour de la photo.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-xs animate-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative w-full max-w-xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh] ${
          isRTL ? 'text-right' : 'text-left'
        }`}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h3 className="text-base font-extrabold text-stone-900">
              {language === 'ar' ? 'تعديل بيانات الصورة' : 'Modifier les informations de la photo'}
            </h3>
            <p className="text-xs text-stone-500">
              {language === 'ar' ? 'العنوان، الشرح، الترتيب وحالة النشر' : 'Titre, légende, ordre et visibilité'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Aperçu de la photo */}
          <div className="flex items-center gap-4 p-3 bg-stone-50 rounded-2xl border border-stone-100">
            <img
              src={photo.public_url}
              alt="Aperçu"
              className="w-20 h-16 object-cover rounded-xl border border-stone-200"
            />
            <div className="text-xs text-stone-500">
              <p className="font-semibold text-stone-800">
                {titleFr || titleAr || (language === 'ar' ? 'صورة بدون عنوان' : 'Photo sans titre')}
              </p>
              <p className="font-mono text-[10px] text-stone-400 mt-0.5 truncate max-w-xs">
                {photo.public_url}
              </p>
            </div>
          </div>

          {/* Titres FR & AR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700">
                Titre en Français
              </label>
              <input
                type="text"
                value={titleFr}
                onChange={(e) => setTitleFr(e.target.value)}
                placeholder="Ex: Ouverture de la cérémonie"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#0F5132]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700">
                العنوان بالعربية
              </label>
              <input
                type="text"
                dir="rtl"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: افتتاح فعاليات الملتقى"
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-cairo focus:outline-none focus:border-[#0F5132]"
              />
            </div>
          </div>

          {/* Légendes FR & AR */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700">
                Légende en Français
              </label>
              <textarea
                rows={3}
                value={captionFr}
                onChange={(e) => setCaptionFr(e.target.value)}
                placeholder="Les participants lors de l'ouverture..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:border-[#0F5132]"
              />
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-stone-700">
                الشرح / التعليق بالعربية
              </label>
              <textarea
                rows={3}
                dir="rtl"
                value={captionAr}
                onChange={(e) => setCaptionAr(e.target.value)}
                placeholder="حضور مكثف وتفاعل متميز أثناء الجلسة..."
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-cairo focus:outline-none focus:border-[#0F5132]"
              />
            </div>
          </div>

          {/* Ordre & Statut */}
          <div className="pt-2 border-t border-stone-100 flex items-center justify-between gap-4">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-[#0F5132] rounded focus:ring-0 cursor-pointer"
              />
              <span className="text-xs font-bold text-stone-800">
                {language === 'ar' ? 'عرض الصورة في الموقع' : 'Afficher la photo publiquement'}
              </span>
            </label>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">
                {language === 'ar' ? 'الترتيب :' : 'Ordre :'}
              </span>
              <input
                type="number"
                value={sortOrder}
                onChange={(e) => setSortOrder(parseInt(e.target.value, 10) || 0)}
                className="w-16 px-2 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs text-center font-bold"
              />
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-stone-100 hover:bg-stone-200 rounded-xl transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'إلغاء' : 'Annuler'}
            </button>

            <button
              type="submit"
              disabled={isSaving}
              className="px-5 py-2 bg-[#0F5132] hover:bg-[#16A34A] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSaving && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>
                {isSaving
                  ? (language === 'ar' ? 'جاري الحفظ...' : 'Enregistrement...')
                  : (language === 'ar' ? 'حفظ التعديلات' : 'Enregistrer')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
