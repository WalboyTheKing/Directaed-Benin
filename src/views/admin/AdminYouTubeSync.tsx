import React, { useState, useEffect, useCallback } from 'react';
import {
  Youtube,
  Database,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Film,
  Check,
  Info
} from 'lucide-react';
import type { SyncStatus, Video } from '../../types/video.ts';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface AdminYouTubeSyncProps {
  adminToken: string;
}

export const AdminYouTubeSync: React.FC<AdminYouTubeSyncProps> = ({ adminToken }) => {
  const { isRTL, language } = useLanguage();
  const [syncStatus, setSyncStatus] = useState<SyncStatus | null>(null);
  const [videos, setVideos] = useState<Video[]>([]);
  const [isLoadingStatus, setIsLoadingStatus] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncFeedback, setSyncFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const fetchStatus = useCallback(async () => {
    try {
      setIsLoadingStatus(true);
      const res = await fetch('/api/sync/status', {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        setSyncStatus(data);
      }
    } catch (err) {
      console.warn('[Admin YouTube Sync] Erreur statut:', err);
    } finally {
      setIsLoadingStatus(false);
    }
  }, []);

  const fetchVideos = useCallback(async () => {
    try {
      const res = await fetch('/api/videos?limit=50', {
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        const data = await res.json();
        if (data && Array.isArray(data.videos)) {
          setVideos(data.videos);
        }
      }
    } catch (err) {
      console.warn('[Admin YouTube Sync] Erreur vidéos:', err);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    fetchVideos();
  }, [fetchStatus, fetchVideos]);

  const handleTriggerSync = async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncFeedback(null);

    try {
      const res = await fetch('/api/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminToken}`,
        },
      });
      const data = await res.json();
      if (data.success) {
        setSyncFeedback({
          success: true,
          message: data.message || 'Synchronisation avec YouTube réussie.',
        });
      } else {
        setSyncFeedback({
          success: false,
          message: data.message || 'Échec de la synchronisation YouTube.',
        });
      }
      await fetchStatus();
      await fetchVideos();
    } catch {
      setSyncFeedback({
        success: false,
        message: 'Erreur réseau lors du déclenchement de la synchronisation.',
      });
    } finally {
      setIsSyncing(false);
    }
  };

  return (
    <div className={`space-y-8 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* En-tête de section administrative */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-stone-200 shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider">
            <Youtube className="w-4 h-4 text-red-600" />
            <span>
              {language === 'ar' ? 'إدارة المزامنة التلقائية والتشخيص' : 'Gestion de la synchronisation & Diagnostic'}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-stone-900">
            {language === 'ar' ? 'مزامنة قناة يوتيوب الرسمية' : 'Synchronisation YouTube Data API v3'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl">
            {language === 'ar'
              ? 'تتم مزامنة فيديوهات القناة تلقائياً يومياً عبر Vercel Cron مع إمكانية المزامنة اليدوية الفورية في أي وقت.'
              : 'Les vidéos de la chaîne officielle sont synchronisées automatiquement une fois par jour (Vercel Cron) avec possibilité de synchronisation manuelle à tout moment.'}
          </p>
        </div>

        <button
          onClick={handleTriggerSync}
          disabled={isSyncing}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#0F5132] hover:bg-[#16A34A] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all cursor-pointer disabled:opacity-50 shrink-0"
        >
          <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
          <span>
            {isSyncing
              ? (language === 'ar' ? 'جاري المزامنة...' : 'Synchronisation en cours...')
              : (language === 'ar' ? 'مزامنة فورية الآن' : 'Lancer une synchronisation')}
          </span>
        </button>
      </div>

      {/* Message de notification du déclenchement */}
      {syncFeedback && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-3 border shadow-xs animate-fade-in ${
            syncFeedback.success
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
              : 'bg-amber-50 text-amber-900 border-amber-200'
          }`}
        >
          {syncFeedback.success ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <p className="font-bold">{syncFeedback.message}</p>
          </div>
        </div>
      )}

      {/* Cartes métriques techniques (Espace Admin Privé) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Chaîne YouTube */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-bold uppercase tracking-wider text-[11px]">Chaîne YouTube</span>
            <Youtube className="w-4 h-4 text-red-600" />
          </div>
          <div className="text-base font-extrabold text-stone-900 truncate">
            @Madjid-r3c
          </div>
          <div className="text-[11px] font-mono text-stone-500 truncate" dir="ltr">
            ID: {syncStatus?.channelId || 'UCN0WZndfRXylOspFwildeMg'}
          </div>
          <div className="pt-2 border-t border-stone-100">
            <a
              href="https://www.youtube.com/@Madjid-r3c"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-bold text-red-600 hover:text-red-700 inline-flex items-center gap-1"
            >
              <span>Ouvrir sur YouTube</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Base de données */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-bold uppercase tracking-wider text-[11px]">Base de données</span>
            <Database className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-base font-extrabold text-stone-900">
            {syncStatus?.hasSupabase ? 'Supabase PostgreSQL' : 'Stockage Mémoire'}
          </div>
          <div className="text-[11px] text-stone-500">
            Table : <code className="font-mono bg-stone-100 px-1 py-0.5 rounded text-stone-700">videos</code>
          </div>
          <div className="pt-2 border-t border-stone-100 text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Idempotence active (youtube_id)</span>
          </div>
        </div>

        {/* Périodicité */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-bold uppercase tracking-wider text-[11px]">Automatisation</span>
            <Clock className="w-4 h-4 text-stone-600" />
          </div>
          <div className="text-base font-extrabold text-stone-900">
            {syncStatus?.syncIntervalMinutes && syncStatus.syncIntervalMinutes < 1440
              ? `Toutes les ${syncStatus.syncIntervalMinutes} min`
              : (language === 'ar' ? 'يومية (مرة يومياً)' : 'Quotidienne (1x / jour)')}
          </div>
          <div className="text-[11px] text-stone-500">
            {language === 'ar' ? 'Vercel Cron (خطة Hobby)' : 'Vercel Cron (Plan Hobby)'}
          </div>
          <div className="text-[11px] font-mono text-stone-700" dir="ltr">
            {syncStatus?.nextScheduledSyncAt
              ? new Date(syncStatus.nextScheduledSyncAt).toLocaleTimeString('fr-FR', {
                  hour: '2-digit',
                  minute: '2-digit',
                })
              : 'Planifié'}
          </div>
        </div>

        {/* Total indexé */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-bold uppercase tracking-wider text-[11px]">Vidéos actives</span>
            <Film className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-[#0F5132]">
            {syncStatus?.activeVideosCount ?? videos.length}
          </div>
          <div className="text-[11px] text-stone-500">
            Total en base : {syncStatus?.totalVideosCount ?? videos.length}
          </div>
          <div className="pt-1 text-[10px] text-stone-400">
            Affichées sur le site public
          </div>
        </div>
      </div>

      {/* Rapport du dernier scan */}
      {syncStatus?.lastSyncResult && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-xs space-y-3">
          <h3 className="font-bold text-sm text-stone-800 flex items-center gap-2">
            <Info className="w-4 h-4 text-stone-500" />
            <span>Rapport d'exécution de la dernière synchronisation</span>
          </h3>
          <div
            className={`p-4 rounded-xl text-xs space-y-2 ${
              syncStatus.lastSyncResult.success
                ? 'bg-emerald-50 text-emerald-950 border border-emerald-200'
                : 'bg-amber-50 text-amber-950 border border-amber-200'
            }`}
          >
            <p className="font-semibold">{syncStatus.lastSyncResult.message}</p>
            <div className="flex flex-wrap gap-4 text-[11px] text-stone-600 pt-1 border-t border-stone-200/50">
              <span>Nouvelles vidéos ajoutées : <strong>{syncStatus.lastSyncResult.addedCount}</strong></span>
              <span>Vidéos mises à jour : <strong>{syncStatus.lastSyncResult.updatedCount}</strong></span>
              {syncStatus.lastSyncAt && (
                <span>Horodatage : {new Date(syncStatus.lastSyncAt).toLocaleString('fr-FR')}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Liste des vidéos synchronisées et publiées sur le site */}
      <div className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs">
        <div className="p-6 border-b border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-bold text-base text-stone-900">
              Vidéos actuellement publiées sur le site public ({videos.length})
            </h3>
            <p className="text-xs text-stone-500">
              Ces vidéos proviennent de la chaîne YouTube et sont servies par l'API <code className="bg-stone-100 px-1 py-0.5 rounded text-stone-700">/api/videos</code>.
            </p>
          </div>
          <button
            onClick={() => {
              fetchVideos();
              fetchStatus();
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold text-stone-600 hover:bg-stone-50 transition-colors cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Actualiser la liste</span>
          </button>
        </div>

        {videos.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
              <Film className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-stone-800 text-sm">Aucune vidéo active en base</h4>
            <p className="text-xs text-stone-500 max-w-md mx-auto">
              Assurez-vous que vos vidéos sur votre chaîne YouTube (@Madjid-r3c) ont leur visibilité définie sur « Publique », puis cliquez sur « Lancer une synchronisation ».
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 font-bold border-b border-stone-200 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-4">Miniature</th>
                  <th className="py-3 px-4">Titre</th>
                  <th className="py-3 px-4">Date de publication</th>
                  <th className="py-3 px-4">Catégorie</th>
                  <th className="py-3 px-4">Statut</th>
                  <th className="py-3 px-4 text-right">Lien</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 text-stone-700">
                {videos.map((vid) => (
                  <tr key={vid.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 w-28">
                      <div className="aspect-video w-24 rounded-lg overflow-hidden bg-stone-900 border border-stone-200 relative">
                        <img
                          src={vid.thumbnail_url}
                          alt={vid.title}
                          className="w-full h-full object-cover"
                          loading="lazy"
                        />
                        {vid.duration && (
                          <span className="absolute bottom-1 right-1 bg-black/80 text-white font-mono text-[9px] px-1 rounded">
                            {vid.duration}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-stone-900 max-w-xs sm:max-w-md">
                      <div className="line-clamp-2">{vid.title}</div>
                      <div className="text-[10px] font-mono text-stone-400 pt-0.5">ID: {vid.youtube_id}</div>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap text-stone-500">
                      {new Date(vid.published_at).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {vid.category || 'Général'}
                      </span>
                    </td>
                    <td className="py-3 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700">
                        <Check className="w-3.5 h-3.5" />
                        <span>Actif</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right whitespace-nowrap">
                      <a
                        href={vid.youtube_url || `https://www.youtube.com/watch?v=${vid.youtube_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-red-600 hover:text-red-700 font-bold inline-flex items-center gap-1 hover:underline"
                      >
                        <span>Voir</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
