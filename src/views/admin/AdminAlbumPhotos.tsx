import React, { useState, useEffect, useCallback } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Upload,
  Plus,
  Trash2,
  Edit2,
  ArrowUp,
  ArrowDown,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  X
} from 'lucide-react';
import type { GalleryAlbum, GalleryPhoto } from '../../types/gallery.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { PhotoEditModal } from './PhotoEditModal.tsx';

interface AdminAlbumPhotosProps {
  album: GalleryAlbum;
  adminToken: string;
  onBack: () => void;
  onRefreshAlbum: () => void;
}

interface QueuedFile {
  file: File;
  previewUrl: string;
}

export const AdminAlbumPhotos: React.FC<AdminAlbumPhotosProps> = ({
  album,
  adminToken,
  onBack,
  onRefreshAlbum,
}) => {
  const { isRTL, language } = useLanguage();
  const ArrowBackIcon = isRTL ? ArrowRight : ArrowLeft;

  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedQueue, setSelectedQueue] = useState<QueuedFile[]>([]);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [editingPhoto, setEditingPhoto] = useState<GalleryPhoto | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Charger les photos de l'album
  const fetchPhotos = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/gallery/albums/${album.id}/photos`, {
        headers: { Authorization: `Bearer ${adminToken}` },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.photos)) {
          setPhotos(data.photos);
        }
      }
    } catch (err) {
      console.warn('[Admin Photos] Erreur:', err);
    } finally {
      setIsLoading(false);
    }
  }, [album.id, adminToken]);

  useEffect(() => {
    fetchPhotos();
  }, [fetchPhotos]);

  // Sélection de plusieurs images en une seule fois
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const newQueue: QueuedFile[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type.startsWith('image/')) {
        newQueue.push({
          file,
          previewUrl: URL.createObjectURL(file),
        });
      }
    }

    setSelectedQueue((prev) => [...prev, ...newQueue]);
    // Reset file input
    e.target.value = '';
  };

  // Retirer une photo de la file avant l'upload
  const handleRemoveFromQueue = (index: number) => {
    setSelectedQueue((prev) => {
      const updated = [...prev];
      URL.revokeObjectURL(updated[index].previewUrl);
      updated.splice(index, 1);
      return updated;
    });
  };

  // Téléversement groupé des images sélectionnées
  const handleUploadQueue = async () => {
    if (selectedQueue.length === 0) return;

    try {
      setIsUploading(true);
      setErrorMsg(null);
      setSuccessMsg(null);
      setUploadProgress({ current: 0, total: selectedQueue.length });

      let successCount = 0;

      for (let i = 0; i < selectedQueue.length; i++) {
        const item = selectedQueue[i];
        setUploadProgress({ current: i + 1, total: selectedQueue.length });

        // Convertir en base64
        const base64Data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(item.file);
        });

        // 1. Upload vers Supabase Storage 'gallery'
        const uploadRes = await fetch('/api/admin/gallery/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            filename: item.file.name,
            filedata: base64Data,
            contentType: item.file.type || 'image/jpeg',
            albumId: album.id,
          }),
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.public_url) {
          throw new Error(uploadData.error || `Erreur lors de l'upload de ${item.file.name}`);
        }

        // 2. Créer l'enregistrement photo dans la base de données
        const photoRes = await fetch(`/api/admin/gallery/albums/${album.id}/photos`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${adminToken}`,
          },
          body: JSON.stringify({
            public_url: uploadData.public_url,
            storage_path: uploadData.storage_path,
            title_fr: item.file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
            title_ar: null,
            caption_fr: null,
            caption_ar: null,
            sort_order: photos.length + i + 1,
            is_published: true,
          }),
        });

        if (photoRes.ok) {
          successCount++;
        }
      }

      // Nettoyer la file d'attente
      selectedQueue.forEach((item) => URL.revokeObjectURL(item.previewUrl));
      setSelectedQueue([]);

      setSuccessMsg(
        language === 'ar'
          ? `تم رفع ${successCount} صورة بنجاح وإضافتها إلى الألبوم.`
          : `${successCount} photo(s) ajoutée(s) avec succès à l'album.`
      );

      await fetchPhotos();
      onRefreshAlbum();
    } catch (err: any) {
      setErrorMsg(err.message || 'Une erreur est survenue lors de l\'envoi des photos.');
    } finally {
      setIsUploading(false);
    }
  };

  // Suppression d'une photo avec confirmation
  const handleDeletePhoto = async (photo: GalleryPhoto) => {
    const confirmPrompt =
      language === 'ar'
        ? 'هل أنت متأكد من حذف هذه الصورة نهائياً من الألبوم؟'
        : 'Confirmez-vous la suppression définitive de cette photo ?';

    if (!window.confirm(confirmPrompt)) return;

    try {
      setErrorMsg(null);
      const res = await fetch(`/api/admin/gallery/photos/${photo.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la suppression.');
      }

      setPhotos((prev) => prev.filter((p) => p.id !== photo.id));
      onRefreshAlbum();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la suppression de la photo.');
    }
  };

  // Réorganisation : Monter ou Descendre
  const handleMovePhoto = async (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= photos.length) return;

    const newPhotos = [...photos];
    const [moved] = newPhotos.splice(index, 1);
    newPhotos.splice(targetIndex, 0, moved);

    setPhotos(newPhotos);

    try {
      const photoIds = newPhotos.map((p) => p.id);
      await fetch('/api/admin/gallery/photos/reorder', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ photoIds }),
      });
    } catch (err) {
      console.warn('[Reorder Error]', err);
    }
  };

  // Sauvegarde des modifications d'une photo
  const handleSavePhotoUpdates = async (photoId: string, updates: Partial<GalleryPhoto>) => {
    const res = await fetch(`/api/admin/gallery/photos/${photoId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(updates),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Erreur lors de la mise à jour.');
    }

    const { photo: updatedPhoto } = await res.json();
    setPhotos((prev) => prev.map((p) => (p.id === photoId ? { ...p, ...updatedPhoto } : p)));
    setSuccessMsg(language === 'ar' ? 'تم تحديث بيانات الصورة بنجاح.' : 'Informations de la photo mises à jour.');
  };

  return (
    <div className={`space-y-6 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Barre supérieure : Retour & Informations de l'album */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-3xl border border-stone-200 shadow-xs">
        <div className="space-y-1">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-[#0F5132] transition-colors cursor-pointer"
          >
            <ArrowBackIcon className="w-4 h-4" />
            <span>{language === 'ar' ? 'الرجوع إلى قائمة الألبومات' : 'Retour aux albums'}</span>
          </button>

          <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900 leading-tight">
            {language === 'ar' ? album.title_ar || album.title_fr : album.title_fr}
          </h2>

          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 pt-1">
            <span className="font-semibold text-emerald-800">{album.category}</span>
            <span>·</span>
            <span>
              {photos.length}{' '}
              {language === 'ar'
                ? (photos.length > 10 ? 'صورة' : 'صور')
                : (photos.length > 1 ? 'photos' : 'photo')}
            </span>
            <span>·</span>
            <span
              className={`px-2 py-0.5 rounded-full font-bold ${
                album.is_published
                  ? 'bg-emerald-100 text-[#0F5132]'
                  : 'bg-stone-200 text-stone-700'
              }`}
            >
              {album.is_published
                ? (language === 'ar' ? 'منشور' : 'Publié')
                : (language === 'ar' ? 'مسودة' : 'Brouillon')}
            </span>
          </div>
        </div>

        {/* Bouton d'ajout de photos */}
        <div>
          <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-xs">
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'إضافة صور جديدة' : 'Ajouter des photos'}</span>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileSelect}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Messages d'alerte ou de confirmation */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2.5 animate-shake">
          <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
          <span>{errorMsg}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* ============================================================== */}
      {/* FILE D'ATTENTE AVANT VALIDATION & TÉLÉVERSEMENT                */}
      {/* ============================================================== */}
      {selectedQueue.length > 0 && (
        <div className="bg-emerald-900/5 border-2 border-dashed border-emerald-600/40 rounded-3xl p-6 space-y-4 animate-fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-extrabold text-sm text-stone-900">
                {language === 'ar' ? 'الصور المحددة للرفع' : 'Photos sélectionnées en attente d\'upload'}
              </h3>
              <p className="text-xs text-stone-500">
                {language === 'ar'
                  ? `تم اختيار ${selectedQueue.length} صورة. يمكنك معاينتها أو إلغاء أي منها قبل التأكيد.`
                  : `${selectedQueue.length} photo(s) prête(s). Vous pouvez retirer une photo avant de lancer l'upload.`}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  selectedQueue.forEach((item) => URL.revokeObjectURL(item.previewUrl));
                  setSelectedQueue([]);
                }}
                disabled={isUploading}
                className="px-3.5 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-xl transition-colors cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء التحديد' : 'Annuler tout'}
              </button>

              <button
                type="button"
                onClick={handleUploadQueue}
                disabled={isUploading}
                className="px-5 py-2 bg-[#0F5132] hover:bg-[#16A34A] text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-xs disabled:opacity-50 flex items-center gap-2"
              >
                {isUploading ? (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                <span>
                  {isUploading
                    ? language === 'ar'
                      ? `جاري الرفع (${uploadProgress.current}/${uploadProgress.total})...`
                      : `Envoi (${uploadProgress.current}/${uploadProgress.total})...`
                    : language === 'ar'
                    ? `تأكيد ورفع ${selectedQueue.length} صورة`
                    : `Téléverser ${selectedQueue.length} photo(s)`}
                </span>
              </button>
            </div>
          </div>

          {/* Grille des aperçus avant validation */}
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {selectedQueue.map((item, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200 group">
                <img src={item.previewUrl} alt="Aperçu" className="w-full h-full object-cover" />
                {!isUploading && (
                  <button
                    type="button"
                    onClick={() => handleRemoveFromQueue(idx)}
                    className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                    title={language === 'ar' ? 'إلغاء الصورة' : 'Retirer'}
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <div className="absolute bottom-0 inset-x-0 bg-stone-900/80 p-1 text-[9px] text-stone-300 truncate text-center">
                  {item.file.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* GRILLE DES PHOTOS DE L'ALBUM                                   */}
      {/* ============================================================== */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="aspect-4/3 bg-stone-200 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
          <ImageIcon className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-bold text-base text-stone-800">
            {language === 'ar' ? 'الألبوم فارغ حالياً' : 'Cet album ne contient aucune photo'}
          </h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            {language === 'ar'
              ? 'انقر على زر "إضافة صور جديدة" أعلاه لاختيار ورفع صور هذا الألبوم.'
              : 'Cliquez sur "Ajouter des photos" pour importer des photographies vers Supabase Storage.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {photos.map((photo, index) => {
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
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                {/* Image miniature */}
                <div className="relative aspect-4/3 bg-stone-900 overflow-hidden">
                  <img
                    src={photo.public_url}
                    alt={photoTitle || 'Photo album'}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Badge statut publié / masqué */}
                  <div className={`absolute top-2 ${isRTL ? 'left-2' : 'right-2'}`}>
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-xs ${
                        photo.is_published
                          ? 'bg-emerald-600/95 text-white'
                          : 'bg-stone-800/90 text-stone-300'
                      }`}
                    >
                      {photo.is_published ? (
                        <>
                          <Eye className="w-2.5 h-2.5" />
                          <span>{language === 'ar' ? 'معروض' : 'Publié'}</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="w-2.5 h-2.5" />
                          <span>{language === 'ar' ? 'مخفي' : 'Masqué'}</span>
                        </>
                      )}
                    </span>
                  </div>

                  {/* Index d'ordre */}
                  <div className={`absolute bottom-2 ${isRTL ? 'right-2' : 'left-2'}`}>
                    <span className="px-2 py-0.5 rounded bg-black/70 text-white font-mono text-[10px]">
                      #{photo.sort_order || index + 1}
                    </span>
                  </div>
                </div>

                {/* Métadonnées & Description */}
                <div className="p-3.5 space-y-1.5 flex-1">
                  <h4 className="font-bold text-xs text-stone-900 line-clamp-1">
                    {photoTitle || (language === 'ar' ? 'بدون عنوان' : 'Sans titre')}
                  </h4>
                  {photoCaption && (
                    <p className="text-[11px] text-stone-500 line-clamp-2 leading-relaxed">
                      {photoCaption}
                    </p>
                  )}
                </div>

                {/* Actions : Réordonner, Modifier, Supprimer */}
                <div className="px-3.5 py-2.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-xs text-stone-600">
                  {/* Boutons Monter / Descendre */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMovePhoto(index, 'up')}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-stone-200 text-stone-600 disabled:opacity-30 cursor-pointer"
                      title={language === 'ar' ? 'تحريك للأعلى' : 'Monter'}
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMovePhoto(index, 'down')}
                      disabled={index === photos.length - 1}
                      className="p-1 rounded hover:bg-stone-200 text-stone-600 disabled:opacity-30 cursor-pointer"
                      title={language === 'ar' ? 'تحريك للأسفل' : 'Descendre'}
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Modifier */}
                    <button
                      type="button"
                      onClick={() => setEditingPhoto(photo)}
                      className="p-1.5 rounded-lg hover:bg-emerald-50 text-[#0F5132] font-semibold transition-colors cursor-pointer"
                      title={language === 'ar' ? 'تعديل البيانات' : 'Modifier'}
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    {/* Supprimer */}
                    <button
                      type="button"
                      onClick={() => handleDeletePhoto(photo)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-600 transition-colors cursor-pointer"
                      title={language === 'ar' ? 'حذف الصورة' : 'Supprimer'}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal d'édition d'une photo */}
      <PhotoEditModal
        isOpen={editingPhoto !== null}
        onClose={() => setEditingPhoto(null)}
        photo={editingPhoto}
        onSave={handleSavePhotoUpdates}
      />
    </div>
  );
};
