import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { mockExternalApis, settleScrollReveals } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await mockExternalApis(page);
  // Sections fade in via a CSS opacity transition as they scroll into view
  // (see .animate-fade-up in src/index.css). Scanning mid-transition catches
  // text at a partial opacity, which blends its color toward the background
  // and can trip axe's color-contrast check on an otherwise-compliant color
  // — a false positive from test timing, not a real defect. The app already
  // ships a prefers-reduced-motion stylesheet that snaps opacity to 1
  // immediately; emulating it here scans the settled, real-world state.
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test.describe('accessibility (axe-core, live browser scan)', () => {
  test('homepage (dark theme) has no serious/critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').scrollIntoViewIfNeeded(); // let lazy sections mount
    await settleScrollReveals(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const serious = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });

  test('homepage (light theme) has no serious/critical accessibility violations', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Açık Temaya Geç/i }).click();
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await settleScrollReveals(page);

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();

    const serious = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });

  test('CV page has no serious/critical accessibility violations', async ({ page }) => {
    await page.goto('/#cv');

    const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa']).analyze();
    const serious = results.violations.filter((v) => ['serious', 'critical'].includes(v.impact));
    expect(serious, JSON.stringify(serious, null, 2)).toEqual([]);
  });
});
