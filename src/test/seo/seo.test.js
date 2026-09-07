import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import { JSDOM } from 'jsdom';

const ROOT = process.cwd();
const html = readFileSync(join(ROOT, 'index.html'), 'utf-8');
const dom = new JSDOM(html);
const { document } = dom.window;

const getMeta = (selector) => document.querySelector(selector)?.getAttribute('content');

describe('SEO: index.html <head>', () => {
  it('declares a language on <html> (required for screen readers and search engines)', () => {
    expect(document.documentElement.getAttribute('lang')).toBe('tr');
  });

  it('has a non-empty, reasonably-sized <title> (Google truncates past ~60 chars)', () => {
    const title = document.querySelector('title')?.textContent;
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    expect(title.length).toBeLessThanOrEqual(70);
  });

  it('has a meta description between 50 and 160 characters', () => {
    const desc = getMeta('meta[name="description"]');
    expect(desc).toBeTruthy();
    expect(desc.length).toBeGreaterThanOrEqual(50);
    expect(desc.length).toBeLessThanOrEqual(160);
  });

  it('has a single viewport meta tag for responsive rendering', () => {
    const viewports = document.querySelectorAll('meta[name="viewport"]');
    expect(viewports).toHaveLength(1);
    expect(viewports[0].getAttribute('content')).toContain('width=device-width');
  });

  it('has a canonical link tag', () => {
    const canonical = document.querySelector('link[rel="canonical"]')?.getAttribute('href');
    expect(canonical).toMatch(/^https:\/\//);
  });

  it('does not block indexing (no noindex directive)', () => {
    const robotsMeta = getMeta('meta[name="robots"]') || '';
    expect(robotsMeta.toLowerCase()).not.toContain('noindex');
  });

  it('has complete Open Graph tags for social sharing previews', () => {
    for (const prop of ['og:title', 'og:description', 'og:type', 'og:url', 'og:image']) {
      expect(getMeta(`meta[property="${prop}"]`), `missing ${prop}`).toBeTruthy();
    }
  });

  it('og:image is an absolute https URL', () => {
    expect(getMeta('meta[property="og:image"]')).toMatch(/^https:\/\//);
  });

  it('has Twitter Card tags for social sharing previews', () => {
    for (const name of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
      expect(getMeta(`meta[name="${name}"]`), `missing ${name}`).toBeTruthy();
    }
  });

  it('has a favicon link', () => {
    expect(document.querySelector('link[rel="icon"]')).toBeTruthy();
  });

  it('exposes valid Person structured data (JSON-LD) for rich results', () => {
    const script = document.querySelector('script[type="application/ld+json"]');
    expect(script).toBeTruthy();

    const data = JSON.parse(script.textContent);
    expect(data['@context']).toBe('https://schema.org');
    expect(data['@type']).toBe('Person');
    expect(data.name).toBeTruthy();
    expect(data.url).toMatch(/^https:\/\//);
    expect(Array.isArray(data.sameAs)).toBe(true);
    expect(data.sameAs.length).toBeGreaterThan(0);
  });

  it('has exactly one <h1> reserved for the page (rendered by Hero, not duplicated in the shell)', () => {
    // index.html itself only ships the #root mount point; this guards against
    // ever hardcoding a second <h1> into the static shell.
    expect(document.querySelectorAll('h1')).toHaveLength(0);
  });
});

describe('SEO: public/robots.txt', () => {
  const path = join(ROOT, 'public', 'robots.txt');

  it('exists', () => {
    expect(existsSync(path)).toBe(true);
  });

  it('allows crawling and references the sitemap', () => {
    const content = readFileSync(path, 'utf-8');
    expect(content).toMatch(/User-agent:\s*\*/);
    expect(content).toMatch(/Allow:\s*\//);
    expect(content).toMatch(/Sitemap:\s*https:\/\//);
  });
});

describe('SEO: public/sitemap.xml', () => {
  const path = join(ROOT, 'public', 'sitemap.xml');

  it('exists and is well-formed XML with at least one <url> entry', () => {
    expect(existsSync(path)).toBe(true);
    const content = readFileSync(path, 'utf-8');
    const sitemapDom = new JSDOM(content, { contentType: 'text/xml' });
    const parseError = sitemapDom.window.document.querySelector('parsererror');
    expect(parseError).toBeNull();

    const urls = sitemapDom.window.document.getElementsByTagName('url');
    expect(urls.length).toBeGreaterThan(0);
  });

  it('every <loc> is an absolute https URL matching the canonical domain', () => {
    const content = readFileSync(path, 'utf-8');
    const sitemapDom = new JSDOM(content, { contentType: 'text/xml' });
    const locs = Array.from(sitemapDom.window.document.getElementsByTagName('loc')).map((n) => n.textContent);

    expect(locs.length).toBeGreaterThan(0);
    for (const loc of locs) {
      expect(loc).toMatch(/^https:\/\/an1lbayram-github-io\.vercel\.app\//);
    }
  });

  it('the homepage canonical URL from index.html is present in the sitemap', () => {
    const canonical = getMeta('link[rel="canonical"]') || document.querySelector('link[rel="canonical"]').getAttribute('href');
    const content = readFileSync(path, 'utf-8');
    expect(content).toContain(canonical);
  });
});

describe('SEO: PWA manifest is wired for installability', () => {
  it('vite.config.js declares a manifest with name, icons, and theme color', () => {
    const viteConfig = readFileSync(join(ROOT, 'vite.config.js'), 'utf-8');
    expect(viteConfig).toMatch(/manifest:\s*{/);
    expect(viteConfig).toMatch(/name:\s*['"].+['"]/);
    expect(viteConfig).toMatch(/theme_color:/);
    expect(viteConfig).toMatch(/icons:\s*\[/);
  });
});
