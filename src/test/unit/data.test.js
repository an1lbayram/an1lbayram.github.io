import { describe, it, expect } from 'vitest';
import { projects } from '../../data/projects';
import { certificates } from '../../data/certificates';
import { skills, languages } from '../../data/skills';
import { mediumArticles } from '../../data/medium';
import { translations } from '../../utils/translations';

const hasKey = (lang, key) => Object.prototype.hasOwnProperty.call(translations[lang], key);

function uniqueIds(items) {
  const ids = items.map((i) => i.id);
  return new Set(ids).size === ids.length;
}

describe('data/projects.js', () => {
  it('every project has a unique id', () => {
    expect(uniqueIds(projects)).toBe(true);
  });

  it('every project has a title, a valid customDate, and either a public url or isPrivate', () => {
    for (const p of projects) {
      expect(p.title, `project #${p.id} missing title`).toBeTruthy();
      expect(Number.isNaN(new Date(p.customDate).getTime()), `project #${p.id} has invalid customDate "${p.customDate}"`).toBe(false);
      expect(p.url || p.isPrivate, `project #${p.id} has neither a url nor isPrivate`).toBeTruthy();
    }
  });

  it('every project tag has both a name and a Bootstrap badge class', () => {
    for (const p of projects) {
      if (!p.tags) continue;
      for (const tag of p.tags) {
        expect(tag.name, `project #${p.id} has a tag with no name`).toBeTruthy();
        expect(tag.class, `project #${p.id} tag "${tag.name}" has no class`).toBeTruthy();
      }
    }
  });

  it('every project descKey resolves to a real translation in both tr and en', () => {
    for (const p of projects) {
      if (!p.descKey) continue;
      expect(hasKey('tr', p.descKey), `missing tr.${p.descKey}`).toBe(true);
      expect(hasKey('en', p.descKey), `missing en.${p.descKey}`).toBe(true);
    }
  });

  it('github project urls point at github.com/an1lbayram', () => {
    for (const p of projects) {
      if (p.isPrivate) continue;
      expect(p.url).toMatch(/^https:\/\/github\.com\/an1lbayram\//);
    }
  });
});

describe('data/certificates.js', () => {
  it('every certificate has a unique id', () => {
    expect(uniqueIds(certificates)).toBe(true);
  });

  it('every certificate has a title, institution, and date', () => {
    for (const c of certificates) {
      expect(c.title, `certificate #${c.id} missing title`).toBeTruthy();
      expect(c.institution, `certificate #${c.id} missing institution`).toBeTruthy();
      expect(c.date, `certificate #${c.id} missing date`).toBeTruthy();
    }
  });

  it('every certificate titleKey resolves to a real translation in both tr and en', () => {
    for (const c of certificates) {
      if (!c.titleKey) continue;
      expect(hasKey('tr', c.titleKey), `missing tr.${c.titleKey}`).toBe(true);
      expect(hasKey('en', c.titleKey), `missing en.${c.titleKey}`).toBe(true);
    }
  });

  it('every certificate url, when present, is https', () => {
    for (const c of certificates) {
      if (!c.url) continue;
      expect(c.url).toMatch(/^https:\/\//);
    }
  });
});

describe('data/skills.js', () => {
  it('every skill progress is a number between 0 and 100', () => {
    for (const s of skills) {
      expect(s.progress).toBeGreaterThanOrEqual(0);
      expect(s.progress).toBeLessThanOrEqual(100);
    }
  });

  it('every skill has a name and a Bootstrap color class', () => {
    for (const s of skills) {
      expect(s.name).toBeTruthy();
      expect(s.colorClass).toBeTruthy();
    }
  });

  it('every language nameKey/levelKey resolves to a real translation in both tr and en', () => {
    for (const l of languages) {
      if (l.nameKey) {
        expect(hasKey('tr', l.nameKey)).toBe(true);
        expect(hasKey('en', l.nameKey)).toBe(true);
      }
      if (l.levelKey) {
        expect(hasKey('tr', l.levelKey)).toBe(true);
        expect(hasKey('en', l.levelKey)).toBe(true);
      }
    }
  });
});

describe('data/medium.js', () => {
  it('every article has a unique id', () => {
    expect(uniqueIds(mediumArticles)).toBe(true);
  });

  it('every article has an https medium.com url and a TR/EN lang tag', () => {
    for (const a of mediumArticles) {
      expect(a.url).toMatch(/^https:\/\/medium\.com\//);
      expect(['TR', 'EN']).toContain(a.lang);
    }
  });

  it('every article titleKey/descKey resolves to a real translation in both tr and en', () => {
    for (const a of mediumArticles) {
      if (a.titleKey) {
        expect(hasKey('tr', a.titleKey), `missing tr.${a.titleKey}`).toBe(true);
        expect(hasKey('en', a.titleKey), `missing en.${a.titleKey}`).toBe(true);
      }
      if (a.descKey) {
        expect(hasKey('tr', a.descKey), `missing tr.${a.descKey}`).toBe(true);
        expect(hasKey('en', a.descKey), `missing en.${a.descKey}`).toBe(true);
      }
    }
  });
});
