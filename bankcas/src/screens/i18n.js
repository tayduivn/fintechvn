import i18n from 'i18next';
import XHR from 'i18next-xhr-backend';
// import LanguageDetector from 'i18next-browser-languagedetector';
import { localStorage } from 'utils';
import { KEY_LANG_BANKCAS } from 'config/constants';

let lanInit = localStorage.loadState(KEY_LANG_BANKCAS);
lanInit = ( undefined !== lanInit.key) ? (lanInit.key) : 'vi';

i18n
  .use(XHR)
  /* .use(LanguageDetector) */
  .init({
    fallbackLng: lanInit,

    ns: ['topbar', 'common', 'sidebar', 'content', 'footer' ],
    defaultNS: 'dashboard',

    keySeparator: false,

    interpolation: {
      escapeValue: false,
      formatSeparator: ','
    },

    react: {
      wait: true
    },

    backend: {
      loadPath: '/lang/{{lng}}/{{ns}}.json',
      addPath: '/locales/{{lng}}/{{ns}}',
      allowMultiLoading: false,
    }
  });

export default i18n;