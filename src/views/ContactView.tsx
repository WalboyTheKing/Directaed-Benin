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
import { useLanguage } from '../context/LanguageContext.tsx';

export const ContactView: React.FC = () => {
  const { t, isRTL, language } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    childGrade: 'collège',
    subject: 'admission',
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
        throw new Error(data.error || 'Erreur lors de l\'envoi');
      }

      setSubmitSuccess(t('contact_form_success'));
      setFormData({
        name: '',
        email: '',
        phone: '',
        childGrade: 'collège',
        subject: 'admission',
        message: '',
      });
    } catch (err: any) {
      setSubmitError(
        language === 'ar'
          ? 'تعذر إرسال الرسالة حالياً، يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.'
          : 'Impossible d\'envoyer le message pour le moment, veuillez réessayer.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`py-12 bg-stone-50 min-h-screen ${isRTL ? 'text-right' : 'text-left'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-xs font-bold text-[#16A34A] tracking-wider uppercase">
            {t('contact_hero_tag')}
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-stone-900 tracking-tight">
            {t('contact_hero_title')}
          </h1>
          <p className="text-base text-stone-600 leading-relaxed">
            {t('contact_hero_desc')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Coordinates & Info Card */}
          <div className="lg:col-span-5 bg-stone-900 text-white p-8 rounded-3xl shadow-xl space-y-8">
            <div>
              <h2 className="text-xl font-bold text-white">
                {language === 'ar' ? 'المكتب الوطني ومجمع بنين' : language === 'fr' ? 'Campus & Administration' : 'Administration & Campus'}
              </h2>
              <p className="text-xs text-stone-400 mt-1">
                {language === 'ar'
                  ? 'جمعية العون المباشر — جمهورية بنين'
                  : 'Direct Aid International — République du Bénin'}
              </p>
            </div>

            <div className="space-y-5 text-xs sm:text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-200">{t('footer_contact_info')}</p>
                  <p className="text-stone-400 mt-0.5">{t('footer_address')}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-200">{language === 'ar' ? 'الهاتف والاستفسارات' : 'Téléphone & WhatsApp'}</p>
                  <p className="text-stone-400 mt-0.5" dir="ltr">+229 21 30 18 45</p>
                  <p className="text-stone-400" dir="ltr">+229 97 00 12 34</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-200">{t('contact_form_email')}</p>
                  <p className="text-stone-400 mt-0.5" dir="ltr">contact@directaid-benin.org</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-stone-200">{language === 'ar' ? 'أوقات العمل واستقبال الأولياء' : 'Horaires d\'ouverture'}</p>
                  <p className="text-stone-400 mt-0.5">{t('footer_hours')}</p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-stone-800/80 rounded-2xl border border-stone-700/60 text-xs text-stone-300 space-y-1">
              <p className="font-bold text-emerald-400">
                {language === 'ar' ? 'زيارة الحرم المدرسي :' : language === 'fr' ? 'Visite guidée du campus :' : 'Guided campus tour:'}
              </p>
              <p className="text-stone-400 leading-relaxed">
                {language === 'ar'
                  ? 'يمكنكم حجز موعد مسبق لمرافقة أبنائكم في جولة استكشافية للفصول والمختبرات والملاعب الرياضية.'
                  : 'Prenez rendez-vous pour visiter nos salles de cours, laboratoires de sciences et complexes sportifs.'}
              </p>
            </div>
          </div>

          {/* Form Card */}
          <div className="lg:col-span-7 bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xs">
            <h2 className="text-xl font-bold text-stone-900 mb-6">
              {language === 'ar' ? 'نموذج التسجيل والاستفسار' : language === 'fr' ? 'Formulaire d\'inscription & contact' : 'Enrollment & Inquiry Form'}
            </h2>

            {submitSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 flex items-start gap-3 text-xs">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{language === 'ar' ? 'تم استلام طلبكم بنجاح' : 'Demande reçue avec succès'}</p>
                  <p className="mt-1">{submitSuccess}</p>
                </div>
              </div>
            )}

            {submitError && (
              <div className="mb-6 p-4 rounded-xl bg-red-50 text-red-800 border border-red-200 flex items-start gap-3 text-xs">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">{language === 'ar' ? 'تعذر الإرسال' : 'Erreur d\'envoi'}</p>
                  <p className="mt-1">{submitError}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5 text-xs sm:text-sm">
              <div>
                <label className="block font-bold text-stone-700 mb-1.5">
                  {t('contact_form_name')} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={language === 'ar' ? 'مثال: محمد عبد الله / ولي أمر الطالب عمر' : 'Ex: Koffi Mensah / Parent'}
                  className={`w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1.5">
                    {t('contact_form_email')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="contact@exemple.com"
                    dir="ltr"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] transition-all text-left"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1.5">
                    {t('contact_form_phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+229 XX XX XX XX"
                    dir="ltr"
                    className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] transition-all text-left"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 mb-1.5">
                    {t('contact_form_grade')}
                  </label>
                  <select
                    value={formData.childGrade}
                    onChange={(e) => setFormData({ ...formData, childGrade: e.target.value })}
                    className={`w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] transition-all cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <option value="maternelle">{language === 'ar' ? 'مرحلة الروضة والتمهيدي' : 'Maternelle'}</option>
                    <option value="primaire">{language === 'ar' ? 'المرحلة الابتدائية' : 'Primaire (CI - CM2)'}</option>
                    <option value="collège">{language === 'ar' ? 'المرحلة الإعدادية (المتوسطة)' : 'Collège (6ème - 3ème / BEPC)'}</option>
                    <option value="lycée">{language === 'ar' ? 'المرحلة الثانوية (علمي / أدبي)' : 'Lycée (Seconde - Terminale / BAC)'}</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 mb-1.5">
                    {t('contact_form_subject')}
                  </label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className={`w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] transition-all cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}
                  >
                    <option value="admission">{language === 'ar' ? 'طلب تسجيل طالب جديد' : 'Demande d\'inscription'}</option>
                    <option value="bourse">{language === 'ar' ? 'الاستفسار عن كفالة الأيتام والمنح' : 'Bourses & Parrainage d\'orphelins'}</option>
                    <option value="visite">{language === 'ar' ? 'حجز موعد لزيارة الحرم المدرسي' : 'Planifier une visite du campus'}</option>
                    <option value="autre">{language === 'ar' ? 'استفسار عام آخر' : 'Autre renseignement'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1.5">
                  {t('contact_form_msg')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={
                    language === 'ar'
                      ? 'يرجى كتابة تفاصيل استفساركم أو عمر الطالب وتاريخ الزيارة المفضلة...'
                      : 'Précisez votre demande, niveau de l\'enfant ou date souhaitée de visite...'
                  }
                  className={`w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16A34A] focus:border-[#16A34A] transition-all ${isRTL ? 'text-right' : 'text-left'}`}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3.5 bg-[#16A34A] hover:bg-[#15803D] text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50 cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
                <span>{isSubmitting ? (language === 'ar' ? 'جاري الإرسال...' : 'Envoi en cours...') : t('contact_form_submit')}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
