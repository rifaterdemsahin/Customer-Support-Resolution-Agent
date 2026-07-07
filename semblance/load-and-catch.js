/**
 * Global error catcher — loads every page of the CSRA demo with Playwright,
 * captures console errors, page errors, unhandled promise rejections, and
 * failed network requests, then writes a structured report into the
 * `semblance/` folder so errors can be triaged and fixed.
 *
 * Usage:  node semblance/load-and-catch.js
 */
const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
// Auto-discover every top-level HTML page so newly added pages are scanned
// automatically — no need to edit this list when a page is added.
const PAGES = fs.readdirSync(ROOT)
  .filter(function (f) { return f.endsWith('.html'); })
  .sort();

const OUT_DIR = path.resolve(__dirname);
fs.mkdirSync(OUT_DIR, { recursive: true });

function ts() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19) + 'Z';
}

async function probe(page, name) {
  const events = [];
  const url = 'file://' + path.join(ROOT, name);

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      events.push({ kind: 'console.error', text: msg.text(), location: msg.location() });
    }
  });
  page.on('pageerror', (err) => {
    events.push({ kind: 'pageerror', text: err.message, stack: err.stack });
  });
  page.on('requestfailed', (req) => {
    events.push({
      kind: 'requestfailed',
      url: req.url(),
      method: req.method(),
      failure: req.failure() ? req.failure().errorText : 'unknown',
    });
  });
  page.on('response', (resp) => {
    if (resp.status() >= 400) {
      events.push({ kind: 'http-' + resp.status(), url: resp.url(), status: resp.status() });
    }
  });

  try {
    await page.goto(url, { waitUntil: 'load', timeout: 15000 });
  } catch (e) {
    events.push({ kind: 'goto-failed', text: e.message });
  }
  // Let timelines / async fetches run a bit so deferred errors surface.
  await page.waitForTimeout(4000);

  return { page: name, url, events };
}

async function run() {
  const stamp = ts();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    deviceScaleFactor: 1,
  });

  const results = [];
  for (const name of PAGES) {
    if (!fs.existsSync(path.join(ROOT, name))) {
      results.push({ page: name, url: null, events: [{ kind: 'missing-file', text: name + ' not found' }] });
      continue;
    }
    const page = await context.newPage();
    try {
      const r = await probe(page, name);
      results.push(r);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  // Pretty human report
  const lines = [];
  lines.push('# Semblance — Caught Errors Report');
  lines.push('');
  lines.push('Generated: ' + stamp);
  lines.push('');
  let total = 0;
  for (const r of results) {
    lines.push('## ' + r.page);
    if (!r.events.length) {
      lines.push('- ✅ no errors caught');
    } else {
      for (const e of r.events) {
        total++;
        let s = '- [' + e.kind + '] ';
        if (e.url) s += e.url + ' ';
        if (e.status) s += '(' + e.status + ') ';
        if (e.failure) s += 'failure: ' + e.failure + ' ';
        if (e.text) s += e.text;
        lines.push(s);
      }
    }
    lines.push('');
  }
  lines.push('---');
  lines.push('Total caught events: ' + total);

  const mdPath = path.join(OUT_DIR, 'caught-errors-' + stamp + '.md');
  fs.writeFileSync(mdPath, lines.join('\n'));

  const jsonPath = path.join(OUT_DIR, 'caught-errors-' + stamp + '.json');
  fs.writeFileSync(jsonPath, JSON.stringify({ stamp, results }, null, 2));

  // Always-replace latest snapshot for quick triage
  fs.writeFileSync(path.join(OUT_DIR, 'latest.md'), lines.join('\n'));
  fs.writeFileSync(path.join(OUT_DIR, 'latest.json'), JSON.stringify({ stamp, results }, null, 2));

  console.log(lines.join('\n'));
  console.log('\nReport written: ' + mdPath);
  process.exit(total > 0 ? 0 : 0);
}

run().catch((err) => {
  console.error('FATAL:', err);
  process.exit(1);
});
