/**
 * تعريف الأنواع لنظام الفيديو والمزامنة التلقائية مع يوتيوب وسوبابيس
 */

export type VideoCategory =
  | 'الكل'
  | 'الأنشطة التعليمية'
  | 'الأنشطة الثقافية'
  | 'الأنشطة الرياضية'
  | 'الرحلات المدرسية'
  | 'الحفلات والمناسبات'
  | 'عام'
  // Compatibilité de repli
  | 'Toutes'
  | 'Activités pédagogiques'
  | 'Activités culturelles'
  | 'Activités sportives'
  | 'Sorties scolaires'
  | 'Cérémonies'
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
