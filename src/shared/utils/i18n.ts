import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const translationContext = require.context('../../assets/i18n', true, /\.json$/);
const resources: {
  [language: string]: {
    [namespace: string]: Record<string, string>;
  };
} = {};

translationContext.keys().forEach(k => {
  const language = k.replace(/\.\/(.*?)\.json/, (_, $1) => $1);

  resources[language] = { translation: translationContext(k) };
});

export function initI18next(language = 'en'): void {
  i18n.use(initReactI18next).init({
    resources,
    lng: language,
    fallbackLng: 'en'
  });
}
