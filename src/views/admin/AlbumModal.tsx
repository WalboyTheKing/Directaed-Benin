import React, { useState, useEffect } from 'react';
import { X, Upload, Image as ImageIcon, Calendar, Tag, AlertCircle } from 'lucide-react';
import type { GalleryAlbum, GalleryCategory } from '../../types/gallery.ts';
import { GALLERY_CATEGORIES } from '../../types/gallery.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface AlbumModalProps {
  isOpen: boolean;
  onClose: () => void;
  album: GalleryAlbum | null;
  onSave: (albumData: Partial<GalleryAlbum>) => Promise<void>;
  adminToken: string;
}

export const AlbumModal: React.FC<AlbumModalProps> = ({
  isOpen,
  onClose,
  album,
  onSave,
  adminToken,
}) => {
  const { isRTL, language } = useLanguage();

  const [titleFr, setTitleFr] = useState('');
  const [titleAr, setTitleAr] = useState('');
  const [descFr, setDescFr] = useState('');
  const [descAr, setDescAr] = useState('');
  const [category, setCategory] = useState<GalleryCategory>('Activités culturelles');
  const [eventDate, setEventDate] = useState('');
  const [coverUrl, setCoverUrl] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [sortOrder, setSortOrder] = useState(0);

  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (album) {
      setTitleFr(album.title_fr || '');
      setTitleAr(album.title_ar || '');
      setDescFr(album.description_fr || '');
      setDescAr(album.description_ar || '');
      setCategory((album.category as GalleryCategory) || 'Activités culturelles');
      setEventDate(album.event_date ? album.event_date.split('T')[0] : '');
      setCoverUrl(album.cover_url || '');
      setIsPublished(album.is_published);
      setSortOrder(album.sort_order || 0);
    } else {
      setTitleFr('');
      setTitleAr('');
      setDescFr('');
      setDescAr('');
      setCategory('Activités culturelles');
      setEventDate(new Date().toISOString().split('T')[0]);
      setCoverUrl('');
      setIsPublished(true);
      setSortOrder(0);
    }
    setErrorMsg(null);
  }, [album, isOpen]);

  if (!isOpen) return null;

  // Téléversement d'image de couverture vers Supabase Storage
  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsUploadingCover(true);
      setErrorMsg(null);

      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          const res = await fetch('/api/admin/gallery/upload', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({
              filename: file.name,
              filedata: base64Data,
              contentType: file.type || 'image/jpeg',
              albumId: album?.id || 'covers',
            }),
          });

          const data = await res.json();
          if (!res.ok || !data.public_url) {
            throw new Error(data.error || 'Erreur lors du téléversement de la couverture.');
          }

          setCoverUrl(data.public_url);
        } catch (err: any) {
          setErrorMsg(err.message || 'Échec du téléversement de l\'image.');
        } finally {
          setIsUploadingCover(false);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la lecture du fichier.');
      setIsUploadingCover(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleFr.trim()) {
      setErrorMsg(language === 'ar' ? 'عنوان الألبوم بالفرنسية مطلوب.' : 'Le titre français de l\'album est obligatoire.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMsg(null);

      await onSave({
        title_fr: titleFr.trim(),
        title_ar: titleAr.trim() || null,
        description_fr: descFr.trim() || null,
        description_ar: descAr.trim() || null,
        category,
        event_date: eventDate || null,
        cover_url: coverUrl.trim() || null,
        is_published: isPublished,
        sort_order: Number(sortOrder) || 0,
      });

      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de l\'enregistrement de l\'album.');
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
        className={`relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh] ${
          isRTL ? 'text-right' : 'text-left'
        }`}
      >
        {/* Header Modal */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div>
            <h3 className="text-lg font-extrabold text-stone-900">
              {album
                ? language === 'ar'
                  ? 'تعديل بيانات الألبوم'
                  : 'Modifier l\'album'
                : language === 'ar'
                ? 'إنشاء ألبوم جديد'
                : 'Créer un nouvel album'}
            </h3>
            <p className="text-xs text-stone-500">
              {language === 'ar'
                ? 'إدارة العناوين، الوصف، التاريخ وغلاف الألبوم'
                : 'Renseignez les informations et l\'image de couverture'}
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps Formulaire */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Titres : Français & Arabe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                Titre en Français <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={titleFr}
                onChange={(e) => setTitleFr(e.target.value)}
                placeholder="Ex: Rencontre annuelle des jeunes 2026"
                required
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#0F5132]/20 focus:border-[#0F5132]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                العنوان بالعربية (اختياري)
              </label>
              <input
                type="text"
                dir="rtl"
                value={titleAr}
                onChange={(e) => setTitleAr(e.target.value)}
                placeholder="مثال: الملتقى السنوي للشباب 2026"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-cairo focus:outline-none focus:ring-2 focus:ring-[#0F5132]/20 focus:border-[#0F5132]"
              />
            </div>
          </div>

          {/* Descriptions : Français & Arabe */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                Description en Français
              </label>
              <textarea
                rows={3}
                value={descFr}
                onChange={(e) => setDescFr(e.target.value)}
                placeholder="Résumé des moments forts de cet événement..."
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-[#0F5132]/20 focus:border-[#0F5132]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                الوصف بالعربية
              </label>
              <textarea
                rows={3}
                dir="rtl"
                value={descAr}
                onChange={(e) => setDescAr(e.target.value)}
                placeholder="نبذة عن أبرز محطات وفعاليات هذا النشاط..."
                className="w-full px-3.5 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs font-cairo focus:outline-none focus:ring-2 focus:ring-[#0F5132]/20 focus:border-[#0F5132]"
              />
            </div>
          </div>

          {/* Catégorie & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                {language === 'ar' ? 'التصنيف' : 'Catégorie'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as GalleryCategory)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0F5132]"
              >
                {GALLERY_CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name_fr} — {cat.name_ar}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-stone-700">
                {language === 'ar' ? 'تاريخ الفعالية' : 'Date de l\'événement'}
              </label>
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium focus:outline-none focus:border-[#0F5132]"
              />
            </div>
          </div>

          {/* Image de couverture */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700">
              {language === 'ar' ? 'صورة غلاف الألبوم' : 'Image de couverture'}
            </label>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {coverUrl && (
                <div className="relative w-28 h-20 rounded-xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0">
                  <img src={coverUrl} alt="Aperçu couverture" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setCoverUrl('')}
                    className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                    title="Supprimer la couverture"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <label className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-bold cursor-pointer transition-colors flex items-center gap-2">
                    <Upload className="w-3.5 h-3.5 text-[#0F5132]" />
                    <span>
                      {isUploadingCover
                        ? (language === 'ar' ? 'جاري الرفع...' : 'Téléversement...')
                        : (language === 'ar' ? 'رفع صورة من الجهاز' : 'Téléverser un fichier')}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCoverUpload}
                      disabled={isUploadingCover}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="url"
                  value={coverUrl}
                  onChange={(e) => setCoverUrl(e.target.value)}
                  placeholder="Ou collez une URL d'image directe (https://...)"
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-700 focus:outline-none focus:border-[#0F5132]"
                />
              </div>
            </div>
          </div>

          {/* Statut & Ordre */}
          <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-4">
            {/* Statut Publication */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 text-[#0F5132] rounded focus:ring-0 cursor-pointer"
              />
              <span className="text-xs font-bold text-stone-800">
                {language === 'ar' ? 'نشر الألبوم للجمهور العام' : 'Publier l\'album sur le site public'}
              </span>
            </label>

            {/* Ordre */}
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
              disabled={isSaving || isUploadingCover}
              className="px-6 py-2 bg-[#0F5132] hover:bg-[#16A34A] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center gap-1.5"
            >
              {isSaving && (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              )}
              <span>
                {isSaving
                  ? (language === 'ar' ? 'جاري الحفظ...' : 'Enregistrement...')
                  : (language === 'ar' ? 'حفظ الألبوم' : 'Enregistrer')}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
