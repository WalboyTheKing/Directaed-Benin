import React, { useState, useEffect, useCallback } from 'react';
import {
  Plus,
  Upload,
  Search,
  Camera,
  FolderKanban,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Edit,
  Trash2,
  Image as ImageIcon,
  Calendar,
  Layers,
  Sparkles,
  RefreshCw,
  SlidersHorizontal
} from 'lucide-react';
import type { GalleryAlbum, GalleryStats, GalleryCategory } from '../../types/gallery.ts';
import { GALLERY_CATEGORIES } from '../../types/gallery.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';
import { AlbumModal } from './AlbumModal.tsx';
import { AdminAlbumPhotos } from './AdminAlbumPhotos.tsx';
import { MultiPhotoUploadModal } from './MultiPhotoUploadModal.tsx';

interface AdminGalleryDashboardProps {
  adminToken: string;
}

export const AdminGalleryDashboard: React.FC<AdminGalleryDashboardProps> = ({ adminToken }) => {
  const { isRTL, language } = useLanguage();

  const [albums, setAlbums] = useState<GalleryAlbum[]>([]);
  const [stats, setStats] = useState<GalleryStats>({
    totalAlbums: 0,
    totalPhotos: 0,
    publishedAlbums: 0,
    draftAlbums: 0,
  });

  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modals et vues enfants
  const [isAlbumModalOpen, setIsAlbumModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<GalleryAlbum | null>(null);
  const [managingAlbum, setManagingAlbum] = useState<GalleryAlbum | null>(null);

  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Charger la liste des albums et les statistiques
  const fetchData = useCallback(async () => {
    try {
      setIsLoading(true);

      const [albumsRes, statsRes] = await Promise.all([
        fetch('/api/admin/gallery/albums', {
          headers: { Authorization: `Bearer ${adminToken}` },
        }),
        fetch('/api/admin/gallery/stats', {
          headers: { Authorization: `Bearer ${adminToken}` },
        }),
      ]);

      if (albumsRes.ok) {
        const albumsData = await albumsRes.json();
        if (albumsData && Array.isArray(albumsData.albums)) {
          setAlbums(albumsData.albums);
        }
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
    } catch (err) {
      console.warn('[Admin Dashboard] Erreur:', err);
      setErrorMsg(language === 'ar' ? 'تعذر جلب البيانات من الخادم.' : 'Erreur lors du chargement des données.');
    } finally {
      setIsLoading(false);
    }
  }, [adminToken, language]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Création ou modification d'album
  const handleSaveAlbum = async (albumData: Partial<GalleryAlbum>) => {
    const isEditing = Boolean(editingAlbum);
    const url = isEditing
      ? `/api/admin/gallery/albums/${editingAlbum!.id}`
      : '/api/admin/gallery/albums';
    const method = isEditing ? 'PUT' : 'POST';

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(albumData),
    });

    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.error || 'Erreur lors de l\'enregistrement de l\'album.');
    }

    setSuccessMsg(
      isEditing
        ? (language === 'ar' ? 'تم تحديث الألبوم بنجاح.' : 'Album modifié avec succès.')
        : (language === 'ar' ? 'تم إنشاء الألبوم الجديد بنجاح.' : 'Nouvel album créé avec succès.')
    );

    setEditingAlbum(null);
    setIsAlbumModalOpen(false);
    await fetchData();
  };

  // Bascule rapide Publié / Dépublié
  const handleTogglePublish = async (album: GalleryAlbum) => {
    try {
      const res = await fetch(`/api/admin/gallery/albums/${album.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
        body: JSON.stringify({ is_published: !album.is_published }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors du changement de statut.');
      }

      setAlbums((prev) =>
        prev.map((a) => (a.id === album.id ? { ...a, is_published: !a.is_published } : a))
      );

      // Actualiser statistiques
      setStats((prev) => ({
        ...prev,
        publishedAlbums: album.is_published ? prev.publishedAlbums - 1 : prev.publishedAlbums + 1,
        draftAlbums: album.is_published ? prev.draftAlbums + 1 : prev.draftAlbums - 1,
      }));
    } catch (err: any) {
      setErrorMsg(err.message || 'Impossible de modifier le statut de publication.');
    }
  };

  // Suppression d'un album avec confirmation explicite
  const handleDeleteAlbum = async (album: GalleryAlbum) => {
    const confirmPrompt =
      language === 'ar'
        ? `هل أنت متأكد من حذف الألبوم "${album.title_ar || album.title_fr}" وكافة الصور التابعة له نهائياً؟`
        : `Êtes-vous sûr de vouloir supprimer définitivement l'album "${album.title_fr}" et toutes ses photos associées ?`;

    if (!window.confirm(confirmPrompt)) return;

    try {
      const res = await fetch(`/api/admin/gallery/albums/${album.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminToken}` },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Erreur lors de la suppression.');
      }

      setSuccessMsg(language === 'ar' ? 'تم حذف الألبوم بنجاح.' : 'Album supprimé avec succès.');
      await fetchData();
    } catch (err: any) {
      setErrorMsg(err.message || 'Erreur lors de la suppression de l\'album.');
    }
  };

  // Filtrage
  const filteredAlbums = albums.filter((alb) => {
    const matchesSearch =
      alb.title_fr.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (alb.title_ar && alb.title_ar.includes(searchQuery)) ||
      (alb.category && alb.category.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory =
      selectedCategory === 'all' || alb.category === selectedCategory;

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && alb.is_published) ||
      (statusFilter === 'draft' && !alb.is_published);

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Si on est en train de gérer les photos d'un album
  if (managingAlbum) {
    return (
      <AdminAlbumPhotos
        album={managingAlbum}
        adminToken={adminToken}
        onBack={() => setManagingAlbum(null)}
        onRefreshAlbum={fetchData}
      />
    );
  }

  return (
    <div className={`space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Messages */}
      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-center justify-between">
          <span>{errorMsg}</span>
          <button onClick={() => setErrorMsg(null)} className="text-red-500 hover:text-red-700 font-bold">
            ✕
          </button>
        </div>
      )}

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg(null)} className="text-emerald-700 hover:text-emerald-900 font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Cartes de statistiques du tableau de bord */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Albums */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              {language === 'ar' ? 'إجمالي الألبومات' : 'Total Albums'}
            </span>
            <FolderKanban className="w-4 h-4 text-[#0F5132]" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {stats.totalAlbums}
          </p>
        </div>

        {/* Total Photos */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              {language === 'ar' ? 'إجمالي الصور' : 'Total Photos'}
            </span>
            <Camera className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {stats.totalPhotos}
          </p>
        </div>

        {/* Albums Publiés */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              {language === 'ar' ? 'ألبومات منشورة' : 'Albums Publiés'}
            </span>
            <Eye className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-[#0F5132]">
            {stats.publishedAlbums}
          </p>
        </div>

        {/* Albums en Brouillon */}
        <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-stone-500">
            <span className="text-xs font-bold uppercase tracking-wider">
              {language === 'ar' ? 'ألبومات كمسودة' : 'Albums Brouillons'}
            </span>
            <EyeOff className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600">
            {stats.draftAlbums}
          </p>
        </div>
      </div>

      {/* Barre d'action : Recherche, Filtres & Bouton Nouvel Album */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Recherche */}
          <div className="relative flex-1">
            <Search className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3.5' : 'left-3.5'} w-4 h-4 text-stone-400`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'البحث عن ألبوم...' : 'Rechercher un album par titre ou catégorie...'}
              className={`w-full ${isRTL ? 'pr-10 pl-4' : 'pl-10 pr-4'} py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0F5132]`}
            />
          </div>

          {/* Boutons d'action : Ajouter des photos & Nouvel Album */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-[#0F5132] border border-emerald-300 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
              title={language === 'ar' ? 'رفع صور جديدة إلى ألبوم' : 'Ajouter des photos à un album'}
            >
              <Upload className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة صور' : 'Ajouter des photos'}</span>
            </button>

            <button
              onClick={() => {
                setEditingAlbum(null);
                setIsAlbumModalOpen(true);
              }}
              className="px-5 py-2.5 bg-[#0F5132] hover:bg-[#16A34A] text-white font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'ألبوم جديد' : 'Nouvel album'}</span>
            </button>
          </div>
        </div>

        {/* Filtres par Catégorie et Statut */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-stone-500 font-semibold flex items-center gap-1">
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'التصنيف :' : 'Catégorie :'}</span>
            </span>

            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                selectedCategory === 'all'
                  ? 'bg-stone-900 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {language === 'ar' ? 'الكل' : 'Toutes'}
            </button>

            {GALLERY_CATEGORIES.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.id)}
                className={`px-3 py-1 rounded-lg font-semibold transition-colors cursor-pointer ${
                  selectedCategory === c.id
                    ? 'bg-stone-900 text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {language === 'ar' ? c.name_ar : c.name_fr}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="px-3 py-1 bg-stone-50 border border-stone-200 rounded-lg text-xs font-semibold text-stone-700 focus:outline-none"
            >
              <option value="all">{language === 'ar' ? 'كافة الحالات' : 'Tous les statuts'}</option>
              <option value="published">{language === 'ar' ? 'المنشورة فقط' : 'Publiés uniquement'}</option>
              <option value="draft">{language === 'ar' ? 'المسودات فقط' : 'Brouillons uniquement'}</option>
            </select>
          </div>
        </div>
      </div>

      {/* Liste des albums */}
      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white p-5 rounded-2xl border border-stone-200 animate-pulse h-24" />
          ))}
        </div>
      ) : filteredAlbums.length === 0 ? (
        <div className="bg-white rounded-3xl border border-stone-200 p-12 text-center space-y-3">
          <FolderKanban className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="font-bold text-base text-stone-800">
            {language === 'ar' ? 'لم يتم العثور على ألبومات' : 'Aucun album trouvé'}
          </h3>
          <p className="text-xs text-stone-500">
            {language === 'ar'
              ? 'انقر على "ألبوم جديد" للبدء في إنشاء معرض صور.'
              : 'Cliquez sur "Nouvel album" pour créer votre premier album.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredAlbums.map((album) => {
            const albumTitle =
              language === 'ar' ? album.title_ar || album.title_fr : album.title_fr;

            return (
              <div
                key={album.id}
                className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col md:flex-row md:items-center justify-between gap-5"
              >
                {/* Couverture et infos */}
                <div className="flex items-center gap-4 min-w-0">
                  <div className="relative w-24 h-20 sm:w-28 sm:h-20 rounded-2xl bg-stone-900 overflow-hidden shrink-0 border border-stone-200">
                    {album.cover_url ? (
                      <img
                        src={album.cover_url}
                        alt={albumTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-stone-500">
                        <ImageIcon className="w-6 h-6" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        {album.category}
                      </span>
                      {album.event_date && (
                        <span className="text-stone-500 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(album.event_date).toLocaleDateString(language === 'ar' ? 'ar-EG' : 'fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      )}
                      <span className="text-stone-500 flex items-center gap-1">
                        <Camera className="w-3 h-3" />
                        {album.photo_count || 0}{' '}
                        {language === 'ar' ? 'صورة' : 'photos'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-stone-900 truncate">
                      {albumTitle}
                    </h3>

                    {album.title_ar && language !== 'ar' && (
                      <p className="text-xs text-stone-400 font-cairo truncate">
                        {album.title_ar}
                      </p>
                    )}
                  </div>
                </div>

                {/* Statut & Boutons d'action */}
                <div className="flex flex-wrap items-center gap-2 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                  {/* Badge & Toggle Publier / Dépublier */}
                  <button
                    onClick={() => handleTogglePublish(album)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 ${
                      album.is_published
                        ? 'bg-emerald-100 text-[#0F5132] hover:bg-emerald-200'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                    title={
                      album.is_published
                        ? (language === 'ar' ? 'إلغاء النشر (تحويل لمسودة)' : 'Dépublier l\'album')
                        : (language === 'ar' ? 'نشر الألبوم للعموم' : 'Publier l\'album')
                    }
                  >
                    {album.is_published ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    <span>
                      {album.is_published
                        ? (language === 'ar' ? 'منشور' : 'Publié')
                        : (language === 'ar' ? 'مسودة' : 'Brouillon')}
                    </span>
                  </button>

                  {/* Bouton Gérer les photos */}
                  <button
                    onClick={() => setManagingAlbum(album)}
                    className="px-3.5 py-1.5 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'إدارة الصور' : 'Gérer les photos'}</span>
                    <span className="bg-emerald-900/60 px-1.5 py-0.5 rounded-full text-[10px]">
                      {album.photo_count || 0}
                    </span>
                  </button>

                  {/* Bouton Modifier */}
                  <button
                    onClick={() => {
                      setEditingAlbum(album);
                      setIsAlbumModalOpen(true);
                    }}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                    title={language === 'ar' ? 'تعديل الألبوم' : 'Modifier l\'album'}
                  >
                    <Edit className="w-4 h-4" />
                  </button>

                  {/* Bouton Supprimer */}
                  <button
                    onClick={() => handleDeleteAlbum(album)}
                    className="p-2 rounded-xl bg-stone-100 hover:bg-red-50 text-stone-600 hover:text-red-600 transition-colors cursor-pointer"
                    title={language === 'ar' ? 'حذف الألبوم' : 'Supprimer l\'album'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Créer / Modifier Album */}
      <AlbumModal
        isOpen={isAlbumModalOpen}
        onClose={() => {
          setIsAlbumModalOpen(false);
          setEditingAlbum(null);
        }}
        album={editingAlbum}
        onSave={handleSaveAlbum}
        adminToken={adminToken}
      />

      {/* Modal de téléversement groupé de photos */}
      <MultiPhotoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        adminToken={adminToken}
        albums={albums}
        onUploadSuccess={async (_albumId, count) => {
          setSuccessMsg(
            language === 'ar'
              ? `تم رفع ${count} صورة بنجاح.`
              : `${count} photo(s) ajoutée(s) avec succès.`
          );
          await fetchData();
        }}
      />
    </div>
  );
};
