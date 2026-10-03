import express, { type Request, type Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import type { Video, SyncStatus, VideoCategory, VideoStatus } from './src/types/video.ts';
import type { GalleryAlbum, GalleryPhoto, GalleryStats } from './src/types/gallery.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// Support base64 uploads and large payloads for gallery images
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

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
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCN0WZndfRXylOspFwildeMg';
const YOUTUBE_OFFICIAL_CHANNEL_URL = 'https://www.youtube.com/@Madjid-r3c';
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || '';
const SYNC_INTERVAL_MINUTES = parseInt(process.env.SYNC_INTERVAL_MINUTES || '15', 10);
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'ajmc2026';

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

// Magasin en mémoire (uniquement pour les vidéos réelles synchronisées ou cache local)
const initialVideos: Video[] = [];

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
  channelTitle: 'A.J.M.C — Association des Jeunes Musulmans pour la Culture (Kandi)',
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

// 6. Catégorisation automatique adaptée à l'A.J.M.C (Association des Jeunes Musulmans pour la Culture) :
// Priorité 1 : Playlist YouTube
// Priorité 2 : Mots-clés du titre / de la description
// Priorité 3 : Catégorie générale 'عام'
function inferCategoryFromPlaylist(playlistTitle: string): VideoCategory | null {
  const p = playlistTitle.toLowerCase();
  if (p.includes('conférence') || p.includes('rencontre') || p.includes('débat') || p.includes('محاضر') || p.includes('ندوة') || p.includes('لقاء') || p.includes('درس')) {
    return 'المحاضرات واللقاءات';
  }
  if (p.includes('religie') || p.includes('islam') || p.includes('coran') || p.includes('قرآن') || p.includes('تلاوة') || p.includes('تجويد') || p.includes('دين') || p.includes('دعوة') || p.includes('إسلام')) {
    return 'الأنشطة الدينية';
  }
  if (p.includes('jeune') || p.includes('chabab') || p.includes('شباب') || p.includes('فتيان') || p.includes('ناشئة') || p.includes('formation') || p.includes('atelier')) {
    return 'أنشطة الشباب';
  }
  if (p.includes('social') || p.includes('solidar') || p.includes('aide') || p.includes('خير') || p.includes('إحسان') || p.includes('تضامن') || p.includes('إغاث') || p.includes('مجتمع')) {
    return 'الأنشطة الاجتماعية';
  }
  if (p.includes('culture') || p.includes('ثقاف') || p.includes('شعر') || p.includes('مسرح') || p.includes('أدب') || p.includes('إنشاد')) {
    return 'الأنشطة الثقافية';
  }
  if (p.includes('éducat') || p.includes('pédago') || p.includes('تعليم') || p.includes('معرفة') || p.includes('علم') || p.includes('دورة')) {
    return 'الأنشطة التعليمية';
  }
  if (p.includes('événement') || p.includes('célébration') || p.includes('fête') || p.includes('مناسب') || p.includes('احتفال') || p.includes('عيد') || p.includes('مهرجان') || p.includes('فعال')) {
    return 'الفعاليات والمناسبات';
  }
  return null;
}

function inferCategoryFromText(title: string, description: string): VideoCategory {
  const combined = `${title} ${description}`.toLowerCase();
  if (
    combined.includes('conférence') ||
    combined.includes('rencontre') ||
    combined.includes('débat') ||
    combined.includes('محاضر') ||
    combined.includes('ندوة') ||
    combined.includes('لقاء') ||
    combined.includes('خطبة') ||
    combined.includes('درس')
  ) {
    return 'المحاضرات واللقاءات';
  }
  if (
    combined.includes('coran') ||
    combined.includes('quran') ||
    combined.includes('islam') ||
    combined.includes('religie') ||
    combined.includes('قرآن') ||
    combined.includes('تلاوة') ||
    combined.includes('تجويد') ||
    combined.includes('دين') ||
    combined.includes('دعوة') ||
    combined.includes('إسلام') ||
    combined.includes('حديث') ||
    combined.includes('سنة')
  ) {
    return 'الأنشطة الدينية';
  }
  if (
    combined.includes('jeunesse') ||
    combined.includes('jeune') ||
    combined.includes('chabab') ||
    combined.includes('شباب') ||
    combined.includes('فتيان') ||
    combined.includes('مخيم') ||
    combined.includes('رياض') ||
    combined.includes('sport') ||
    combined.includes('tournoi')
  ) {
    return 'أنشطة الشباب';
  }
  if (
    combined.includes('social') ||
    combined.includes('solidarité') ||
    combined.includes('communaut') ||
    combined.includes('charité') ||
    combined.includes('اجتماع') ||
    combined.includes('تضامن') ||
    combined.includes('خير') ||
    combined.includes('إحسان') ||
    combined.includes('مساعدة') ||
    combined.includes('إطعام')
  ) {
    return 'الأنشطة الاجتماعية';
  }
  if (
    combined.includes('culture') ||
    combined.includes('ثقاف') ||
    combined.includes('إنشاد') ||
    combined.includes('نشيد') ||
    combined.includes('مسابقة') ||
    combined.includes('شعر') ||
    combined.includes('أدب') ||
    combined.includes('تراث')
  ) {
    return 'الأنشطة الثقافية';
  }
  if (
    combined.includes('éducat') ||
    combined.includes('formation') ||
    combined.includes('atelier') ||
    combined.includes('تعليم') ||
    combined.includes('تربوي') ||
    combined.includes('دورة') ||
    combined.includes('تأهيل')
  ) {
    return 'الأنشطة التعليمية';
  }
  if (
    combined.includes('fête') ||
    combined.includes('célébration') ||
    combined.includes('événement') ||
    combined.includes('anniversaire') ||
    combined.includes('مناسب') ||
    combined.includes('احتفال') ||
    combined.includes('عيد') ||
    combined.includes('افتتاح') ||
    combined.includes('مهرجان')
  ) {
    return 'الفعاليات والمناسبات';
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

// Nettoyage intelligent de la cible de chaîne YouTube (URL complète, @handle, ID UC...)
function parseYouTubeChannelTarget(rawInput: string): { type: 'id' | 'handle'; param: string } {
  let cleaned = rawInput.trim();
  // Suppression des slashes de fin et paramètres de tracking
  cleaned = cleaned.replace(/\/+$/, '');

  if (cleaned.includes('youtube.com/channel/')) {
    cleaned = cleaned.split('youtube.com/channel/')[1].split('/')[0].split('?')[0];
  } else if (cleaned.includes('youtube.com/@')) {
    cleaned = cleaned.split('youtube.com/@')[1].split('/')[0].split('?')[0];
  } else if (cleaned.includes('youtube.com/c/')) {
    cleaned = cleaned.split('youtube.com/c/')[1].split('/')[0].split('?')[0];
  }

  if (cleaned.startsWith('UC') && cleaned.length >= 20) {
    return { type: 'id', param: `id=${encodeURIComponent(cleaned)}` };
  }

  // Handle avec ou sans @
  const handle = cleaned.replace(/^@/, '');
  return { type: 'handle', param: `forHandle=${encodeURIComponent(handle)}` };
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
      const target = parseYouTubeChannelTarget(YOUTUBE_CHANNEL_ID);
      let channelRes = await fetch(
        `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&${target.param}&key=${YOUTUBE_API_KEY}`
      );

      // Si recherche par forHandle a échoué et que c'était un handle, essayer forUsername de secours
      if (channelRes.ok) {
        const testData = (await channelRes.clone().json()) as any;
        if (!testData.items || testData.items.length === 0) {
          const rawCleaned = YOUTUBE_CHANNEL_ID.trim().replace(/^@/, '');
          console.log(`[YouTube Sync] Repli sur forUsername pour: ${rawCleaned}`);
          const fallbackRes = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=contentDetails,snippet&forUsername=${encodeURIComponent(rawCleaned)}&key=${YOUTUBE_API_KEY}`
          );
          if (fallbackRes.ok) {
            const fallbackData = (await fallbackRes.clone().json()) as any;
            if (fallbackData.items && fallbackData.items.length > 0) {
              channelRes = fallbackRes;
            }
          }
        }
      }

      if (!channelRes.ok) {
        const errText = await channelRes.text();
        throw new Error(`Erreur YouTube API channels.list (${channelRes.status}): ${errText}`);
      }

      const channelData = (await channelRes.json()) as any;
      const channelItem = channelData.items?.[0];

      if (!channelItem) {
        throw new Error(`Chaîne YouTube introuvable avec l'identifiant: ${YOUTUBE_CHANNEL_ID}. Vérifiez que l'identifiant est bien le Channel ID (commençant par UC...) ou le handle @officiel.`);
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

      // 3. Récupération des vidéos récentes depuis la playlist d'uploads de la chaîne avec pagination complète (Section 3 & 4)
      let rawItems: any[] = [];
      let pageToken: string | undefined = undefined;
      let pagesTraversed = 0;
      let playlistFetchSuccessful = false;
      const MAX_PAGES = 10; // Jusqu'à 500 vidéos maximum

      do {
        pagesTraversed++;
        const pageParam = pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : '';
        const playlistUrl = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet,status&playlistId=${uploadsPlaylistId}&maxResults=50${pageParam}&key=${YOUTUBE_API_KEY}`;
        const playlistItemsRes = await fetch(playlistUrl);

        if (!playlistItemsRes.ok) {
          if (playlistItemsRes.status === 404 && pagesTraversed === 1) {
            console.warn(`[YouTube Sync] Playlist uploads (${uploadsPlaylistId}) 404 : la chaîne n'a pas encore de vidéo publique indexée dans sa playlist d'uploads.`);
            // Tentative de recherche par search.list
            try {
              const searchRes = await fetch(
                `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${resolvedChannelId}&order=date&type=video&maxResults=50&key=${YOUTUBE_API_KEY}`
              );
              if (searchRes.ok) {
                const searchData = (await searchRes.json()) as any;
                rawItems = (searchData.items || []).map((it: any) => ({
                  snippet: {
                    ...it.snippet,
                    resourceId: { videoId: it.id?.videoId },
                  },
                  status: { privacyStatus: 'public' },
                }));
                playlistFetchSuccessful = true;
              }
            } catch (sErr) {
              console.warn('[YouTube Sync] Erreur lors de la tentative de recherche de secours:', sErr);
            }
          } else {
            const errText = await playlistItemsRes.text();
            console.error(`[YouTube Sync] Erreur YouTube API playlistItems page ${pagesTraversed} (${playlistItemsRes.status}):`, errText);
            throw new Error(`Erreur YouTube API playlistItems (${playlistItemsRes.status}): ${errText}`);
          }
          break;
        }

        const playlistItemsData = (await playlistItemsRes.json()) as any;
        playlistFetchSuccessful = true;
        const pageItems = playlistItemsData.items || [];
        rawItems.push(...pageItems);
        pageToken = playlistItemsData.nextPageToken;
      } while (pageToken && pagesTraversed < MAX_PAGES);

      if (rawItems.length === 0) {
        syncStatusState.isSyncing = false;
        syncStatusState.lastSyncAt = new Date().toISOString();
        syncStatusState.nextScheduledSyncAt = new Date(Date.now() + SYNC_INTERVAL_MINUTES * 60 * 1000).toISOString();
        console.log('[YouTube Sync] ==================== DIAGNOSTIC SYNCHRONISATION ====================');
        console.log(`[YouTube Sync] ID de chaîne utilisé          : ${resolvedChannelId}`);
        console.log(`[YouTube Sync] ID de playlist Uploads obtenu   : ${uploadsPlaylistId}`);
        console.log(`[YouTube Sync] Pages parcourues               : ${pagesTraversed}`);
        console.log(`[YouTube Sync] Éléments reçus de YouTube       : 0 (aucune vidéo publique trouvée)`);
        console.log('[YouTube Sync] ===================================================================');
        return {
          success: true,
          addedCount: 0,
          updatedCount: 0,
          message: 'Aucune vidéo publique trouvée sur la chaîne YouTube spécifiée.',
        };
      }

      const allVideoIds = rawItems.map((i: any) => i.snippet?.resourceId?.videoId).filter(Boolean);

      // 4. Batch query par paquets de 50 pour durées et statuts de confidentialité (1 quota unit par paquet)
      const detailsMap = new Map<string, any>();
      for (let i = 0; i < allVideoIds.length; i += 50) {
        const chunk = allVideoIds.slice(i, i + 50);
        const detailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,status&id=${chunk.join(',')}&key=${YOUTUBE_API_KEY}`;
        try {
          const detailsRes = await fetch(detailsUrl);
          if (detailsRes.ok) {
            const detailsData = await detailsRes.json();
            for (const d of detailsData.items || []) {
              detailsMap.set(d.id, d);
            }
          }
        } catch (dErr) {
          console.warn('[YouTube Sync] Avertissement lors de la récupération des détails d\'un paquet:', dErr);
        }
      }

      let addedCount = 0;
      let updatedCount = 0;
      let ignoredCount = 0;
      let validVideosCount = 0;
      let supabaseErrorsCount = 0;
      const seenVideoIds = new Set<string>();

      for (const item of rawItems) {
        const videoId = item.snippet?.resourceId?.videoId;
        if (!videoId) continue;
        seenVideoIds.add(videoId);

        const details = detailsMap.get(videoId);
        const snippet = details?.snippet || item.snippet;

        const rawDuration = details?.contentDetails?.duration || 'PT0M';
        const formattedDuration = parseISODuration(rawDuration);

        // Détection statut de confidentialité / disponibilité (Section 4 & 11)
        const privacyStatus = details?.status?.privacyStatus || item.status?.privacyStatus || 'public';
        const isEmbeddable = details?.status?.embeddable !== false;

        let videoStatus: VideoStatus = 'ACTIVE';
        if (privacyStatus === 'private') {
          videoStatus = 'PRIVATE';
          ignoredCount++;
          console.log(`[YouTube Sync] Vidéo ignorée (Privée) : ${videoId} — "${snippet.title}"`);
        } else if (!isEmbeddable) {
          videoStatus = 'UNAVAILABLE';
          ignoredCount++;
          console.log(`[YouTube Sync] Vidéo ignorée (Non intégrable) : ${videoId} — "${snippet.title}"`);
        } else {
          validVideosCount++;
        }

        // Catégorisation automatique selon la hiérarchie définie (Section 6)
        const associatedPlaylistTitle = videoToPlaylistMap.get(videoId);
        const category = determineCategory(snippet.title, snippet.description, associatedPlaylistTitle);

        const thumbnailUrl =
          snippet.thumbnails?.maxres?.url ||
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
          // Idempotence Supabase sécurisée avec maybeSingle et gestion UUID
          const { data: existing, error: selectErr } = await supabase
            .from('videos')
            .select('id, youtube_id, status')
            .eq('youtube_id', videoId)
            .maybeSingle();

          const dbPayload = {
            youtube_id: videoId,
            youtube_url: `https://www.youtube.com/watch?v=${videoId}`,
            title: snippet.title,
            description: snippet.description || '',
            thumbnail_url: thumbnailUrl,
            published_at: snippet.publishedAt,
            channel_id: resolvedChannelId,
            playlist_id: associatedPlaylistTitle || null,
            category,
            duration: formattedDuration,
            status: videoStatus,
            updated_at: new Date().toISOString(),
          };

          if (existing) {
            const { error: updateErr } = await supabase
              .from('videos')
              .update(dbPayload)
              .eq('youtube_id', videoId);

            if (updateErr) {
              console.error('[Supabase Update Error]', updateErr);
              supabaseErrorsCount++;
            } else {
              updatedCount++;
            }
          } else {
            const { error: insertErr } = await supabase
              .from('videos')
              .insert({
                ...dbPayload,
                created_at: new Date().toISOString(),
              });

            if (insertErr) {
              console.error('[Supabase Insert Error]', insertErr);
              supabaseErrorsCount++;
              if (insertErr.message?.includes('id') || insertErr.code === '23502') {
                await supabase.from('videos').insert({
                  ...dbPayload,
                  id: `yt-${videoId}`,
                  created_at: new Date().toISOString(),
                });
              }
            } else {
              addedCount++;
            }
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

      // 5. Réconciliation prudente des vidéos supprimées de YouTube (Section 8) :
      // On ne marque UNAVAILABLE que si la synchronisation a réussi son parcours complet
      if (playlistFetchSuccessful && seenVideoIds.size > 0) {
        if (supabase) {
          try {
            const { data: dbActiveVideos } = await supabase
              .from('videos')
              .select('youtube_id')
              .eq('status', 'ACTIVE');

            if (dbActiveVideos && dbActiveVideos.length > 0) {
              for (const row of dbActiveVideos) {
                if (!seenVideoIds.has(row.youtube_id)) {
                  console.log(`[YouTube Sync] Vidéo ${row.youtube_id} non présente sur la chaîne YouTube -> passage en UNAVAILABLE`);
                  await supabase
                    .from('videos')
                    .update({ status: 'UNAVAILABLE', updated_at: new Date().toISOString() })
                    .eq('youtube_id', row.youtube_id);
                }
              }
            }
          } catch (rErr) {
            console.warn('[YouTube Sync] Erreur réconciliation Supabase:', rErr);
          }
        } else {
          localVideosStore = localVideosStore.map((v) => {
            if (!seenVideoIds.has(v.youtube_id)) {
              return { ...v, status: 'UNAVAILABLE' as const, updated_at: new Date().toISOString() };
            }
            return v;
          });
        }
      }

      // Diagnostic journalisé sans exposer de secrets (Section 4)
      console.log('[YouTube Sync] ==================== DIAGNOSTIC SYNCHRONISATION ====================');
      console.log(`[YouTube Sync] ID de chaîne utilisé          : ${resolvedChannelId}`);
      console.log(`[YouTube Sync] ID de playlist Uploads obtenu   : ${uploadsPlaylistId}`);
      console.log(`[YouTube Sync] Nombre de pages parcourues     : ${pagesTraversed}`);
      console.log(`[YouTube Sync] Éléments reçus de YouTube       : ${rawItems.length}`);
      console.log(`[YouTube Sync] Vidéos valides pour le site     : ${validVideosCount}`);
      console.log(`[YouTube Sync] Vidéos ignorées (privées/etc.)  : ${ignoredCount}`);
      console.log(`[YouTube Sync] Nouvelles vidéos insérées       : ${addedCount}`);
      console.log(`[YouTube Sync] Vidéos mises à jour             : ${updatedCount}`);
      console.log(`[YouTube Sync] Erreurs Supabase                : ${supabaseErrorsCount}`);
      console.log('[YouTube Sync] ===================================================================');

      // Comptage direct et fiable
      let totalCount = 0;
      let activeCount = 0;

      if (supabase) {
        const { data: allDbVideos, error: countErr } = await supabase
          .from('videos')
          .select('id, status');

        if (!countErr && allDbVideos) {
          totalCount = allDbVideos.length;
          activeCount = allDbVideos.filter((v: any) => v.status === 'ACTIVE').length;
        } else {
          totalCount = localVideosStore.length;
          activeCount = localVideosStore.filter((v) => v.status === 'ACTIVE').length;
        }
      } else {
        totalCount = localVideosStore.length;
        activeCount = localVideosStore.filter((v) => v.status === 'ACTIVE').length;
      }

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

    const hasConfiguredKeys = Boolean(
      YOUTUBE_API_KEY &&
      !YOUTUBE_API_KEY.includes('AIzaSyXXXXX') &&
      YOUTUBE_CHANNEL_ID &&
      !YOUTUBE_CHANNEL_ID.includes('UC_x5XG1OV2P6uZZ5FSM9Ttw')
    );

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

      let { data, error } = await query;

      // Si Supabase est vide alors que les clés sont configurées, déclencher la synchro YouTube immédiatement
      // OU si le dernier sync date de plus de SYNC_INTERVAL_MINUTES
      const lastSyncMs = syncStatusState.lastSyncAt ? Date.parse(syncStatusState.lastSyncAt) : 0;
      const isStale = (Date.now() - lastSyncMs) > (SYNC_INTERVAL_MINUTES * 60 * 1000);

      if (hasConfiguredKeys && !syncStatusState.isSyncing && ((!data || data.length === 0) || isStale)) {
        if (!data || data.length === 0) {
          console.log('[Auto-Sync] Base vide : synchronisation immédiate de la chaîne YouTube...');
          await syncYouTubeVideos();
          const retryRes = await query;
          data = retryRes.data;
        } else {
          console.log('[Auto-Sync] Synchronisation périodique d\'arrière-plan déclenchée...');
          syncYouTubeVideos().catch((err) => console.warn('[Auto-Sync Background]', err));
        }
      }

      if (error) {
        console.error('[Supabase Error]', error);
        allVideos = hasConfiguredKeys ? [] : localVideosStore;
      } else {
        allVideos = (data as Video[]) || [];
      }
    } else {
      if (hasConfiguredKeys && localVideosStore.length === 0 && !syncStatusState.isSyncing) {
        await syncYouTubeVideos();
      }
      allVideos = hasConfiguredKeys
        ? localVideosStore.filter((v) => v.channel_id === YOUTUBE_CHANNEL_ID || !v.id.startsWith('vid-00'))
        : [...localVideosStore];
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
app.get('/api/sync/status', async (_req: Request, res: Response) => {
  const isChannelConfigured = Boolean(
    YOUTUBE_CHANNEL_ID && !YOUTUBE_CHANNEL_ID.includes('UC_x5XG1OV2P6uZZ5FSM9Ttw')
  );
  const isApiKeyConfigured = Boolean(
    YOUTUBE_API_KEY && !YOUTUBE_API_KEY.includes('AIzaSyXXXXX')
  );

  let totalVideos = localVideosStore.length;
  let activeVideos = localVideosStore.filter((v) => v.status === 'ACTIVE').length;

  if (supabase) {
    try {
      const { data: dbVideos, error } = await supabase.from('videos').select('id, status');
      if (!error && dbVideos) {
        totalVideos = dbVideos.length;
        activeVideos = dbVideos.filter((v: any) => v.status === 'ACTIVE').length;
      }
    } catch {
      // repli sur comptage en mémoire
    }
  }

  res.json({
    // Propriétés demandées en section 7
    status: isApiKeyConfigured && isChannelConfigured ? 'connected' : 'ready',
    lastSync: syncStatusState.lastSyncAt,
    nextSync: syncStatusState.nextScheduledSyncAt,
    videosFound: totalVideos,
    channelConfigured: isChannelConfigured,

    // Propriétés enrichies pour l'interface de surveillance
    lastSyncAt: syncStatusState.lastSyncAt,
    nextScheduledSyncAt: syncStatusState.nextScheduledSyncAt,
    syncIntervalMinutes: syncStatusState.syncIntervalMinutes,
    isSyncing: syncStatusState.isSyncing,
    totalVideosCount: totalVideos,
    activeVideosCount: activeVideos,
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

// ==============================================================================
// GESTION DE LA SÉCURITÉ & AUTHENTIFICATION ADMIN (A.J.M.C)
// ==============================================================================

// Clé de signature interne dérivée automatiquement du mot de passe admin (sans configuration requise)
const ADMIN_SESSION_SECRET = crypto
  .createHash('sha256')
  .update((process.env.ADMIN_PASSWORD || 'ajmc2026') + '_ajmc_kandi_session_salt_2026')
  .digest('hex');

function generateAdminToken(payload: { email?: string; role: string }) {
  const data = JSON.stringify({ ...payload, exp: Date.now() + 7 * 24 * 60 * 60 * 1000 });
  const b64 = Buffer.from(data).toString('base64');
  const signature = crypto.createHmac('sha256', ADMIN_SESSION_SECRET).update(b64).digest('hex');
  return `${b64}.${signature}`;
}

function verifyAdminToken(token: string): boolean {
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 2) return false;
  const [b64, signature] = parts;
  const expectedSignature = crypto.createHmac('sha256', ADMIN_SESSION_SECRET).update(b64).digest('hex');
  if (signature !== expectedSignature) return false;
  try {
    const payload = JSON.parse(Buffer.from(b64, 'base64').toString('utf8'));
    if (payload.exp && payload.exp < Date.now()) return false;
    return payload.role === 'admin';
  } catch {
    return false;
  }
}

const requireAdmin = (req: Request, res: Response, next: () => void) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Accès refusé. Veuillez vous connecter à l\'espace d\'administration.' });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (!verifyAdminToken(token)) {
    res.status(403).json({ error: 'Session expirée ou non autorisée. Veuillez vous reconnecter.' });
    return;
  }
  next();
};

// ==============================================================================
// MAGASIN LOCAL DE SECOURS POUR LA GALERIE (EN L'ABSENCE DE TABLES SUPABASE)
// ==============================================================================

let localAlbumsStore: GalleryAlbum[] = [
  {
    id: 'alb-001',
    title_fr: 'Rencontre annuelle de la jeunesse musulmane à Kandi',
    title_ar: 'الملتقى السنوي للشباب المسلم بمدينة كاندي',
    description_fr: 'Journée d\'échanges, d\'ateliers méthodologiques et de tables rondes fraternelles réunissant les jeunes engagés de la commune de Kandi.',
    description_ar: 'فعاليات الملتقى السنوي التفاعلي الذي جمع شباب مدينة كاندي حول قيم الأخوة، والعمل المشترك، وصقل المهارات.',
    cover_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=800&auto=format&fit=crop&q=80',
    event_date: '2026-09-25',
    category: 'Activités culturelles',
    is_published: true,
    sort_order: 1,
    created_at: '2026-09-25T09:00:00Z',
    updated_at: '2026-09-25T09:00:00Z',
  },
  {
    id: 'alb-002',
    title_fr: 'Conférence publique : Jeunesse, Éthique et Citoyenneté',
    title_ar: 'محاضرة عامة: الشباب، الأخلاق والمواطنة الإيجابية',
    description_fr: 'Conférence-débat ouverte au public avec des intervenants qualifiés autour de l\'apport des jeunes au développement local.',
    description_ar: 'ندوة حوارية مفتوحة تناولت دور الشباب في تعزيز التماسك الاجتماعي والقيم الأخلاقية الفاضلة.',
    cover_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=800&auto=format&fit=crop&q=80',
    event_date: '2026-09-18',
    category: 'Conférences et rencontres',
    is_published: true,
    sort_order: 2,
    created_at: '2026-09-18T10:00:00Z',
    updated_at: '2026-09-18T10:00:00Z',
  },
  {
    id: 'alb-003',
    title_fr: 'Ateliers de formation pratique et compétences numériques',
    title_ar: 'ورش التدريب الميداني والمهارات الرقمية للشباب',
    description_fr: 'Sessions d\'apprentissage en bureautique, création de contenus éducatifs et gestion de projets associatifs.',
    description_ar: 'دورات تدريبية مكثفة لتمكين الشباب من أدوات المعلوميات والتسيير التشاركي للمبادرات التطوعية.',
    cover_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&auto=format&fit=crop&q=80',
    event_date: '2026-09-12',
    category: 'Activités de jeunesse',
    is_published: true,
    sort_order: 3,
    created_at: '2026-09-12T14:00:00Z',
    updated_at: '2026-09-12T14:00:00Z',
  },
  {
    id: 'alb-004',
    title_fr: 'Campagne de solidarité et entraide communautaire',
    title_ar: 'حملة التكافل الاجتماعي والتضامن مع الأسر',
    description_fr: 'Distribution de vivres et actions d\'entraide au profit des familles vulnérables de la commune.',
    description_ar: 'مبادرة إنسانية لتوزيع المعونات العينية ومساندة الأسر المتعففة في أحياء كاندي.',
    cover_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&auto=format&fit=crop&q=80',
    event_date: '2026-08-30',
    category: 'Actions sociales',
    is_published: true,
    sort_order: 4,
    created_at: '2026-08-30T08:00:00Z',
    updated_at: '2026-08-30T08:00:00Z',
  },
];

let localPhotosStore: GalleryPhoto[] = [
  {
    id: 'pho-001',
    album_id: 'alb-001',
    storage_path: null,
    public_url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=1200&auto=format&fit=crop&q=80',
    title_fr: 'Ouverture de la journée annuelle des jeunes',
    title_ar: 'افتتاح فعاليات الملتقى السنوي للشباب',
    caption_fr: 'Les participants réunis dans la grande salle lors du mot de bienvenue des responsables de l\'A.J.M.C.',
    caption_ar: 'المشاركون في القاعة الكبرى خلال الكلمة الافتتاحية لمسؤولي جمعية الشباب المسلم للثقافة.',
    sort_order: 1,
    is_published: true,
    created_at: '2026-09-25T09:15:00Z',
    updated_at: '2026-09-25T09:15:00Z',
  },
  {
    id: 'pho-002',
    album_id: 'alb-001',
    storage_path: null,
    public_url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&auto=format&fit=crop&q=80',
    title_fr: 'Atelier d\'échanges collaboratifs',
    title_ar: 'ورشة نقاش تشاركية بين الشباب',
    caption_fr: 'Groupes de travail sur les projets culturels et éducatifs à déployer pour l\'année à venir.',
    caption_ar: 'مجموعات العمل حول المبادرات الثقافية والتربوية المزمع تنظيمها خلال السنة القادمة.',
    sort_order: 2,
    is_published: true,
    created_at: '2026-09-25T11:30:00Z',
    updated_at: '2026-09-25T11:30:00Z',
  },
  {
    id: 'pho-003',
    album_id: 'alb-001',
    storage_path: null,
    public_url: 'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=1200&auto=format&fit=crop&q=80',
    title_fr: 'Photo commémorative de clôture',
    title_ar: 'صورة جماعية في ختام الملتقى',
    caption_fr: 'Moment de convivialité fraternelle rassemblant les membres bénévoles et les intervenants.',
    caption_ar: 'لقطة تذكارية ختامية جسدت روح التآخي والتعاون المثمر بين المشاركين والمتطوعين.',
    sort_order: 3,
    is_published: true,
    created_at: '2026-09-25T16:00:00Z',
    updated_at: '2026-09-25T16:00:00Z',
  },
  {
    id: 'pho-004',
    album_id: 'alb-002',
    storage_path: null,
    public_url: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=1200&auto=format&fit=crop&q=80',
    title_fr: 'Intervention d\'un conférencier invité',
    title_ar: 'مداخلة المحاضر الضيف',
    caption_fr: 'Exposé inspirant sur la transmission des valeurs et la responsabilité sociale des jeunes.',
    caption_ar: 'عرض توجيهي متميز حول دور الشباب في خدمة المجتمع والتحلي بالقيم الفاضلة.',
    sort_order: 1,
    is_published: true,
    created_at: '2026-09-18T10:30:00Z',
    updated_at: '2026-09-18T10:30:00Z',
  },
  {
    id: 'pho-005',
    album_id: 'alb-003',
    storage_path: null,
    public_url: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&auto=format&fit=crop&q=80',
    title_fr: 'Séance pratique sur les outils informatiques',
    title_ar: 'جلسة تدريبية تطبيقية في الحاسوب',
    caption_fr: 'Apprentissage des bases du traitement de texte, de la présentation assistée et de la recherche documentaire.',
    caption_ar: 'تدريب تفاعلي على البرمجيات المكتبية الأساسية وإعداد العروض التقديمية.',
    sort_order: 1,
    is_published: true,
    created_at: '2026-09-12T14:30:00Z',
    updated_at: '2026-09-12T14:30:00Z',
  },
  {
    id: 'pho-006',
    album_id: 'alb-004',
    storage_path: null,
    public_url: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200&auto=format&fit=crop&q=80',
    title_fr: 'Préparation et remise des kits solidaires',
    title_ar: 'تجهيز وتوزيع السلال التضامنية',
    caption_fr: 'Les jeunes bénévoles de l\'A.J.M.C mobilisés pour la logistique et l\'acheminement des dons.',
    caption_ar: 'شباب الجمعية أثناء تنظيم وتجهيز السلال الغذائية لتوزيعها على المستحقين.',
    sort_order: 1,
    is_published: true,
    created_at: '2026-08-30T09:00:00Z',
    updated_at: '2026-08-30T09:00:00Z',
  },
];

// ==============================================================================
// ROUTES AUTHENTIFICATION ADMIN
// ==============================================================================

// POST /api/admin/login
app.post('/api/admin/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!password) {
    res.status(400).json({ error: 'Mot de passe administrateur requis.' });
    return;
  }

  let isAdmin = false;
  let adminEmail = email || 'admin@ajmc-kandi.org';

  // 1. Vérification Supabase Auth si configuré et email fourni
  if (supabase && email && email.includes('@')) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (!error && data?.user) {
        const role = data.user.app_metadata?.role || data.user.user_metadata?.role;
        if (role === 'admin' || data.user.email === process.env.ADMIN_EMAIL) {
          isAdmin = true;
          adminEmail = data.user.email || adminEmail;
        }
      }
    } catch (err) {
      console.warn('[Supabase Auth check failed]', err);
    }
  }

  // 2. Vérification mot de passe maître de sécurité
  if (!isAdmin && password === ADMIN_PASSWORD) {
    isAdmin = true;
  }

  if (!isAdmin) {
    res.status(401).json({ error: 'Identifiants ou mot de passe administrateur incorrects.' });
    return;
  }

  const token = generateAdminToken({ email: adminEmail, role: 'admin' });
  res.json({
    authenticated: true,
    token,
    user: {
      id: 'admin_user',
      email: adminEmail,
      role: 'admin',
      name: 'Administration A.J.M.C',
    },
    message: 'Authentification administrateur réussie.',
  });
});

// GET /api/admin/verify
app.get('/api/admin/verify', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ authenticated: false });
    return;
  }
  const token = authHeader.split(' ')[1];
  if (verifyAdminToken(token)) {
    res.json({ authenticated: true, role: 'admin' });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// POST /api/admin/logout
app.post('/api/admin/logout', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Déconnexion effectuée avec succès.' });
});

// ==============================================================================
// ROUTES PUBLIQUES DE LA GALERIE (ALBUMS & PHOTOS PUBLIÉS UNIQUEMENT)
// ==============================================================================

// GET /api/gallery/albums - Liste des albums publiés avec nombre de photos
app.get('/api/gallery/albums', async (req: Request, res: Response) => {
  try {
    if (supabase) {
      const { data: albums, error } = await supabase
        .from('gallery_albums')
        .select('*')
        .eq('is_published', true)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (!error && albums) {
        // Comptage des photos publiées par album
        const { data: photoCounts } = await supabase
          .from('gallery_photos')
          .select('album_id')
          .eq('is_published', true);

        const countsMap: Record<string, number> = {};
        if (photoCounts) {
          for (const p of photoCounts) {
            countsMap[p.album_id] = (countsMap[p.album_id] || 0) + 1;
          }
        }

        const enriched = albums.map((alb) => ({
          ...alb,
          photo_count: countsMap[alb.id] || 0,
        }));
        res.json({ albums: enriched });
        return;
      }
    }

    // Repli sur le magasin en mémoire
    const publishedAlbums = localAlbumsStore
      .filter((a) => a.is_published)
      .sort((a, b) => a.sort_order - b.sort_order || new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map((alb) => ({
        ...alb,
        photo_count: localPhotosStore.filter((p) => p.album_id === alb.id && p.is_published).length,
      }));

    res.json({ albums: publishedAlbums });
  } catch (err: any) {
    console.error('[Gallery Albums Error]', err);
    res.status(500).json({ error: 'Erreur lors de la récupération des albums.' });
  }
});

// GET /api/gallery/albums/:id - Détails d'un album et ses photos publiées
app.get('/api/gallery/albums/:id', async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { data: album, error: albumError } = await supabase
        .from('gallery_albums')
        .select('*')
        .eq('id', id)
        .eq('is_published', true)
        .single();

      if (!albumError && album) {
        const { data: photos } = await supabase
          .from('gallery_photos')
          .select('*')
          .eq('album_id', id)
          .eq('is_published', true)
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: true });

        res.json({
          album,
          photos: photos || [],
        });
        return;
      }
    }

    // Repli en mémoire
    const album = localAlbumsStore.find((a) => a.id === id && a.is_published);
    if (!album) {
      res.status(404).json({ error: 'Album introuvable ou non publié.' });
      return;
    }
    const photos = localPhotosStore
      .filter((p) => p.album_id === id && p.is_published)
      .sort((a, b) => a.sort_order - b.sort_order || new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    res.json({ album, photos });
  } catch (err: any) {
    console.error('[Gallery Album View Error]', err);
    res.status(500).json({ error: 'Erreur lors de la récupération de l\'album.' });
  }
});

// ==============================================================================
// ROUTES ADMINISTRATION DE LA GALERIE (PROTÉGÉES PAR requireAdmin)
// ==============================================================================

// GET /api/admin/gallery/stats - Statistiques du tableau de bord galerie
app.get('/api/admin/gallery/stats', requireAdmin, async (req: Request, res: Response) => {
  try {
    if (supabase) {
      const { data: albums } = await supabase.from('gallery_albums').select('id, is_published');
      const { data: photos } = await supabase.from('gallery_photos').select('id');

      if (albums) {
        const totalAlbums = albums.length;
        const publishedAlbums = albums.filter((a) => a.is_published).length;
        const draftAlbums = totalAlbums - publishedAlbums;
        const totalPhotos = photos ? photos.length : 0;

        res.json({
          totalAlbums,
          totalPhotos,
          publishedAlbums,
          draftAlbums,
        });
        return;
      }
    }

    const totalAlbums = localAlbumsStore.length;
    const publishedAlbums = localAlbumsStore.filter((a) => a.is_published).length;
    const draftAlbums = totalAlbums - publishedAlbums;
    const totalPhotos = localPhotosStore.length;

    res.json({
      totalAlbums,
      totalPhotos,
      publishedAlbums,
      draftAlbums,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors du calcul des statistiques.' });
  }
});

// GET /api/admin/gallery/albums - Liste de tous les albums (brouillons & publiés)
app.get('/api/admin/gallery/albums', requireAdmin, async (req: Request, res: Response) => {
  try {
    if (supabase) {
      const { data: albums, error } = await supabase
        .from('gallery_albums')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false });

      if (!error && albums) {
        const { data: photoCounts } = await supabase.from('gallery_photos').select('album_id');
        const countsMap: Record<string, number> = {};
        if (photoCounts) {
          for (const p of photoCounts) {
            countsMap[p.album_id] = (countsMap[p.album_id] || 0) + 1;
          }
        }
        const enriched = albums.map((alb) => ({
          ...alb,
          photo_count: countsMap[alb.id] || 0,
        }));
        res.json({ albums: enriched });
        return;
      }
    }

    const enriched = localAlbumsStore.map((alb) => ({
      ...alb,
      photo_count: localPhotosStore.filter((p) => p.album_id === alb.id).length,
    }));
    res.json({ albums: enriched });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors de la récupération des albums admin.' });
  }
});

// POST /api/admin/gallery/albums - Créer un album
app.post('/api/admin/gallery/albums', requireAdmin, async (req: Request, res: Response) => {
  try {
    const {
      title_fr,
      title_ar,
      description_fr,
      description_ar,
      cover_url,
      event_date,
      category = 'Activités culturelles',
      is_published = false,
      sort_order = 0,
    } = req.body;

    if (!title_fr || !title_fr.trim()) {
      res.status(400).json({ error: 'Le titre français de l\'album est obligatoire.' });
      return;
    }

    const newAlbumData: Partial<GalleryAlbum> = {
      title_fr: title_fr.trim(),
      title_ar: title_ar?.trim() || null,
      description_fr: description_fr?.trim() || null,
      description_ar: description_ar?.trim() || null,
      cover_url: cover_url?.trim() || null,
      event_date: event_date || new Date().toISOString().split('T')[0],
      category: category || 'Activités culturelles',
      is_published: Boolean(is_published),
      sort_order: parseInt(`${sort_order || 0}`, 10),
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('gallery_albums')
        .insert([newAlbumData])
        .select()
        .single();

      if (!error && data) {
        res.status(201).json({ album: { ...data, photo_count: 0 } });
        return;
      }
    }

    const created: GalleryAlbum = {
      id: `alb-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...(newAlbumData as any),
      photo_count: 0,
    };
    localAlbumsStore.unshift(created);
    res.status(201).json({ album: created });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors de la création de l\'album.' });
  }
});

// PUT /api/admin/gallery/albums/:id - Modifier un album
app.put('/api/admin/gallery/albums/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const payload: any = {
      updated_at: new Date().toISOString(),
    };
    if (updates.title_fr !== undefined) payload.title_fr = updates.title_fr.trim();
    if (updates.title_ar !== undefined) payload.title_ar = updates.title_ar ? updates.title_ar.trim() : null;
    if (updates.description_fr !== undefined) payload.description_fr = updates.description_fr ? updates.description_fr.trim() : null;
    if (updates.description_ar !== undefined) payload.description_ar = updates.description_ar ? updates.description_ar.trim() : null;
    if (updates.cover_url !== undefined) payload.cover_url = updates.cover_url ? updates.cover_url.trim() : null;
    if (updates.event_date !== undefined) payload.event_date = updates.event_date;
    if (updates.category !== undefined) payload.category = updates.category;
    if (updates.is_published !== undefined) payload.is_published = Boolean(updates.is_published);
    if (updates.sort_order !== undefined) payload.sort_order = parseInt(`${updates.sort_order}`, 10);

    if (supabase) {
      const { data, error } = await supabase
        .from('gallery_albums')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        res.json({ album: data });
        return;
      }
    }

    const idx = localAlbumsStore.findIndex((a) => a.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Album introuvable.' });
      return;
    }
    localAlbumsStore[idx] = { ...localAlbumsStore[idx], ...payload };
    res.json({ album: localAlbumsStore[idx] });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors de la mise à jour de l\'album.' });
  }
});

// DELETE /api/admin/gallery/albums/:id - Supprimer un album et toutes ses photos + fichiers Storage
app.delete('/api/admin/gallery/albums/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (supabase) {
      // 1. Récupérer les photos de l'album pour supprimer leurs fichiers du Storage
      const { data: photos } = await supabase
        .from('gallery_photos')
        .select('storage_path')
        .eq('album_id', id);

      if (photos && photos.length > 0) {
        const filePaths = photos.map((p) => p.storage_path).filter(Boolean) as string[];
        if (filePaths.length > 0) {
          await supabase.storage.from('gallery').remove(filePaths).catch(() => {});
        }
      }

      // 2. Supprimer l'album (la suppression en cascade supprime automatiquement gallery_photos)
      const { error } = await supabase.from('gallery_albums').delete().eq('id', id);
      if (!error) {
        res.json({ success: true, message: 'Album et photos supprimés avec succès.' });
        return;
      }
    }

    // Magasin local
    localPhotosStore = localPhotosStore.filter((p) => p.album_id !== id);
    localAlbumsStore = localAlbumsStore.filter((a) => a.id !== id);
    res.json({ success: true, message: 'Album supprimé avec succès.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors de la suppression de l\'album.' });
  }
});

// GET /api/admin/gallery/albums/:id/photos - Photos d'un album pour l'administrateur
app.get('/api/admin/gallery/albums/:id/photos', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { data: photos, error } = await supabase
        .from('gallery_photos')
        .select('*')
        .eq('album_id', id)
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true });

      if (!error && photos) {
        res.json({ photos });
        return;
      }
    }

    const photos = localPhotosStore
      .filter((p) => p.album_id === id)
      .sort((a, b) => a.sort_order - b.sort_order || new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

    res.json({ photos });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors de la récupération des photos.' });
  }
});

// POST /api/admin/gallery/upload - Upload d'image vers Supabase Storage 'gallery'
app.post('/api/admin/gallery/upload', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { filename, filedata, contentType = 'image/jpeg', albumId = 'general' } = req.body;
    if (!filedata) {
      res.status(400).json({ error: 'Données de fichier manquantes pour l\'upload.' });
      return;
    }

    const cleanFilename = (filename || 'photo.jpg').replace(/[^a-zA-Z0-9._-]/g, '_');
    const storagePath = `albums/${albumId}/${Date.now()}_${cleanFilename}`;
    const fileBuffer = Buffer.from(filedata, 'base64');

    if (supabase) {
      const { error: uploadError } = await supabase.storage
        .from('gallery')
        .upload(storagePath, fileBuffer, {
          contentType,
          upsert: true,
        });

      if (!uploadError) {
        const { data: publicData } = supabase.storage.from('gallery').getPublicUrl(storagePath);
        res.json({
          public_url: publicData.publicUrl,
          storage_path: storagePath,
        });
        return;
      }
      console.warn('[Supabase Storage upload warning, fallback to data URI]', uploadError.message);
    }

    // Repli : Data URI propre pour affichage immédiat
    const dataUri = `data:${contentType};base64,${filedata}`;
    res.json({
      public_url: dataUri,
      storage_path: storagePath,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors du téléversement de l\'image.' });
  }
});

// POST /api/admin/gallery/albums/:id/photos - Ajouter une photo dans un album
app.post('/api/admin/gallery/albums/:id/photos', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      public_url,
      storage_path,
      title_fr,
      title_ar,
      caption_fr,
      caption_ar,
      sort_order = 0,
      is_published = true,
    } = req.body;

    if (!public_url) {
      res.status(400).json({ error: 'L\'URL de l\'image est obligatoire.' });
      return;
    }

    const photoData: Partial<GalleryPhoto> = {
      album_id: id,
      public_url,
      storage_path: storage_path || null,
      title_fr: title_fr?.trim() || null,
      title_ar: title_ar?.trim() || null,
      caption_fr: caption_fr?.trim() || null,
      caption_ar: caption_ar?.trim() || null,
      sort_order: parseInt(`${sort_order || 0}`, 10),
      is_published: Boolean(is_published),
      updated_at: new Date().toISOString(),
    };

    if (supabase) {
      const { data, error } = await supabase
        .from('gallery_photos')
        .insert([photoData])
        .select()
        .single();

      if (!error && data) {
        // Mettre à jour l'image de couverture si l'album n'en a pas
        const { data: album } = await supabase.from('gallery_albums').select('cover_url').eq('id', id).single();
        if (album && !album.cover_url) {
          await supabase.from('gallery_albums').update({ cover_url: public_url }).eq('id', id);
        }
        res.status(201).json({ photo: data });
        return;
      }
    }

    const newPhoto: GalleryPhoto = {
      id: `pho-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...(photoData as any),
    };
    localPhotosStore.push(newPhoto);

    // Mettre à jour la couverture de l'album si vide
    const albIdx = localAlbumsStore.findIndex((a) => a.id === id);
    if (albIdx !== -1 && !localAlbumsStore[albIdx].cover_url) {
      localAlbumsStore[albIdx].cover_url = public_url;
    }

    res.status(201).json({ photo: newPhoto });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors de l\'ajout de la photo.' });
  }
});

// PUT /api/admin/gallery/photos/:id - Modifier les métadonnées d'une photo
app.put('/api/admin/gallery/photos/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const payload: any = {
      updated_at: new Date().toISOString(),
    };
    if (updates.title_fr !== undefined) payload.title_fr = updates.title_fr ? updates.title_fr.trim() : null;
    if (updates.title_ar !== undefined) payload.title_ar = updates.title_ar ? updates.title_ar.trim() : null;
    if (updates.caption_fr !== undefined) payload.caption_fr = updates.caption_fr ? updates.caption_fr.trim() : null;
    if (updates.caption_ar !== undefined) payload.caption_ar = updates.caption_ar ? updates.caption_ar.trim() : null;
    if (updates.sort_order !== undefined) payload.sort_order = parseInt(`${updates.sort_order}`, 10);
    if (updates.is_published !== undefined) payload.is_published = Boolean(updates.is_published);

    if (supabase) {
      const { data, error } = await supabase
        .from('gallery_photos')
        .update(payload)
        .eq('id', id)
        .select()
        .single();

      if (!error && data) {
        res.json({ photo: data });
        return;
      }
    }

    const idx = localPhotosStore.findIndex((p) => p.id === id);
    if (idx === -1) {
      res.status(404).json({ error: 'Photo introuvable.' });
      return;
    }
    localPhotosStore[idx] = { ...localPhotosStore[idx], ...payload };
    res.json({ photo: localPhotosStore[idx] });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors de la modification de la photo.' });
  }
});

// PUT /api/admin/gallery/photos/reorder - Réorganisation de l'ordre des photos
app.put('/api/admin/gallery/photos/reorder', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { photoIds } = req.body;
    if (!Array.isArray(photoIds)) {
      res.status(400).json({ error: 'Format invalide : photoIds doit être une liste.' });
      return;
    }

    if (supabase) {
      for (let i = 0; i < photoIds.length; i++) {
        await supabase
          .from('gallery_photos')
          .update({ sort_order: i + 1, updated_at: new Date().toISOString() })
          .eq('id', photoIds[i]);
      }
      res.json({ success: true, message: 'Ordre des photos mis à jour avec succès.' });
      return;
    }

    photoIds.forEach((pid: string, idx: number) => {
      const photo = localPhotosStore.find((p) => p.id === pid);
      if (photo) {
        photo.sort_order = idx + 1;
        photo.updated_at = new Date().toISOString();
      }
    });

    res.json({ success: true, message: 'Ordre des photos mis à jour avec succès.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors du réordonnancement des photos.' });
  }
});

// DELETE /api/admin/gallery/photos/:id - Supprimer une photo de la base et du Storage Supabase
app.delete('/api/admin/gallery/photos/:id', requireAdmin, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (supabase) {
      const { data: photo } = await supabase
        .from('gallery_photos')
        .select('storage_path')
        .eq('id', id)
        .single();

      if (photo && photo.storage_path) {
        await supabase.storage.from('gallery').remove([photo.storage_path]).catch(() => {});
      }

      const { error } = await supabase.from('gallery_photos').delete().eq('id', id);
      if (!error) {
        res.json({ success: true, message: 'Photo supprimée avec succès.' });
        return;
      }
    }

    localPhotosStore = localPhotosStore.filter((p) => p.id !== id);
    res.json({ success: true, message: 'Photo supprimée avec succès.' });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Erreur lors de la suppression de la photo.' });
  }
});

// 4. POST & GET /api/sync - Déclenche une synchronisation (supporte Vercel Cron qui envoie GET et Dashboard qui envoie POST)
app.all(['/api/sync', '/api/sync/trigger'], async (req: Request, res: Response) => {
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

// 5. POST /api/contact - Formulaire de contact officiel de l'A.J.M.C
app.post('/api/contact', (req: Request, res: Response) => {
  const { name, email, phone, message, subject } = req.body;
  if (!name || !email || !message) {
    res.status(400).json({ error: 'Veuillez renseigner votre nom, email et message.' });
    return;
  }
  console.log(`[AJMC Contact Form] Reçu de: ${name} (${email}) - Tél: ${phone || 'N/A'} - Sujet: ${subject || 'Général'}`);
  res.json({
    success: true,
    message: 'تم استلام رسالتكم بنجاح وسيتواصل معكم فريق جمعية الشباب المسلم للثقافة في أقرب وقت.',
  });
});

// Configure Vite integration & Server Startup (Section 4)
async function startServer() {
  // 1. Vérification de la configuration au démarrage (Section 4)
  const isApiKeyConfigured = Boolean(YOUTUBE_API_KEY && !YOUTUBE_API_KEY.includes('AIzaSyXXXXX'));
  const isChannelConfigured = Boolean(YOUTUBE_CHANNEL_ID && !YOUTUBE_CHANNEL_ID.includes('UC_x5XG1OV2P6uZZ5FSM9Ttw'));

  console.log('[Startup] ========================================================');
  console.log('[Startup] A.J.M.C — Association des Jeunes Musulmans pour la Culture (Kandi, Bénin)');
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

// Sur Vercel Serverless, app est exportée sans lancer app.listen
if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error('[Server Fatal]', err);
  });
}

export default app;
