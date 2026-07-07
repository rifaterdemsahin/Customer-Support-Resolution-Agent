#!/usr/bin/env node
/**
 * DeepSeek-powered auto-fixer for health-check failures.
 *
 * When the health check fails, this script sends the failure log + source files
 * to the DeepSeek chat API and asks for minimal JSON edits. With --apply it
 * writes the edits to disk (each edit is applied only if its oldText matches
 * exactly once in the file). The CI workflow then commits & pushes the change
 * and re-runs the health check.
 *
 *   node semblance/deepseek-fix.js            # diagnose only -> latest-deepseek.md
 *   node semblance/deepseek-fix.js --apply    # apply edits to files
 *
 * Env:
 *   DEEPSEEK_API_KEY   (required) bearer token for api.deepseek.com
 *   DEEPSEEK_MODEL     (optional, default deepseek-chat)
 *   DEEPSEEK_ENDPOINT  (optional, default https://api.deepseek.com/chat/completions)
 */
const fs = require('fs');
const path = require('path');
const https = require('https');

const ROOT = path.resolve(__dirname, '..');
const APPLY = process.argv.includes('--apply');
const KEY = process.env.DEEPSEEK_API_KEY || '';
const MODEL = process.env.DEEPSEEK_MODEL || 'deepseek-chat';
const ENDPOINT = process.env.DEEPSEEK_ENDPOINT || 'https://api.deepseek.com/chat/completions';
const PER_FILE_CAP = 8000;

function read(p) { try { return fs.readFileSync(path.join(ROOT, p), 'utf8'); } catch (e) { return null; } }
function cap(s) { return s.length > PER_FILE_CAP ? s.slice(0, PER_FILE_CAP) + '\n…(truncated)…' : s; }

function latestLog() {
  const files = fs.readdirSync(__dirname).filter(f => /^health-.*\.log$/.test(f)).sort();
  return files.length ? path.join(__dirname, files[files.length - 1]) : null;
}

const logPath = latestLog();
if (!logPath) { console.error('No health-check log found. Run health-check first.'); process.exit(2); }
const log = fs.readFileSync(logPath, 'utf8');
const latest = read('semblance/latest-health.md') || '';

if (!/FAIL  /.test(latest)) {
  console.log('Last health check passed — nothing to fix.');
  process.exit(0);
}

const contextFiles = [
  'index.html', 'act1.html', 'act2.html', 'act3.html', 'combined.html', 'media.html', 'methodology.html',
  'backend/main.go', 'backend/main_test.go', 'test-animation.js',
  'semblance/load-and-catch.js', 'semblance/verify-sentinel.js', 'semblance/verify-pipeline.js',
  'semblance/scan-links.js', 'semblance/health-check.sh',
];
const context = contextFiles
  .map(f => { const c = read(f); return c ? `\n===== FILE: ${f} =====\n${cap(c)}` : ''; })
  .join('\n');

const sys = `You are an automated fixer for the "Customer Support Resolution Agent" web demo (HTML+GSAP pages + Go backend + Playwright tests). The automated health check failed. Read the failure report, the full log, and the source files, then output ONLY a JSON object — no prose, no markdown fences — with this exact shape:
{"reason":"one-line explanation of the root cause","edits":[{"path":"relative/path/from/repo/root","oldText":"exact existing text to replace (must occur exactly once in the file)","newText":"replacement text"}]}
Rules:
- "path" must be one of the files provided.
- "oldText" must match EXACTLY (whitespace, casing) and be UNIQUE in the file — include enough surrounding context to guarantee uniqueness.
- Make the minimal edit that fixes the failing check. If you are not confident, return {"reason":"...","edits":[]}.`;

const user = `HEALTH REPORT:\n${latest}\n\nFULL LOG (tail):\n${log.slice(-6000)}\n\nSOURCE FILES:${context}`;

function callDeepSeek() {
  return new Promise((resolve, reject) => {
    const body = JSON.stringify({
      model: MODEL,
      messages: [{ role: 'system', content: sys }, { role: 'user', content: user }],
      temperature: 0,
      max_tokens: 4096,
      response_format: { type: 'json_object' },
    });
    const u = new URL(ENDPOINT);
    const req = https.request({
      hostname: u.hostname, path: u.pathname, method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${KEY}`, 'Content-Length': Buffer.byteLength(body) },
    }, res => {
      let d = ''; res.on('data', c => d += c);
      res.on('end', () => {
        if (res.statusCode >= 400) return reject(new Error(`DeepSeek HTTP ${res.statusCode}: ${d.slice(0, 500)}`));
        try { resolve(JSON.parse(d)); } catch (e) { reject(new Error('bad JSON from DeepSeek: ' + d.slice(0, 500))); }
      });
    });
    req.on('error', reject);
    req.write(body);
    req.end();
  });
}

(async () => {
  if (!KEY) { console.error('DEEPSEEK_API_KEY not set — cannot run DeepSeek fixer.'); process.exit(2); }
  console.log(`Calling DeepSeek (model=${MODEL}) to analyze failures…`);
  let resp;
  try { resp = await callDeepSeek(); }
  catch (e) { console.error('DeepSeek call failed:', e.message); process.exit(3); }

  const content = resp.choices && resp.choices[0] && resp.choices[0].message && resp.choices[0].message.content;
  let parsed;
  try { parsed = JSON.parse(content); }
  catch (e) { console.error('Could not parse DeepSeek JSON:\n', content && content.slice(0, 800)); process.exit(4); }

  const edits = Array.isArray(parsed.edits) ? parsed.edits : [];
  const report = [
    '# DeepSeek Diagnosis',
    '',
    `- Model: ${MODEL}`,
    `- Reason: ${parsed.reason || '(none)'}`,
    `- Proposed edits: ${edits.length}`,
    '',
    '## Proposed edits',
    '',
    ...edits.map((e, i) => `### ${i + 1}. ${e.path}\n\n\`\`\`diff\n--- ${e.path}\n+++ ${e.path}\n${String(e.oldText).split('\n').map(l => '- ' + l).join('\n')}\n${String(e.newText).split('\n').map(l => '+ ' + l).join('\n')}\n\`\`\``),
  ].join('\n');
  fs.writeFileSync(path.join(__dirname, 'latest-deepseek.md'), report);
  console.log(report);

  if (!APPLY) { console.log('\nDry run (no --apply). No files changed.'); process.exit(0); }

  let applied = 0, skipped = 0;
  for (const e of edits) {
    const orig = read(e.path);
    if (orig == null) { console.warn(`skip (missing file): ${e.path}`); skipped++; continue; }
    const count = orig.split(e.oldText).length - 1;
    if (count !== 1) { console.warn(`skip (match count ${count}, need exactly 1): ${e.path}`); skipped++; continue; }
    fs.writeFileSync(path.join(ROOT, e.path), orig.replace(e.oldText, e.newText));
    applied++; console.log(`applied: ${e.path}`);
  }
  console.log(`\nApplied ${applied} edit(s), skipped ${skipped}.`);
  process.exit(applied > 0 ? 0 : 5);
})();
