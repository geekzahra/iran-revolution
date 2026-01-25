/**
 * Internationalization (i18n) utility for Geography of Absence
 * Supports English (en) and Persian (fa)
 */

const STORAGE_KEY = 'geography-of-absence-lang';
const DEFAULT_LANG = 'en';

// Translation dictionary
const translations = {
    en: {
        // Page title
        'page.title': 'Geography of Absence | Iran 2026 Memorial',
        'page.description': 'An immersive memorial for those lost in the 2026 Iran massacres. A wounded land that never heals.',

        // Intro section
        'intro.title': 'Geography of Absence',
        'intro.subtitle': 'Each tulip, a life taken',
        'intro.date': 'Iran, January 2026',

        // Controls hint
        'controls.drag': 'Drag to rotate',
        'controls.scroll': 'Scroll to zoom',
        'controls.click': 'Click a tulip to remember',

        // Info panel
        'panel.title': 'The 2026 Iran Massacres',
        'panel.date': 'December 2025 – January 2026',

        // Statistics
        'stat.deaths': 'Estimated Deaths',
        'stat.injured': 'Injured',
        'stat.detained': 'Detained',
        'stat.cities': 'Cities Affected',

        // Panel sections
        'section.what': 'What Happened',
        'section.what.p1': 'In late December 2025, widespread protests erupted across Iran following a severe economic crisis. The government responded with extreme force, implementing a near-total internet blackout on January 8, 2026.',
        'section.what.p2': 'Security forces, including the IRGC and Basij, were ordered to "shoot to kill." Reports document the use of heavy machine guns against crowds, hospital attacks, and widespread torture.',

        'section.tulip': 'The Red Tulip',
        'section.tulip.p1': 'In Persian culture, the red tulip (لاله) symbolizes martyrdom and the blood of those who fell. Each tulip on this map represents one identified victim—placed where they took their last breath.',
        'section.tulip.p2': 'We have identified 120+ victims. The true number is far greater. Due to the information blackout, many will never be named.',

        'section.sources': 'Sources',

        // Victim popup
        'victim.age.unknown': 'Age unknown',
        'victim.date.unknown': 'Date unknown',
        'victim.years': 'years old',

        // Language toggle
        'lang.toggle': 'FA | EN',
        'memorial.tagline': 'Every tulip is a life.'
    },
    fa: {
        // Page title
        'page.title': 'جغرافیای غیاب | یادبود ایران ۱۴۰۴',
        'page.description': 'یادبودی برای کسانی که در کشتارهای دی ۱۴۰۴ ایران جان باختند.',

        // Intro section
        'intro.title': 'جغرافیای غیاب',
        'intro.subtitle': 'هر لاله، یک زندگی گرفته‌شده',
        'intro.date': 'ایران، دی ۱۴۰۴',

        // Controls hint
        'controls.drag': 'بکشید برای چرخش',
        'controls.scroll': 'اسکرول برای بزرگنمایی',
        'controls.click': 'روی لاله کلیک کنید',

        // Info panel
        'panel.title': 'کشتارهای دی ۱۴۰۴ ایران',
        'panel.date': 'دی ۱۴۰۴',

        // Statistics
        'stat.deaths': 'کشته‌شدگان تخمینی',
        'stat.injured': 'زخمی‌ها',
        'stat.detained': 'بازداشت‌شدگان',
        'stat.cities': 'شهرهای درگیر',

        // Panel sections
        'section.what': 'چه اتفاقی افتاد',
        'section.what.p1': 'در اواخر دی ۱۴۰۴، اعتراضات گسترده در سراسر ایران به دنبال بحران شدید اقتصادی آغاز شد. حکومت با خشونت شدید پاسخ داد و در ۱۸ دی قطع اینترنت تقریباً کامل را اجرا کرد.',
        'section.what.p2': 'به نیروهای امنیتی از جمله سپاه و بسیج دستور «شلیک برای کشتن» داده شد. گزارش‌ها حاکی از استفاده از مسلسل‌های سنگین علیه جمعیت، حمله به بیمارستان‌ها و شکنجه گسترده است.',

        'section.tulip': 'لاله سرخ',
        'section.tulip.p1': 'در فرهنگ ایرانی، لاله سرخ نماد شهادت و خون کسانی است که جان باختند. هر لاله روی این نقشه نشان‌دهنده یک قربانی شناسایی‌شده است—در جایی که آخرین نفس خود را کشید.',
        'section.tulip.p2': 'ما بیش از ۱۲۰ قربانی را شناسایی کرده‌ایم. تعداد واقعی بسیار بیشتر است. به دلیل قطع اطلاعات، بسیاری هرگز نام‌گذاری نخواهند شد.',

        'section.sources': 'منابع',

        // Victim popup
        'victim.age.unknown': 'سن نامعلوم',
        'victim.date.unknown': 'تاریخ نامعلوم',
        'victim.years': 'ساله',

        // Language toggle
        'lang.toggle': 'FA | EN',
        'memorial.tagline': 'هر لاله، یک زندگی است.'
    }
};

/**
 * Get the current language from localStorage or default
 */
export function getCurrentLanguage() {
    if (typeof localStorage !== 'undefined') {
        return localStorage.getItem(STORAGE_KEY) || DEFAULT_LANG;
    }
    return DEFAULT_LANG;
}

/**
 * Set the current language and persist to localStorage
 */
export function setLanguage(lang) {
    if (lang !== 'en' && lang !== 'fa') {
        console.warn(`Invalid language: ${lang}. Using default.`);
        lang = DEFAULT_LANG;
    }
    if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, lang);
    }
    updateDocumentDirection(lang);
    updatePageTranslations(lang);
}

/**
 * Get a translated string by key
 */
export function t(key, lang = null) {
    const currentLang = lang || getCurrentLanguage();
    const langTranslations = translations[currentLang];

    if (!langTranslations || !langTranslations[key]) {
        // Fallback to English, then return key
        return translations.en[key] || key;
    }

    return langTranslations[key];
}

/**
 * Get text direction for current language
 */
export function getDirection(lang = null) {
    const currentLang = lang || getCurrentLanguage();
    return currentLang === 'fa' ? 'rtl' : 'ltr';
}

/**
 * Update document direction and lang attributes
 */
export function updateDocumentDirection(lang = null) {
    const currentLang = lang || getCurrentLanguage();
    const dir = getDirection(currentLang);

    document.documentElement.setAttribute('dir', dir);
    document.documentElement.setAttribute('lang', currentLang);

    // Update page title
    document.title = t('page.title', currentLang);

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) {
        metaDesc.setAttribute('content', t('page.description', currentLang));
    }
}

/**
 * Update all elements with data-i18n attribute
 */
export function updatePageTranslations(lang = null) {
    const currentLang = lang || getCurrentLanguage();

    // Update all elements with data-i18n attribute
    const elements = document.querySelectorAll('[data-i18n]');
    elements.forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key, currentLang);
    });

    // Update language toggle button text
    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        const langText = langToggle.querySelector('.lang-text');
        if (langText) {
            langText.textContent = t('lang.toggle', currentLang);
        }
    }
}

/**
 * Toggle between English and Persian
 */
export function toggleLanguage() {
    const currentLang = getCurrentLanguage();
    const newLang = currentLang === 'en' ? 'fa' : 'en';
    setLanguage(newLang);
    return newLang;
}

/**
 * Format a date string according to current language
 */
export function formatDateLocalized(dateStr, lang = null) {
    const currentLang = lang || getCurrentLanguage();

    if (!dateStr) {
        return t('victim.date.unknown', currentLang);
    }

    const date = new Date(dateStr);

    if (currentLang === 'fa') {
        // Use Persian locale and calendar
        return date.toLocaleDateString('fa-IR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            calendar: 'persian'
        });
    }

    // English formatting
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Format age display according to current language
 */
export function formatAge(age, lang = null) {
    const currentLang = lang || getCurrentLanguage();

    if (!age) {
        return t('victim.age.unknown', currentLang);
    }

    if (currentLang === 'fa') {
        // Convert to Persian numerals
        const persianNumerals = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];
        const persianAge = age.toString().split('').map(d => persianNumerals[d]).join('');
        return `${persianAge} ${t('victim.years', currentLang)}`;
    }

    return `${age} ${t('victim.years', currentLang)}`;
}

/**
 * Initialize i18n on page load
 */
export function initI18n() {
    const lang = getCurrentLanguage();
    updateDocumentDirection(lang);

    // Wait for DOM to be ready before updating translations
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            updatePageTranslations(lang);
        });
    } else {
        updatePageTranslations(lang);
    }
}
