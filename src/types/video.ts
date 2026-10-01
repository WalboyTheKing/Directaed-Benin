/**
 * Types pour le système de médiathèque et synchronisation YouTube de l'A.J.M.C — Kandi
 */

export type VideoCategory =
  | 'الكل'
  | 'الأنشطة التعليمية'
  | 'الأنشطة الثقافية'
  | 'الأنشطة الدينية'
  | 'أنشطة الشباب'
  | 'الأنشطة الاجتماعية'
  | 'المحاضرات واللقاءات'
  | 'الفعاليات والمناسبات'
  | 'عام'
  // Compatibilité de repli en français
  | 'Toutes'
  | 'Activités éducatives'
  | 'Activités culturelles'
  | 'Activités religieuses'
  | 'Activités de jeunesse'
  | 'Actions sociales'
  | 'Conférences et rencontres'
  | 'Événements et célébrations'
  | 'Général';

export type VideoStatus = 'ACTIVE' | 'UNAVAILABLE' | 'PRIVATE';

export interface Video {
  id: string;
  youtube_id: string;
  youtube_url: string;
  title: string;
  description: string;
  thumbnail_url: string;
  published_at: string;
  channel_id: string;
  playlist_id?: string | null;
  category: VideoCategory;
  duration?: string;
  status: VideoStatus;
  created_at: string;
  updated_at: string;
}

export interface SyncStatus {
  lastSyncAt: string | null;
  nextScheduledSyncAt: string | null;
  syncIntervalMinutes: number;
  isSyncing: boolean;
  totalVideosCount: number;
  activeVideosCount: number;
  channelId: string | null;
  channelTitle?: string | null;
  hasApiKey: boolean;
  hasChannelId: boolean;
  hasSupabase: boolean;
  databaseProvider: 'supabase' | 'in_memory_store';
  lastSyncResult?: {
    success: boolean;
    addedCount: number;
    updatedCount: number;
    message: string;
    timestamp: string;
  } | null;
  error?: string | null;
}

export interface VideosResponse {
  videos: Video[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  categories: { name: string; count: number }[];
}
