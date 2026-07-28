# perf — the two numbers a claim needs

An improvement without a before number is a claim. These two scripts produce the
before number, for any Lux surface, from a URL.

```
node tools/perf/mobile-sweep.mjs https://explore.lux.network "explore LIVE" "/,/blocks,/txs"
node tools/perf/perf.mjs        https://explore.lux.network "explore LIVE" "/,/txs"
```

`mobile-sweep` is layout only, so it needs no throttling and runs a route per
second. It reports, at an iPhone 15 Pro logical viewport (393x852, DPR 3, touch):

- **overflowPx** — `scrollWidth - clientWidth` on the document. The page scrolls
  sideways.
- **clippedEls** — elements whose box lies outside the viewport. This is the
  number that matters when `overflowPx` is 0: a body that cannot scroll does not
  mean the content fits, it means the content is *unreachable*. Read it with
  `perf.mjs`'s containment check before calling it a defect — an element inside
  an `overflow-x: auto` ancestor is scrollable, not clipped.
- **small<44** — interactive elements under 44px tall, the floor Apple and
  Google both publish.

`perf.mjs` adds 4x CPU throttling and a Slow-3G network profile over CDP and
reports LCP (with the element that won it), CLS, an INP proxy, long-task count
and total blocking time, bytes by type, and the same layout audit. Pass
`--desktop` for 1440x900. `SHOT_DIR=… ` captures a screenshot, but only when the
page has more than 200 characters of text — a screenshot of a spinner or a login
wall is worse than no screenshot.

Both take a real origin, so they measure production the same way they measure a
`next start` or a static `out/` on localhost. Compare like with like: serve
local builds through something that sends brotli, or every local LCP will look
three times worse than the CDN it is bound for.
