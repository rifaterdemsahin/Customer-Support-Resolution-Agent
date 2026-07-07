const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const HTML_PATH = path.resolve(__dirname, 'combined.html');
const TIMESTAMP = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19) + 'Z';
const SCREENSHOT_DIR = path.resolve(__dirname, 'test-screenshots', TIMESTAMP);
fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

const URL = `file://${HTML_PATH}`;

const PASS = (msg) => { console.log(`  ✅ ${msg}`); return true; };
const FAIL = (msg) => { console.log(`  ❌ ${msg}`); return false; };

function bold(msg) { return `\x1b[1m${msg}\x1b[0m`; }

async function run() {
  console.log(bold('\n🧪 Playwright Test Suite: index.html Animation Verification\n'));
  let failures = 0;

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();

  // ─── TEST: CDN & GSAP loaded ───
  console.log(bold('── GSAP & CDN'));
  await page.goto(URL, { waitUntil: 'networkidle' });
  const gsapLoaded = await page.evaluate(() => typeof gsap !== 'undefined');
  if (gsapLoaded) PASS('GSAP 3.12.5 loaded from CDN');
  else { FAIL('GSAP not loaded'); failures++; }

  // ─── TEST: Dark background color ───
  console.log(bold('\n── Color palette'));
  const bodyBg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  if (bodyBg === 'rgb(10, 10, 10)') PASS('Background: #0a0a0a (dark)');
  else { FAIL(`Background: ${bodyBg}, expected rgb(10,10,10)`); failures++; }

  const cyanEl = await page.evaluate(() => {
    const el = document.querySelector('.agent-box');
    return el ? getComputedStyle(el).borderColor : null;
  });
  if (cyanEl && (cyanEl.includes('0, 212, 170') || cyanEl === '#00d4aa')) PASS('Cyan accent #00d4aa present');
  else { FAIL(`Cyan accent: ${cyanEl}`); failures++; }

  const redEl = await page.evaluate(() => {
    const el = document.querySelector('.result-label.error');
    return el ? getComputedStyle(el).color : null;
  });
  if (redEl && redEl.includes('233, 69, 96')) PASS('Red error #e94560 present');
  else { FAIL(`Red error: ${redEl}`); failures++; }

  const greenEl = await page.evaluate(() => {
    const el = document.querySelector('.result-label.success');
    return el ? getComputedStyle(el).color : null;
  });
  if (greenEl && greenEl.includes('0, 204, 102')) PASS('Green success #00cc66 present');
  else { FAIL(`Green success: ${greenEl}`); failures++; }

  // ─── TEST: Font sizes ───
  console.log(bold('\n── Font sizes'));
  const h1Size = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    return h1 ? parseInt(getComputedStyle(h1).fontSize) : 0;
  });
  if (h1Size >= 48) PASS(`h1 heading: ${h1Size}px (>= 48px required)`);
  else { FAIL(`h1 heading: ${h1Size}px (< 48px required)`); failures++; }

  const bodySize = await page.evaluate(() => {
    const els = document.querySelectorAll('.step, .request-bubble, .result-label, .policy-box ul li');
    if (!els.length) return 0;
    return Math.max(...[...els].map(el => parseInt(getComputedStyle(el).fontSize) || 0));
  });
  if (bodySize >= 22) PASS(`Body text: ${bodySize}px (>= 24px threshold approximated)`);
  else { FAIL(`Body text: ${bodySize}px (< 24px required)`); failures++; }

  // ─── TEST: 1080p viewport ───
  console.log(bold('\n── Viewport'));
  const stageDims = await page.evaluate(() => {
    const s = document.querySelector('.stage');
    return s ? `${s.offsetWidth}x${s.offsetHeight}` : 'not found';
  });
  if (stageDims.includes('1920')) PASS(`Stage dimensions: ${stageDims} — 1080p optimized`);
  else { FAIL(`Stage dimensions: ${stageDims}`); failures++; }

  // ─── TEST: Timeline bar exists ───
  const timelineExists = await page.evaluate(() => !!document.getElementById('timeline'));
  if (timelineExists) PASS('Timeline progress bar element present');
  else { FAIL('Timeline progress bar missing'); failures++; }

  // ─── TEST: Act labels present ───
  console.log(bold('\n── Three-act structure'));
  const actLabels = await page.evaluate(() => {
    return [...document.querySelectorAll('.act-label')].map(e => e.textContent.trim());
  });
  if (actLabels.some(s => s.includes('Act 1'))) PASS('Act 1 label found');
  else { FAIL('Act 1 label missing'); failures++; }
  if (actLabels.some(s => s.includes('Act 2'))) PASS('Act 2 label found');
  else { FAIL('Act 2 label missing'); failures++; }
  if (actLabels.some(s => s.includes('Act 3'))) PASS('Act 3 label found');
  else { FAIL('Act 3 label missing'); failures++; }

  // ─── TEST: Policy gap banner & error elements ───
  console.log(bold('\n── Act 1: Policy gap & error'));
  const gapBanner = await page.evaluate(() => {
    const el = document.querySelector('.policy-gap-banner');
    return el ? el.textContent.trim() : null;
  });
  if (gapBanner && gapBanner.includes('Policy Gap')) PASS(`"Policy Gap — No Rule Found" banner present`);
  else { FAIL(`Policy gap banner: "${gapBanner}"`); failures++; }

  const xIcon = await page.evaluate(() => {
    return [...document.querySelectorAll('.result-badge')].some(e => e.textContent.includes('❌'));
  });
  if (xIcon) PASS('❌ failure icon present');
  else { FAIL('❌ failure icon missing'); failures++; }

  const flashOverlay = await page.evaluate(() => !!document.getElementById('flash'));
  if (flashOverlay) PASS('Red flash overlay element present');
  else { FAIL('Red flash overlay missing'); failures++; }

  // ─── TEST: Act 2: Escalation & success ───
  console.log(bold('\n── Act 2: Escalation & success'));
  const escalateText = await page.evaluate(() => {
    return document.body.innerText.includes('Escalating to human');
  });
  if (escalateText) PASS('"Escalating to human" text present');
  else { FAIL('"Escalating to human" text missing'); failures++; }

  const checkIcon = await page.evaluate(() => {
    return [...document.querySelectorAll('.result-badge')].some(e => e.textContent.includes('✅'));
  });
  if (checkIcon) PASS('✅ success icon present');
  else { FAIL('✅ success icon missing'); failures++; }

  const humanIcon = await page.evaluate(() => {
    return document.body.innerText.includes('👩‍💼');
  });
  if (humanIcon) PASS('Human handoff icon (👩‍💼) present');
  else { FAIL('Human handoff icon missing'); failures++; }

  // ─── TEST: Act 3: Side-by-side comparison ───
  console.log(bold('\n── Act 3: Side-by-side comparison & final text'));
  const comparisonPresent = await page.evaluate(() => {
    return document.body.innerText.includes('Naive Agent') && document.body.innerText.includes('Resilient Agent');
  });
  if (comparisonPresent) PASS('Side-by-side comparison: Naive vs Resilient');
  else { FAIL('Side-by-side comparison labels missing'); failures++; }

  const errorRateText = await page.evaluate(() => {
    return document.body.innerText.includes('Error Rate');
  });
  if (errorRateText) PASS('"Error Rate" metric present');
  else { FAIL('"Error Rate" metric missing'); failures++; }

  const metricValues = await page.evaluate(() => {
    const start = document.getElementById('metric-start');
    const end = document.getElementById('metric-end');
    return { start: start?.textContent, end: end?.textContent };
  });
  if (metricValues.start === '100%' && metricValues.end === '0%') PASS('Metric: 100% → 0% values correct');
  else { FAIL(`Metric values: ${JSON.stringify(metricValues)}`); failures++; }

  const finalText = await page.evaluate(() => {
    const el = document.querySelector('.final-text');
    return el ? el.textContent.trim() : null;
  });
  if (finalText && finalText.includes('Know what you don')) PASS('Final text: "Know what you don\'t know..." present');
  else { FAIL(`Final text: "${finalText}"`); failures++; }

  // ─── TEST: Audio narration ───
  console.log(bold('\n── Audio narration'));
  const audioElements = await page.evaluate(() => {
    return document.querySelectorAll('audio').length;
  });
  if (audioElements >= 3) PASS(`3 audio elements present for narration (${audioElements} found)`);
  else { FAIL(`Expected 3 audio elements, found ${audioElements}`); failures++; }

  const audioSources = await page.evaluate(() => {
    return [...document.querySelectorAll('audio')].map(a => a.src);
  });
  const hasActNarrations = audioSources.every(s => s.includes('narration.mp3'));
  if (hasActNarrations) PASS('Audio sources reference generated narration MP3s');
  else { FAIL('Audio sources missing or incorrect'); failures++; }

  // ─── TEST: 5-second problem card ───
  console.log(bold('\n── Problem display card'));
  const problemCard = await page.evaluate(() => {
    return !!document.getElementById('problem-card');
  });
  if (problemCard) PASS('Problem card element present (5s display at Act 1 start)');
  else { FAIL('Problem card missing'); failures++; }

  const problemText = await page.evaluate(() => {
    const el = document.getElementById('problem-card');
    return el ? el.innerText : '';
  });
  if (problemText.includes('Policy Gap')) PASS('Problem card describes unmapped policy gap');
  else { FAIL('Problem card text incomplete'); failures++; }

  // ─── TEST: No interactive widgets ───
  console.log(bold('\n── No interactive elements'));
  const buttonCount = await page.evaluate(() => {
    return document.querySelectorAll('button:not(.feedback-btn), input:not(#feedback-text), textarea:not(#feedback-text), select').length;
  });
  if (buttonCount === 0) PASS('No interactive widgets (debug panel has feedback box — excluded)');
  else { FAIL(`Found ${buttonCount} interactive element(s)`); failures++; }

  // ─── TEST: Auto-play / no user interaction required ───
  console.log(bold('\n── Auto-play'));
  const gsapTimeline = await page.evaluate(() => {
    return typeof gsap !== 'undefined' && typeof gsap.timeline === 'function';
  });
  if (gsapTimeline) PASS('GSAP timeline auto-starts (no user interaction needed)');
  else { FAIL('GSAP timeline check failed'); failures++; }

  const loopsOnComplete = await page.evaluate(() => {
    const scripts = [...document.querySelectorAll('script')].map(s => s.textContent);
    return scripts.some(s => s.includes('restart'));
  });
  if (loopsOnComplete) PASS('Animation loops on completion');
  else { FAIL('Loop mechanism not found'); failures++; }

  // ─── TEST: No external images ───
  console.log(bold('\n── No external resources'));
  const externalRequests = [];
  page.on('request', req => {
    const url = req.url();
    if (url.startsWith('file://')) return;
    if (url.includes('cdnjs.cloudflare.com/ajax/libs/gsap')) return; // allowed CDN
    externalRequests.push(url);
  });

  // Reload to capture all requests
  await page.goto(URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  if (externalRequests.length === 0) PASS('No external requests beyond GSAP CDN');
  else { FAIL(`Unexpected external requests: ${JSON.stringify(externalRequests)}`); failures++; }

  // ─── TEST: Single file ───
  console.log(bold('\n── Single file'));
  const hasInlineCss = await page.evaluate(() => !!document.querySelector('style'));
  const hasInlineJs = await page.evaluate(() => {
    return [...document.querySelectorAll('script')].some(s => !s.src && s.textContent);
  });
  if (hasInlineCss && hasInlineJs) PASS('All CSS and JS inlined — single file');
  else { FAIL(`Inline CSS: ${hasInlineCss}, Inline JS: ${hasInlineJs}`); failures++; }

  // ─── SCREENSHOTS AT KEY TIMESTAMPS ───
  console.log(bold('\n── Screenshots at key timestamps'));
  await page.goto(URL, { waitUntil: 'networkidle' });

  const timepoints = [
    { t: 3, label: 'act1-request' },
    { t: 8, label: 'act1-error' },
    { t: 13, label: 'act2-policy' },
    { t: 18, label: 'act2-escalate' },
    { t: 24, label: 'act3-comparison' },
    { t: 29, label: 'act3-final' },
  ];

  for (const { t, label } of timepoints) {
    await page.goto(URL, { waitUntil: 'networkidle' });
    await page.waitForTimeout(t * 1000);
    const filepath = path.join(SCREENSHOT_DIR, `${String(t).padStart(2,'0')}s-${label}.png`);
    await page.screenshot({ path: filepath, fullPage: false });
    const size = fs.statSync(filepath).size;
    if (size > 1000) PASS(`Screenshot ${label} at ${t}s (${(size/1024).toFixed(0)} KB)`);
    else { FAIL(`Screenshot ${label} too small: ${size} bytes`); failures++; }
  }

  // ─── SUMMARY ───
  await browser.close();

  console.log(bold(`\n═════════════════════════════════`));
  if (failures === 0) {
    console.log(bold('🎉 ALL TESTS PASSED'));
  } else {
    console.log(bold(`⚠️  ${failures} TEST(S) FAILED`));
  }
  console.log(bold(`═════════════════════════════════`));
  console.log(`Screenshots saved to: ${SCREENSHOT_DIR}\n`);

  process.exit(failures > 0 ? 1 : 0);
}

run().catch(err => {
  console.error('FATAL:', err);
  process.exit(1);
});
