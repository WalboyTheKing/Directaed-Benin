import React, { useState } from 'react';
import { Lock, Mail, KeyRound, AlertCircle, ArrowRight, ArrowLeft, ShieldCheck } from 'lucide-react';
import { AJMCLogo } from '../../components/AJMCLogo.tsx';
import { LanguageSelector } from '../../components/LanguageSelector.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';
import heroBgImage from '../../assets/images/hero_ajmc_culture_bg_1790847624430.jpg';

interface AdminLoginProps {
  onLoginSuccess: (token: string) => void;
  onBackToPublicSite: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({
  onLoginSuccess,
  onBackToPublicSite,
}) => {
  const { isRTL, language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const ArrowIcon = isRTL ? ArrowLeft : ArrowRight;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) {
      setErrorMessage(
        language === 'ar' ? 'يرجى إدخال كلمة المرور.' : 'Veuillez saisir votre mot de passe.'
      );
      return;
    }

    try {
      setIsLoading(true);
      setErrorMessage(null);

      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.token) {
        throw new Error(data.error || 'Identifiants administrateur incorrects.');
      }

      onLoginSuccess(data.token);
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          (language === 'ar'
            ? 'خطأ في تسجيل الدخول. يرجى التحقق من بيانات الاعتماد.'
            : 'Erreur d\'authentification. Veuillez vérifier vos identifiants.')
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen relative bg-[#061e14] text-stone-100 flex flex-col justify-between py-12 px-4 sm:px-6 lg:px-8 overflow-hidden ${
        isRTL ? 'text-right' : 'text-left'
      }`}
    >
      {/* Fond visuel riche et atmosphérique avec lueur émeraude */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <img
          src={heroBgImage}
          alt="Arrière-plan"
          className="w-full h-full object-cover object-center opacity-30 filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#041a11]/95 via-[#062418]/90 to-[#03150e]/98" />
        <div className="absolute inset-0 bg-[radial-gradient(#16A34A_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
        <div className="absolute -top-32 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl" />
      </div>

      {/* Barre supérieure discrète */}
      <div className="relative z-10 max-w-md w-full mx-auto flex items-center justify-between">
        <button
          onClick={onBackToPublicSite}
          className="text-xs text-emerald-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer bg-emerald-950/60 hover:bg-emerald-900/60 px-3 py-1.5 rounded-xl border border-emerald-800/40 backdrop-blur-xs"
        >
          <ArrowIcon className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'الرجوع إلى الموقع العام' : 'Retour au site public'}</span>
        </button>

        <LanguageSelector />
      </div>

      {/* Carte centrale de connexion */}
      <div className="relative z-10 max-w-md w-full mx-auto bg-stone-900/85 backdrop-blur-md border border-emerald-700/40 rounded-3xl p-8 shadow-2xl shadow-emerald-950/80 space-y-6">
        <div className="text-center space-y-3">
          <div className="flex justify-center">
            <AJMCLogo variant="white" compact={false} />
          </div>
          <div className="pt-2">
            <h1 className="text-xl font-extrabold text-white">
              {language === 'ar' ? 'بوابة إدارة الموقع' : 'Espace Administration'}
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              {language === 'ar'
                ? 'إدارة الألبومات، معرض الصور والبيانات الرسمية'
                : 'Gestion de la galerie photo, des albums et des contenus'}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="p-3.5 bg-red-950/60 border border-red-800/80 rounded-xl text-xs text-red-300 flex items-start gap-2.5 animate-shake">
            <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Identifiant ou Email */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-300">
              {language === 'ar' ? 'البريد الإلكتروني أو اسم المستخدم' : 'Email ou Identifiant'}
            </label>
            <div className="relative">
              <Mail className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-stone-500`} />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ajmc-kandi.org"
                autoComplete="username"
                className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 bg-stone-950/70 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors`}
              />
            </div>
          </div>

          {/* Mot de passe */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-stone-300">
              {language === 'ar' ? 'كلمة المرور' : 'Mot de passe'} <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <KeyRound className={`absolute top-1/2 -translate-y-1/2 ${isRTL ? 'right-3' : 'left-3'} w-4 h-4 text-stone-500`} />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                autoComplete="current-password"
                required
                className={`w-full ${isRTL ? 'pr-9 pl-3' : 'pl-9 pr-3'} py-2.5 bg-stone-950/70 border border-stone-700 rounded-xl text-sm text-white placeholder-stone-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors`}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-[#0F5132] hover:bg-[#16A34A] text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-950/50 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Lock className="w-4 h-4" />
            )}
            <span>
              {isLoading
                ? (language === 'ar' ? 'جاري التحقق...' : 'Vérification...')
                : (language === 'ar' ? 'تسجيل الدخول' : 'Se connecter')}
            </span>
          </button>
        </form>

        <div className="pt-2 text-center text-[11px] text-stone-400 border-t border-stone-800">
          <p>
            {language === 'ar'
              ? 'الوصول مقتصر على المشرفين المصرح لهم فقط.'
              : 'Accès réservé exclusivement aux administrateurs autorisés.'}
          </p>
        </div>
      </div>

      {/* Pied de page */}
      <div className="relative z-10 max-w-md w-full mx-auto text-center text-xs text-stone-400">
        <p>A.J.M.C — Kandi, République du Bénin</p>
      </div>
    </div>
  );
};
