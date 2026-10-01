import React from 'react';
import { useLanguage } from '../context/LanguageContext.tsx';

interface AJMCLogoProps {
  variant?: 'color' | 'white';
  compact?: boolean;
}

export const AJMCLogo: React.FC<AJMCLogoProps> = ({ variant = 'color', compact = false }) => {
  const { isRTL } = useLanguage();
  const isWhite = variant === 'white';

  return (
    <div className={`flex items-center gap-3 select-none ${isRTL ? 'flex-row-reverse text-right' : 'flex-row text-left'}`}>
      {/* Emblème héraldique élégant de l'AJMC */}
      <div className="relative shrink-0 flex items-center justify-center">
        <div
          className={`w-11 h-11 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 ${
            isWhite
              ? 'bg-emerald-800/80 border border-emerald-600/50 text-emerald-300'
              : 'bg-linear-to-br from-[#0F5132] via-[#16A34A] to-emerald-700 border border-emerald-600/40 text-white shadow-emerald-900/10'
          }`}
        >
          {/* Logo vectoriel stylisé : Dôme / Rayonnement / Étoile culturelle */}
          <svg viewBox="0 0 40 40" className="w-7 h-7 fill-current" aria-hidden="true">
            {/* Croissant stylisé et motif culturel */}
            <path
              d="M20 5C11.716 5 5 11.716 5 20C5 28.284 11.716 35 20 35C22.42 35 24.697 34.426 26.717 33.407C21.848 31.956 18.28 27.472 18.28 22.143C18.28 16.033 22.754 11.002 28.604 10.093C26.136 6.945 22.308 5 20 5Z"
              opacity="0.9"
            />
            {/* Étoile à 8 branches symbolisant la culture et le savoir */}
            <path
              d="M28 14L29.2 17.5L32.7 18.7L29.2 19.9L28 23.4L26.8 19.9L23.3 18.7L26.8 17.5L28 14Z"
              className={isWhite ? 'fill-amber-300' : 'fill-amber-400'}
            />
          </svg>
        </div>
      </div>

      {/* Texte institutionnel */}
      {!compact && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span
              className={`font-black tracking-tight text-base sm:text-lg ${
                isWhite ? 'text-white' : 'text-stone-900'
              }`}
            >
              A.J.M.C
            </span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider ${
                isWhite
                  ? 'bg-emerald-900/70 text-emerald-300 border border-emerald-700/60'
                  : 'bg-emerald-50 text-[#0F5132] border border-emerald-200'
              }`}
            >
              Kandi · Bénin
            </span>
          </div>

          <span
            className={`text-xs font-semibold truncate ${
              isWhite ? 'text-stone-300' : 'text-stone-600'
            }`}
          >
            {isRTL
              ? 'جمعية الشباب المسلم للثقافة'
              : 'Association des Jeunes Musulmans pour la Culture'}
          </span>
        </div>
      )}
    </div>
  );
};
