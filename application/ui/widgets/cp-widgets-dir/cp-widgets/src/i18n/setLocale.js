import { DEFAULT_LOCALE } from './constants';
import { setI18nextLocale } from './i18next';

export default locale => {
  setI18nextLocale(locale, DEFAULT_LOCALE);
};
