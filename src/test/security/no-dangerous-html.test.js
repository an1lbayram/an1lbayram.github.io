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

// These sinks bypass React's automatic escaping and are the most common source
// of DOM-based XSS in a React app. The codebase should stay free of them; if one
// is genuinely needed, it must go through a sanitizer (e.g. DOMPurify) and this
// test should be updated deliberately, not silently.
const DANGEROUS_PATTERNS = [
  { name: 'dangerouslySetInnerHTML', pattern: /dangerouslySetInnerHTML/ },
  { name: '.innerHTML assignment', pattern: /\.innerHTML\s*=/ },
  { name: 'document.write', pattern: /document\.write\(/ },
  { name: 'eval()', pattern: /\beval\(/ },
  { name: 'new Function(', pattern: /new Function\(/ },
];

describe('security: no unsafe HTML/JS injection sinks', () => {
  const files = collectFiles(SRC_DIR, ['.jsx', '.js']).filter(
    (f) => !f.includes(`${join('src', 'test')}`)
  );

  it.each(DANGEROUS_PATTERNS)('$name is not used anywhere in src/', ({ pattern }) => {
    const offenders = files.filter((file) => pattern.test(readFileSync(file, 'utf-8')));
    expect(offenders).toEqual([]);
  });
});
