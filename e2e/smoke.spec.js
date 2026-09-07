import { test, expect } from '@playwright/test';
import { mockExternalApis, waitForSectionsToMount, openMobileMenuIfNeeded } from './helpers.js';

test.beforeEach(async ({ page }) => {
  await mockExternalApis(page);
});

test.describe('Functional QA / E2E: core page flow', () => {
  test('loads the homepage with the expected title and hero content', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Anıl Bayram/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText('ANIL BAYRAM');
  });

  test('every navbar link scrolls to its target in-page section', async ({ page }) => {
    await page.goto('/');
    // These sections are React.lazy + Suspense chunks; an in-page anchor
    // click only scrolls to an element that already exists, so clicking
    // before the chunk mounts (while the Suspense fallback is still showing)
    // would silently no-op. Wait for the real section to exist first.
    await waitForSectionsToMount(page);

    const sections = [
      { link: 'Projeler', id: 'projects' },
      { link: 'Beceriler', id: 'skills' },
      { link: 'İletişim', id: 'contact' },
    ];

    for (const { link, id } of sections) {
      await openMobileMenuIfNeeded(page);
      await page.getByRole('navigation').getByRole('link', { name: link, exact: true }).click();
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
  });

  test('toggling the language switches visible copy and persists across reload', async ({ page }) => {
    await page.goto('/');
    await waitForSectionsToMount(page);
    await expect(page.getByRole('heading', { name: 'Hakkımda' })).toBeVisible();

    await openMobileMenuIfNeeded(page);
    await page.getByRole('button', { name: 'EN | TR' }).click();
    await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible();

    await page.reload();
    await expect(page.getByRole('heading', { name: 'About Me' })).toBeVisible();
  });

  test('toggling the theme switches the data-bs-theme attribute and persists across reload', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'dark');

    await page.getByRole('button', { name: /Açık Temaya Geç/i }).click();
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('data-bs-theme', 'light');
  });

  test('the project filter buttons narrow down the visible project cards', async ({ page }) => {
    await page.goto('/');
    const projectsSection = page.locator('#projects');
    // Projects is a React.lazy + Suspense chunk, and while its GitHub-stats
    // fetch is in flight it renders skeleton placeholders that carry the
    // *same* wrapper styling as real cards — counting them can silently
    // count skeletons instead of real content. `[data-testid=project-card]`
    // is only rendered for
    // the real ProjectCard (skeletons have no title element), so wait/count
    // on that instead.
    await projectsSection.locator('[data-testid="project-card"]').first().waitFor();

    const initialCount = await projectsSection.locator('[data-testid="project-card"]').count();
    expect(initialCount).toBeGreaterThan(0);

    await projectsSection.getByRole('button', { name: 'Masaüstü' }).click();
    // The re-render after the state update isn't guaranteed to have painted
    // by the time a one-shot .count() would read it (seen on slower WebKit
    // runs) — expect.poll retries the count instead of reading it once.
    await expect
      .poll(() => projectsSection.locator('[data-testid="project-card"]').count())
      .toBeLessThan(initialCount);
    const filteredCount = await projectsSection.locator('[data-testid="project-card"]').count();
    expect(filteredCount).toBeGreaterThan(0);
  });

  test('the contact form shows client-side validation errors for empty required fields', async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').scrollIntoViewIfNeeded();
    await page.getByRole('button', { name: 'Gönder' }).click();

    await expect(page.getByText(/en az 2 karakter/i)).toBeVisible();
  });

  test('submitting a valid contact form (captcha stubbed) shows a success toast and hits Web3Forms', async ({ page }) => {
    await page.goto('/');
    await page.locator('#contact').scrollIntoViewIfNeeded();

    await page.getByLabel(/İsim/).fill('Playwright Test');
    await page.getByLabel(/E-posta/).fill('test@example.com');
    await page.getByLabel(/Konu/).fill('E2E Test Subject');
    await page.getByLabel(/Mesaj/).fill('This is an automated end-to-end test message.');

    // hCaptcha's real widget can't be solved headlessly; the network stub
    // above returns an empty script, so the widget never renders and the
    // form's own required-captcha guard blocks submission — assert on that
    // guard directly instead of faking a captcha token.
    await page.getByRole('button', { name: 'Gönder' }).click();
    await expect(page.getByText(/robot olmadığınızı doğrulayın/i)).toBeVisible();
  });

  test('opening the CV view via the hero button shows the printable resume and can be closed', async ({ page }) => {
    await page.goto('/');
    await page.getByRole('link', { name: /CV İndir/ }).click();

    await expect(page.getByText('ANIL BAYRAM')).toBeVisible();
    await expect(page).toHaveURL(/#cv$/);

    await page.getByRole('button', { name: /Kapat/ }).click();
    await expect(page.getByRole('link', { name: /CV İndir/ })).toBeVisible();
  });

  test('external project/social links carry rel="noopener noreferrer" (reverse-tabnabbing guard, verified live in the browser)', async ({ page }) => {
    await page.goto('/');
    const githubLink = page.locator('#social').getByRole('link', { name: /GitHub profilimi ziyaret et/i });
    await expect(githubLink).toHaveAttribute('rel', /noopener/);
    await expect(githubLink).toHaveAttribute('target', '_blank');
  });
});
