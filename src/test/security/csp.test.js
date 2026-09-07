import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const ROOT = process.cwd();

// The app is deployed to two targets: Vercel (headers come from vercel.json)
// and GitHub Pages (static hosting, so the CSP must be duplicated as a <meta>
// tag in index.html). Both must stay in sync and both must actually allow the
// third-party APIs the app calls, otherwise the CSP silently breaks features
// (this happened before: api.github.com / api.rss2json.com were missing).
const REQUIRED_CONNECT_SRC_HOSTS = [
  'https://api.web3forms.com',
  'https://api.hcaptcha.com',
  'https://api.github.com',
  'https://api.rss2json.com',
];

function extractCsp(source) {
  // CSP directive values legitimately contain single quotes (e.g. 'self'),
  // so only the enclosing double quotes may terminate the match.
  const match = source.match(/Content-Security-Policy["']?\s+content=["']([^"]+)["']/)
    || source.match(/"key":\s*"Content-Security-Policy",\s*"value":\s*"([^"]+)"/);
  return match ? match[1] : null;
}

describe('security: Content-Security-Policy', () => {
  const vercelJson = readFileSync(join(ROOT, 'vercel.json'), 'utf-8');
  const indexHtml = readFileSync(join(ROOT, 'index.html'), 'utf-8');

  const vercelCsp = extractCsp(vercelJson);
  const metaCsp = extractCsp(indexHtml);

  it('vercel.json defines a Content-Security-Policy header', () => {
    expect(vercelCsp).toBeTruthy();
  });

  it('index.html defines a fallback CSP <meta> tag for GitHub Pages', () => {
    expect(metaCsp).toBeTruthy();
  });

  it('neither CSP allows unsafe-eval', () => {
    expect(vercelCsp).not.toMatch(/unsafe-eval/);
    expect(metaCsp).not.toMatch(/unsafe-eval/);
  });

  it('both CSPs set frame-ancestors or default-src to restrict framing/injection', () => {
    expect(vercelCsp).toMatch(/default-src 'self'/);
    expect(metaCsp).toMatch(/default-src 'self'/);
  });

  it.each(REQUIRED_CONNECT_SRC_HOSTS)('connect-src allows %s in both CSPs', (host) => {
    expect(vercelCsp).toContain(host);
    expect(metaCsp).toContain(host);
  });
});
