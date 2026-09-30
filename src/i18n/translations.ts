export type Language = 'ar' | 'fr' | 'en';

export interface Translations {
  // Navigation
  nav_home: string;
  nav_school: string;
  nav_activities: string;
  nav_videos: string;
  nav_gallery: string;
  nav_news: string;
  nav_contact: string;
  nav_enroll_btn: string;

  // Hero Section
  hero_org: string;
  hero_title_line1: string;
  hero_title_line2: string;
  hero_desc: string;
  hero_btn_enroll: string;
  hero_btn_videos: string;
  hero_badge_editorial: string;

  // Stats
  stat_success_rate: string;
  stat_success_label: string;
  stat_students_count: string;
  stat_students_label: string;
  stat_centers_count: string;
  stat_centers_label: string;
  stat_languages_count: string;
  stat_languages_label: string;

  // Home Sections
  section_videos_title: string;
  section_videos_subtitle: string;
  section_videos_btn: string;
  section_videos_empty: string;
  section_vision_tag: string;
  section_vision_title: string;
  section_vision_subtitle: string;

  vision_item1_title: string;
  vision_item1_desc: string;
  vision_item2_title: string;
  vision_item2_desc: string;
  vision_item3_title: string;
  vision_item3_desc: string;
  vision_item4_title: string;
  vision_item4_desc: string;

  section_activities_tag: string;
  section_activities_title: string;
  section_activities_btn: string;

  cta_join_title: string;
  cta_join_desc: string;
  cta_join_btn: string;

  // Videos View
  videos_hero_title: string;
  videos_hero_desc: string;
  videos_search_placeholder: string;
  videos_sort_recent: string;
  videos_sort_oldest: string;
  videos_empty: string;
  videos_watch_btn: string;

  // Video Categories
  cat_all: string;
  cat_ceremonies: string;
  cat_sports: string;
  cat_culture: string;
  cat_pedagogy: string;
  cat_trips: string;
  cat_general: string;

  // School View
  school_hero_tag: string;
  school_hero_title: string;
  school_hero_desc: string;
  school_history_title: string;
  school_history_p1: string;
  school_history_p2: string;
  school_director_title: string;
  school_director_name: string;
  school_director_message: string;

  // Contact View
  contact_hero_tag: string;
  contact_hero_title: string;
  contact_hero_desc: string;
  contact_form_name: string;
  contact_form_email: string;
  contact_form_phone: string;
  contact_form_grade: string;
  contact_form_subject: string;
  contact_form_msg: string;
  contact_form_submit: string;
  contact_form_success: string;

  // Footer
  footer_desc: string;
  footer_quick_links: string;
  footer_contact_info: string;
  footer_address: string;
  footer_hours: string;
  footer_rights: string;
  footer_youtube_title: string;
  footer_youtube_desc: string;
  footer_youtube_btn: string;
}

export const translations: Record<Language, Translations> = {
  ar: {
    // Navigation
    nav_home: 'الرئيسية',
    nav_school: 'عن المجمع',
    nav_activities: 'الأنشطة',
    nav_videos: 'الفيديوهات',
    nav_gallery: 'معرض الصور',
    nav_news: 'الأخبار',
    nav_contact: 'تواصل معنا',
    nav_enroll_btn: 'التسجيل والزيارة',

    // Hero Section
    hero_org: 'جمعية العون المباشر · جمهورية بنين',
    hero_title_line1: 'نعلّم لنرتقي،',
    hero_title_line2: 'ونبني مستقبلاً يليق بأبنائنا.',
    hero_desc: 'في مجمع العون المباشر التعليمي في بنين، نوفر بيئة تربوية رائدة تجمع بين التفوق الأكاديمي، إتقان اللغتين العربية والفرنسية، والتربية الأخلاقية ورعاية المواهب من مرحلة الروضة إلى الثانوية والتأهيل المهني.',
    hero_btn_enroll: 'طلب التسجيل والمعلومات',
    hero_btn_videos: 'مشاهدة أنشطتنا المصورة',
    hero_badge_editorial: 'أنشطة وفعاليات المجمع',

    // Stats
    stat_success_rate: '100%',
    stat_success_label: 'نسبة النجاح في الامتحانات الرسمية (BEPC و BAC)',
    stat_students_count: '+3,500',
    stat_students_label: 'طالب وطالبة يستفيدون من التعليم والرعاية',
    stat_centers_count: '15',
    stat_centers_label: 'مركز ومجمع تعليمي تابع للعون المباشر في بنين',
    stat_languages_count: '3 لغات',
    stat_languages_label: 'تعليم ثنائي وثلاثي اللغة (العربية، الفرنسية، الإنجليزية)',

    // Home Sections
    section_videos_title: 'أحدث التغطيات المصورة',
    section_videos_subtitle: 'اكتشف أحدث الأنشطة والمناسبات والفعاليات التربوية لمجمع العون المباشر التعليمي في بنين.',
    section_videos_btn: 'مشاهدة جميع الفيديوهات',
    section_videos_empty: 'التقارير والفيديوهات المصورة ستكون متاحة قريباً.',
    section_vision_tag: 'الرؤية التربوية',
    section_vision_title: 'ركائز التعليم في مجمع العون المباشر',
    section_vision_subtitle: 'منهج تعليمي متكامل يجمع بين التحصيل العلمي الرصين وغرس القيم واكتشاف إبداع كل طالب.',

    vision_item1_title: 'التميز الأكاديمي واللغات',
    vision_item1_desc: 'تعليم وفق المعايير الرسمية لوزارة التعليم في بنين، مع عناية فائقة بإتقان اللغات العربية والفرنسية والإنجليزية.',
    vision_item2_title: 'القرآن الكريم والآداب',
    vision_item2_desc: 'حلقات يومية لحفظ وترتيل القرآن الكريم، وتنشئة الطلاب على الأخلاق الفاضلة وفنون الخطابة والإلقاء.',
    vision_item3_title: 'كفالة الأيتام والعدالة الاجتماعية',
    vision_item3_desc: 'رعاية شاملة للأيتام والمحتاجين تشمل التعليم المجاني، الزي المدرسي، التغذية والمتابعة الصحية الدورية.',
    vision_item4_title: 'الابتكار العلمي والتقني',
    vision_item4_desc: 'مختبرات حاسوب حديثة وورش تطبيقية للفيزياء والكيمياء والروبوتات لإعداد قادة الغد.',

    section_activities_tag: 'الحياة المدرسية',
    section_activities_title: 'أنشطة متنوعة تثري شخصية الطالب',
    section_activities_btn: 'استكشف كافة الأنشطة المدرسية',

    cta_join_title: 'انضم إلى مجمع العون المباشر التعليمي في بنين',
    cta_join_desc: 'باب التسجيل مفتوح للطلاب الجدد والمحولين. ندعوكم للتواصل مع إدارة التعليم للاطلاع على شروط القبول وبرامج المنح والكفالات المتاحة.',
    cta_join_btn: 'استمارة التسجيل وطلب الزيارة',

    // Videos View
    videos_hero_title: 'مكتبة الفيديوهات والأنشطة',
    videos_hero_desc: 'شاهد الفعاليات الرسمية، البطولات الرياضية، الحفلات القرآنية، والأنشطة التربوية لمجمع العون المباشر التعليمي بنين.',
    videos_search_placeholder: 'ابحث في عناوين الفيديوهات والأنشطة...',
    videos_sort_recent: 'الأحدث أولاً',
    videos_sort_oldest: 'الأقدم أولاً',
    videos_empty: 'التقارير والفيديوهات المصورة ستكون متاحة قريباً.',
    videos_watch_btn: 'شاهد الآن',

    // Video Categories
    cat_all: 'الكل',
    cat_ceremonies: 'الحفلات والمناسبات',
    cat_sports: 'الأنشطة الرياضية',
    cat_culture: 'الأنشطة الثقافية',
    cat_pedagogy: 'الأنشطة التعليمية',
    cat_trips: 'الرحلات المدرسية',
    cat_general: 'عام',

    // School View
    school_hero_tag: 'رسالتنا وهويتنا',
    school_hero_title: 'مجمع العون المباشر التعليمي بنين',
    school_hero_desc: 'صرح تعليمي نموذجي يجمع بين الأصالة والحداثة، لرعاية الجيل الصاعد في بنين وتمكينه بالعلم والمعرفة والقيم.',
    school_history_title: 'مسيرة العطاء وبناء الإنسان',
    school_history_p1: 'تأسس مجمع العون المباشر التعليمي في جمهورية بنين بهدف تقديم نموذج تعليمي استثنائي يلبي تطلعات الأسر ويوفر للطلاب بيئة تعليمية محفزة على التفوق والإبداع.',
    school_history_p2: 'يحتضن المجمع اليوم مئات الطلاب من المرحلة الابتدائية حتى الثانوية، مع كفالة خاصة للأيتام والطلبة المتميزين لتأهيلهم لولوج أرقى الجامعات العالمية.',
    school_director_title: 'كلمة الإدارة العامة للمجمع',
    school_director_name: 'إدارة مجمع العون المباشر التعليمي — بنين',
    school_director_message: 'نؤمن في مجمع العون المباشر بأن التعليم هو أثمن استثمار في بناء الإنسان. نلتزم بتوفير أعلى معايير الجودة الأكاديمية والتربوية لأبنائنا وبناتنا في بنين.',

    // Contact View
    contact_hero_tag: 'تواصل معنا',
    contact_hero_title: 'التسجيل والاستفسار والزيارات',
    contact_hero_desc: 'يسعدنا استقبال استفساراتكم بشأن التسجيل، برامج المنح، أو ترتيب زيارة ميدانية لحرم المجمع التعليمي.',
    contact_form_name: 'الاسم الكامل للولي أو الطالب',
    contact_form_email: 'البريد الإلكتروني',
    contact_form_phone: 'رقم الهاتف / الواتساب',
    contact_form_grade: 'المرحلة الدراسية المرغوبة',
    contact_form_subject: 'موضوع الاستفسار',
    contact_form_msg: 'نص الرسالة أو تفاصيل الطلب',
    contact_form_submit: 'إرسال طلب الاستفسار',
    contact_form_success: 'تم إرسال طلبكم بنجاح! سيتواصل معكم فريق الإدارة خلال 48 ساعة.',

    // Footer
    footer_desc: 'جمعية إنسانية وتنموية رائدة تعمل في بنين على نشر التعليم النوعي، ورعاية الأيتام، وتوفير بيئة تربوية ثنائية اللغة لتمكين الأجيال وصناعة المستقبل.',
    footer_quick_links: 'روابط سريعة',
    footer_contact_info: 'المراكز الإدارية والتعليمية',
    footer_address: 'المكتب الوطني ومجمع العون المباشر التعليمي: كوتونو / بورتو نوفو — جمهورية بنين',
    footer_hours: 'من الإثنين إلى الجمعة: 8:00 صباحاً – 5:30 مساءً',
    footer_rights: '© 2026 مجمع العون المباشر بنين. جميع الحقوق محفوظة.',
    footer_youtube_title: 'قناة يوتيوب الرسمية',
    footer_youtube_desc: 'شاهد جميع الفيديوهات والتقارير الميدانية المصورة عبر القناة الرسمية للمجمع.',
    footer_youtube_btn: 'زيارة قناة يوتيوب الرسمية',
  },

  fr: {
    // Navigation
    nav_home: 'Accueil',
    nav_school: 'Le Complexe',
    nav_activities: 'Activités',
    nav_videos: 'Vidéos',
    nav_gallery: 'Galerie Photos',
    nav_news: 'Actualités',
    nav_contact: 'Contact',
    nav_enroll_btn: 'Inscription & Visite',

    // Hero Section
    hero_org: 'Direct Aid International · République du Bénin',
    hero_title_line1: 'Éduquer pour élever,',
    hero_title_line2: 'et bâtir un avenir digne de nos enfants.',
    hero_desc: 'Au sein du Complexe Éducatif DirectAid Bénin, nous offrons un environnement pédagogique d\'excellence alliant réussite académique, maîtrise de l\'arabe et du français, éducation aux valeurs et formation de la maternelle au lycée.',
    hero_btn_enroll: 'Demande d\'inscription',
    hero_btn_videos: 'Découvrir nos vidéos',
    hero_badge_editorial: 'Activités & Événements',

    // Stats
    stat_success_rate: '100%',
    stat_success_label: 'Taux de réussite aux examens officiels (BEPC & BAC)',
    stat_students_count: '+3 500',
    stat_students_label: 'Élèves bénéficiant d\'une éducation de qualité et d\'un encadrement',
    stat_centers_count: '15',
    stat_centers_label: 'Centres et complexes éducatifs DirectAid au Bénin',
    stat_languages_count: '3 Langues',
    stat_languages_label: 'Éducation bilingue et trilingue (Arabe, Français, Anglais)',

    // Home Sections
    section_videos_title: 'Derniers reportages vidéo',
    section_videos_subtitle: 'Découvrez les dernières activités et événements du Complexe Éducatif DirectAid Bénin.',
    section_videos_btn: 'Voir toutes les vidéos',
    section_videos_empty: 'Les derniers reportages vidéo seront bientôt disponibles.',
    section_vision_tag: 'Vision Pédagogique',
    section_vision_title: 'Les piliers de l\'éducation à DirectAid Bénin',
    section_vision_subtitle: 'Un programme complet combinant rigueur académique, ancrage éthique et épanouissement personnel.',

    vision_item1_title: 'Excellence Académique & Langues',
    vision_item1_desc: 'Enseignement conforme aux programmes officiels du Bénin avec une maîtrise approfondie de l\'arabe, du français et de l\'anglais.',
    vision_item2_title: 'Saint Coran & Valeurs Morales',
    vision_item2_desc: 'Cercles quotidiens de mémorisation du Coran, éducation aux vertus morales et ateliers d\'éloquence.',
    vision_item3_title: 'Parrainage d\'Orphelins & Équité',
    vision_item3_desc: 'Prise en charge intégrale des orphelins et élèves démunis : gratuité scolaire, tenues, cantine et suivi médical.',
    vision_item4_title: 'Innovation Scientifique & Digitale',
    vision_item4_desc: 'Salles informatiques équipées, laboratoires de sciences et ateliers de robotique pour préparer les futurs leaders.',

    section_activities_tag: 'Vie Scolaire',
    section_activities_title: 'Des activités qui enrichissent la personnalité',
    section_activities_btn: 'Découvrir toutes les activités',

    cta_join_title: 'Rejoignez le Complexe Éducatif DirectAid Bénin',
    cta_join_desc: 'Inscriptions ouvertes pour les nouveaux élèves et transferts. Contactez notre secrétariat pour découvrir nos filières et bourses.',
    cta_join_btn: 'Formulaire d\'inscription & visite',

    // Videos View
    videos_hero_title: 'Vidéos & Événements Scolaires',
    videos_hero_desc: 'Retrouvez les cérémonies officielles, tournois sportifs, concours coraniques et projets pédagogiques du Complexe Éducatif DirectAid Bénin.',
    videos_search_placeholder: 'Rechercher une vidéo ou une activité...',
    videos_sort_recent: 'Plus récentes',
    videos_sort_oldest: 'Plus anciennes',
    videos_empty: 'Les derniers reportages vidéo seront bientôt disponibles.',
    videos_watch_btn: 'Regarder la vidéo',

    // Video Categories
    cat_all: 'Toutes les catégories',
    cat_ceremonies: 'Fêtes et événements',
    cat_sports: 'Activités sportives',
    cat_culture: 'Activités culturelles',
    cat_pedagogy: 'Activités pédagogiques',
    cat_trips: 'Sorties et voyages scolaires',
    cat_general: 'Général',

    // School View
    school_hero_tag: 'Notre Mission',
    school_hero_title: 'Complexe Éducatif DirectAid Bénin',
    school_hero_desc: 'Une institution d\'excellence au service de la jeunesse béninoise, conjuguant savoirs modernes et valeurs intemporelles.',
    school_history_title: 'Une histoire d\'engagement et de dévouement',
    school_history_p1: 'Le Complexe Éducatif DirectAid au Bénin a été créé pour offrir une alternative éducative de référence, accessible et performante.',
    school_history_p2: 'Le campus accueille aujourd\'hui des centaines d\'élèves de la maternelle au secondaire, formant des citoyens éclairés et responsables.',
    school_director_title: 'Mot de la Direction',
    school_director_name: 'Direction Générale — DirectAid Bénin',
    school_director_message: 'À DirectAid, nous croyons que l\'éducation est le plus bel investissement pour l\'avenir. Nous formons des générations prêtes à relever tous les défis.',

    // Contact View
    contact_hero_tag: 'Nous Contacter',
    contact_hero_title: 'Inscriptions, Visites & Renseignements',
    contact_hero_desc: 'Notre secrétariat est à votre disposition pour vous orienter et planifier une visite guidée du campus.',
    contact_form_name: 'Nom complet du parent ou tuteur',
    contact_form_email: 'Adresse e-mail',
    contact_form_phone: 'Téléphone / WhatsApp',
    contact_form_grade: 'Niveau scolaire souhaité',
    contact_form_subject: 'Objet du message',
    contact_form_msg: 'Votre message ou détails de la demande',
    contact_form_submit: 'Envoyer ma demande',
    contact_form_success: 'Votre message a été envoyé avec succès. Notre équipe vous recontactera sous 48 heures.',

    // Footer
    footer_desc: 'Organisation humanitaire et éducative de référence au Bénin, dédiée à la diffusion du savoir, au parrainage des orphelins et à l\'émancipation de la jeunesse.',
    footer_quick_links: 'Liens Rapides',
    footer_contact_info: 'Administration & Campus',
    footer_address: 'Siège National & Complexe Scolaire : Cotonou / Porto-Novo — République du Bénin',
    footer_hours: 'Du Lundi au Vendredi : 08h00 – 17h30',
    footer_rights: '© 2026 DirectAid Bénin. Tous droits réservés.',
    footer_youtube_title: 'Chaîne YouTube Officielle',
    footer_youtube_desc: 'Visionnez tous les reportages officiels du complexe sur notre chaîne YouTube.',
    footer_youtube_btn: 'Accéder à la chaîne YouTube',
  },

  en: {
    // Navigation
    nav_home: 'Home',
    nav_school: 'About Campus',
    nav_activities: 'Activities',
    nav_videos: 'Videos',
    nav_gallery: 'Photo Gallery',
    nav_news: 'News',
    nav_contact: 'Contact',
    nav_enroll_btn: 'Admissions & Visit',

    // Hero Section
    hero_org: 'Direct Aid International · Republic of Benin',
    hero_title_line1: 'Educating to empower,',
    hero_title_line2: 'building a dignified future for our children.',
    hero_desc: 'At DirectAid Benin Educational Complex, we provide a leading educational environment combining academic excellence, Arabic and French mastery, moral upbringing, and talent development from kindergarten to high school.',
    hero_btn_enroll: 'Request Enrollment',
    hero_btn_videos: 'Watch Our Videos',
    hero_badge_editorial: 'Campus Events & Activities',

    // Stats
    stat_success_rate: '100%',
    stat_success_label: 'Success rate in official examinations (BEPC & BAC)',
    stat_students_count: '+3,500',
    stat_students_label: 'Students benefiting from quality education and care',
    stat_centers_count: '15',
    stat_centers_label: 'Educational centers and campuses across Benin',
    stat_languages_count: '3 Languages',
    stat_languages_label: 'Trilingual curriculum (Arabic, French, English)',

    // Home Sections
    section_videos_title: 'Latest Video Highlights',
    section_videos_subtitle: 'Explore recent activities, celebrations, and campus life at DirectAid Benin Educational Complex.',
    section_videos_btn: 'View All Videos',
    section_videos_empty: 'Latest video reports will be available soon.',
    section_vision_tag: 'Educational Vision',
    section_vision_title: 'Core Pillars of DirectAid Education',
    section_vision_subtitle: 'A holistic curriculum uniting academic rigor, character building, and individual talent development.',

    vision_item1_title: 'Academic Excellence & Languages',
    vision_item1_desc: 'Curriculum compliant with Benin Ministry of Education standards, emphasizing fluency in Arabic, French, and English.',
    vision_item2_title: 'Holy Quran & Ethics',
    vision_item2_desc: 'Daily Quran memorization and recitation circles, cultivating noble character, eloquence, and leadership skills.',
    vision_item3_title: 'Orphan Sponsorship & Equity',
    vision_item3_desc: 'Comprehensive support for orphans and disadvantaged youth: free tuition, uniforms, nutritious meals, and health monitoring.',
    vision_item4_title: 'Science & Digital Innovation',
    vision_item4_desc: 'Modern computer labs, physics and chemistry laboratories, and robotics workshops preparing future innovators.',

    section_activities_tag: 'School Life',
    section_activities_title: 'Vibrant activities enriching student character',
    section_activities_btn: 'Explore all school activities',

    cta_join_title: 'Join DirectAid Benin Educational Complex',
    cta_join_desc: 'Enrollment is open for new and transfer students. Contact our administration for admission requirements and scholarship programs.',
    cta_join_btn: 'Enrollment & Visit Form',

    // Videos View
    videos_hero_title: 'Videos & Campus Highlights',
    videos_hero_desc: 'Watch sports tournaments, Quran recitations, graduation ceremonies, and academic projects at DirectAid Benin.',
    videos_search_placeholder: 'Search video titles and descriptions...',
    videos_sort_recent: 'Most recent first',
    videos_sort_oldest: 'Oldest first',
    videos_empty: 'Latest video reports will be available soon.',
    videos_watch_btn: 'Watch Now',

    // Video Categories
    cat_all: 'All Categories',
    cat_ceremonies: 'Ceremonies & Events',
    cat_sports: 'Sports Activities',
    cat_culture: 'Cultural Activities',
    cat_pedagogy: 'Educational Activities',
    cat_trips: 'School Trips & Excursions',
    cat_general: 'General',

    // School View
    school_hero_tag: 'Our Mission & Identity',
    school_hero_title: 'DirectAid Benin Educational Complex',
    school_hero_desc: 'A benchmark institution uniting contemporary scholarship with enduring ethical values to empower Benin’s youth.',
    school_history_title: 'A journey of dedication and human development',
    school_history_p1: 'DirectAid Benin Educational Complex was established to deliver an outstanding educational standard accessible to all students.',
    school_history_p2: 'Today, the campus serves hundreds of learners from kindergarten through secondary education, offering specialized orphan care.',
    school_director_title: 'Message from the Administration',
    school_director_name: 'General Directorate — DirectAid Benin',
    school_director_message: 'At DirectAid, we believe education is the finest investment for human dignity. We are dedicated to nurturing tomorrow’s leaders.',

    // Contact View
    contact_hero_tag: 'Get In Touch',
    contact_hero_title: 'Admissions, Inquiries & Campus Tours',
    contact_hero_desc: 'We are delighted to assist you with registration inquiries, scholarship information, or booking a campus tour.',
    contact_form_name: 'Full Name of Parent or Guardian',
    contact_form_email: 'Email Address',
    contact_form_phone: 'Phone / WhatsApp',
    contact_form_grade: 'Target Grade Level',
    contact_form_subject: 'Subject of Inquiry',
    contact_form_msg: 'Message details',
    contact_form_submit: 'Submit Inquiry',
    contact_form_success: 'Thank you! Your request has been submitted. Our team will contact you within 48 hours.',

    // Footer
    footer_desc: 'A premier humanitarian and educational organization working in Benin to spread quality learning, care for orphans, and build a brighter future.',
    footer_quick_links: 'Quick Links',
    footer_contact_info: 'Administration & Campuses',
    footer_address: 'National Office & Educational Complex: Cotonou / Porto-Novo — Republic of Benin',
    footer_hours: 'Monday to Friday: 8:00 AM – 5:30 PM',
    footer_rights: '© 2026 DirectAid Benin. All rights reserved.',
    footer_youtube_title: 'Official YouTube Channel',
    footer_youtube_desc: 'Watch official reports and ceremony highlights directly on our official YouTube channel.',
    footer_youtube_btn: 'Visit Official YouTube Channel',
  },
};
