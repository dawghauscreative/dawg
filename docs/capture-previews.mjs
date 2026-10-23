// Captures full-page screenshots of every page in every design option, desktop and phone.
//
// One-time setup (on your own computer, in any empty folder):
//   npm init -y && npm install playwright && npx playwright install chromium
// Run:
//   STORE_PASSWORD="your storefront password" node capture-previews.mjs
// Optional: ONLY=3,4 (just options 3 and 4)   PAGES=home,science (just those pages)
// Output: ./previews/<option>/<page>.desktop.png and .phone.png
import { chromium } from 'playwright';
import fs from 'fs';

const STORE = 'https://zyeszp-qc.myshopify.com';
const PASSWORD = process.env.STORE_PASSWORD || '';

const OPTIONS = {
  '1-current-build-live': '167606157547',
  '2-current-build-light': '168234909931',
  '3-brand-notes-dark': '168230682859',
  '4-brand-notes-light': '168234746091',
};
const PAGES = {
  home: '/',
  'uv-shield': '/products/uv-shield',
  skinbiotic: '/products/skinbiotic',
  dermaboost: '/products/dermaboost',
  'sun-safe-system': '/products/sun-safe-system',
  'skin-recovery-system': '/products/skin-recovery-system',
  'sun-resilience-system': '/products/sun-resilience-system',
  'complete-skin-defense-system': '/products/complete-skin-defense-system',
  science: '/pages/science',
  systems: '/pages/systems',
  faq: '/pages/faq',
  founder: '/pages/founder',
  'skin-edu': '/blogs/skin-edu',
  'shop-all': '/collections/shop-all',
};
const DEVICES = {
  desktop: { viewport: { width: 1440, height: 900 } },
  phone: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
};

const onlyOptions = process.env.ONLY ? process.env.ONLY.split(',').map((s) => s.trim()) : null;
const onlyPages = process.env.PAGES ? process.env.PAGES.split(',').map((s) => s.trim()) : null;

async function unlock(page, url) {
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  if (page.url().includes('/password') && PASSWORD) {
    await page.fill('input[type="password"]', PASSWORD);
    await Promise.all([page.waitForLoadState('domcontentloaded'), page.keyboard.press('Enter')]);
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
  }
}

async function settle(page) {
  // scroll the whole page so lazy images and reveal animations load, then wait for fonts
  await page.evaluate(async () => {
    await new Promise((resolve) => {
      let y = 0;
      const step = () => {
        window.scrollBy(0, 600); y += 600;
        if (y < document.body.scrollHeight + 600) setTimeout(step, 120); else resolve();
      };
      step();
    });
    window.scrollTo(0, 0);
  });
  await page.evaluate(() => document.fonts && document.fonts.ready);
  await page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => {});
  await page.waitForTimeout(800);
}

const browser = await chromium.launch();
for (const [optName, themeId] of Object.entries(OPTIONS)) {
  if (onlyOptions && !onlyOptions.some((n) => optName.startsWith(n))) continue;
  for (const [devName, dev] of Object.entries(DEVICES)) {
    const ctx = await browser.newContext({ ...dev, reducedMotion: 'reduce' });
    const page = await ctx.newPage();
    for (const [pageName, path] of Object.entries(PAGES)) {
      if (onlyPages && !onlyPages.includes(pageName)) continue;
      const url = `${STORE}${path}?preview_theme_id=${themeId}`;
      try {
        await unlock(page, url);
        await settle(page);
        fs.mkdirSync(`previews/${optName}`, { recursive: true });
        const file = `previews/${optName}/${pageName}.${devName}.png`;
        await page.screenshot({ path: file, fullPage: true });
        console.log('saved', file);
      } catch (e) {
        console.log('FAILED', url, e.message);
      }
    }
    await ctx.close();
  }
}
await browser.close();
console.log('Done. Screenshots are in ./previews');
