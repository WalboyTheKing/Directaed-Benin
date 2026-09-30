import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Database,
  Youtube,
  Globe,
  Copy,
  Check,
  Terminal,
  Layers,
  Info,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';
import type { SyncStatus } from '../types/video.ts';

interface SyncAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  syncStatus: SyncStatus | null;
  onTriggerSync: () => Promise<void>;
  isSyncing: boolean;
}

export const SyncAdminModal: React.FC<SyncAdminModalProps> = ({
  isOpen,
  onClose,
  syncStatus,
  onTriggerSync,
  isSyncing,
}) => {
  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'guide'>('status');
  const [copiedSql, setCopiedSql] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  if (!isOpen) return null;

  const handleCopySql = () => {
    const sqlText = `-- ====================================================================
-- SCHEMA SUPABASE POUR LE SITE DE L'ÉCOLE DIRECTAID BÉNIN
-- SYNCHRONISATION AUTOMATIQUE DES VIDÉOS YOUTUBE (MÉTADONNÉES UNIQUEMENT)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    youtube_id VARCHAR(32) UNIQUE NOT NULL,
    youtube_url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    channel_id VARCHAR(64) NOT NULL,
    playlist_id VARCHAR(64),
    category VARCHAR(64) DEFAULT 'عام',
    duration VARCHAR(32),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'UNAVAILABLE', 'PRIVATE')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performances optimales
CREATE INDEX IF NOT EXISTS idx_videos_youtube_id ON public.videos(youtube_id);
CREATE INDEX IF NOT EXISTS idx_videos_published_at ON public.videos(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos(status);

-- Sécurité au niveau des lignes (RLS)
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Lecture publique uniquement des vidéos actives
DROP POLICY IF EXISTS "Public can view active videos" ON public.videos;
CREATE POLICY "Public can view active videos"
    ON public.videos FOR SELECT
    USING (status = 'ACTIVE');

-- Le serveur backend avec SUPABASE_SERVICE_ROLE_KEY a tous les droits
DROP POLICY IF EXISTS "Service role has full access" ON public.videos;
CREATE POLICY "Service role has full access"
    ON public.videos FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);`;

    navigator.clipboard.writeText(sqlText);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleCopyEnv = () => {
    const envText = `# ==========================================================
# CONFIGURATION AUTOMATISATION YOUTUBE & SUPABASE DIRECTAID
# ==========================================================
# Strictement confidentiel côté serveur — Jamais exposé au frontend

YOUTUBE_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
YOUTUBE_CHANNEL_ID="UC_x5XG1OV2P6uZZ5FSM9Ttw"

SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

SYNC_INTERVAL_MINUTES="15"`;

    navigator.clipboard.writeText(envText);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 2000);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-sm text-right"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold">
                نافذة المزامنة والتشخيص التقني
              </h2>
              <p className="text-xs text-stone-300">
                مراقبة الربط التلقائي بين قناة يوتيوب الرسمية وموقع مجمع العون المباشر بنين
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex items-center border-b border-stone-200 bg-stone-50 px-6 gap-2 pt-2">
          <button
            onClick={() => setActiveTab('status')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'status'
                ? 'bg-white text-stone-900 border-t border-x border-stone-200 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>حالة المزامنة والتشخيص</span>
          </button>
          <button
            onClick={() => setActiveTab('sql')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'sql'
                ? 'bg-white text-stone-900 border-t border-x border-stone-200 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>مخطط Supabase SQL (الميتاداتا)</span>
          </button>
          <button
            onClick={() => setActiveTab('guide')}
            className={`px-4 py-2.5 text-xs font-bold rounded-t-lg transition-colors cursor-pointer flex items-center gap-2 ${
              activeTab === 'guide'
                ? 'bg-white text-stone-900 border-t border-x border-stone-200 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>متغيرات البيئة (.env) والأمان</span>
          </button>
        </div>

        {/* Content area */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'status' && (
            <div className="space-y-6">
              {/* Architecture Schema Visual */}
              <div className="bg-stone-50 border border-stone-200 rounded-xl p-5">
                <h3 className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-4">
                  مسار التدفق الآلي (نشر على يوتيوب فقط دون أي تدخل بالموقع)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-center">
                  <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">
                      <Youtube className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xs text-stone-900">1. قناة يوتيوب</span>
                    <span className="text-[11px] text-stone-500">المسؤول ينشر الفيديو على القناة فقط</span>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                      <RefreshCw className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xs text-stone-900">2. خادم Express</span>
                    <span className="text-[11px] text-stone-500">يفحص الـ uploads آلياً ويستخرج التصنيف</span>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center font-bold">
                      <Database className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xs text-stone-900">3. Supabase / التخزين</span>
                    <span className="text-[11px] text-stone-500">حفظ الميتاداتا ومنع التكرار (youtube_id)</span>
                  </div>

                  <div className="bg-white p-4 rounded-lg border border-stone-200 shadow-xs flex flex-col items-center justify-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
                      <Globe className="w-5 h-5" />
                    </div>
                    <span className="font-bold text-xs text-stone-900">4. الموقع والزوار</span>
                    <span className="text-[11px] text-stone-500">عرض فوري بمشغل YouTube Embed المدمج</span>
                  </div>
                </div>
              </div>

              {/* Status Indicators */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>حالة الربط مع يوتيوب</span>
                    {syncStatus?.hasApiKey ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> مفتاح متصل
                      </span>
                    ) : (
                      <span className="text-stone-600 font-bold flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" /> جاهز للربط
                      </span>
                    )}
                  </div>
                  <p className="text-base font-bold text-stone-900">
                    {syncStatus?.hasApiKey ? 'YouTube Data API v3' : 'وضع الجاهزية (محلي)'}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {syncStatus?.hasApiKey ? 'استعلام مباشر عبر قائمة uploads' : 'أدخل YOUTUBE_API_KEY للتفعيل الحي'}
                  </p>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>قناة يوتيوب المعتمدة</span>
                    {syncStatus?.hasChannelId ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> محددة
                      </span>
                    ) : (
                      <span className="text-amber-700 font-bold">افتراضية</span>
                    )}
                  </div>
                  <p className="text-base font-bold text-stone-900 truncate">
                    {syncStatus?.channelTitle || 'قناة مجمع العون المباشر بنين'}
                  </p>
                  <p className="text-[11px] text-stone-500 truncate" dir="ltr">
                    ID: {syncStatus?.channelId || 'UC_directaid_benin'}
                  </p>
                </div>

                <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span>قاعدة البيانات والميتاداتا</span>
                    {syncStatus?.hasSupabase ? (
                      <span className="text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> متصلة
                      </span>
                    ) : (
                      <span className="text-stone-600 font-bold flex items-center gap-1">
                        <Info className="w-3.5 h-3.5" /> تخزين مدمج
                      </span>
                    )}
                  </div>
                  <p className="text-base font-bold text-stone-900">
                    {syncStatus?.hasSupabase ? 'Supabase PostgreSQL' : 'تخزين الذاكرة الاحتياطي'}
                  </p>
                  <p className="text-[11px] text-stone-500">
                    {syncStatus?.hasSupabase ? 'حماية RLS كاملة للميتاداتا' : 'حفظ آمن وسريع للميتاداتا'}
                  </p>
                </div>
              </div>

              {/* Statistics & Diagnostic */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-bold">إحصائيات الفيديوهات</span>
                    <span className="text-emerald-700 font-bold">الحالة: نشطة</span>
                  </div>
                  <div className="flex items-baseline gap-3">
                    <span className="text-2xl font-bold text-stone-900">
                      {syncStatus?.activeVideosCount ?? 0}
                    </span>
                    <span className="text-xs text-stone-500">
                      فيديو نشط في الموقع (من أصل {syncStatus?.totalVideosCount ?? 0} مفهرس)
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400">
                    * الفيديوهات المحذوفة أو الخاصة تُحفظ بحالة UNAVAILABLE/PRIVATE ولا تُعرض للزوار.
                  </p>
                </div>

                <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-bold">الجدول الزمني للمزامنة</span>
                    <span className="text-stone-600 font-mono text-[11px]">
                      كل {syncStatus?.syncIntervalMinutes || 15} دقيقة
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">
                    آخر فحص: <span className="font-bold text-stone-900">{syncStatus?.lastSyncAt ? new Date(syncStatus.lastSyncAt).toLocaleTimeString('ar-EG') : 'منذ قليل'}</span>
                  </p>
                  <p className="text-xs text-stone-600">
                    الفحص التلقائي القادم: <span className="font-bold text-stone-900">{syncStatus?.nextScheduledSyncAt ? new Date(syncStatus.nextScheduledSyncAt).toLocaleTimeString('ar-EG') : 'قريباً'}</span>
                  </p>
                </div>
              </div>

              {/* Diagnostic Action Button */}
              <div className="p-5 border border-stone-200 rounded-xl bg-white space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h4 className="font-bold text-sm text-stone-900">
                      أداة الفحص والتشخيص الفوري (Diagnostic)
                    </h4>
                    <p className="text-xs text-stone-500">
                      مخصصة للاختبار والتشخيص التقني — يقوم السيرفر بطلب القناة وتحديث السجلات فوراً.
                    </p>
                  </div>
                  <button
                    onClick={() => onTriggerSync()}
                    disabled={isSyncing}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                    <span>{isSyncing ? 'جاري الفحص التشخيصي...' : 'تشغيل فحص تشخيصي فوري'}</span>
                  </button>
                </div>

                {syncStatus?.lastSyncResult && (
                  <div
                    className={`p-3.5 rounded-lg text-xs flex items-start gap-2.5 ${
                      syncStatus.lastSyncResult.success
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-red-50 text-red-800 border border-red-200'
                    }`}
                  >
                    {syncStatus.lastSyncResult.success ? (
                      <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
                    )}
                    <div>
                      <p className="font-bold">{syncStatus.lastSyncResult.message}</p>
                      <p className="text-[11px] opacity-75 mt-0.5">
                        التقرير: +{syncStatus.lastSyncResult.addedCount} جديد،{' '}
                        {syncStatus.lastSyncResult.updatedCount} تحديث في{' '}
                        {new Date(syncStatus.lastSyncResult.timestamp).toLocaleTimeString('ar-EG')}.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-stone-900">
                    مخطط SQL لقاعدة بيانات Supabase (جدول <code className="text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded font-mono">videos</code>)
                  </h4>
                  <p className="text-xs text-stone-500">
                    يُحفظ فيه فقط روابط ومعلومات الفيديو (الميتاداتا) دون أي ملفات فيديو.
                  </p>
                </div>
                <button
                  onClick={handleCopySql}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-300 transition-colors cursor-pointer"
                >
                  {copiedSql ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ كود SQL</span>
                    </>
                  )}
                </button>
              </div>

              <div className="relative rounded-xl overflow-hidden bg-stone-900 text-stone-200 text-xs font-mono p-4 overflow-x-auto max-h-[350px] text-left" dir="ltr">
                <pre>{`-- ====================================================================
-- SCHEMA SUPABASE POUR LE SITE DE L'ÉCOLE DIRECTAID BÉNIN
-- SYNCHRONISATION AUTOMATIQUE DES VIDÉOS YOUTUBE (MÉTADONNÉES UNIQUEMENT)
-- ====================================================================

CREATE TABLE IF NOT EXISTS public.videos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    youtube_id VARCHAR(32) UNIQUE NOT NULL,
    youtube_url TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    thumbnail_url TEXT NOT NULL,
    published_at TIMESTAMPTZ NOT NULL,
    channel_id VARCHAR(64) NOT NULL,
    playlist_id VARCHAR(64),
    category VARCHAR(64) DEFAULT 'عام',
    duration VARCHAR(32),
    status VARCHAR(20) DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'UNAVAILABLE', 'PRIVATE')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index pour performances optimales
CREATE INDEX IF NOT EXISTS idx_videos_youtube_id ON public.videos(youtube_id);
CREATE INDEX IF NOT EXISTS idx_videos_published_at ON public.videos(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_videos_category ON public.videos(category);
CREATE INDEX IF NOT EXISTS idx_videos_status ON public.videos(status);

-- Sécurité au niveau des lignes (RLS)
ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;

-- Lecture publique uniquement des vidéos actives
DROP POLICY IF EXISTS "Public can view active videos" ON public.videos;
CREATE POLICY "Public can view active videos"
    ON public.videos FOR SELECT
    USING (status = 'ACTIVE');

-- Le serveur backend avec SUPABASE_SERVICE_ROLE_KEY a tous les droits
DROP POLICY IF EXISTS "Service role has full access" ON public.videos;
CREATE POLICY "Service role has full access"
    ON public.videos FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);`}</pre>
              </div>
            </div>
          )}

          {activeTab === 'guide' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-stone-900">
                    متغيرات البيئة المطلوبة في السيرفر (.env)
                  </h4>
                  <p className="text-xs text-stone-500">
                    تبقى سرية في السيرفر ولا تصل إلى متصفح الزائر نهائياً.
                  </p>
                </div>
                <button
                  onClick={handleCopyEnv}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg border border-stone-300 transition-colors cursor-pointer"
                >
                  {copiedEnv ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span>تم النسخ!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>نسخ .env</span>
                    </>
                  )}
                </button>
              </div>

              <div className="rounded-xl bg-stone-900 text-stone-200 text-xs font-mono p-4 overflow-x-auto text-left" dir="ltr">
                <pre>{`YOUTUBE_API_KEY="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
YOUTUBE_CHANNEL_ID="UC_x5XG1OV2P6uZZ5FSM9Ttw"

SUPABASE_URL="https://your-project-id.supabase.co"
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

SYNC_INTERVAL_MINUTES=15`}</pre>
              </div>

              <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-xl space-y-2 text-xs text-emerald-900">
                <div className="flex items-center gap-2 font-bold text-emerald-950">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>ضمانات الأمان والأداء الصارم:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-emerald-800 pr-1">
                  <li><strong>لا يتم تحميل أي فيديو على السيرفر</strong>: يتم التشغيل مباشرة عبر YouTube Embed Player.</li>
                  <li><strong>استهلاك أدنى لحصة يوتيوب (Quota)</strong>: الاستعلام يتم عبر قائمة Uploads دفعة واحدة كل 15 دقيقة فقط (وليس عند كل زائر).</li>
                  <li><strong>الأمان الكامل</strong>: مفتاح YouTube ومفتاح Supabase Service Role محفوظان حصرياً في السيرفر.</li>
                  <li><strong>التصنيف التلقائي</strong>: يُحدد وفق قائمة التشغيل (Playlist) ثم الكلمات الدلالية ثم 'عام'.</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-stone-200 bg-stone-50 text-xs text-stone-500">
          <span>أداة تشخيص فنية لمهندسي النظام — موقع مجمع العون المباشر بنين</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-lg font-bold transition-colors cursor-pointer"
          >
            إغلاق النافذة
          </button>
        </div>
      </div>
    </div>
  );
};
