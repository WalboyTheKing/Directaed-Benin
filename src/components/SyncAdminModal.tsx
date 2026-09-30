import React, { useState } from 'react';
import {
  X,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Database,
  Youtube,
  Lock,
  LogOut,
  ShieldCheck,
  Calendar,
  Check
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('directaid_admin_auth') === 'true';
  });
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setIsVerifying(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.authenticated) {
        setIsAuthenticated(true);
        sessionStorage.setItem('directaid_admin_auth', 'true');
        setPassword('');
      } else {
        setAuthError(data.error || 'Mot de passe incorrect.');
      }
    } catch {
      setAuthError('Erreur de connexion au serveur.');
    } finally {
      setIsVerifying(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('directaid_admin_auth');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-right">
        {/* Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h2 className="font-bold text-base">
              {isAuthenticated ? 'لوحة تحكم المزامنة والتشخيص الإداري' : 'فضاء الإدارة — تسجيل الدخول'}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="text-xs text-stone-400 hover:text-white flex items-center gap-1 cursor-pointer"
                title="Déconnexion"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>خروج</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-stone-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Fermer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Corps du modal */}
        {!isAuthenticated ? (
          /* Formulaire de connexion sécurisé */
          <div className="p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center mx-auto">
                <Lock className="w-6 h-6 text-[#16A34A]" />
              </div>
              <h3 className="font-bold text-stone-900 text-base">
                الوصول محمي بكلمة مرور الإدارة
              </h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                هذه الواجهة مخصصة لمسؤولي مجمع العون المباشر لمراقبة وتشخيص حالة المزامنة مع يوتيوب وسوبابيس.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 text-red-800 border border-red-200 rounded-xl text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4 max-w-sm mx-auto">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  كلمة مرور المسؤول (Admin Password)
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-xs sm:text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] text-left"
                  dir="ltr"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying}
                className="w-full py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-xl text-xs transition-colors cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isVerifying ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <ShieldCheck className="w-4 h-4" />
                )}
                <span>{isVerifying ? 'جاري التحقق...' : 'دخول لوحة التحكم'}</span>
              </button>
            </form>
          </div>
        ) : (
          /* Espace Diagnostic Privé */
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            {/* Statuts des services */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>قناة يوتيوب</span>
                  <Youtube className="w-4 h-4 text-red-500" />
                </div>
                <p className="text-sm font-bold text-stone-900">
                  {syncStatus?.hasChannelId ? 'متصلة بالخدمة' : 'غير مهيأة'}
                </p>
                <p className="text-[11px] text-stone-500 truncate" dir="ltr">
                  ID: {syncStatus?.channelId || 'UCN0WZndfRXylOspFwildeMg'}
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>قاعدة البيانات</span>
                  <Database className="w-4 h-4 text-emerald-600" />
                </div>
                <p className="text-sm font-bold text-stone-900">
                  {syncStatus?.hasSupabase ? 'Supabase PostgreSQL' : 'تخزين محلي'}
                </p>
                <p className="text-[11px] text-stone-500">
                  {syncStatus?.activeVideosCount ?? 0} فيديو نشط مفهرس
                </p>
              </div>

              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-1">
                <div className="flex items-center justify-between text-xs text-stone-500">
                  <span>المزامنة المجدولة</span>
                  <RefreshCw className="w-3.5 h-3.5 text-stone-600" />
                </div>
                <p className="text-sm font-bold text-stone-900">
                  كل {syncStatus?.syncIntervalMinutes || 15} دقيقة
                </p>
                <p className="text-[11px] text-stone-500">
                  تلقائية بدون تدخل
                </p>
              </div>
            </div>

            {/* Détails du dernier scan */}
            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
              <div className="flex items-center justify-between text-stone-600">
                <span>آخر فحص ومزامنة:</span>
                <span className="font-bold text-stone-900" dir="ltr">
                  {syncStatus?.lastSyncAt ? new Date(syncStatus.lastSyncAt).toLocaleString('fr-FR') : '—'}
                </span>
              </div>
              <div className="flex items-center justify-between text-stone-600">
                <span>الفحص القادم:</span>
                <span className="font-bold text-stone-900" dir="ltr">
                  {syncStatus?.nextScheduledSyncAt ? new Date(syncStatus.nextScheduledSyncAt).toLocaleString('fr-FR') : '—'}
                </span>
              </div>
            </div>

            {/* Résultat du dernier sync */}
            {syncStatus?.lastSyncResult && (
              <div
                className={`p-4 rounded-xl text-xs space-y-2 ${
                  syncStatus.lastSyncResult.success
                    ? 'bg-emerald-50 text-emerald-900 border border-emerald-200'
                    : 'bg-red-50 text-red-900 border border-red-200'
                }`}
              >
                <div className="flex items-center gap-2 font-bold">
                  {syncStatus.lastSyncResult.success ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
                  )}
                  <span>{syncStatus.lastSyncResult.message}</span>
                </div>
                <div className="flex gap-4 text-[11px] text-stone-600 pt-1">
                  <span>فيديوهات جديدة: {syncStatus.lastSyncResult.addedCount}</span>
                  <span>فيديوهات محدثة: {syncStatus.lastSyncResult.updatedCount}</span>
                </div>
              </div>
            )}

            {/* Action de synchronisation immédiate */}
            <div className="pt-2 flex items-center justify-between border-t border-stone-200">
              <p className="text-xs text-stone-500">
                يمكنك إطلاق فحص يدوي فوري لتحديث الفيديوهات من يوتيوب.
              </p>
              <button
                onClick={() => onTriggerSync()}
                disabled={isSyncing}
                className="px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer flex items-center gap-2"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                <span>{isSyncing ? 'جاري المزامنة...' : 'مزامنة الآن'}</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
