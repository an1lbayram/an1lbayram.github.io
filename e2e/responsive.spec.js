import { test, expect } from '@playwright/test';
import { mockExternalApis } from './helpers.js';

// The navbar's CSS breakpoint (see src/index.css) collapses into a hamburger
// menu at max-width: 768px, so these are the two behaviors under test
// regardless of which Playwright project (desktop/mobile/tablet) runs them.
const VIEWPORTS = [
  { name: 'mobile', width: 375, height: 812 },
  { name: 'tablet', width: 820, height: 1180 },
  { name: 'desktop', width: 1440, height: 900 },
];

test.beforeEach(async ({ page }) => {
  await mockExternalApis(page);
});

for (const { name, width, height } of VIEWPORTS) {
  test.describe(`responsive layout @ ${name} (${width}x${height})`, () => {
    test.use({ viewport: { width, height } });

    test('renders with no horizontal overflow (no content wider than the viewport)', async ({ page }) => {
      await page.goto('/');
      const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth);
      const clientWidth = await page.evaluate(() => document.documentElement.clientWidth);
      expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1); // +1 for sub-pixel rounding
    });

    test('hamburger menu is present below the 768px breakpoint and absent above it', async ({ page }) => {
      await page.goto('/');
      const hamburger = page.getByLabel('Menüyü Aç/Kapat');

      if (width <= 768) {
        await expect(hamburger).toBeVisible();
      } else {
        await expect(hamburger).toBeHidden();
      }
    });
  });
}

test.describe('mobile navigation interaction', () => {
  test.use({ viewport: { width: 375, height: 812 } });

  test('nav links are hidden until the hamburger is opened, then close the menu on selection', async ({ page }) => {
    await mockExternalApis(page);
    await page.goto('/');

    const navLinks = page.locator('.nav-links');
    await expect(navLinks).not.toHaveClass(/active/);

    await page.getByLabel('Menüyü Aç/Kapat').click();
    await expect(navLinks).toHaveClass(/active/);

    await page.getByRole('link', { name: 'Hakkımda', exact: true }).click();
    await expect(navLinks).not.toHaveClass(/active/);
  });
});
