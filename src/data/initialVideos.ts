
import type { Video, SyncStatus } from '../types/video.ts';

/**
 * Aucune vidéo de démonstration ne doit être affichée en production.
 * Les vraies vidéos doivent être chargées depuis GET /api/videos.
 */
export const initialVideos: Video[] = [];

/**
 * État initial neutre.
 * Le statut réel de synchronisation doit provenir du backend
 * via GET /api/sync/status.
 */
export const initialSyncStatus: SyncStatus = {
  lastSyncAt: null,
  nextScheduledSyncAt: null,
  syncIntervalMinutes: 15,
  isSyncing: false,
  totalVideosCount: 0,
  activeVideosCount: 0,
  channelId: '',
  channelTitle: '',
  hasApiKey: false,
  hasChannelId: false,
  hasSupabase: false,
  databaseProvider: 'supabase',
  lastSyncResult: null,
  error: null,
};

/**
 * Catégories disponibles.
 * Les nombres doivent être calculés à partir des vidéos réellement
 * reçues depuis le backend, et non définis ici.
 */
export const initialCategories = [
  { name: 'الكل', count: 0 },
  { name: 'الأنشطة الثقافية', count: 0 },
  { name: 'المحاضرات واللقاءات', count: 0 },
  { name: 'الأنشطة الدينية', count: 0 },
  { name: 'الأنشطة التعليمية', count: 0 },
  { name: 'الأنشطة الاجتماعية', count: 0 },
  { name: 'أنشطة الشباب', count: 0 },
];
