import i18n from 'i18n-js';

import en from './i18n/locales/en.json';
import it from './i18n/locales/it.json';

i18n.defaultLocale = 'en';
i18n.locale = 'en';
i18n.fallbacks = true;
i18n.translations = { en, it };

export const setLocale = (locale) => {
    i18n.locale = locale;
}

export default i18n;