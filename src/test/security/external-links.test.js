import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';

const SRC_DIR = join(process.cwd(), 'src');

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

// Reverse tabnabbing: any target="_blank" link must carry rel="noopener noreferrer"
// (or at least noopener), otherwise the opened page can access window.opener and
// redirect the original tab to a phishing page.
describe('security: external links (reverse tabnabbing)', () => {
  const files = collectFiles(SRC_DIR, ['.jsx', '.js']);

  it('found source files to scan', () => {
    expect(files.length).toBeGreaterThan(0);
  });

  it('every target="_blank" anchor has rel="noopener noreferrer"', () => {
    const offenders = [];

    for (const file of files) {
      const content = readFileSync(file, 'utf-8');
      // crude but effective: look at each <a ...> tag spanning up to 400 chars
      const anchorRegex = /<a\b[^>]*>/g;
      let match;
      while ((match = anchorRegex.exec(content)) !== null) {
        const tag = match[0];
        if (/target=["']_blank["']/.test(tag) && !/rel=["'][^"']*noopener/.test(tag)) {
          offenders.push(`${file}: ${tag.slice(0, 120)}`);
        }
      }
    }

    expect(offenders).toEqual([]);
  });
});
