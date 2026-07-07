const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');
const ROOT = path.resolve(__dirname, '..');
const PAGES = fs.readdirSync(ROOT).filter(function (f) { return f.endsWith('.html'); }).sort();

(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();

  const pageErrors = [];
  const reported = [];
  page.on('pageerror', e => pageErrors.push(e.message));
  page.on('console', m => { if (m.type() === 'error') pageErrors.push('CONSOLE: ' + m.text()); });
  // Intercept the sentinel's beacon so it doesn't hit a non-existent server.
  await ctx.route('**/api/errors', r => {
    reported.push(r.request().postData() || '');
    r.fulfill({ status: 200, body: '{"status":"ok","message":"recorded"}', contentType: 'application/json' });
  });
  // Simulate the GSAP CDN failing.
  await ctx.route('**/gsap.min.js', r => r.abort());

  const results = {};
  for (const f of PAGES) {
    pageErrors.length = 0; reported.length = 0;
    await page.goto('file://' + path.join(ROOT, f), { waitUntil: 'load' }).catch(() => {});
    await page.waitForTimeout(1200);
    const gsapVersion = await page.evaluate(() => (window.gsap && window.gsap.version) || 'undefined');
    const badge = await page.evaluate(() => {
      const b = document.getElementById('sentinel-badge');
      return b ? b.textContent : null;
    });
    const gsapCrash = pageErrors.some(e => /gsap is not defined/i.test(e));
    results[f] = {
      gsapVersion,
      gsapCrash,
      badge,
      reported: reported.length,
      otherErrors: pageErrors.filter(e => !/Failed to load resource/i.test(e)),
    };
  }

  console.log(JSON.stringify(results, null, 2));
  let ok = true;
  for (const [f, r] of Object.entries(results)) {
    if (r.gsapCrash) { console.log('FAIL ' + f + ': gsap still crashes'); ok = false; }
  }
  console.log(ok ? '\n✅ Sentinel prevents gsap crash on all pages' : '\n❌ Some pages still crash');
  await browser.close();
  process.exit(ok ? 0 : 1);
})();
