import { describe, it, expect } from 'vitest';
import { translations } from '../../utils/translations';

describe('translations', () => {
  const languages = Object.keys(translations);

  it('defines both tr and en locales', () => {
    expect(languages.sort()).toEqual(['en', 'tr']);
  });

  it('every key present in tr also exists in en, and vice versa (no missing translations)', () => {
    const trKeys = new Set(Object.keys(translations.tr));
    const enKeys = new Set(Object.keys(translations.en));

    const missingInEn = [...trKeys].filter((k) => !enKeys.has(k));
    const missingInTr = [...enKeys].filter((k) => !trKeys.has(k));

    expect(missingInEn).toEqual([]);
    expect(missingInTr).toEqual([]);
  });

  it('no translation value is an empty string', () => {
    for (const lang of languages) {
      const empty = Object.entries(translations[lang])
        .filter(([, value]) => typeof value === 'string' && value.trim() === '')
        .map(([key]) => `${lang}.${key}`);
      expect(empty).toEqual([]);
    }
  });

  it('no translation value still contains an untranslated raw key placeholder (e.g. "undefined")', () => {
    for (const lang of languages) {
      const offenders = Object.entries(translations[lang])
        .filter(([, value]) => typeof value === 'string' && /undefined|\[object Object\]/i.test(value))
        .map(([key]) => `${lang}.${key}`);
      expect(offenders).toEqual([]);
    }
  });
});
