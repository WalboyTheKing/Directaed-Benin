export type Language = 'ar' | 'fr';

export interface Translations {
  // Navigation
  nav_home: string;
  nav_about: string;
  nav_activities: string;
  nav_news: string;
  nav_projects: string;
  nav_media: string;
  nav_contact: string;
  nav_cta_join: string;

  // Header / Organisation
  org_name: string;
  org_acronym: string;
  org_location: string;
  org_country: string;

  // Hero Section
  hero_title_line1: string;
  hero_title_line2: string;
  hero_desc: string;
  hero_btn_about: string;
  hero_btn_activities: string;
  hero_badge: string;

  // Présentation courte
  about_summary_title: string;
  about_summary_subtitle: string;
  about_summary_text: string;

  // Domaines d'action (Home & Activités)
  domain_education_title: string;
  domain_education_desc: string;
  domain_culture_title: string;
  domain_culture_desc: string;
  domain_youth_title: string;
  domain_youth_desc: string;
  domain_religious_title: string;
  domain_religious_desc: string;
  domain_social_title: string;
  domain_social_desc: string;
  domain_conferences_title: string;
  domain_conferences_desc: string;
  domain_events_title: string;
  domain_events_desc: string;

  // Section Vidéos & Médiathèque
  media_section_title: string;
  media_section_subtitle: string;
  media_section_btn: string;
  media_empty: string;
  media_watch_btn: string;
  media_search_placeholder: string;
  media_sort_recent: string;
  media_sort_oldest: string;
  media_tab_videos: string;
  media_tab_photos: string;

  // Catégories d'activités & vidéos
  cat_all: string;
  cat_education: string;
  cat_culture: string;
  cat_religious: string;
  cat_youth: string;
  cat_social: string;
  cat_conferences: string;
  cat_events: string;
  cat_general: string;

  // Section Appel à participation
  call_action_title: string;
  call_action_desc: string;
  call_action_btn: string;

  // Page À Propos
  about_page_title: string;
  about_page_subtitle: string;
  about_who_title: string;
  about_who_desc1: string;
  about_who_desc2: string;
  about_mission_title: string;
  about_mission_desc: string;
  about_vision_title: string;
  about_vision_desc: string;
  about_values_title: string;
  about_values_desc: string;
  about_youth_commitment_title: string;
  about_youth_commitment_desc: string;
  about_org_title: string;
  about_org_desc: string;

  // Page Projets
  projects_page_title: string;
  projects_page_subtitle: string;

  // Page Actualités
  news_page_title: string;
  news_page_subtitle: string;
  news_read_more: string;

  // Contact
  contact_title: string;
  contact_subtitle: string;
  contact_form_name: string;
  contact_form_phone: string;
  contact_form_email: string;
  contact_form_subject: string;
  contact_form_msg: string;
  contact_form_submit: string;
  contact_form_success: string;
  contact_info_title: string;
  contact_address: string;
  contact_phone: string;
  contact_email: string;

  // Footer
  footer_desc: string;
  footer_quick_links: string;
  footer_contact_info: string;
  footer_youtube_title: string;
  footer_youtube_btn: string;
  footer_rights: string;
}

export const translations: Record<Language, Translations> = {
  fr: {
    // Navigation
    nav_home: 'Accueil',
    nav_about: 'À propos',
    nav_activities: 'Nos activités',
    nav_news: 'Actualités',
    nav_projects: 'Projets',
    nav_media: 'Médiathèque',
    nav_contact: 'Contact',
    nav_cta_join: 'Nous rejoindre',

    // Header / Organisation
    org_name: 'Association des Jeunes Musulmans pour la Culture',
    org_acronym: 'A.J.M.C',
    org_location: 'Kandi',
    org_country: 'République du Bénin',

    // Hero Section
    hero_title_line1: 'Éveiller les consciences,',
    hero_title_line2: 'unir la jeunesse par la culture et les valeurs.',
    hero_desc: 'L\'Association des Jeunes Musulmans pour la Culture (A.J.M.C — Kandi) œuvre pour l\'épanouissement moral, éducatif, culturel et social de la jeunesse au Bénin.',
    hero_btn_about: 'Découvrir l\'association',
    hero_btn_activities: 'Voir nos activités',
    hero_badge: 'Association culturelle & communautaire',

    // Présentation courte
    about_summary_title: 'Qui sommes-nous ?',
    about_summary_subtitle: 'Un engagement durable pour la jeunesse et la société',
    about_summary_text: 'L\'A.J.M.C est une organisation associative à but non lucratif basée à Kandi au Bénin. Composée de jeunes engagés, elle promeut la culture du savoir, l\'entraide communautaire, l\'éthique islamique et la participation active au développement social.',

    // Domaines d'action
    domain_education_title: 'Activités éducatives',
    domain_education_desc: 'Séances de formation, cercles d\'apprentissage, alphabétisation et développement des compétences personnelles de la jeunesse.',
    domain_culture_title: 'Activités culturelles',
    domain_culture_desc: 'Rencontres littéraires, concours d\'éloquence, poésie, chants thématiques et préservation du patrimoine moral et culturel.',
    domain_youth_title: 'Activités de jeunesse',
    domain_youth_desc: 'Initiatives sportives, sorties de cohésion, ateliers pratiques et programmes de mentorat pour les adolescents et jeunes adultes.',
    domain_religious_title: 'Activités religieuses',
    domain_religious_desc: 'Apprentissage et récitation du Saint Coran, cours de sciences islamiques fondamentales et commémoration des fêtes musulmanes.',
    domain_social_title: 'Actions sociales & Solidarité',
    domain_social_desc: 'Assistance aux familles vulnérables, actions caritatives, visites d\'entraide et campagnes de salubrité publique.',
    domain_conferences_title: 'Conférences & Rencontres',
    domain_conferences_desc: 'Débats constructifs, séminaires thématiques avec des conférenciers invités sur les grands enjeux sociétaux et éthiques.',
    domain_events_title: 'Événements & Célébrations',
    domain_events_desc: 'Organisation de rassemblements communautaires, cérémonies de remise de distinctions et journées commémoratives.',

    // Section Vidéos & Médiathèque
    media_section_title: 'Dernières vidéos et reportages',
    media_section_subtitle: 'Suivez les temps forts, conférences et réalisations de l\'A.J.M.C publiés sur notre chaîne YouTube.',
    media_section_btn: 'Accéder à la médiathèque',
    media_empty: 'Les enregistrements et reportages vidéo seront bientôt disponibles.',
    media_watch_btn: 'Regarder la vidéo',
    media_search_placeholder: 'Rechercher une conférence, une activité ou un reportage...',
    media_sort_recent: 'Plus récentes',
    media_sort_oldest: 'Plus anciennes',
    media_tab_videos: 'Vidéos & Conférences',
    media_tab_photos: 'Galerie photos',

    // Catégories
    cat_all: 'Toutes les activités',
    cat_education: 'Activités éducatives',
    cat_culture: 'Activités culturelles',
    cat_religious: 'Activités religieuses',
    cat_youth: 'Activités de jeunesse',
    cat_social: 'Actions sociales',
    cat_conferences: 'Conférences et rencontres',
    cat_events: 'Événements et célébrations',
    cat_general: 'Général',

    // Section Appel à participation
    call_action_title: 'Rejoignez la dynamique de l\'A.J.M.C à Kandi',
    call_action_desc: 'Que vous souhaitiez participer à nos rencontres culturelles, vous engager bénévolement ou soutenir nos initiatives citoyennes, notre porte est ouverte à tous les jeunes et sympathisants.',
    call_action_btn: 'Prendre contact avec l\'équipe',

    // Page À Propos
    about_page_title: 'À propos de l\'A.J.M.C',
    about_page_subtitle: 'Découvrez l\'histoire, les principes directeurs et la mission de notre association à Kandi.',
    about_who_title: 'Qui sommes-nous ?',
    about_who_desc1: 'L\'Association des Jeunes Musulmans pour la Culture (A.J.M.C — Kandi) réunit des jeunes musulmans et citoyennes animés par la volonté commune de promouvoir une culture vivante, éclairée et bienfaisante au sein de la commune de Kandi et dans le Nord du Bénin.',
    about_who_desc2: 'En tant qu\'association indépendante, l\'A.J.M.C privilégie le dialogue, la valorisation des compétences des jeunes et l\'enracinement dans les valeurs de fraternité, de respect mutuel et de dévouement civique.',
    about_mission_title: 'Notre mission',
    about_mission_desc: 'Offrir un cadre sain d\'épanouissement intellectuel, spirituel et moral à la jeunesse, favoriser l\'accès à la culture et à l\'éducation, et initier des actions de solidarité sociale au bénéfice de l\'ensemble de la communauté.',
    about_vision_title: 'Notre vision',
    about_vision_desc: 'Bâtir une jeunesse musulmane instruite, dynamique, exemplaire et actrice incontournable du développement durable, de la paix et de la concorde au Bénin.',
    about_values_title: 'Nos valeurs fondamentales',
    about_values_desc: 'Fraternité sincère, probité morale, quête perpétuelle du savoir utile, solidarité active, sens des responsabilités et respect de la dignité humaine.',
    about_youth_commitment_title: 'Notre engagement envers la jeunesse',
    about_youth_commitment_desc: 'Accompagner chaque jeune dans son orientation personnelle et sociale, en lui offrant des espaces d\'expression saine, des repères éthiques solides et des opportunités d\'engagement bénévole utile.',
    about_org_title: 'Organisation et fonctionnement',
    about_org_desc: 'L\'association s\'appuie sur un bureau exécutif élu, des commissions thématiques (culturelle, éducative, sociale, communication) et l\'énergie constante de ses membres adhérents et bénévoles.',

    // Page Projets
    projects_page_title: 'Projets et initiatives',
    projects_page_subtitle: 'Les programmes conçus et portés par l\'A.J.M.C pour répondre aux besoins de notre communauté.',

    // Page Actualités
    news_page_title: 'Actualités & Annonces',
    news_page_subtitle: 'Toutes les dernières informations, comptes-rendus et communiqués officiels de l\'A.J.M.C.',
    news_read_more: 'Lire le communiqué',

    // Contact
    contact_title: 'Contactez l\'A.J.M.C',
    contact_subtitle: 'Une question, une proposition de partenariat ou envie de rejoindre nos activités ? Écrivez-nous ou appelez-nous directement.',
    contact_form_name: 'Nom complet',
    contact_form_phone: 'Numéro de téléphone / WhatsApp',
    contact_form_email: 'Adresse email',
    contact_form_subject: 'Objet du message',
    contact_form_msg: 'Votre message',
    contact_form_submit: 'Envoyer le message',
    contact_form_success: 'Votre message a bien été transmis aux responsables de l\'A.J.M.C. Nous vous répondrons dans les plus brefs délais.',
    contact_info_title: 'Coordonnées de l\'Association',
    contact_address: 'Kandi, Département de l\'Alibori — République du Bénin',
    contact_phone: '+229 01 97 18 58 22',
    contact_email: 'Maguidram@gmail.com',

    // Footer
    footer_desc: 'Organisation associative et culturelle de jeunesse œuvrant pour l\'élévation morale, le savoir, la fraternité et le progrès social à Kandi et au Bénin.',
    footer_quick_links: 'Navigation',
    footer_contact_info: 'Secrétariat & Contact',
    footer_youtube_title: 'Chaîne YouTube officielle',
    footer_youtube_btn: 'Rejoindre notre chaîne YouTube',
    footer_rights: '© 2026 Association des Jeunes Musulmans pour la Culture (A.J.M.C — Kandi). Tous droits réservés.',
  },

  ar: {
    // Navigation
    nav_home: 'الرئيسية',
    nav_about: 'من نحن',
    nav_activities: 'أنشطتنا',
    nav_news: 'الأخبار',
    nav_projects: 'مشاريعنا',
    nav_media: 'المكتبة الإعلامية',
    nav_contact: 'اتصل بنا',
    nav_cta_join: 'انضم إلينا',

    // Header / Organisation
    org_name: 'جمعية الشباب المسلم للثقافة',
    org_acronym: 'A.J.M.C',
    org_location: 'كاندي',
    org_country: 'جمهورية بنين',

    // Hero Section
    hero_title_line1: 'توعية، عطاء،',
    hero_title_line2: 'وتمكين للشباب من أجل مجتمع متماسك وواعد.',
    hero_desc: 'جمعية الشباب المسلم للثقافة (A.J.M.C — كاندي) إطار شبابي رائد يكرس جهوده لنشر الوعي الثقافي والأخلاقي، ورعاية طاقات الشباب، والنهوض بالعمل الاجتماعي والتطوعي في بنين.',
    hero_btn_about: 'اكتشف جمعيتنا',
    hero_btn_activities: 'اكتشف أنشطتنا',
    hero_badge: 'جمعية ثقافية واجتماعية شبابية',

    // Présentation courte
    about_summary_title: 'من نحن ؟',
    about_summary_subtitle: 'عطاء شبابي مستمر لخدمة المجتمع والأجيال',
    about_summary_text: 'جمعية الشباب المسلم للثقافة (A.J.M.C) هي هيئة مجتمعية وثقافية مستقلة مقرها مدينة كاندي بجمهورية بنين. تضم نخبة من خيرة الشباب الساعين لبث روح المبادرة، ونشر العلم النافع، وتعزيز قيم التكافل والأخوة والمواطنة الصالحة.',

    // Domaines d'action
    domain_education_title: 'الأنشطة التعليمية',
    domain_education_desc: 'دورات تكوينية، برامج محو الأمية، وورش تدريبية لصقل مهارات الشباب الحياتية والمعرفية.',
    domain_culture_title: 'الأنشطة الثقافية',
    domain_culture_desc: 'ندوات فكرية، مسابقات في الخطابة والإلقاء، إحياء المناسبات الشعرية والإنشادية الهادفة.',
    domain_youth_title: 'أنشطة الشباب',
    domain_youth_desc: 'ملتقيات حوارية، بطولات رياضية، مخيمات تربوية وورشات لتوجيه الناشئة والشباب.',
    domain_religious_title: 'الأنشطة الدينية',
    domain_religious_desc: 'حلقات تحفيظ وتجويد القرآن الكريم، دروس فقهية وأخلاقية، وإحياء الشعائر والمناسبات الإسلامية.',
    domain_social_title: 'الأنشطة الاجتماعية',
    domain_social_desc: 'قوافل الإغاثة، مساعدة الأسر المتعففة، حملات النظافة والبيئة، وزيارات التآخي والتضامن.',
    domain_conferences_title: 'المحاضرات واللقاءات',
    domain_conferences_desc: 'تنظيم محاضرات عامة بحضور نخبة من العلماء والدعاة والمفكرين لمعالجة قضايا الشباب والمجتمع.',
    domain_events_title: 'الفعاليات والمناسبات',
    domain_events_desc: 'إقامة الاحتفالات بالأعياد والمناسبات العامة، وتكريم حفظة القرآن والمتفوقين وأصحاب المبادرات.',

    // Section Vidéos & Médiathèque
    media_section_title: 'أحدث التغطيات المرئية والمحاضرات',
    media_section_subtitle: 'تابعوا تسجيلات المحاضرات والملتقيات والأنشطة الميدانية عبر قناتنا الرسمية على يوتيوب.',
    media_section_btn: 'زيارة المكتبة الإعلامية',
    media_empty: 'التقارير والمقاطع المرئية ستكون متاحة قريباً.',
    media_watch_btn: 'شاهد الآن',
    media_search_placeholder: 'ابحث في المحاضرات والأنشطة والندوات...',
    media_sort_recent: 'الأحدث أولاً',
    media_sort_oldest: 'الأقدم أولاً',
    media_tab_videos: 'الفيديوهات والمحاضرات',
    media_tab_photos: 'معرض الصور',

    // Catégories
    cat_all: 'كافة الأنشطة',
    cat_education: 'الأنشطة التعليمية',
    cat_culture: 'الأنشطة الثقافية',
    cat_religious: 'الأنشطة الدينية',
    cat_youth: 'أنشطة الشباب',
    cat_social: 'الأنشطة الاجتماعية',
    cat_conferences: 'المحاضرات واللقاءات',
    cat_events: 'الفعاليات والمناسبات',
    cat_general: 'عام',

    // Section Appel à participation
    call_action_title: 'انضم إلى مسيرة العطاء مع جمعية A.J.M.C في كاندي',
    call_action_desc: 'نرحب بجميع الطاقات الشبابية والمهتمين بالعمل الثقافي والاجتماعي. معاً نصنع أثراً نافعاً في مدينتنا ووطننا.',
    call_action_btn: 'تواصل مع إدارة الجمعية',

    // Page À Propos
    about_page_title: 'عن جمعية A.J.M.C — كاندي',
    about_page_subtitle: 'تعرف على رسالة الجمعية، أهدافها الاستراتيجية، ومبادئ عملها الميداني.',
    about_who_title: 'من نحن ؟',
    about_who_desc1: 'جمعية الشباب المسلم للثقافة (A.J.M.C — كاندي) تجمع طاقات شبابية رائدة تؤمن بأن الثقافة الرصينة والأخلاق الفاضلة هما أساس نهضة الفرد والمجتمع في مدينة كاندي ومنطقة أليبوري وعموم بنين.',
    about_who_desc2: 'تسعى الجمعية عبر نهج وسطي قويم إلى تقديم نموذج شبابي ملهم، يعزز أواصر الأخوة الصادقة والتعاون المثمر على البر والتقوى.',
    about_mission_title: 'رسالتنا',
    about_mission_desc: 'توفير بيئة شبابية محفزة على طلب العلم، وحفظ الهوية، وبناء الشخصية المتوازنة والمشاركة الإيجابية في تنمية المجتمع.',
    about_vision_title: 'رؤيتنا',
    about_vision_desc: 'أن تكون الجمعية منارة ثقافية وتربوية واجتماعية ملهمة لشباب بنين، تسهم بفاعلية في ترسيخ السلام والمحبة والتكافل.',
    about_values_title: 'قيمنا الجوهرية',
    about_values_desc: 'الإخلاص، الأخوة والمحبة، الاستقامة والنزاهة، طلب العلم النافع، روح المبادرة، والتضامن الإنساني.',
    about_youth_commitment_title: 'التزامنا نحو جيل الشباب',
    about_youth_commitment_desc: 'إتاحة منابر للحوار البناء، واكتشاف المواهب ورعايتها، وتقديم القدوات الصالحة التي تسهم في حماية الشباب وتوجيهه نحو ما ينفعه.',
    about_org_title: 'الهيكل التنظيمي',
    about_org_desc: 'يدير الجمعية مكتب تنفيذي منتخب يضم لجان متخصصة (اللجنة الثقافية، التربوية، الاجتماعية، والإعلامية) بمشاركة تطوعية واسعة من الأعضاء.',

    // Page Projets
    projects_page_title: 'مشاريع الجمعية ومبادراتها',
    projects_page_subtitle: 'البرامج الميدانية والمشاريع التي تطلقها الجمعية لتحقيق النفع المستدام في المجتمع.',

    // Page Actualités
    news_page_title: 'الأخبار والمستجدات',
    news_page_subtitle: 'آخر البيانات، البلاغات والتقارير الإخبارية عن أنشطة جمعية A.J.M.C.',
    news_read_more: 'قراءة المزيد',

    // Contact
    contact_title: 'تواصل مع جمعية A.J.M.C',
    contact_subtitle: 'يسعدنا استقبال استفساراتكم واقتراحاتكم وطلبات الانضمام والتنسيق المشترك.',
    contact_form_name: 'الاسم الكامل',
    contact_form_phone: 'رقم الهاتف / الواتساب',
    contact_form_email: 'البريد الإلكتروني',
    contact_form_subject: 'موضوع الرسالة',
    contact_form_msg: 'نص الرسالة أو المقترح',
    contact_form_submit: 'إرسال الرسالة',
    contact_form_success: 'تم إرسال رسالتكم بنجاح إلى إدارة الجمعية، وسيتواصل معكم فريق العمل في أقرب وقت.',
    contact_info_title: 'بيانات الاتصال الرسمية',
    contact_address: 'كاندي، مقاطعة أليبوري — جمهورية بنين',
    contact_phone: '+229 01 97 18 58 22',
    contact_email: 'Maguidram@gmail.com',

    // Footer
    footer_desc: 'هيئة شبابية وثقافية واجتماعية تعمل في مدينة كاندي وبنين على تنمية قدرات الشباب، نشر الثقافة الهادفة، وخدمة المجتمع.',
    footer_quick_links: 'روابط سريعة',
    footer_contact_info: 'التواصل والأمانة العامة',
    footer_youtube_title: 'القناة الرسمية على يوتيوب',
    footer_youtube_btn: 'متابعة قناتنا على يوتيوب',
    footer_rights: '© 2026 جمعية الشباب المسلم للثقافة (A.J.M.C — كاندي). جميع الحقوق محفوظة.',
  },
};
