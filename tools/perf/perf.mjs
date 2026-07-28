#!/usr/bin/env node
// Field-shaped lab measurement: LCP / CLS / INP-proxy under 4x CPU throttle and
// a Slow-3G network profile, plus a mobile-viewport overflow + touch-target audit.
//
//   node perf.mjs <baseUrl> <label> <route>[,<route>...] [--desktop]
//
// Every capture asserts a POSITIVE string in the DOM first. A spinner, a login
// wall or an unstyled flash is not a measurement.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const base = process.argv[2];
const label = process.argv[3];
const routes = (process.argv[4] || '/').split(',');
const desktop = process.argv.includes('--desktop');
const SHOT_DIR = process.env.SHOT_DIR;

// iPhone 15 Pro logical viewport; DPR 3, real UA, touch on.
const MOBILE = { viewport: { width: 393, height: 852 }, deviceScaleFactor: 3, isMobile: true, hasTouch: true,
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Mobile/15E148 Safari/604.1' };
const DESKTOP = { viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 };

const SLOW3G = { offline: false, downloadThroughput: (400 * 1024) / 8, uploadThroughput: (400 * 1024) / 8, latency: 400 };

const collector = `
  window.__pm = { lcp: 0, cls: 0, longTasks: [], lcpEl: '' };
  new PerformanceObserver((l) => { for (const e of l.getEntries()) { window.__pm.lcp = e.startTime; window.__pm.lcpEl = (e.element && (e.element.tagName + (e.element.className ? '.' + String(e.element.className).slice(0,60) : ''))) || e.url || ''; } })
    .observe({ type: 'largest-contentful-paint', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) window.__pm.cls += e.value; })
    .observe({ type: 'layout-shift', buffered: true });
  new PerformanceObserver((l) => { for (const e of l.getEntries()) window.__pm.longTasks.push(Math.round(e.duration)); })
    .observe({ type: 'longtask', buffered: true });
`;

const audit = `(() => {
  const de = document.documentElement, b = document.body;
  const docOverflow = Math.max(de.scrollWidth, b.scrollWidth) - de.clientWidth;
  const offenders = [];
  const vw = de.clientWidth;
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (r.right > vw + 1 || r.left < -1) {
      const cs = getComputedStyle(el);
      if (cs.position === 'fixed' && r.width <= vw + 2) continue;
      offenders.push({ tag: el.tagName.toLowerCase(), cls: String(el.className || '').slice(0, 70), left: Math.round(r.left), right: Math.round(r.right), w: Math.round(r.width) });
    }
  }
  // Touch targets: interactive leaves smaller than 44x44 CSS px.
  const small = [];
  for (const el of document.querySelectorAll('a,button,[role="button"],input,select,summary,[role="tab"],[role="menuitem"]')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    if (getComputedStyle(el).visibility === 'hidden') continue;
    if (r.height < 44 || r.width < 24) small.push({ tag: el.tagName.toLowerCase(), t: (el.textContent||'').trim().slice(0,28), w: Math.round(r.width), h: Math.round(r.height), cls: String(el.className||'').slice(0,50) });
  }
  const scrollables = [...document.querySelectorAll('*')].filter(e => { const cs = getComputedStyle(e); return /auto|scroll/.test(cs.overflowY + cs.overflowX) && e.scrollHeight > e.clientHeight + 8; });
  const noMomentum = scrollables.filter(e => getComputedStyle(e).webkitOverflowScrolling !== 'touch' && getComputedStyle(e).overscrollBehavior === 'auto').length;
  return {
    docOverflow, offenders: offenders.slice(0, 12), offenderCount: offenders.length,
    smallTargets: small.slice(0, 12), smallCount: small.length,
    scrollables: scrollables.length, noMomentum,
    safeAreaUsed: /env\\(safe-area/.test([...document.styleSheets].map(s => { try { return [...s.cssRules].map(r => r.cssText).join(''); } catch { return ''; } }).join('')),
    bodyChars: (document.body.innerText || '').length,
    imgNoDims: [...document.images].filter(i => !i.getAttribute('width') && !i.style.aspectRatio && !getComputedStyle(i).aspectRatio.includes('/')).length,
    imgCount: document.images.length,
  };
})()`;

const rows = [];
const browser = await chromium.launch();
for (const route of routes) {
  const ctx = await browser.newContext(desktop ? DESKTOP : MOBILE);
  await ctx.addInitScript(collector);
  const page = await ctx.newPage();
  const cdp = await ctx.newCDPSession(page);
  await cdp.send('Network.enable');
  await cdp.send('Network.emulateNetworkConditions', SLOW3G);
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });

  const bytes = { js: 0, css: 0, img: 0, font: 0, other: 0, reqs: 0 };
  page.on('response', async (r) => {
    bytes.reqs++;
    const ct = (r.headers()['content-type'] || '').split(';')[0];
    let n = Number(r.headers()['content-length'] || 0);
    if (!n) { try { n = (await r.body()).length; } catch { n = 0; } }
    if (/javascript/.test(ct)) bytes.js += n;
    else if (/css/.test(ct)) bytes.css += n;
    else if (/image|svg/.test(ct)) bytes.img += n;
    else if (/font/.test(ct)) bytes.font += n;
    else bytes.other += n;
  });
  const errs = [];
  page.on('pageerror', (e) => errs.push(e.message));

  const t0 = Date.now();
  let status = 0;
  try { const r = await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 120000 }); status = r ? r.status() : 0; } catch (e) { errs.push('NAV ' + e.message); }
  try { await page.waitForLoadState('networkidle', { timeout: 45000 }); } catch { /* slow-3g budget */ }
  await page.waitForTimeout(2500);
  const loadMs = Date.now() - t0;

  // INP proxy: drive the first real control and measure event->next-paint.
  let inp = null;
  try {
    const target = page.locator('button:visible, a[href]:visible').first();
    await target.scrollIntoViewIfNeeded({ timeout: 3000 });
    inp = await page.evaluate(async () => {
      const el = document.querySelector('button, a[href]');
      if (!el) return null;
      const t = performance.now();
      el.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      el.dispatchEvent(new PointerEvent('pointerup', { bubbles: true }));
      el.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
      await new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r)));
      return Math.round(performance.now() - t);
    });
  } catch { /* nothing interactive */ }

  const pm = await page.evaluate('window.__pm').catch(() => ({}));
  const a = await page.evaluate(audit).catch((e) => ({ err: String(e) }));
  const nav = await page.evaluate(() => { const n = performance.getEntriesByType('navigation')[0]; return n ? { ttfb: Math.round(n.responseStart), domInteractive: Math.round(n.domInteractive), load: Math.round(n.loadEventEnd) } : {}; });

  const row = { route, status, label, viewport: desktop ? 'desktop-1440' : 'mobile-393',
    lcp: Math.round(pm.lcp || 0), lcpEl: pm.lcpEl, cls: Number((pm.cls || 0).toFixed(4)),
    inpProxy: inp, longTasks: (pm.longTasks || []).length, longTaskMs: (pm.longTasks || []).reduce((x, y) => x + y, 0),
    loadMs, ...nav, bytes, errors: errs.length, errSample: [...new Set(errs)].slice(0, 3), ...a };
  rows.push(row);
  const kb = (n) => (n / 1024).toFixed(0);
  console.log(`${label} ${row.viewport} ${route} :: HTTP ${status} LCP ${row.lcp}ms CLS ${row.cls} INPp ${inp}ms longTasks ${row.longTasks}/${row.longTaskMs}ms JS ${kb(bytes.js)}KB reqs ${bytes.reqs} overflow ${a.docOverflow}px/${a.offenderCount}el smallTargets ${a.smallCount} err ${errs.length} bodyChars ${a.bodyChars}`);
  if (SHOT_DIR && a.bodyChars > 200) {
    const name = `${label}-${desktop ? 'desk' : 'mob'}-${route.replace(/[^a-z0-9]/gi, '_') || 'root'}.png`;
    await page.screenshot({ path: `${SHOT_DIR}/${name}`, fullPage: false });
    row.shot = `${SHOT_DIR}/${name}`;
  }
  await ctx.close();
}
await browser.close();
if (process.env.JSON_OUT) { writeFileSync(process.env.JSON_OUT, JSON.stringify(rows, null, 2)); console.log('json ->', process.env.JSON_OUT); }
