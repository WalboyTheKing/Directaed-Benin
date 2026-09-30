import React from 'react';
import {
  BookOpen,
  Award,
  Users,
  Compass,
  CheckCircle2,
  Calendar,
  Building,
  GraduationCap,
  ShieldCheck,
  HeartHandshake,
  Globe2,
  Sparkles
} from 'lucide-react';
import { SCHOOL_IMAGES } from '../assets/images.ts';

interface SchoolViewProps {
  onSelectTab: (tab: string) => void;
}

export const SchoolView: React.FC<SchoolViewProps> = ({ onSelectTab }) => {
  return (
    <div className="py-12 space-y-16 bg-stone-50 min-h-screen text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 border-b border-stone-200 pb-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A]" />
            <span className="text-xs font-bold text-[#16A34A] uppercase tracking-widest">
              جمعية العون المباشر — بنين | DirectAid
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
            مجمع العون المباشر التعليمي
          </h1>
          <p className="text-base text-stone-600 leading-relaxed">
            صرح تربوي وتعليمي متميز في جمهورية بنين، يجمع بين التحصيل الأكاديمي الرفيع، التعليم ثنائي اللغة، المنهج العلمي والتربية الأخلاقية القويمة.
          </p>
        </div>

        {/* Mot de la Direction */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 sm:p-10 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-4 flex flex-col items-center text-center space-y-3">
            <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-[#16A34A] shadow-inner bg-stone-100">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80"
                alt="إدارة مجمع العون المباشر"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-900">
                إدارة المجمع والمكتب الميداني
              </h3>
              <p className="text-xs text-stone-500">
                جمعية العون المباشر · جمهورية بنين
              </p>
            </div>
          </div>

          <div className="lg:col-span-8 space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
            <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
              «التعليم هو الاستثمار الحقيقي في الإنسان، وأساس كل نهضة وتنمية»
            </h2>
            <p>
              مرحباً بكم في مجمع العون المباشر التعليمي في بنين. تواصل جمعيتنا منذ تأسيسها بقيادة الدكتور عبد الرحمن السميط رحمه الله رسالتها الإنسانية السامية المتمثلة في محاربة الجهل والفقر وتوفير فرص متكافئة للتعليم النوعي لأبناء القارة الإفريقية.
            </p>
            <p>
              إننا لا نكتفي بتقديم المناهج الدراسية، بل نغرس في نفوس طلابنا الإيمان بالله، والاعتزاز بالهوية، وحب العلم، وروح المسؤولية ليكونوا عناصر فاعلة وقادة مخلصين في تنمية مجتمعهم ووطنهم.
            </p>
            <div className="pt-2 text-xs text-[#16A34A] font-bold">
              — كلمة إدارة المجمع واللجنة التربوية
            </div>
          </div>
        </div>

        {/* Projet Pédagogique & Valeurs */}
        <div className="space-y-8">
          <div>
            <span className="text-xs font-bold text-[#16A34A] uppercase tracking-widest">
              القيم والمبادئ
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              رؤيتنا التعليمية والتربوية
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
                <Globe2 className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                الازدواجية اللغوية والانفتاح
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                تدريس المنهاج الوطني البنيني المعتمد باللغة الفرنسية بالتوازي مع تعليم ممنهج للغة العربية الفصحى وقواعدها واللغة الإنجليزية الحديثة.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                الرعاية الشاملة وكفالة الأيتام
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                تأمين احتياجات الطلاب الأيتام والمتعففين، من توفير المقاعد الدراسية، الكتب، الزي الموحد، الوجبات الغذائية والرعاية الصحية الأولية.
              </p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-[#16A34A]/10 text-[#16A34A] flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">
                الانضباط وغرس الفضائل
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                بناء الشخصية السوية المتوازنة القائمة على الأمانة، الصدق، احترام المعلمين والزملاء، وحب الوطن والمساهمة في استقراره وازدهاره.
              </p>
            </div>
          </div>
        </div>

        {/* Campus & Installations au Bénin */}
        <div className="space-y-8">
          <div>
            <span className="text-xs font-bold text-[#16A34A] uppercase tracking-widest">
              البيئة المدرسية
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 mt-1">
              مرافق تعليمية متطورة
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs flex flex-col">
              <div className="aspect-16/9 bg-stone-100 overflow-hidden">
                <img
                  src={SCHOOL_IMAGES.heroCampus}
                  alt="مباني مجمع العون المباشر"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-lg font-bold text-stone-900">
                  الفصول الدراسية والساحات الواسعة
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  قاعات دراسية جيدة التهوية والإضاءة، ساحات مظللة بالأشجار ومجهزة بأنظمة أمان لتوفير بيئة نفسية وصحية ملائمة للتحصيل.
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs flex flex-col">
              <div className="aspect-16/9 bg-stone-100 overflow-hidden">
                <img
                  src={SCHOOL_IMAGES.activityPedagogique}
                  alt="قاعات الحاسوب والمختبرات"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-2">
                <h3 className="text-lg font-bold text-stone-900">
                  المختبرات العلمية وقاعات التكنولوجيا
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed">
                  أجهزة كمبيوتر متصلة بالإنترنت، ومختبرات مجهزة لإجراء التجارب العلمية في الأحياء والكيمياء والفيزياء ومكتبة ثرية بالمراجع.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* المراحل الدراسية */}
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-8 sm:p-12 space-y-6">
          <div className="max-w-2xl space-y-2">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">
              المراحل والمسارات
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              منظومة تعليمية متكاملة من الروضة إلى الثانوي
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 border-t border-stone-800">
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-white">
                الروضة والابتدائي
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                تأسيس قوي في القراءة والكتابة والحساب باللغتين العربية والفرنسية، وتنمية المهارات الحركية والإبداعية والتحضير لشهادة CEP.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-white">
                المرحلة الإعدادية (التعليم المتوسط)
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                تعميق المعارف العلمية والأدبية، برامج خاصة لحفظ القرآن والخط العربي، والإعداد لامتحان شهادة التعليم الإعدادي BEPC بنسب نجاح 100%.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-white">
                المرحلة الثانوية والتأهيل المهني
              </h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                شعب علمية وأدبية تؤهل لاجتياز البكالوريا بتفوق، وورش تدريب مهني في مجالات تكنولوجيا المعلومات، الكهرباء والحرف التطبيقية.
              </p>
            </div>
          </div>

          <div className="pt-6">
            <button
              onClick={() => onSelectTab('contact')}
              className="px-5 py-2.5 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
            >
              الاستفسار عن التسجيل وشروط المنح
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
