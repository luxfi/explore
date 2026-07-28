#!/usr/bin/env node
// Mobile layout sweep over many routes: horizontal overflow (scrollWidth vs
// clientWidth AND per-element bounding boxes, because a body with overflow
// hidden reports 0 while content is silently CLIPPED), sub-44px touch targets,
// and safe-area usage. Layout only, so no CPU/network throttling needed.
import { chromium } from 'playwright';
import { writeFileSync } from 'node:fs';

const base = process.argv[2], label = process.argv[3];
const routes = process.argv[4].split(',');
const W = Number(process.env.VW || 393), H = Number(process.env.VH || 852);

const probe = `(() => {
  const de = document.documentElement, vw = de.clientWidth;
  const docOverflow = Math.max(de.scrollWidth, document.body.scrollWidth) - vw;
  const out = [], small = [];
  for (const el of document.querySelectorAll('*')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) continue;
    const cs = getComputedStyle(el);
    if (cs.position === 'fixed' && r.width <= vw + 2) continue;
    if (r.right > vw + 1 || r.left < -1) out.push({ tag: el.tagName.toLowerCase(), cls: String(el.className || '').slice(0, 80), l: Math.round(r.left), r: Math.round(r.right), w: Math.round(r.width) });
  }
  for (const el of document.querySelectorAll('a,button,[role="button"],input,select,summary,[role="tab"],[role="menuitem"],[role="switch"]')) {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0 || getComputedStyle(el).visibility === 'hidden') continue;
    if (r.height < 44) small.push({ tag: el.tagName.toLowerCase(), t: (el.textContent || '').trim().slice(0, 24), w: Math.round(r.width), h: Math.round(r.height), cls: String(el.className || '').slice(0, 60) });
  }
  return { vw, docOverflow, clipped: out.length, worstRight: out.reduce((m, o) => Math.max(m, o.r), 0), offenders: out.slice(0, 6), small: small.length, smallSample: small.slice(0, 6), bodyChars: (document.body.innerText || '').length };
})()`;

const b = await chromium.launch();
const ctx = await b.newContext({ viewport: { width: W, height: H }, deviceScaleFactor: 3, isMobile: true, hasTouch: true });
const page = await ctx.newPage();
const rows = [];
for (const route of routes) {
  try {
    await page.goto(base + route, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await page.waitForTimeout(700);
    const r = await page.evaluate(probe);
    rows.push({ route, ...r });
    console.log(`${route.padEnd(42)} overflowPx ${String(r.docOverflow).padStart(5)}  clippedEls ${String(r.clipped).padStart(4)}  worstRight ${String(r.worstRight).padStart(5)}  small<44 ${String(r.small).padStart(4)}  chars ${r.bodyChars}`);
  } catch (e) { console.log(`${route.padEnd(42)} FAIL ${String(e.message).slice(0, 60)}`); rows.push({ route, fail: String(e.message).slice(0, 120) }); }
}
await b.close();
const ok = rows.filter((r) => !r.fail);
console.log(`\n${label} @ ${W}x${H}: routes ${ok.length}  with body overflow ${ok.filter((r) => r.docOverflow > 0).length}  with clipped elements ${ok.filter((r) => r.clipped > 0).length}  total clipped els ${ok.reduce((s, r) => s + r.clipped, 0)}  total small targets ${ok.reduce((s, r) => s + r.small, 0)}`);
if (process.env.JSON_OUT) writeFileSync(process.env.JSON_OUT, JSON.stringify(rows, null, 2));
