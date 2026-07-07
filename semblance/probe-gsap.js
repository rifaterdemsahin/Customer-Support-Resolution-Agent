const { chromium } = require('playwright');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push('PAGEERROR: ' + e.message));
  page.on('console', m => { if (m.type()==='error') errs.push('CONSOLE: ' + m.text()); });
  await ctx.route('**/gsap.min.js', r => r.abort());
  for (const f of ['act1.html','act2.html','act3.html','combined.html','index.html']) {
    errs.length = 0;
    await page.goto('file://'+path.join(ROOT,f), { waitUntil:'load' }).catch(()=>{});
    await page.waitForTimeout(1500);
    console.log('=== '+f+' (GSAP blocked) ===');
    console.log(errs.length ? errs.join('\n') : '(no errors)');
  }
  await browser.close();
})();
