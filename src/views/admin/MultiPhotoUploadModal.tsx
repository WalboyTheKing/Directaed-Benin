import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  RotateCw,
  Trash2,
  FolderKanban,
  FileCheck
} from 'lucide-react';
import type { GalleryAlbum } from '../../types/gallery.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

export interface MultiPhotoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  adminToken: string;
  albums: GalleryAlbum[];
  targetAlbum?: GalleryAlbum | null;
  onUploadSuccess: (albumId: string, count: number) => void;
}

export interface QueuedUploadItem {
  id: string;
  file: File;
  previewUrl: string;
  name: string;
  size: number;
  status: 'idle' | 'uploading' | 'success' | 'error';
  errorMessage?: string;
}

// Limites de validation
const MAX_FILE_SIZE_BYTES = 15 * 1024 * 1024; // 15 Mo max par photo
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

export const MultiPhotoUploadModal: React.FC<MultiPhotoUploadModalProps> = ({
  isOpen,
  onClose,
  adminToken,
  albums,
  targetAlbum,
  onUploadSuccess,
}) => {
  const { isRTL, language } = useLanguage();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [selectedAlbumId, setSelectedAlbumId] = useState<string>('');
  const [queue, setQueue] = useState<QueuedUploadItem[]>([]);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<{ current: number; total: number }>({ current: 0, total: 0 });
  const [validationWarning, setValidationWarning] = useState<string | null>(null);
  const [resultSummary, setResultSummary] = useState<{ success: number; failed: number } | null>(null);

  // Synchroniser l'album cible
  useEffect(() => {
    if (targetAlbum) {
      setSelectedAlbumId(targetAlbum.id);
    } else if (albums.length > 0 && !selectedAlbumId) {
      setSelectedAlbumId(albums[0].id);
    }
  }, [targetAlbum, albums, isOpen]);

  // Nettoyage systématique des URL blob pour éviter les fuites mémoire
  const cleanupQueueUrls = useCallback((itemsToClean: QueuedUploadItem[]) => {
    itemsToClean.forEach((item) => {
      try {
        URL.revokeObjectURL(item.previewUrl);
      } catch {
        // Ignorer si déjà révoquée
      }
    });
  }, []);

  // Nettoyer à la fermeture
  const handleClose = () => {
    if (isUploading) {
      const confirmClose = window.confirm(
        language === 'ar'
          ? 'عملية الرفع جارية حالياً. هل تريد حقاً الإلغاء والخروج؟'
          : 'Un téléversement est en cours. Voulez-vous vraiment annuler et fermer ?'
      );
      if (!confirmClose) return;
    }
    cleanupQueueUrls(queue);
    setQueue([]);
    setValidationWarning(null);
    setResultSummary(null);
    setIsUploading(false);
    onClose();
  };

  // Traiter une liste de fichiers (sélection ou drop)
  const processFiles = (files: FileList | File[]) => {
    setValidationWarning(null);
    setResultSummary(null);

    const validNewItems: QueuedUploadItem[] = [];
    let rejectedCount = 0;
    let duplicateCount = 0;
    let oversizedCount = 0;

    const existingSignatures = new Set(
      queue.map((item) => `${item.file.name}-${item.file.size}-${item.file.lastModified}`)
    );

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;

      // 1. Vérification du type MIME et de l'extension
      const isAllowedType =
        ALLOWED_MIME_TYPES.includes(file.type.toLowerCase()) ||
        ALLOWED_EXTENSIONS.includes(ext);

      if (!isAllowedType) {
        rejectedCount++;
        continue;
      }

      // 2. Vérification de la taille max (15 Mo)
      if (file.size > MAX_FILE_SIZE_BYTES) {
        oversizedCount++;
        continue;
      }

      // 3. Détection des doublons dans la sélection
      const signature = `${file.name}-${file.size}-${file.lastModified}`;
      if (existingSignatures.has(signature)) {
        duplicateCount++;
        continue;
      }

      existingSignatures.add(signature);
      validNewItems.push({
        id: `upload-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        file,
        previewUrl: URL.createObjectURL(file),
        name: file.name,
        size: file.size,
        status: 'idle',
      });
    }

    if (rejectedCount > 0 || oversizedCount > 0 || duplicateCount > 0) {
      const warningParts: string[] = [];
      if (rejectedCount > 0) {
        warningParts.push(
          language === 'ar'
            ? `${rejectedCount} ملف بتنسيق غير مدعوم (المسموح: JPG, PNG, WEBP)`
            : `${rejectedCount} fichier(s) rejeté(s) (formats acceptés : JPG, JPEG, PNG, WEBP)`
        );
      }
      if (oversizedCount > 0) {
        warningParts.push(
          language === 'ar'
            ? `${oversizedCount} ملف يتجاوز الحجم الأقصى (15 ميغابايت)`
            : `${oversizedCount} fichier(s) dépassent la taille maximale autorisée (15 Mo)`
        );
      }
      if (duplicateCount > 0) {
        warningParts.push(
          language === 'ar'
            ? `${duplicateCount} صورة مكررة تم تجاهلها`
            : `${duplicateCount} doublon(s) ignoré(s)`
        );
      }
      setValidationWarning(warningParts.join(' • '));
    }

    if (validNewItems.length > 0) {
      setQueue((prev) => [...prev, ...validNewItems]);
    }
  };

  // Gestion du champ fichier
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
    e.target.value = '';
  };

  // Glisser-déposer
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isUploading) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (isUploading) return;

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Retirer une photo spécifique de la file
  const handleRemoveItem = (id: string) => {
    if (isUploading) return;
    setQueue((prev) => {
      const item = prev.find((it) => it.id === id);
      if (item) {
        URL.revokeObjectURL(item.previewUrl);
      }
      return prev.filter((it) => it.id !== id);
    });
  };

  // Vider toute la file
  const handleClearAll = () => {
    if (isUploading) return;
    cleanupQueueUrls(queue);
    setQueue([]);
    setValidationWarning(null);
    setResultSummary(null);
  };

  // Formatage lisible de la taille
  const formatSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
  };

  // Taille totale de la sélection
  const totalQueueSize = queue.reduce((sum, it) => sum + it.size, 0);

  // Téléversement multiple réel fichier par fichier avec reprise
  const handleStartUpload = async (onlyRetryFailed = false) => {
    const destinationAlbumId = targetAlbum?.id || selectedAlbumId;
    if (!destinationAlbumId) {
      setValidationWarning(
        language === 'ar'
          ? 'يرجى تحديد ألبوم الوجهة أولاً.'
          : 'Veuillez sélectionner l\'album de destination avant de téléverser.'
      );
      return;
    }

    const itemsToUpload = queue.filter((item) =>
      onlyRetryFailed ? item.status === 'error' : item.status !== 'success'
    );

    if (itemsToUpload.length === 0) return;

    try {
      setIsUploading(true);
      setValidationWarning(null);
      setResultSummary(null);
      setUploadProgress({ current: 0, total: itemsToUpload.length });

      let currentSuccess = 0;
      let currentFailed = 0;

      for (let i = 0; i < itemsToUpload.length; i++) {
        const item = itemsToUpload[i];
        setUploadProgress({ current: i + 1, total: itemsToUpload.length });

        // Mettre à jour l'état de l'élément à "uploading"
        setQueue((prev) =>
          prev.map((it) => (it.id === item.id ? { ...it, status: 'uploading', errorMessage: undefined } : it))
        );

        try {
          // 1. Conversion Base64
          const base64Data = await new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => {
              const res = reader.result as string;
              resolve(res.split(',')[1]);
            };
            reader.onerror = () => reject(new Error('Erreur de lecture locale du fichier'));
            reader.readAsDataURL(item.file);
          });

          // 2. Téléversement vers Supabase Storage via /api/admin/gallery/upload
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
              albumId: destinationAlbumId,
            }),
          });

          const uploadData = await uploadRes.json();
          if (!uploadRes.ok || !uploadData.public_url) {
            throw new Error(uploadData.error || `Échec du stockage pour ${item.file.name}`);
          }

          // Titre propre basé sur le nom du fichier
          const cleanTitle = item.file.name
            .replace(/\.[^/.]+$/, '')
            .replace(/[-_]/g, ' ')
            .trim();

          // 3. Enregistrement dans la table gallery_photos via /api/admin/gallery/albums/:id/photos
          const photoRes = await fetch(`/api/admin/gallery/albums/${destinationAlbumId}/photos`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${adminToken}`,
            },
            body: JSON.stringify({
              public_url: uploadData.public_url,
              storage_path: uploadData.storage_path,
              title_fr: cleanTitle || 'Photo A.J.M.C',
              title_ar: null,
              caption_fr: null,
              caption_ar: null,
              sort_order: Date.now() % 100000,
              is_published: true,
            }),
          });

          const photoData = await photoRes.json();
          if (!photoRes.ok) {
            throw new Error(photoData.error || `Erreur d'enregistrement pour ${item.file.name}`);
          }

          // Succès pour cet élément
          currentSuccess++;
          setQueue((prev) =>
            prev.map((it) => (it.id === item.id ? { ...it, status: 'success' } : it))
          );
        } catch (err: any) {
          // Échec isolé : on n'interrompt pas le reste du lot
          currentFailed++;
          console.warn(`[Upload Error] ${item.file.name}:`, err.message);
          setQueue((prev) =>
            prev.map((it) =>
              it.id === item.id
                ? { ...it, status: 'error', errorMessage: err.message || 'Échec du téléversement' }
                : it
            )
          );
        }
      }

      setResultSummary({ success: currentSuccess, failed: currentFailed });

      // Si au moins une image a réussi, actualiser l'album
      if (currentSuccess > 0) {
        onUploadSuccess(destinationAlbumId, currentSuccess);
      }
    } finally {
      setIsUploading(false);
    }
  };

  if (!isOpen) return null;

  const currentAlbumObj = targetAlbum || albums.find((a) => a.id === selectedAlbumId);
  const pendingCount = queue.filter((it) => it.status !== 'success').length;
  const successCount = queue.filter((it) => it.status === 'success').length;
  const errorCount = queue.filter((it) => it.status === 'error').length;
  const hasErrors = errorCount > 0;
  const isAllSuccess = queue.length > 0 && successCount === queue.length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-stone-950/75 backdrop-blur-xs animate-fade-in">
      <div
        className={`bg-white rounded-3xl w-full max-w-3xl overflow-hidden shadow-2xl border border-stone-200 my-auto flex flex-col max-h-[90vh] ${
          isRTL ? 'text-right' : 'text-left'
        }`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        {/* Entête de la modale */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2 text-xs font-bold text-[#0F5132] uppercase tracking-wider">
              <Upload className="w-4 h-4" />
              <span>{language === 'ar' ? 'رفع جماعي للصور' : 'Téléversement groupé'}</span>
            </div>
            <h3 className="text-lg sm:text-xl font-black text-stone-900">
              {language === 'ar' ? 'إضافة صور إلى الألبوم' : 'Ajouter des photos à l\'album'}
            </h3>
          </div>

          <button
            onClick={handleClose}
            disabled={isUploading}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 rounded-full transition-colors cursor-pointer disabled:opacity-40"
            title={language === 'ar' ? 'إغلاق' : 'Fermer'}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Corps de la modale */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          {/* 1. Sélection de l'album de destination */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
              {language === 'ar' ? 'ألبوم الوجهة' : 'Album de destination'}
            </label>

            {targetAlbum ? (
              <div className="flex items-center gap-3 p-3.5 bg-emerald-50/70 border border-emerald-200 rounded-2xl">
                <FolderKanban className="w-5 h-5 text-[#0F5132] shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-stone-900 truncate">
                    {language === 'ar' ? targetAlbum.title_ar || targetAlbum.title_fr : targetAlbum.title_fr}
                  </p>
                  <p className="text-xs text-stone-500">
                    {targetAlbum.category} • {targetAlbum.photo_count || 0} {language === 'ar' ? 'صورة حالياً' : 'photos actuelles'}
                  </p>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-[#0F5132]">
                  {language === 'ar' ? 'محدد' : 'Sélectionné'}
                </span>
              </div>
            ) : (
              <div>
                <select
                  value={selectedAlbumId}
                  onChange={(e) => setSelectedAlbumId(e.target.value)}
                  disabled={isUploading}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm font-semibold text-stone-800 focus:outline-none focus:border-[#0F5132]"
                >
                  {albums.length === 0 ? (
                    <option value="">
                      {language === 'ar' ? 'لا يوجد ألبومات متاحة' : 'Aucun album disponible'}
                    </option>
                  ) : (
                    albums.map((alb) => (
                      <option key={alb.id} value={alb.id}>
                        {language === 'ar' ? alb.title_ar || alb.title_fr : alb.title_fr} ({alb.category})
                      </option>
                    ))
                  )}
                </select>
                {albums.length === 0 && (
                  <p className="text-xs text-amber-700 mt-1">
                    {language === 'ar'
                      ? 'يرجى إنشاء ألبوم أولاً قبل إضافة صور.'
                      : 'Veuillez créer un album au préalable avant de pouvoir téléverser des photos.'}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* 2. Zone de dépôt & Sélection de fichiers multiples */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
              isDragging
                ? 'border-[#0F5132] bg-emerald-50/70 scale-[0.99]'
                : 'border-stone-300 hover:border-[#0F5132] bg-stone-50/50 hover:bg-emerald-50/20'
            } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleFileInputChange}
              className="hidden"
            />

            <div className="w-14 h-14 mx-auto rounded-2xl bg-white border border-stone-200 text-[#0F5132] flex items-center justify-center shadow-xs mb-3 group-hover:scale-105 transition-transform">
              <Upload className="w-6 h-6" />
            </div>

            <h4 className="font-extrabold text-sm sm:text-base text-stone-900">
              {language === 'ar'
                ? 'اسحب وأفلت الصور هنا، أو انقر للاختيار'
                : 'Glissez-déposez vos photos ici, ou cliquez pour parcourir'}
            </h4>
            <p className="text-xs text-stone-500 mt-1">
              {language === 'ar'
                ? 'يمكنك تحديد عدة صور في آن واحد (JPG, JPEG, PNG, WEBP — حتى 15 ميغابايت لكل صورة)'
                : 'Sélection multiple autorisée (JPG, JPEG, PNG, WEBP — 15 Mo max par photo)'}
            </p>

            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-white hover:bg-stone-100 text-stone-800 rounded-xl text-xs font-bold border border-stone-200 shadow-xs">
              <ImageIcon className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'ar' ? 'تحديد عدة صور من الجهاز' : 'Sélectionner plusieurs images'}</span>
            </div>
          </div>

          {/* Alertes de validation */}
          {validationWarning && (
            <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-800 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{validationWarning}</span>
            </div>
          )}

          {/* Résumé de fin de téléversement */}
          {resultSummary && (
            <div
              className={`p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-3 border ${
                resultSummary.failed === 0
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                  : 'bg-amber-50 border-amber-200 text-amber-900'
              }`}
            >
              {resultSummary.failed === 0 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-extrabold">
                  {language === 'ar'
                    ? `${resultSummary.success} صورة تمت إضافتها بنجاح.${resultSummary.failed > 0 ? ` ${resultSummary.failed} لم تكتمل.` : ''}`
                    : `${resultSummary.success} photo(s) ajoutée(s) avec succès.${resultSummary.failed > 0 ? ` ${resultSummary.failed} échec(s).` : ''}`}
                </p>
                {resultSummary.failed > 0 && (
                  <p className="text-xs text-stone-600 mt-0.5">
                    {language === 'ar'
                      ? 'يمكنك النقر على "إعادة المحاولة" لرفع الصور التي فشلت فقط دون تكرار الصور الناجحة.'
                      : 'Vous pouvez cliquer sur "Réessayer les échecs" pour renvoyer uniquement les photos non enregistrées.'}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Barre de progression pendant l'upload */}
          {isUploading && (
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-[#0F5132] border-t-transparent rounded-full animate-spin" />
                  <span>
                    {language === 'ar'
                      ? `جاري الرفع : ${uploadProgress.current} / ${uploadProgress.total}`
                      : `Téléversement : ${uploadProgress.current} / ${uploadProgress.total}`}
                  </span>
                </span>
                <span>
                  {uploadProgress.total > 0
                    ? Math.round((uploadProgress.current / uploadProgress.total) * 100)
                    : 0}
                  %
                </span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div
                  className="bg-[#0F5132] h-full transition-all duration-300 rounded-full"
                  style={{
                    width: `${
                      uploadProgress.total > 0
                        ? (uploadProgress.current / uploadProgress.total) * 100
                        : 0
                    }%`,
                  }}
                />
              </div>
            </div>
          )}

          {/* 3. Prévisualisation des images sélectionnées */}
          {queue.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <h4 className="font-extrabold text-xs sm:text-sm text-stone-900">
                    {language === 'ar'
                      ? `${queue.length} صورة محددة`
                      : `${queue.length} photo(s) sélectionnée(s)`}
                  </h4>
                  <span className="text-[11px] font-mono text-stone-400">
                    ({formatSize(totalQueueSize)})
                  </span>
                </div>

                {!isUploading && (
                  <button
                    type="button"
                    onClick={handleClearAll}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-red-600 hover:text-red-700 transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>{language === 'ar' ? 'إفراغ القائمة' : 'Vider la sélection'}</span>
                  </button>
                )}
              </div>

              {/* Grille des miniatures */}
              <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-72 overflow-y-auto p-1">
                {queue.map((item) => (
                  <div
                    key={item.id}
                    className={`relative aspect-square rounded-2xl overflow-hidden border bg-stone-100 group transition-all ${
                      item.status === 'uploading'
                        ? 'border-[#0F5132] ring-2 ring-emerald-500/30'
                        : item.status === 'success'
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20 opacity-80'
                        : item.status === 'error'
                        ? 'border-red-400 ring-2 ring-red-500/20'
                        : 'border-stone-200'
                    }`}
                  >
                    <img
                      src={item.previewUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Badge de statut */}
                    {item.status === 'uploading' && (
                      <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white gap-1 p-2">
                        <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span className="text-[10px] font-bold text-center">
                          {language === 'ar' ? 'جاري الرفع...' : 'Envoi...'}
                        </span>
                      </div>
                    )}

                    {item.status === 'success' && (
                      <div className="absolute inset-0 bg-emerald-950/40 flex items-center justify-center">
                        <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                          <CheckCircle2 className="w-4 h-4" />
                        </div>
                      </div>
                    )}

                    {item.status === 'error' && (
                      <div className="absolute inset-0 bg-red-950/60 flex flex-col items-center justify-center text-white p-1 text-center">
                        <AlertCircle className="w-5 h-5 text-red-400 mb-1" />
                        <span className="text-[9px] font-bold text-red-200 leading-tight truncate max-w-full px-1">
                          {item.errorMessage || (language === 'ar' ? 'فشل' : 'Échec')}
                        </span>
                      </div>
                    )}

                    {/* Bouton de suppression individuelle */}
                    {!isUploading && item.status !== 'uploading' && (
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(item.id)}
                        className="absolute top-1.5 right-1.5 p-1 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer shadow-xs"
                        title={language === 'ar' ? 'إزالة' : 'Retirer'}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {/* Nom et taille */}
                    <div className="absolute bottom-0 inset-x-0 bg-stone-950/80 px-1.5 py-1 text-[9px] text-stone-200 truncate flex items-center justify-between">
                      <span className="truncate">{item.name}</span>
                      <span className="font-mono text-stone-400 shrink-0 text-[8px] ml-1">
                        {formatSize(item.size)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pied de la modale */}
        <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50 flex flex-col-reverse sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleClose}
            disabled={isUploading}
            className="w-full sm:w-auto px-5 py-2.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white border border-stone-200 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
          >
            {isAllSuccess
              ? language === 'ar'
                ? 'إغلاق المعرض'
                : 'Fermer'
              : language === 'ar'
              ? 'إلغاء'
              : 'Annuler'}
          </button>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {/* Bouton de réessai pour les fichiers en erreur */}
            {hasErrors && !isUploading && (
              <button
                type="button"
                onClick={() => handleStartUpload(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>
                  {language === 'ar'
                    ? `إعادة محاولة (${errorCount})`
                    : `Réessayer les ${errorCount} échecs`}
                </span>
              </button>
            )}

            {/* Bouton de téléversement principal */}
            {!isAllSuccess && (
              <button
                type="button"
                onClick={() => handleStartUpload(false)}
                disabled={isUploading || queue.length === 0 || (!targetAlbum && !selectedAlbumId)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <Upload className="w-4 h-4" />
                )}
                <span>
                  {isUploading
                    ? language === 'ar'
                      ? `جاري الرفع (${uploadProgress.current}/${uploadProgress.total})...`
                      : `Envoi (${uploadProgress.current}/${uploadProgress.total})...`
                    : language === 'ar'
                    ? `رفع ${pendingCount} صورة`
                    : `Téléverser les ${pendingCount} photos`}
                </span>
              </button>
            )}

            {isAllSuccess && (
              <button
                type="button"
                onClick={handleClose}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer"
              >
                <FileCheck className="w-4 h-4" />
                <span>
                  {language === 'ar' ? 'تم الرفع بنجاح (إغلاق)' : 'Terminé (Fermer)'}
                </span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
