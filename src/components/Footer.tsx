import React from 'react';
import { Youtube, MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { DirectAidLogo } from './DirectAidLogo.tsx';

interface FooterProps {
  onSelectTab: (tab: string) => void;
  onOpenSyncModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onSelectTab, onOpenSyncModal }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-right">
          {/* Col 1: Institutional Presentation */}
          <div className="space-y-4">
            <DirectAidLogo variant="white" />
            <p className="text-sm text-stone-400 leading-relaxed pt-2">
              جمعية إنسانية وتنموية رائدة تعمل في بنين على نشر التعليم النوعي، ورعاية الأيتام، وتوفير بيئة تربوية ثنائية اللغة لتمكين الأجيال وصناعة المستقبل.
            </p>
            <div className="pt-2">
              <button
                onClick={onOpenSyncModal}
                className="inline-flex items-center gap-2 text-xs text-emerald-400 hover:text-emerald-300 transition-colors underline cursor-pointer"
              >
                <span>بنية النظام وحالة مزامنة يوتيوب</span>
                <ExternalLink className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* Col 2: Navigation rapide */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-stone-100 tracking-wider">
              روابط سريعة
            </h3>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button
                  onClick={() => onSelectTab('accueil')}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('ecole')}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  عن المجمع والمشروع التربوي
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('activites')}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  الأنشطة المدرسية والرحلات
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('videos')}
                  className="hover:text-stone-100 transition-colors cursor-pointer inline-flex items-center gap-1.5"
                >
                  <span>مكتبة الفيديوهات التلقائية</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('galerie')}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  معرض الصور
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('actualites')}
                  className="hover:text-stone-100 transition-colors cursor-pointer"
                >
                  الأخبار والفعاليات
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Coordonnées & Horaires au Bénin */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-stone-100 tracking-wider">
              الإدارة والمراكز التعليمية
            </h3>
            <ul className="space-y-3 text-sm text-stone-400">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#16A34A] shrink-0 mt-1" />
                <span>المكتب الوطني ومجمع العون المباشر التعليمي: كوتونو / بورتو نوفو — جمهورية بنين</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span dir="ltr">+229 21 30 18 45 / +229 97 00 12 34</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#16A34A] shrink-0" />
                <span className="font-mono text-xs">contact@directaid-benin.org</span>
              </li>
              <li className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-[#16A34A] shrink-0 mt-1" />
                <span>من الإثنين إلى الجمعة: 08:00 صباحاً — 05:30 مساءً</span>
              </li>
            </ul>
          </div>

          {/* Col 4: Chaîne YouTube Officielle */}
          <div className="space-y-4">
            <h3 className="font-bold text-sm text-stone-100 tracking-wider">
              قناة يوتيوب الرسمية
            </h3>
            <p className="text-sm text-stone-400 leading-relaxed">
              جميع التقارير والأنشطة المصورة المنشورة على القناة الرسمية للمجمع تُنشر تلقائياً هنا عبر نظام الربط الذكي.
            </p>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer shadow-xs"
            >
              <Youtube className="w-4 h-4" />
              <span>زيارة قناة يوتيوب الرسمية</span>
            </a>
            <div className="text-xs text-stone-500 pt-1">
              <span>تحديث تلقائي مستمر عبر YouTube Data API v3 و Supabase</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
          <p>© 2026 جمعية العون المباشر — بنين (DirectAid Benin). جميع الحقوق محفوظة.</p>
          <div className="flex items-center gap-6">
            <span>المشروع التربوي</span>
            <span aria-hidden="true">·</span>
            <span>سياسة الخصوصية</span>
            <span aria-hidden="true">·</span>
            <span>الشفافية والحوكمة</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
