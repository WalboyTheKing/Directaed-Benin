import React, { useState } from 'react';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  MessageSquare
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext.tsx';
import { PageHeader } from '../components/PageHeader.tsx';

export const ContactView: React.FC = () => {
  const { t, isRTL, language } = useLanguage();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
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
        subject: '',
        message: '',
      });
    } catch (err: any) {
      setSubmitError(
        language === 'ar'
          ? 'تعذر إرسال الرسالة حالياً، يرجى المحاولة مرة أخرى أو الاتصال بنا مباشرة.'
          : 'Impossible d\'envoyer le message pour le moment. Veuillez vérifier votre connexion ou nous contacter par téléphone.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`space-y-12 pb-20 ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* En-tête atmosphérique */}
      <PageHeader
        title={t('contact_title')}
        subtitle={t('contact_subtitle')}
        kicker="A.J.M.C — Kandi · Secrétariat & Permanence"
        icon={Mail}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Carte Coordonnées officielles */}
          <div className="lg:col-span-5 bg-gradient-to-b from-[#061f14] to-[#04160e] text-white p-5 sm:p-8 md:p-10 rounded-3xl shadow-xl border border-emerald-800/40 space-y-6 sm:space-y-8 backdrop-blur-xs">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>{language === 'ar' ? 'المقر الإداري' : 'Siège officiel'}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {t('contact_info_title')}
              </h2>
              <p className="text-xs text-stone-300 mt-1">
                {t('org_name')} (A.J.M.C)
              </p>
            </div>

            <div className="space-y-6 text-sm text-stone-300">
              {/* Adresse */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    {language === 'ar' ? 'المقر والعنوان' : 'Adresse'}
                  </h4>
                  <p className="text-stone-300 mt-0.5 leading-relaxed text-xs sm:text-sm">
                    {t('contact_address')}
                  </p>
                </div>
              </div>

              {/* Téléphone */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    {language === 'ar' ? 'الهاتف المباشر' : 'Téléphone'}
                  </h4>
                  <a
                    href="tel: +2290197185822"
                    className="text-stone-300 hover:text-emerald-400 transition-colors mt-0.5 block text-xs sm:text-sm font-mono"
                    dir="ltr"
                  >
                    +229 01 97 18 58 22
                  </a>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-950/80 border border-emerald-800/60 text-emerald-400 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                    {language === 'ar' ? 'البريد الإلكتروني' : 'Courriel'}
                  </h4>
                  <a
                    href="mailto:Maguidram@gmail.com"
                    className="text-stone-300 hover:text-emerald-400 transition-colors mt-0.5 block text-xs sm:text-sm"
                  >
                    Maguidram@gmail.com
                  </a>
                </div>
              </div>
            </div>

            {/* Note d'accueil */}
            <div className="pt-6 border-t border-emerald-900/60 text-xs text-stone-300 leading-relaxed font-medium">
              <p>
                {language === 'ar'
                  ? 'مكاتب الجمعية مفتوحة لاستقبالكم والتفاعل مع استفساراتكم ومقترحاتكم البناءة.'
                  : 'Les membres de l\'A.J.M.C sont à votre disposition pour vous renseigner et vous accueillir lors de nos permanences à Kandi.'}
              </p>
            </div>
          </div>

          {/* Formulaire de contact */}
          <div className="lg:col-span-7 bg-white/95 rounded-3xl border border-stone-200/90 p-5 sm:p-8 md:p-10 shadow-sm backdrop-blur-xs space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-stone-900">
                {language === 'ar' ? 'أرسل لنا رسالة مباشرة' : 'Envoyer un message'}
              </h2>
              <p className="text-xs text-stone-500 mt-1">
                {language === 'ar'
                  ? 'يرجى ملء الاستمارة وسيتواصل معكم فريق الجمعية في أقرب وقت ممكن.'
                  : 'Remplissez le formulaire ci-dessous pour toute demande ou proposition.'}
              </p>
            </div>

            {/* Succès */}
            {submitSuccess && (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-800 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{submitSuccess}</span>
              </div>
            )}

            {/* Erreur */}
            {submitError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-700 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <span>{submitError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    {t('contact_form_name')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0F5132]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    {t('contact_form_email')} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0F5132]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    {t('contact_form_phone')}
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0F5132]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-stone-700">
                    {t('contact_form_subject')}
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder={language === 'ar' ? 'موضوع الرسالة' : 'Objet de la demande'}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0F5132]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-stone-700">
                  {t('contact_form_msg')} <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder={
                    language === 'ar'
                      ? 'اكتب رسالتك أو استفسارك هنا...'
                      : 'Précisez votre demande ou vos suggestions...'
                  }
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:border-[#0F5132]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full sm:w-auto px-8 py-3 bg-[#0F5132] hover:bg-[#16A34A] text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                  <span>
                    {isSubmitting
                      ? (language === 'ar' ? 'جاري الإرسال...' : 'Envoi en cours...')
                      : t('contact_form_submit')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
