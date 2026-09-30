import React from 'react';

interface DirectAidLogoProps {
  className?: string;
  variant?: 'full' | 'icon' | 'white';
}

export const DirectAidLogo: React.FC<DirectAidLogoProps> = ({
  className = 'h-10',
  variant = 'full',
}) => {
  return (
    <div className={`inline-flex items-center gap-3 select-none ${className}`}>
      {/* Official Emblem: Green circle with stylized white branch */}
      <div className="relative w-11 h-11 shrink-0 rounded-full bg-[#16A34A] flex items-center justify-center shadow-xs">
        <svg
          viewBox="0 0 100 100"
          className="w-8 h-8 fill-white"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Base seed dot */}
          <circle cx="28" cy="74" r="6" />

          {/* Leaflets / wheat stem */}
          {/* Leaf 1 left */}
          <path d="M 33 67 C 22 64, 20 48, 30 46 C 36 49, 36 60, 33 67 Z" />
          {/* Leaf 1 right */}
          <path d="M 40 70 C 47 75, 62 70, 60 58 C 53 54, 43 62, 40 70 Z" />

          {/* Leaf 2 left */}
          <path d="M 40 50 C 31 46, 30 30, 42 30 C 47 34, 45 44, 40 50 Z" />
          {/* Leaf 2 right */}
          <path d="M 48 53 C 57 57, 72 50, 68 39 C 60 36, 51 45, 48 53 Z" />

          {/* Leaf 3 left */}
          <path d="M 50 34 C 44 28, 45 15, 57 17 C 60 22, 57 30, 50 34 Z" />
          {/* Leaf 3 right */}
          <path d="M 58 37 C 67 40, 80 32, 74 21 C 67 19, 60 29, 58 37 Z" />

          {/* Top tip leaf */}
          <path d="M 64 20 C 62 10, 74 6, 78 14 C 77 22, 69 22, 64 20 Z" />
        </svg>
      </div>

      {variant !== 'icon' && (
        <div className="flex flex-col text-left">
          {/* Arabic title */}
          <span
            className="text-base sm:text-lg font-bold text-[#16A34A] leading-tight font-serif tracking-wide"
            dir="rtl"
            lang="ar"
          >
            العَون المُبَاشِر
          </span>

          {/* Latin title + Country */}
          <div className="flex items-center gap-1.5">
            <span
              className={`text-sm sm:text-base font-bold tracking-tight leading-none ${
                variant === 'white' ? 'text-white' : 'text-stone-900'
              }`}
            >
              DirectAid
            </span>
            <span className="text-[11px] font-semibold text-[#16A34A] uppercase tracking-wider">
              Bénin
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
