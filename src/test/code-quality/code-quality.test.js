import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
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

const allSourceFiles = collectFiles(SRC_DIR, ['.js', '.jsx']);
const TEST_DIR = join(SRC_DIR, 'test');
const SELF = join(SRC_DIR, 'test', 'code-quality', 'code-quality.test.js');
const nonTestFiles = allSourceFiles.filter((f) => !f.startsWith(TEST_DIR));
// This file's own source text contains the very patterns it scans for
// (e.g. the string "it.only(" inside a regex literal), so it must exclude
// itself or it would permanently flag itself as an offender.
const testFiles = allSourceFiles.filter((f) => f.startsWith(TEST_DIR) && f !== SELF);

describe('code quality: no debug leftovers in application code', () => {
  it('no console.log left in src/ (console.error/warn are fine, console.log is debugging residue)', () => {
    const offenders = nonTestFiles.filter((file) => /console\.log\s*\(/.test(readFileSync(file, 'utf-8')));
    expect(offenders).toEqual([]);
  });

  it('no debugger statements in src/', () => {
    const offenders = nonTestFiles.filter((file) => /\bdebugger\s*;/.test(readFileSync(file, 'utf-8')));
    expect(offenders).toEqual([]);
  });

  it('no TODO/FIXME/XXX markers left unresolved in application code', () => {
    const offenders = [];
    for (const file of nonTestFiles) {
      const content = readFileSync(file, 'utf-8');
      if (/\b(TODO|FIXME|XXX)\b/.test(content)) offenders.push(file);
    }
    expect(offenders).toEqual([]);
  });
});

describe('code quality: test suite hygiene', () => {
  it('no test is left focused with it.only/describe.only (would silently skip the rest of the suite in CI)', () => {
    const offenders = testFiles.filter((file) =>
      /\b(it|test|describe)\.only\s*\(/.test(readFileSync(file, 'utf-8'))
    );
    expect(offenders).toEqual([]);
  });

  it('no test is left disabled with it.skip/describe.skip/xit/xdescribe', () => {
    const offenders = testFiles.filter((file) =>
      /\b(it|test|describe)\.skip\s*\(|\bxit\s*\(|\bxdescribe\s*\(/.test(readFileSync(file, 'utf-8'))
    );
    expect(offenders).toEqual([]);
  });
});

describe('code quality: project configuration', () => {
  it('package.json defines lint, test, and build scripts', () => {
    const pkg = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));
    expect(pkg.scripts.lint).toBeTruthy();
    expect(pkg.scripts.test).toBeTruthy();
    expect(pkg.scripts.build).toBeTruthy();
  });

  it('the ESLint config exists and is loadable', async () => {
    const config = await import(/* @vite-ignore */ join(ROOT, '.eslintrc.cjs'));
    expect(config.default ?? config).toBeTruthy();
  });

  it('every application source file has a corresponding test-suite category, or is a trivial re-export/entrypoint', () => {
    // Sanity check that this test suite doesn't silently drift from the
    // codebase: main.jsx (entrypoint) and index.css/cv.css are intentionally
    // excluded, everything else in components/hooks should be testable.
    const untestedComponents = readdirSync(join(SRC_DIR, 'components')).filter((f) => {
      if (!f.endsWith('.jsx')) return false;
      const name = f.replace('.jsx', '');
      const hasTest = testFiles.some((t) => t.includes(`${name}.test.`));
      return !hasTest;
    });
    expect(untestedComponents).toEqual([]);
  });
});
