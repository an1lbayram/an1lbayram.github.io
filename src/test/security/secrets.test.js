import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, extname } from 'node:path';

const ROOT = process.cwd();
const SRC_DIR = join(ROOT, 'src');

function collectFiles(dir, exts, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory()) {
      collectFiles(full, exts, acc);
    } else if (exts.includes(extname(full))) {
      acc.push(full);
    }
  }
  return acc;
}

// Patterns for credentials that should never be committed to a public repo.
// hCaptcha/Web3Forms "site keys" are intentionally public (like a Stripe
// publishable key) and are excluded on purpose.
const SECRET_PATTERNS = [
  { name: 'AWS access key ID', pattern: /AKIA[0-9A-Z]{16}/ },
  { name: 'PEM private key block', pattern: /-----BEGIN (RSA |EC )?PRIVATE KEY-----/ },
  { name: 'Google API key', pattern: /AIza[0-9A-Za-z_-]{35}/ },
  { name: 'generic bearer/secret assignment', pattern: /(secret|api[_-]?key|access[_-]?token)\s*[:=]\s*["'][A-Za-z0-9_-]{20,}["']/i },
];

describe('security: no hardcoded credentials', () => {
  const files = collectFiles(SRC_DIR, ['.js', '.jsx']);

  it.each(SECRET_PATTERNS)('no $name pattern in src/', ({ pattern }) => {
    const offenders = files.filter((file) => pattern.test(readFileSync(file, 'utf-8')));
    expect(offenders).toEqual([]);
  });

  it('.env is gitignored so real secrets never reach the repo', () => {
    const gitignore = readFileSync(join(ROOT, '.gitignore'), 'utf-8');
    expect(gitignore).toMatch(/^\.env$/m);
  });

  it('.env.example only contains placeholder values, not a real key', () => {
    if (!existsSync(join(ROOT, '.env.example'))) return;
    const example = readFileSync(join(ROOT, '.env.example'), 'utf-8');
    expect(example).toMatch(/YOUR_.*_HERE/);
  });

  it('only VITE_-prefixed env vars are read from import.meta.env (others are never bundled anyway)', () => {
    const offenders = [];
    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      const regex = /import\.meta\.env\.([A-Z0-9_]+)/g;
      let match;
      while ((match = regex.exec(content)) !== null) {
        if (!match[1].startsWith('VITE_') && match[1] !== 'MODE' && match[1] !== 'DEV' && match[1] !== 'PROD' && match[1] !== 'SSR') {
          offenders.push(`${file}: ${match[1]}`);
        }
      }
    }
    expect(offenders).toEqual([]);
  });
});
