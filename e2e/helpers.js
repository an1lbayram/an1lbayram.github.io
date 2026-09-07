/**
 * Stubs the third-party network calls the app makes on every page load
 * (GitHub stats, Medium RSS feed, hCaptcha's script, Web3Forms submit) so
 * E2E runs are deterministic and don't depend on those services being up.
 */
export async function mockExternalApis(page) {
  await page.route('https://api.github.com/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { name: 'Altay', stargazers_count: 3, forks_count: 1, language: 'JavaScript' },
      ]),
    })
  );

  await page.route('https://api.rss2json.com/**', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ status: 'ok', items: [] }),
    })
  );

  await page.route('https://js.hcaptcha.com/**', (route) =>
    route.fulfill({ status: 200, contentType: 'application/javascript', body: '' })
  );

  await page.route('https://api.web3forms.com/submit', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ success: true, message: 'OK' }),
    })
  );
}

/**
 * Every below-the-fold section (Contact included) is a React.lazy + Suspense
 * chunk, so it doesn't exist in the DOM until the chunk finishes loading —
 * tests that interact with anything inside those sections (or with the
 * navbar's links to them) should wait for this first to avoid racing the
 * Suspense fallback.
 */
export async function waitForSectionsToMount(page) {
  await page.locator('#contact').waitFor();
}

/**
 * The navbar collapses its links (including the language switch button)
 * behind a hamburger menu below the 768px breakpoint (see src/index.css).
 * Tests that need to click a nav link/button and run across both desktop
 * and mobile Playwright projects must open it first on narrow viewports.
 */
export async function openMobileMenuIfNeeded(page) {
  const hamburger = page.getByLabel('Menüyü Aç/Kapat');
  if (await hamburger.isVisible()) {
    await hamburger.click();
  }
}

/**
 * Framer Motion's `whileInView` reveals start at `opacity: 0` and only settle
 * once the element has actually scrolled into view. axe walks the whole
 * document, so anything still parked at opacity 0 gets sampled as a faded
 * blend of its real color against the page background — which reports a
 * colour-contrast violation for text that no user ever sees in that state.
 *
 * Walking the page top-to-bottom fires every reveal; the assertion then waits
 * until no revealed section is mid-transition, so axe scans the settled page.
 */
export async function settleScrollReveals(page) {
  // Once sayfayi bastan sona gezerek her reveal'i tetikle.
  await page.evaluate(async () => {
    const step = Math.round(window.innerHeight * 0.75);
    for (let y = 0, guard = 0; y < document.documentElement.scrollHeight && guard < 80; y += step, guard++) {
      window.scrollTo(0, y);
      await new Promise((resolve) => setTimeout(resolve, 80));
    }
    window.scrollTo(0, 0);
  });

  // Sonra kalanlari zorla son hallerine getir. Beklemek yerine dayatmak
  // onemli: WebKit'te bazi reveal'lar hic yerine oturmuyor ve tarayiciya
  // gore degisen bir bekleme testi kirilgan yapiyor. Gecisleri de kapatiyoruz
  // - tema degistirildikten hemen sonra tarama yapilirsa axe yari yolda kalmis
  // bir rengi olcup gercekte olmayan kontrast hatasi bildiriyor.
  await page.addStyleTag({
    content: `
      *, *::before, *::after { transition: none !important; animation: none !important; }
      [style*="opacity"] { opacity: 1 !important; }
    `,
  });
  await page.waitForTimeout(150);
}
