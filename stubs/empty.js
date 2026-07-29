// The browser's answer to a Node builtin.
//
// `configs/multichain/config.nodejs.ts` reaches for `fs`/`path` behind a
// `NEXT_RUNTIME === 'nodejs'` guard, and MetaMask's SDK reaches for a React
// Native storage module. Webpack was told to answer those with nothing
// (`resolve.fallback: { fs: false }`); Turbopack has no `fallback`, so it needs
// a module to point at. This is that module — same answer, both bundlers.
module.exports = {};
