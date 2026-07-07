// End-to-end: serve repo over HTTP + record /api/errors, load act1.html with
// GSAP blocked, and confirm the client sentinel reports the dependency-missing
// error to the server (i.e. the full client->server catching pipeline works).
const { chromium } = require('playwright');
const http = require('http');
const fs = require('fs');
const path = require('path');
const ROOT = path.resolve(__dirname, '..');

const received = [];

const srv = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/errors') {
    let body = '';
    req.on('data', c => body += c);
    req.on('end', () => { received.push(body); res.writeHead(200, {'Content-Type':'application/json'}); res.end('{"status":"ok","message":"recorded"}'); });
    return;
  }
  // CORS for beacon/fetch
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  let p = req.url === '/' ? '/index.html' : req.url;
  const fp = path.join(ROOT, p);
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200); res.end(data);
  });
});

srv.listen(8124, async () => {
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  const page = await ctx.newPage();
  await ctx.route('**/gsap.min.js', r => r.abort());
  await page.goto('http://localhost:8124/act1.html', { waitUntil: 'load' });
  await page.waitForTimeout(1500);
  await browser.close();
  srv.close();

  const depMissing = received.some(b => /dependency-missing/.test(b) && /gsap/i.test(b));
  console.log('reports received:', received.length);
  console.log('dependency-missing reported:', depMissing);
  if (received[0]) console.log('sample:', received[0].slice(0, 200));
  console.log(depMissing ? '\n✅ client->server error pipeline works' : '\n❌ pipeline failed');
  process.exit(depMissing ? 0 : 1);
});
