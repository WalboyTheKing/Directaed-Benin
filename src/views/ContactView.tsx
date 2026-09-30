import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  AlertCircle,
  HelpCircle
} from 'lucide-react';

export const ContactView: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    childGrade: 'المرحلة الإعدادية (التعليم المتوسط)',
    subject: 'طلب تسجيل طالب جديد',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(null);
    setSubmitError(null);

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'حدث خطأ أثناء الإرسال');
      }

      setSubmitSuccess(
        'تم إرسال طلبكم بنجاح إلى إدارة مجمع العون المباشر بنين. سيتواصل معكم فريق القبول والتسجيل خلال 48 ساعة.'
      );
      setFormData({
        name: '',
        email: '',
        phone: '',
        childGrade: 'المرحلة الإعدادية (التعليم المتوسط)',
        subject: 'طلب تسجيل طالب جديد',
        message: '',
      });
    } catch (err: any) {
      setSubmitError(err.message || 'تعذر إرسال الرسالة حالياً، يرجى المحاولة مرة أخرى.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="py-12 bg-stone-50 min-h-screen space-y-16 text-right">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3 border-b border-stone-200 pb-8">
          <span className="text-xs font-bold text-[#16A34A] uppercase tracking-widest">
            التواصل والتسجيل
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
            التواصل مع إدارة المجمع
          </h1>
          <p className="text-base text-stone-600 leading-relaxed">
            يسعد فريق العمل واللجنة التعليمية في جمعية العون المباشر بنين باستقبال استفساراتكم وترتيب زياراتكم الميدانية للمجمع.
          </p>
        </div>

        {/* 2-Columns: Info on Left, Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Column: Coordinates */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6">
              <h2 className="text-xl font-bold text-stone-900">
                بيانات الاتصال الرسمية
              </h2>

              <ul className="space-y-4 text-sm text-stone-700">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-[#16A34A] shrink-0 mt-1" />
                  <div>
                    <span className="font-bold block text-stone-900">المقر الرئيسي والمجمع</span>
                    <span>مكتب جمعية العون المباشر، كوتونو / بورتو نوفو — بنين</span>
                    <span className="text-xs text-stone-500 block mt-0.5">
                      فروع ومراكز تعليمية في باراكو، كاندي ودجوغو
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-[#16A34A] shrink-0 mt-1" />
                  <div>
                    <span className="font-bold block text-stone-900">الهاتف والواتساب المباشر</span>
                    <span dir="ltr" className="block text-right font-mono font-bold text-stone-800">
                      +229 21 30 18 45 / +229 97 00 12 34
                    </span>
                    <span className="text-xs text-stone-500 block mt-0.5">
                      خدمة الاستقبال الهاتفي طيلة أيام الأسبوع
                    </span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-[#16A34A] shrink-0 mt-1" />
                  <div>
                    <span className="font-bold block text-stone-900">البريد الإلكتروني المعتمد</span>
                    <span className="font-mono text-xs block text-stone-700">contact@directaid-benin.org</span>
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-[#16A34A] shrink-0 mt-1" />
                  <div>
                    <span className="font-bold block text-stone-900">ساعات الدوام الرسمي</span>
                    <span>من الإثنين إلى الجمعة: 08:00 ص — 05:30 م</span>
                    <span className="text-xs text-stone-500 block mt-0.5">
                      السبت: 08:30 ص — 12:30 م (شؤون القبول والتسجيل)
                    </span>
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick FAQ Card */}
            <div className="bg-emerald-50/70 rounded-xl p-6 border border-emerald-200/80 space-y-3">
              <h3 className="font-bold text-sm text-[#16A34A] flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#16A34A]" />
                <span>برامج المنح ورعاية الأيتام</span>
              </h3>
              <p className="text-xs text-stone-700 leading-relaxed">
                تولي جمعية العون المباشر اهتماماً خاصاً لرعاية الأيتام والمتفوقين دراسياً. تخضع طلبات الكفالة والمنح للجنة اجتماعية وتربوية مختصة لضمان وصول الرعاية لمستحقيها.
              </p>
            </div>
          </div>

          {/* Column: Contact & Visit Form */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-2xl border border-stone-200 p-8 shadow-xs space-y-6">
              <div className="space-y-1">
                <h2 className="text-2xl font-bold text-stone-900">
                  استمارة التواصل وطلب التسجيل
                </h2>
                <p className="text-xs text-stone-500">
                  يرجى تعبئة الحقول التالية وسيتواصل معكم فريق القبول والتسجيل في أقرب وقت.
                </p>
              </div>

              {submitSuccess && (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#16A34A] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">تم إرسال الطلب بنجاح!</p>
                    <p className="mt-1 leading-relaxed">{submitSuccess}</p>
                  </div>
                </div>
              )}

              {submitError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-900 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">تنبيه</p>
                    <p className="mt-1 leading-relaxed">{submitError}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      اسم ولي الأمر أو المتقدم *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A] text-right"
                      placeholder="مثال: عبد الله أحمد"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      البريد الإلكتروني *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A] text-left"
                      dir="ltr"
                      placeholder="name@example.com"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      رقم الهاتف / الواتساب
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A] text-left"
                      dir="ltr"
                      placeholder="+229 97 00 00 00"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      المرحلة الدراسية
                    </label>
                    <select
                      value={formData.childGrade}
                      onChange={(e) => setFormData({ ...formData, childGrade: e.target.value })}
                      className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A] bg-white text-right"
                    >
                      <option value="مرحلة الروضة">مرحلة الروضة</option>
                      <option value="المرحلة الابتدائية (من الأول إلى السادس)">المرحلة الابتدائية (من الأول إلى السادس)</option>
                      <option value="المرحلة الإعدادية (التعليم المتوسط)">المرحلة الإعدادية (التعليم المتوسط)</option>
                      <option value="المرحلة الثانوية (البكالوريا)">المرحلة الثانوية (البكالوريا)</option>
                      <option value="شعبة التأهيل المهني والتقني">شعبة التأهيل المهني والتقني</option>
                      <option value="استفسار عام">استفسار عام</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    موضوع الرسالة
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A] bg-white text-right"
                  >
                    <option value="طلب تسجيل طالب جديد">طلب تسجيل طالب جديد</option>
                    <option value="الاستفسار عن برامج المنح وكفالة الأيتام">الاستفسار عن برامج المنح وكفالة الأيتام</option>
                    <option value="طلب زيارة المجمع التعليمي">طلب زيارة المجمع التعليمي</option>
                    <option value="استفسار عن المناهج واللغات">استفسار عن المناهج واللغات</option>
                    <option value="موضوع آخر">موضوع آخر</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    تفاصيل الرسالة *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2 text-sm border border-stone-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#16A34A] text-right"
                    placeholder="يرجى كتابة تفاصيل استفساركم أو معلومات الطالب والمواعيد المناسبة للتواصل معكم..."
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full sm:w-auto px-6 py-3 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-xl text-xs font-bold shadow-xs transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5 rotate-180" />
                    <span>{isSubmitting ? 'جاري الإرسال...' : 'إرسال الرسالة الآن'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
