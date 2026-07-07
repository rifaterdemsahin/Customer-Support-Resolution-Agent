/**
 * Link + sentinel integrity scanner.
 *
 * Auto-discovers every top-level *.html page and checks:
 *   1. The Error Sentinel (`__csraSentinel`) is present — every page must be
 *      covered by the global client error catcher.
 *   2. Every internal `href` target resolves to a real file on disk — catches
 *      links to pages that were never created (e.g. a tool-card pointing at a
 *      missing methodology.html).
 *
 * External (http(s):, data:, mailto:, tel:) and fragment-only links are skipped.
 *
 * Usage:  node semblance/scan-links.js     # exit non-zero on any problem
 */
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const OUT_DIR = __dirname;

function ts() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19) + 'Z';
}

const pages = fs.readdirSync(ROOT)
  .filter(function (f) { return f.endsWith('.html'); })
  .sort();

const problems = [];

for (const page of pages) {
  const fp = path.join(ROOT, page);
  const html = fs.readFileSync(fp, 'utf8');

  // 1. Sentinel presence.
  if (!/__csraSentinel/.test(html)) {
    problems.push({ page, kind: 'missing-sentinel', detail: 'Error Sentinel <script> not found — add it to <head> (copy from act1.html)' });
  }

  // 2. Internal link resolution.
  const re = /href="([^"#?]+)"/g;
  let m;
  while ((m = re.exec(html))) {
    const href = m[1];
    if (/^(https?:|data:|mailto:|tel:)/.test(href)) continue;   // external
    if (href.startsWith('//')) continue;                        // protocol-relative
    if (!href) continue;
    const target = path.resolve(ROOT, href);
    let st;
    try { st = fs.statSync(target); } catch (e) {
      problems.push({ page, kind: 'broken-link', detail: 'href="' + href + '" -> not found' });
      continue;
    }
    if (!st.isFile()) {
      problems.push({ page, kind: 'broken-link', detail: 'href="' + href + '" -> not a file' });
    }
  }
}

const lines = [];
lines.push('# Scan Links — ' + ts());
lines.push('');
lines.push('Discovered pages (' + pages.length + '): ' + pages.join(', '));
lines.push('');
if (problems.length === 0) {
  lines.push('✅ Every page has the Error Sentinel and every internal link resolves.');
} else {
  lines.push('❌ ' + problems.length + ' problem(s):');
  for (const p of problems) lines.push('- [' + p.page + '] ' + p.kind + ': ' + p.detail);
}
const md = lines.join('\n');

fs.writeFileSync(path.join(OUT_DIR, 'latest-scan.md'), md);
fs.writeFileSync(path.join(OUT_DIR, 'scan-links-' + ts() + '.md'), md);

console.log(md);
process.exit(problems.length ? 1 : 0);
