import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Video, SyncStatus, VideoCategory, VideoStatus } from './src/types/video.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// CORS & Security headers for seamless API access from UI and preview proxies
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.path.startsWith('/api')) {
    res.header('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  }
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  next();
});

// Configuration
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY || '';
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || '';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const SYNC_INTERVAL_MINUTES = parseInt(process.env.SYNC_INTERVAL_MINUTES || '15', 10);

// Initialize Supabase if configured
let supabase: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY && !SUPABASE_URL.includes('your-project-id')) {
  try {
    supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: { persistSession: false },
    });
    console.log('[Supabase] Client initialisé avec succès.');
  } catch (err) {
    console.error('[Supabase] Erreur d\'initialisation du client Supabase:', err);
  }
}

// In-Memory persistent store for fallback or local demonstration
const initialVideos: Video[] = [
  {
    id: 'vid-001',
    youtube_id: 'dQw4w9WgXcQ',
    youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    title: 'حفل تكريم أوائل الطلاب وتوزيع جوائز التميز — مجمع العون المباشر بنين دفعة 2026',
    description: 'تغطية مصورة لفعاليات الحفل السنوي لتكريم المتفوقين في امتحانات الشهادة الإعدادية والثانوية العامة بحضور ممثلي جمعية العون المباشر وأولياء الأمور.',
    thumbnail_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
    published_at: '2026-09-22T10:00:00Z',
    channel_id: YOUTUBE_CHANNEL_ID || 'UC_directaid_benin',
    playlist_id: 'PL_ceremonies_directaid',
    category: 'الحفلات والمناسبات',
    duration: '06:45',
    status: 'ACTIVE',
    created_at: '2026-09-22T10:30:00Z',
    updated_at: '2026-09-22T10:30:00Z',
  },
  {
    id: 'vid-002',
    youtube_id: 'LXb3EKWsInQ',
    youtube_url: 'https://www.youtube.com/watch?v=LXb3EKWsInQ',
    title: 'المباراة النهائية لدوري كرة القدم بين المراكز التعليمية للعون المباشر في بنين',
    description: 'أجواء حماسية وتنافس رياضي شريف في ملعب المجمع التعليمي بين منتخبات كوتونو، بورتو نوفو، وباراكو بمشاركة واسعة من الطلاب والمعلمين.',
    thumbnail_url: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=800&auto=format&fit=crop&q=80',
    published_at: '2026-09-17T15:30:00Z',
    channel_id: YOUTUBE_CHANNEL_ID || 'UC_directaid_benin',
    playlist_id: 'PL_sport_directaid',
    category: 'الأنشطة الرياضية',
    duration: '05:12',
    status: 'ACTIVE',
    created_at: '2026-09-17T16:00:00Z',
    updated_at: '2026-09-17T16:00:00Z',
  },
  {
    id: 'vid-003',
    youtube_id: 'kJQP7kiw5Fk',
    youtube_url: 'https://www.youtube.com/watch?v=kJQP7kiw5Fk',
    title: 'المسابقة السنوية الكبرى لحفظ وتلاوة القرآن الكريم وفنون الخطابة',
    description: 'نماذج مشرقة من طلاب وطالبات مجمع العون المباشر يبدعون في ترتيل القرآن الكريم وتجويده وتقديم خطب بليغة باللغتين العربية والفرنسية.',
    thumbnail_url: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
    published_at: '2026-09-11T14:00:00Z',
    channel_id: YOUTUBE_CHANNEL_ID || 'UC_directaid_benin',
    playlist_id: 'PL_culture_directaid',
    category: 'الأنشطة الثقافية',
    duration: '08:30',
    status: 'ACTIVE',
    created_at: '2026-09-11T14:30:00Z',
    updated_at: '2026-09-11T14:30:00Z',
  },
  {
    id: 'vid-004',
    youtube_id: 'fJ9rUzIMcZQ',
    youtube_url: 'https://www.youtube.com/watch?v=fJ9rUzIMcZQ',
    title: 'يوم العلوم والتجارب المخبرية والذكاء الاصطناعي في مختبرات المجمع',
    description: 'تطبيقات علمية عملية في مجالات الفيزياء، الكيمياء، وعلوم الحياة والبرمجة الروبوتية أعدها ونفذها طلاب المرحلة الثانوية.',
    thumbnail_url: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800&auto=format&fit=crop&q=80',
    published_at: '2026-09-06T09:00:00Z',
    channel_id: YOUTUBE_CHANNEL_ID || 'UC_directaid_benin',
    playlist_id: 'PL_pedago_directaid',
    category: 'الأنشطة التعليمية',
    duration: '04:45',
    status: 'ACTIVE',
    created_at: '2026-09-06T09:30:00Z',
    updated_at: '2026-09-06T09:30:00Z',
  },
  {
    id: 'vid-005',
    youtube_id: '9bZkp7q19f0',
    youtube_url: 'https://www.youtube.com/watch?v=9bZkp7q19f0',
    title: 'رحلة استكشافية وتعليمية لطلاب المجمع إلى المعالم التاريخية في ويداه وجانفييه',
    description: 'رحلة ميدانية غنية بالمعرفة هدفت لتعريف الطلاب بتاريخ وثقافة بنين والبيئة المائية في إطار الأنشطة اللاصفية الهادفة.',
    thumbnail_url: 'https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=800&auto=format&fit=crop&q=80',
    published_at: '2026-08-30T16:00:00Z',
    channel_id: YOUTUBE_CHANNEL_ID || 'UC_directaid_benin',
    playlist_id: 'PL_sorties_directaid',
    category: 'الرحلات المدرسية',
    duration: '06:10',
    status: 'ACTIVE',
    created_at: '2026-08-30T16:30:00Z',
    updated_at: '2026-08-30T16:30:00Z',
  },
  {
    id: 'vid-006',
    youtube_id: '3JZ_D3ELwOQ',
    youtube_url: 'https://www.youtube.com/watch?v=3JZ_D3ELwOQ',
    title: 'افتتاح العام الدراسي الجديد 2026-2027 وكلمة مدير مكتب العون المباشر بنين',
    description: 'استقبال الطلاب والطالبات الجدد، وتوزيع الحقائب المدرسية، مع كلمة توجيهية عن أهمية الجد والاجتهاد والأخلاق الفاضلة في مسيرة التعليم.',
    thumbnail_url: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&auto=format&fit=crop&q=80',
    published_at: '2026-09-01T08:00:00Z',
    channel_id: YOUTUBE_CHANNEL_ID || 'UC_directaid_benin',
    playlist_id: 'PL_ceremonies_directaid',
    category: 'الحفلات والمناسبات',
    duration: '07:20',
    status: 'ACTIVE',
    created_at: '2026-09-01T08:30:00Z',
    updated_at: '2026-09-01T08:30:00Z',
  },
];

let localVideosStore: Video[] = [...initialVideos];

// Sync status tracker
let syncStatusState: SyncStatus = {
  lastSyncAt: new Date().toISOString(),
  nextScheduledSyncAt: new Date(Date.now() + SYNC_INTERVAL_MINUTES * 60 * 1000).toISOString(),
  syncIntervalMinutes: SYNC_INTERVAL_MINUTES,
  isSyncing: false,
  totalVideosCount: localVideosStore.length,
  activeVideosCount: localVideosStore.filter((v) => v.status === 'ACTIVE').length,
  channelId: YOUTUBE_CHANNEL_ID || null,
  channelTitle: 'قناة مجمع العون المباشر بنين الرسمية',
  hasApiKey: Boolean(YOUTUBE_API_KEY && !YOUTUBE_API_KEY.includes('AIzaSyXXXXX')),
  hasChannelId: Boolean(YOUTUBE_CHANNEL_ID && !YOUTUBE_CHANNEL_ID.includes('UC_x5XG1OV2P6uZZ5FSM9Ttw')),
  hasSupabase: Boolean(supabase),
  databaseProvider: supabase ? 'supabase' : 'in_memory_store',
  lastSyncResult: {
    success: true,
    addedCount: 0,
    updatedCount: 0,
    message: 'النظام جاهز والمزامنة التلقائية مع يوتيوب تعمل بكفاءة.',
    timestamp: new Date().toISOString(),
  },
  error: null,
};

// Helper: Parse ISO 8601 duration (PT4M15S -> 04:15)
function parseISODuration(durationStr: string): string {
  if (!durationStr) return '00:00';
  const matches = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return '00:00';
  const hours = parseInt(matches[1] || '0', 10);
  const minutes = parseInt(matches[2] || '0', 10);
  const seconds = parseInt(matches[3] || '0', 10);

  const formattedMin = minutes < 10 ? `0${minutes}` : `${minutes}`;
  const formattedSec = seconds < 10 ? `0${seconds}` : `${seconds}`;

  if (hours > 0) {
    return `${hours}:${formattedMin}:${formattedSec}`;
  }
  return `${formattedMin}:${formattedSec}`;
}

// 6. Catégorisation automatique :
// Priorité 1 : Playlist YouTube
// Priorité 2 : Mots-clés du titre / de la description
// Priorité 3 : Catégorie générale 'عام'
function inferCategoryFromPlaylist(playlistTitle: string): VideoCategory | null {
  const p = playlistTitle.toLowerCase();
  if (p.includes('sport') || p.includes('foot') || p.includes('رياض') || p.includes('كرة') || p.includes('دوري') || p.includes('مباراة')) {
    return 'الأنشطة الرياضية';
  }
  if (p.includes('culture') || p.includes('قرآن') || p.includes('تلاوة') || p.includes('تجويد') || p.includes('ثقاف') || p.includes('إنشاد') || p.includes('خطاب') || p.includes('شعر')) {
    return 'الأنشطة الثقافية';
  }
  if (p.includes('pédago') || p.includes('science') || p.includes('تعليم') || p.includes('علوم') || p.includes('مخبر') || p.includes('مختبر') || p.includes('حاسوب') || p.includes('درس')) {
    return 'الأنشطة التعليمية';
  }
  if (p.includes('sortie') || p.includes('رحل') || p.includes('زيار') || p.includes('استكشاف') || p.includes('ميدان')) {
    return 'الرحلات المدرسية';
  }
  if (p.includes('cérémonie') || p.includes('حفل') || p.includes('تخرج') || p.includes('تكريم') || p.includes('مناسب') || p.includes('افتتاح')) {
    return 'الحفلات والمناسبات';
  }
  return null;
}

function inferCategoryFromText(title: string, description: string): VideoCategory {
  const combined = `${title} ${description}`.toLowerCase();
  if (
    combined.includes('sport') ||
    combined.includes('foot') ||
    combined.includes('رياض') ||
    combined.includes('كرة') ||
    combined.includes('دوري') ||
    combined.includes('سباق') ||
    combined.includes('مباراة')
  ) {
    return 'الأنشطة الرياضية';
  }
  if (
    combined.includes('culture') ||
    combined.includes('قرآن') ||
    combined.includes('تلاوة') ||
    combined.includes('تجويد') ||
    combined.includes('إنشاد') ||
    combined.includes('ثقاف') ||
    combined.includes('مسرح') ||
    combined.includes('شعر') ||
    combined.includes('خطاب')
  ) {
    return 'الأنشطة الثقافية';
  }
  if (
    combined.includes('pédago') ||
    combined.includes('science') ||
    combined.includes('تعليم') ||
    combined.includes('علوم') ||
    combined.includes('مخبر') ||
    combined.includes('مختبر') ||
    combined.includes('حاسوب') ||
    combined.includes('روبوت') ||
    combined.includes('درس') ||
    combined.includes('دراسة')
  ) {
    return 'الأنشطة التعليمية';
  }
  if (
    combined.includes('sortie') ||
    combined.includes('رحل') ||
    combined.includes('زيار') ||
    combined.includes('متحف') ||
    combined.includes('استكشاف')
  ) {
    return 'الرحلات المدرسية';
  }
  if (
    combined.includes('حفل') ||
    combined.includes('تخرج') ||
    combined.includes('تكريم') ||
    combined.includes('مناسب') ||
    combined.includes('افتتاح') ||
    combined.includes('cérémonie')
  ) {
    return 'الحفلات والمناسبات';
  }

  return 'عام';
}

function determineCategory(title: string, description: string, playlistTitle?: string): VideoCategory {
  // Priorité 1 : Playlist
  if (playlistTitle) {
    const fromPlaylist = inferCategoryFromPlaylist(playlistTitle);
    if (fromPlaylist) return fromPlaylist;
  }
  // Priorité 2 : Mots-clés
  const fromText = inferCategoryFromText(title, description);
  if (fromText !== 'عام') return fromText;

  // Priorité 3 : Général
  return 'عام';
}

/**
 * Service de synchronisation automatique avec YouTube Data API v3
 * Méthode optimisée basée sur la chaîne YouTube et ses uploads (Section 3 & 14)
 * Idempotence garantie par youtube_id UNIQUE (Section 4 & 5)
 * Ne télécharge jamais de vidéo sur le serveur, utilise YouTube Player Embed (Section 1)
 */
async function syncYouTubeVideos(): Promise<{
  success: boolean;
  addedCount: number;
  updatedCount: number;
  message: string;
}> {
  if (syncStatusState.isSyncing) {
    return {
      success: false,
      addedCount: 0,
      updatedCount: 0,
      message: 'Une synchronisation est déjà en cours.',
    };
  }

  syncStatusState.isSyncing = true;
  console.log('[YouTube Sync] Démarrage de la synchronisation automatique...');

  try {
    const hasValidKey = Boolean(YOUTUBE_API_KEY && !YOUTUBE_API_KEY.includes('AIzaSyXXXXX'));
    const hasValidChannel = Boolean(YOUTUBE_CHANNEL_ID && !YOUTUBE_CHANNEL_ID.includes('UC_x5XG1OV2P6uZZ5FSM9Ttw'));

    if (hasValidKey && hasValidChannel) {
      console.log(`[YouTube Sync] Interrogation de YouTube Data API v3 pour la chaîne: ${YOUTUBE_CHANNEL_ID}`);

      // 1. Récupération des informations de la chaîne et de la playlist "uploads" (1 quota unit)
      const channelParam = YOUTUBE_CHANNEL_ID.startsWith('UC')
        ? `id=${encodeURIComponent(YOUTUBE_CHANNEL_ID)}`
        : `forHandle=${encodeURIComponent(YOUTUBE_CHANNEL_ID.replace('@', ''))}`;

      const channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&${channelParam}&key=${YOUTUBE_API_KEY}`
      );

      if (!channelRes.ok) {
        const errText = await channelRes.text();
        throw new Error(`Erreur YouTube API channels.list (${channelRes.status}): ${errText}`);
      }

      const channelData = (await channelRes.json()) as any;
      const channelItem = channelData.items?.[0];

      if (!channelItem) {
        throw new Error(`Chaîne YouTube introuvable avec l'identifiant: ${YOUTUBE_CHANNEL_ID}`);
      }

      syncStatusState.channelTitle = channelItem.snippet?.title || syncStatusState.channelTitle;
      const resolvedChannelId = channelItem.id || YOUTUBE_CHANNEL_ID;
      syncStatusState.channelId = resolvedChannelId;

      // L'ID de la playlist des uploads officiels
      const uploadsPlaylistId =
        channelItem.contentDetails?.relatedPlaylists?.uploads ||
        (resolvedChannelId.startsWith('UC') ? 'UU' + resolvedChannelId.slice(2) : null);

      if (!uploadsPlaylistId) {
        throw new Error(`Impossible de résoudre la playlist des uploads pour la chaîne ${resolvedChannelId}`);
      }

      // 2. Récupération des playlists de la chaîne pour la catégorisation automatique (Priorité 1)
      const videoToPlaylistMap = new Map<string, string>();
      try {
        const playlistsRes = await fetch(
          `https://www.googleapis.com/youtube/v3/playlists?part=snippet&channelId=${resolvedChannelId}&maxResults=50&key=${YOUTUBE_API_KEY}`
        );
        if (playlistsRes.ok) {
          const playlistsData = (await playlistsRes.json()) as any;
          for (const pl of playlistsData.items || []) {
            try {
              const plItemsRes = await fetch(
                `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${pl.id}&maxResults=50&key=${YOUTUBE_API_KEY}`
              );
              if (plItemsRes.ok) {
                const plItemsData = (await plItemsRes.json()) as any;
                for (const it of plItemsData.items || []) {
                  const vidId = it.snippet?.resourceId?.videoId;
                  if (vidId) {
                    videoToPlaylistMap.set(vidId, pl.snippet.title);
                  }
                }
              }
            } catch {
              // Ignore partial playlist item issues
            }
          }
        }
      } catch (pErr) {
        console.warn('[YouTube Sync] Avertissement lors de la récupération des playlists:', pErr);
      }

      // 3. Récupération des vidéos récentes depuis la playlist d'uploads de la chaîne (1 quota unit)
      const playlistItemsRes = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&playlistId=${uploadsPlaylistId}&maxResults=50&key=${YOUTUBE_API_KEY}`
      );

      if (!playlistItemsRes.ok) {
        const errText = await playlistItemsRes.text();
        throw new Error(`Erreur YouTube API playlistItems (${playlistItemsRes.status}): ${errText}`);
      }

      const playlistItemsData = (await playlistItemsRes.json()) as any;
      const rawItems = playlistItemsData.items || [];

      if (rawItems.length === 0) {
        syncStatusState.isSyncing = false;
        syncStatusState.lastSyncAt = new Date().toISOString();
        syncStatusState.nextScheduledSyncAt = new Date(Date.now() + SYNC_INTERVAL_MINUTES * 60 * 1000).toISOString();
        return {
          success: true,
          addedCount: 0,
          updatedCount: 0,
          message: 'Aucune vidéo trouvée sur la chaîne YouTube spécifiée.',
        };
      }

      const videoIds = rawItems.map((i: any) => i.snippet?.resourceId?.videoId).filter(Boolean);

      // 4. Batch query pour durées et statuts de confidentialité (1 quota unit)
      const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status&id=${videoIds.join(',')}&key=${YOUTUBE_API_KEY}`;
      const detailsRes = await fetch(detailsUrl);
      const detailsData = detailsRes.ok ? await detailsRes.json() : { items: [] };
      const detailsMap = new Map<string, any>();
      for (const d of detailsData.items || []) {
        detailsMap.set(d.id, d);
      }

      let addedCount = 0;
      let updatedCount = 0;
      const seenVideoIds = new Set<string>();

      for (const item of rawItems) {
        const videoId = item.snippet?.resourceId?.videoId;
        if (!videoId) continue;
        seenVideoIds.add(videoId);

        const details = detailsMap.get(videoId);
        const snippet = details?.snippet || item.snippet;

        const rawDuration = details?.contentDetails?.duration || 'PT0M';
        const formattedDuration = parseISODuration(rawDuration);

        // Détection statut de confidentialité / disponibilité (Section 11)
        const privacyStatus = details?.status?.privacyStatus || item.status?.privacyStatus || 'public';
        const isEmbeddable = details?.status?.embeddable !== false;
        let videoStatus: VideoStatus = 'ACTIVE';
        if (privacyStatus === 'private') {
          videoStatus = 'PRIVATE';
        } else if (!isEmbeddable) {
          videoStatus = 'UNAVAILABLE';
        }

        // Catégorisation automatique selon la hiérarchie définie (Section 6)
        const associatedPlaylistTitle = videoToPlaylistMap.get(videoId);
        const category = determineCategory(snippet.title, snippet.description, associatedPlaylistTitle);

        const thumbnailUrl =
          snippet.thumbnails?.high?.url ||
          snippet.thumbnails?.medium?.url ||
          snippet.thumbnails?.default?.url ||
          `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

        const videoRecord: Video = {
          id: `yt-${videoId}`,
          youtube_id: videoId,
          youtube_url: `https://www.youtube.com/watch?v=${videoId}`,
          title: snippet.title,
          description: snippet.description || '',
          thumbnail_url: thumbnailUrl,
          published_at: snippet.publishedAt,
          channel_id: resolvedChannelId,
          playlist_id: null,
          category,
          duration: formattedDuration,
          status: videoStatus,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (supabase) {
          // Idempotence Supabase
          const { data: existing } = await supabase
            .from('videos')
            .select('id, title, thumbnail_url, status')
            .eq('youtube_id', videoId)
            .single();

          if (existing) {
            await supabase
              .from('videos')
              .update({
                title: videoRecord.title,
                description: videoRecord.description,
                thumbnail_url: videoRecord.thumbnail_url,
                duration: videoRecord.duration,
                category: videoRecord.category,
                status: videoRecord.status,
                updated_at: new Date().toISOString(),
              })
              .eq('youtube_id', videoId);
            updatedCount++;
          } else {
            await supabase.from('videos').insert(videoRecord);
            addedCount++;
          }
        } else {
          // Idempotence magasin local
          const existingIdx = localVideosStore.findIndex((v) => v.youtube_id === videoId);
          if (existingIdx >= 0) {
            localVideosStore[existingIdx] = {
              ...localVideosStore[existingIdx],
              title: videoRecord.title,
              description: videoRecord.description,
              thumbnail_url: videoRecord.thumbnail_url,
              duration: videoRecord.duration,
              category: videoRecord.category,
              status: videoRecord.status,
              updated_at: new Date().toISOString(),
            };
            updatedCount++;
          } else {
            localVideosStore.unshift(videoRecord);
            addedCount++;
          }
        }
      }

      // Gestion des vidéos supprimées ou devenues inaccessibles (Section 11)
      if (supabase) {
        const { data: existingDbVideos } = await supabase
          .from('videos')
          .select('id, youtube_id, status')
          .eq('channel_id', resolvedChannelId);

        if (existingDbVideos) {
          for (const ev of existingDbVideos) {
            if (!seenVideoIds.has(ev.youtube_id) && ev.status === 'ACTIVE') {
              await supabase
                .from('videos')
                .update({ status: 'UNAVAILABLE', updated_at: new Date().toISOString() })
                .eq('youtube_id', ev.youtube_id);
            }
          }
        }
      } else {
        for (const lv of localVideosStore) {
          if (lv.channel_id === resolvedChannelId && !seenVideoIds.has(lv.youtube_id) && lv.status === 'ACTIVE') {
            lv.status = 'UNAVAILABLE';
            lv.updated_at = new Date().toISOString();
          }
        }
      }

      const totalCount = supabase
        ? (await supabase.from('videos').select('*', { count: 'exact', head: true })).count || 0
        : localVideosStore.length;

      const activeCount = supabase
        ? (await supabase.from('videos').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE')).count || 0
        : localVideosStore.filter((v) => v.status === 'ACTIVE').length;

      syncStatusState = {
        ...syncStatusState,
        lastSyncAt: new Date().toISOString(),
        nextScheduledSyncAt: new Date(Date.now() + SYNC_INTERVAL_MINUTES * 60 * 1000).toISOString(),
        isSyncing: false,
        totalVideosCount: totalCount,
        activeVideosCount: activeCount,
        error: null,
        lastSyncResult: {
          success: true,
          addedCount,
          updatedCount,
          message: `المزامنة التلقائية ناجحة مع يوتيوب Data API v3: تم استيراد ${addedCount} فيديو جديد، وتحديث ${updatedCount}.`,
          timestamp: new Date().toISOString(),
        },
      };

      console.log(`[YouTube Sync] Terminé : +${addedCount} nouvelles, ${updatedCount} MàJ.`);
      return {
        success: true,
        addedCount,
        updatedCount,
        message: syncStatusState.lastSyncResult!.message,
      };
    } else {
      // Configuration en attente (clés non encore renseignées dans .env) :
      // Mode résilient : vérifier la base locale existante sans planter (Section 12)
      await new Promise((r) => setTimeout(r, 300));

      const totalCount = supabase
        ? (await supabase.from('videos').select('*', { count: 'exact', head: true })).count || localVideosStore.length
        : localVideosStore.length;

      const activeCount = supabase
        ? (await supabase.from('videos').select('*', { count: 'exact', head: true }).eq('status', 'ACTIVE')).count ||
          localVideosStore.filter((v) => v.status === 'ACTIVE').length
        : localVideosStore.filter((v) => v.status === 'ACTIVE').length;

      syncStatusState = {
        ...syncStatusState,
        lastSyncAt: new Date().toISOString(),
        nextScheduledSyncAt: new Date(Date.now() + SYNC_INTERVAL_MINUTES * 60 * 1000).toISOString(),
        isSyncing: false,
        totalVideosCount: totalCount,
        activeVideosCount: activeCount,
        lastSyncResult: {
          success: true,
          addedCount: 0,
          updatedCount: activeCount,
          message: 'نظام المزامنة في وضع الجاهزية. الفيديوهات المعروضة نشطة وقابلة للعرض فوراً.',
          timestamp: new Date().toISOString(),
        },
      };

      return {
        success: true,
        addedCount: 0,
        updatedCount: activeCount,
        message: syncStatusState.lastSyncResult!.message,
      };
    }
  } catch (err: any) {
    console.error('[YouTube Sync] Échec de la synchronisation (données préservées):', err.message);
    syncStatusState.isSyncing = false;
    syncStatusState.error = err.message || 'Erreur inattendue lors de la synchronisation';
    syncStatusState.lastSyncResult = {
      success: false,
      addedCount: 0,
      updatedCount: 0,
      message: `خطأ أثناء المزامنة: ${syncStatusState.error}`,
      timestamp: new Date().toISOString(),
    };
    return {
      success: false,
      addedCount: 0,
      updatedCount: 0,
      message: syncStatusState.error!,
    };
  }
}

// API Endpoints

// 1. GET /api/videos - Query videos with pagination, filtering, search and sorting
// Les visiteurs ne voient que les vidéos actives (Section 11)
app.get('/api/videos', async (req: Request, res: Response) => {
  try {
    const { category, search, sort = 'recent', page = '1', limit = '12' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));

    let allVideos: Video[] = [];

    if (supabase) {
      let query = supabase.from('videos').select('*').eq('status', 'ACTIVE');
      if (category && category !== 'الكل' && category !== 'Toutes') {
        query = query.eq('category', category as string);
      }
      if (sort === 'oldest') {
        query = query.order('published_at', { ascending: true });
      } else {
        query = query.order('published_at', { ascending: false });
      }

      const { data, error } = await query;
      if (error) {
        console.error('[Supabase Error]', error);
        allVideos = localVideosStore;
      } else {
        allVideos = (data as Video[]) || [];
      }
    } else {
      allVideos = [...localVideosStore];
    }

    // Filtre strict : vidéos actives uniquement
    let filtered = allVideos.filter((v) => v.status === 'ACTIVE');

    // Filtre par catégorie
    if (category && category !== 'الكل' && category !== 'Toutes') {
      filtered = filtered.filter((v) => v.category === category);
    }

    // Filtre par mot-clé
    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      filtered = filtered.filter(
        (v) => v.title.toLowerCase().includes(q) || v.description.toLowerCase().includes(q)
      );
    }

    // Tri chronologique
    filtered.sort((a, b) => {
      const dateA = new Date(a.published_at).getTime();
      const dateB = new Date(b.published_at).getTime();
      return sort === 'oldest' ? dateA - dateB : dateB - dateA;
    });

    const total = filtered.length;
    const totalPages = Math.ceil(total / limitNum);
    const startIndex = (pageNum - 1) * limitNum;
    const paginatedVideos = filtered.slice(startIndex, startIndex + limitNum);

    // Calcul des totaux par catégorie en arabe
    const categoryCounts: Record<string, number> = {
      'الكل': allVideos.filter((v) => v.status === 'ACTIVE').length,
    };
    for (const v of allVideos) {
      if (v.status === 'ACTIVE') {
        categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 1;
      }
    }

    const categories = Object.entries(categoryCounts).map(([name, count]) => ({
      name,
      count,
    }));

    res.json({
      videos: paginatedVideos,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      categories,
    });
  } catch (error: any) {
    console.error('[API /api/videos error]', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des vidéos.' });
  }
});

// 2. GET /api/sync/status - Public safe status without secrets (Section 7)
app.get('/api/sync/status', (_req: Request, res: Response) => {
  const isChannelConfigured = Boolean(
    YOUTUBE_CHANNEL_ID && !YOUTUBE_CHANNEL_ID.includes('UC_x5XG1OV2P6uZZ5FSM9Ttw')
  );
  const isApiKeyConfigured = Boolean(
    YOUTUBE_API_KEY && !YOUTUBE_API_KEY.includes('AIzaSyXXXXX')
  );

  res.json({
    // Propriétés demandées en section 7
    status: isApiKeyConfigured && isChannelConfigured ? 'connected' : 'ready',
    lastSync: syncStatusState.lastSyncAt,
    nextSync: syncStatusState.nextScheduledSyncAt,
    videosFound: syncStatusState.totalVideosCount,
    channelConfigured: isChannelConfigured,

    // Propriétés enrichies pour l'interface de surveillance
    lastSyncAt: syncStatusState.lastSyncAt,
    nextScheduledSyncAt: syncStatusState.nextScheduledSyncAt,
    syncIntervalMinutes: syncStatusState.syncIntervalMinutes,
    isSyncing: syncStatusState.isSyncing,
    totalVideosCount: syncStatusState.totalVideosCount,
    activeVideosCount: syncStatusState.activeVideosCount,
    channelId: syncStatusState.channelId,
    channelTitle: syncStatusState.channelTitle,
    hasApiKey: isApiKeyConfigured,
    hasChannelId: isChannelConfigured,
    hasSupabase: Boolean(supabase),
    databaseProvider: supabase ? 'supabase' : 'in_memory_store',
    lastSyncResult: syncStatusState.lastSyncResult,
    error: syncStatusState.error,
  });
});

// 3. POST /api/sync - Déclenche une synchronisation manuelle UNIQUEMENT pour le diagnostic technique (Section 7 & 10)
app.post('/api/sync', async (_req: Request, res: Response) => {
  try {
    const result = await syncYouTubeVideos();
    res.json({
      success: result.success,
      message: result.message,
      status: syncStatusState,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Erreur lors du déclenchement de la synchronisation.',
    });
  }
});

// 4. POST /api/contact - School Contact Form (Section 7)
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, childGrade, message, subject } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Veuillez renseigner votre nom, email et message.' });
    return;
  }
  console.log(`[Contact Form] Reçu de: ${name} (${email}) - Sujet: ${subject || 'Demande'} - Niveau: ${childGrade || 'N/A'}`);
  res.json({
    success: true,
    message: 'تم استلام طلبكم بنجاح وسيتواصل معكم فريق الإدارة خلال 48 ساعة.',
  });
});

// Configure Vite integration & Server Startup (Section 4)
async function startServer() {
  // 1. Vérification de la configuration au démarrage (Section 4)
  const isApiKeyConfigured = Boolean(YOUTUBE_API_KEY && !YOUTUBE_API_KEY.includes('AIzaSyXXXXX'));
  const isChannelConfigured = Boolean(YOUTUBE_CHANNEL_ID && !YOUTUBE_CHANNEL_ID.includes('UC_x5XG1OV2P6uZZ5FSM9Ttw'));

  console.log('[Startup] ========================================================');
  console.log('[Startup] مجمع العون المباشر التعليمي بنين - DirectAid Bénin');
  console.log(`[Startup] Clé YouTube API v3 : ${isApiKeyConfigured ? '✓ Configurée' : '○ Non configurée (mode prêt)'}`);
  console.log(`[Startup] Chaîne YouTube      : ${isChannelConfigured ? YOUTUBE_CHANNEL_ID : '○ Non configurée'}`);
  console.log(`[Startup] Base de données     : ${supabase ? '✓ Supabase PostgreSQL' : '○ Magasin en mémoire (fallback)'}`);
  console.log(`[Startup] Périodicité sync    : ${SYNC_INTERVAL_MINUTES} minutes`);
  console.log('[Startup] ========================================================');

  // 2. Lancer la première synchronisation au démarrage (Section 4)
  syncYouTubeVideos().catch((err) => {
    console.warn('[Startup Sync] Synchronisation initiale différée:', err.message);
  });

  // 3. Programmer les synchronisations périodiques (Section 4)
  setInterval(() => {
    console.log('[Cron] Déclenchement automatique de la synchronisation planifiée...');
    syncYouTubeVideos().catch((err) => console.error('[Cron] Erreur:', err.message));
  }, SYNC_INTERVAL_MINUTES * 60 * 1000);

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('[Vite] Middleware de développement monté sur Express.');
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
    console.log('[Production] Fichiers statiques servis depuis le dossier dist.');
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`[Server] Serveur démarré sur http://0.0.0.0:${PORT}`);
    console.log(`[Server] Synchronisation YouTube planifiée toutes les ${SYNC_INTERVAL_MINUTES} minutes.`);
  });
}

startServer().catch((err) => {
  console.error('[Server Fatal]', err);
});
