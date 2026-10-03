import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import heroBgImage from '../assets/images/hero_ajmc_culture_bg_1790847624430.jpg';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  kicker?: string;
  badge?: string;
  icon?: LucideIcon;
  children?: React.ReactNode;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  kicker = 'A.J.M.C — Kandi · République du Bénin',
  badge,
  icon: Icon,
  children,
}) => {
  const { isRTL } = useLanguage();

  return (
    <div className={`relative bg-[#061e14] text-stone-100 overflow-hidden border-b border-emerald-950/80 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Arrière-plan photographique texturé & lueurs chaleureuses */}
      <div className="absolute inset-0 z-0 pointer-events-none select-none">
        <img
          src={heroBgImage}
          alt="Arrière-plan"
          className="w-full h-full object-cover object-center opacity-25 filter blur-xs"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#041910]/95 via-[#07281b]/90 to-[#041910]/95" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04170f] via-transparent to-[#04170f]/80" />
        <div className="absolute inset-0 bg-[radial-gradient(#16A34A_1px,transparent_1px)] [background-size:28px_28px] opacity-15" />
        {/* Lueurs dorées et émeraude */}
        <div className="absolute -top-20 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl" />
      </div>

      {/* Contenu de l'en-tête */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-18 space-y-3 sm:space-y-4">
        {/* Kicker & Badge */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-700/50 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase text-emerald-300 backdrop-blur-xs max-w-full">
            {Icon ? <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" /> : <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />}
            <span className="truncate">{kicker}</span>
          </div>
          {badge && (
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/30">
              {badge}
            </span>
          )}
        </div>

        {/* Titre Principal */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-snug sm:leading-tight">
          {title}
        </h1>

        {/* Sous-titre */}
        {subtitle && (
          <p className="text-xs sm:text-sm md:text-base text-stone-200 leading-relaxed max-w-3xl drop-shadow-xs font-medium">
            {subtitle}
          </p>
        )}

        {/* Éléments optionnels (onglets, boutons, filtres) */}
        {children && <div className="pt-2 sm:pt-4">{children}</div>}
      </div>
    </div>
  );
};
