import React from 'react';
import { Calendar, Clock, ArrowLeft, User, BookOpen, Bell, Sparkles } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  excerpt: string;
  author: string;
  image: string;
}

const NEWS_LIST: NewsItem[] = [
  {
    id: 'n1',
    title: 'مبادرة البيئة والتشجير: طلاب المجمع يدشنون الحديقة المدرسية ومشروع إعادة التدوير',
    category: 'الحياة المدرسية',
    date: '24 سبتمبر 2026',
    readTime: '3 دقائق',
    author: 'لجنة الأنشطة البيئية',
    excerpt: 'افتتح طلاب المرحلة المتوسطة والثانوية المساحة الخضراء الجديدة داخل المجمع التعليمي، وتضمنت المبادرة غرس أشجار مثمرة وتوزيع حاويات لفرز النفايات لتعزيز السلوك البيئي الإيجابي.',
    image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'n2',
    title: 'أسبوع اللغات الحية: مسابقات الخطابة والمناظرات باللغتين العربية والفرنسية',
    category: 'التعليم واللغات',
    date: '18 سبتمبر 2026',
    readTime: '4 دقائق',
    author: 'قسم اللغات والآداب',
    excerpt: 'تألق طلاب المجمع في تقديم مناظرات فكرية حول دور التعليم في التنمية، مع عروض مسرحية وخطب فصيحة عكست المستوى المتقدم للبرنامج التعليمي ثنائي اللغة.',
    image: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&auto=format&fit=crop&q=80',
  },
  {
    id: 'n3',
    title: 'إنجاز تعليمي رائد: نسبة نجاح 100% لطلاب المجمع في امتحانات الشهادة الرسمية',
    category: 'النتائج والتميز',
    date: '10 سبتمبر 2026',
    readTime: 'دقيقتان',
    author: 'إدارة الشؤون التعليمية',
    excerpt: 'حقق مجمع العون المباشر بنين المركز الأول على مستوى المنطقة في نسب النجاح وعدد التقديرات المتميزة (جيد جداً وممتاز) في شهادتي التعليم المتوسط والثانوية العامة.',
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&auto=format&fit=crop&q=80',
  },
];

const CALENDAR_EVENTS = [
  { date: '03 أكتوبر 2026', title: 'اللقاء الدوري بين أولياء الأمور والإدارة وهيئة التدريس', time: '05:00 م - 07:30 م', location: 'قاعة المجمع الكبرى' },
  { date: '14 أكتوبر 2026', title: 'اليوم الرياضي والتضامني السنوي لجمعية العون المباشر', time: '01:30 م - 05:30 م', location: 'الملاعب الرياضية' },
  { date: '19-30 أكتوبر', title: 'عطلة منتصف الفصل الدراسي الأول', time: 'طيلة الفترة', location: 'إجازة مدرسية' },
  { date: '12 نوفمبر 2026', title: 'يوم الأبواب المفتوحة للراغبين في التسجيل والاطلاع على المجمع', time: '09:00 ص - 01:00 م', location: 'الحرم التعليمي' },
  { date: '11 ديسمبر 2026', title: 'الحفل الختامي وتكريم الفائزين في مسابقة القرآن الكريم السنوية', time: '06:00 م - 08:30 م', location: 'مسجد ومدرج المجمع' },
];

export const NewsView: React.FC = () => {
  return (
    <div className="py-12 bg-stone-50 min-h-screen space-y-16 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 border-b border-stone-200 pb-8">
          <span className="text-xs font-bold text-[#16A34A] uppercase tracking-widest">
            الأخبار والتقويم المدرسي
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
            أخبار مجمع العون المباشر
          </h1>
          <p className="text-base text-stone-600 leading-relaxed">
            تابعوا آخر المستجدات والأنشطة التربوية والفعاليات والتقويم الفصلي للمجمع في جمهورية بنين.
          </p>
        </div>

        {/* Lead Feature & Articles Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {NEWS_LIST.map((item, idx) => (
            <article
              key={item.id}
              className={`bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col ${
                idx === 0 ? 'lg:col-span-2' : ''
              }`}
            >
              <div className={`overflow-hidden bg-stone-100 ${idx === 0 ? 'aspect-16/9' : 'aspect-4/3'}`}>
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  {/* Zero-pill metadata */}
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <span className="font-bold text-[#16A34A]">{item.category}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.date}</span>
                    <span aria-hidden="true">·</span>
                    <span>{item.readTime}</span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
                    {item.title}
                  </h2>

                  <p className="text-sm text-stone-600 leading-relaxed">
                    {item.excerpt}
                  </p>
                </div>

                <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                  <span className="font-semibold text-stone-600">{item.author}</span>
                  <span className="font-bold text-[#16A34A] inline-flex items-center gap-1">
                    قراءة التفاصيل <ArrowLeft className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* School Calendar Table */}
        <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div className="flex items-center gap-2.5">
              <Calendar className="w-5 h-5 text-[#16A34A]" />
              <h2 className="text-xl sm:text-2xl font-bold text-stone-900">
                أجندة الفعاليات والتقويم الفصلي 2026-2027
              </h2>
            </div>
            <span className="text-xs text-stone-500 hidden sm:inline">
              تحديث دوري من الإدارة التعليمية
            </span>
          </div>

          <div className="divide-y divide-stone-100">
            {CALENDAR_EVENTS.map((event, i) => (
              <div
                key={i}
                className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-stone-50 px-3 rounded-lg transition-colors text-right"
              >
                <div className="space-y-1 sm:max-w-md">
                  <h3 className="font-bold text-sm text-stone-900">
                    {event.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-500">
                    <Clock className="w-3.5 h-3.5 text-stone-400" />
                    <span>{event.time}</span>
                    <span aria-hidden="true">·</span>
                    <span>{event.location}</span>
                  </div>
                </div>

                <div className="shrink-0">
                  <span className="font-mono text-xs font-bold px-3 py-1 bg-emerald-50 text-[#16A34A] rounded-md border border-emerald-200">
                    {event.date}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
