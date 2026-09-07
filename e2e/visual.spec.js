import { test, expect } from '@playwright/test';
import { mockExternalApis } from './helpers.js';

// This file only runs on the desktop "chromium" project — see the
// per-project `testIgnore` in playwright.config.js. Cross-browser/device
// font/anti-aliasing/viewport differences would otherwise make every
// project need its own baseline for no real benefit, since layout
// correctness is already covered by the cross-browser/responsive functional
// tests in smoke.spec.js/responsive.spec.js.

test.beforeEach(async ({ page }) => {
  await mockExternalApis(page);
  // Freezes CSS transitions/animations (the app already ships a
  // prefers-reduced-motion stylesheet) so screenshots aren't flaky.
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test.describe('visual regression', () => {
  test('hero section (dark theme, default)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('#hero')).toHaveScreenshot('hero-dark.png');
  });

  test('hero section (light theme)', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('button', { name: /Açık Temaya Geç/i }).click();
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
    await expect(page.locator('#hero')).toHaveScreenshot('hero-light.png');
  });

  test('navbar (desktop, dark theme)', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header')).toHaveScreenshot('navbar-desktop-dark.png');
  });

  test('navbar (mobile, menu open)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('/');
    await page.getByLabel('Menüyü Aç/Kapat').click();
    await expect(page.locator('header')).toHaveScreenshot('navbar-mobile-open.png');
  });

  test('contact form (idle state)', async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await expect(page.locator('#contact')).toHaveScreenshot('contact-idle.png');
  });
});
