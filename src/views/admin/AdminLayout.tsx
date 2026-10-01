import React from 'react';
import { LogOut, ExternalLink, ShieldCheck, FolderKanban, Camera } from 'lucide-react';
import { AJMCLogo } from '../../components/AJMCLogo.tsx';
import { LanguageSelector } from '../../components/LanguageSelector.tsx';
import { useLanguage } from '../../context/LanguageContext.tsx';

interface AdminLayoutProps {
  children: React.ReactNode;
  onLogout: () => void;
  onGoToPublicSite: () => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  onLogout,
  onGoToPublicSite,
}) => {
  const { isRTL, language } = useLanguage();

  return (
    <div className={`min-h-screen bg-stone-100 flex flex-col ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Barre de navigation supérieure de l'administration */}
      <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo officiel & Badge Administration */}
            <div className="flex items-center gap-3">
              <AJMCLogo variant="white" compact={true} />
              <div className="border-r border-stone-700 h-6 hidden sm:block" />
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-white">
                  {language === 'ar' ? 'لوحة التحكم' : 'Administration'}
                </span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950 text-emerald-400 border border-emerald-800">
                  <ShieldCheck className="w-3 h-3" />
                  <span>A.J.M.C</span>
                </span>
              </div>
            </div>

            {/* Actions : Sélecteur de langue, Bouton Retour au site public, Déconnexion */}
            <div className="flex items-center gap-2 sm:gap-3">
              <LanguageSelector />

              <button
                onClick={onGoToPublicSite}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-xl text-xs font-semibold transition-colors cursor-pointer border border-stone-700"
                title={language === 'ar' ? 'معاينة الموقع العام' : 'Voir le site public'}
              >
                <span>{language === 'ar' ? 'الموقع العام' : 'Site public'}</span>
                <ExternalLink className="w-3 h-3 text-stone-400" />
              </button>

              <button
                onClick={onLogout}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-950/80 hover:bg-red-900 text-red-200 rounded-xl text-xs font-bold transition-colors cursor-pointer border border-red-800/80 shadow-xs"
                title={language === 'ar' ? 'تسجيل الخروج' : 'Se déconnecter'}
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden xs:inline-block">
                  {language === 'ar' ? 'خروج' : 'Déconnexion'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Sous-barre d'onglets d'administration */}
        <div className="bg-stone-850 border-t border-stone-800 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto flex items-center gap-4 text-xs font-bold">
            <div className="py-2.5 px-3 border-b-2 border-emerald-500 text-emerald-400 flex items-center gap-2">
              <Camera className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'إدارة معرض الصور والألبومات' : 'Gestion de la Galerie & Albums'}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      {/* Footer administration */}
      <footer className="bg-stone-900 border-t border-stone-800 py-4 text-center text-xs text-stone-500">
        <p>A.J.M.C — Kandi, République du Bénin · Espace de gestion sécurisé</p>
      </footer>
    </div>
  );
};
