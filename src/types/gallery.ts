/**
 * Types pour le système de gestion de la galerie photo et des albums
 * Association des Jeunes Musulmans pour la Culture (A.J.M.C — Kandi)
 */

export type GalleryCategory =
  | 'Activités culturelles'
  | 'Activités religieuses'
  | 'Activités de jeunesse'
  | 'Actions sociales'
  | 'Conférences et rencontres'
  | 'Événements'
  | 'Autres';

export interface GalleryCategoryInfo {
  id: GalleryCategory;
  name_fr: string;
  name_ar: string;
}

export const GALLERY_CATEGORIES: GalleryCategoryInfo[] = [
  { id: 'Activités culturelles', name_fr: 'Activités culturelles', name_ar: 'الأنشطة الثقافية' },
  { id: 'Activités religieuses', name_fr: 'Activités religieuses', name_ar: 'الأنشطة الدينية' },
  { id: 'Activités de jeunesse', name_fr: 'Activités de jeunesse', name_ar: 'أنشطة الشباب' },
  { id: 'Actions sociales', name_fr: 'Actions sociales', name_ar: 'الأنشطة الاجتماعية' },
  { id: 'Conférences et rencontres', name_fr: 'Conférences et rencontres', name_ar: 'المحاضرات واللقاءات' },
  { id: 'Événements', name_fr: 'Événements', name_ar: 'الفعاليات والمناسبات' },
  { id: 'Autres', name_fr: 'Autres', name_ar: 'أخرى' },
];

export interface GalleryAlbum {
  id: string;
  title_fr: string;
  title_ar?: string | null;
  description_fr?: string | null;
  description_ar?: string | null;
  cover_url?: string | null;
  event_date?: string | null;
  category: GalleryCategory | string;
  is_published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  photo_count?: number;
}

export interface GalleryPhoto {
  id: string;
  album_id: string;
  storage_path?: string | null;
  public_url: string;
  title_fr?: string | null;
  title_ar?: string | null;
  caption_fr?: string | null;
  caption_ar?: string | null;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface GalleryStats {
  totalAlbums: number;
  totalPhotos: number;
  publishedAlbums: number;
  draftAlbums: number;
}

export interface AdminUser {
  id: string;
  email: string;
  role: 'admin';
  name?: string;
}
