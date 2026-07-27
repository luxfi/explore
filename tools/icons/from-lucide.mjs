#!/usr/bin/env node
//
// The explorer's UI glyphs come from ONE set: Lucide, as @hanzo/gui ships it in
// `@hanzogui/lucide-icons-2`. Nothing here draws an icon — this reads that
// package's geometry and writes it out as plain SVG, so the sprite that
// `<IconSvg name="..."/>` renders is a build artifact of the standard set
// rather than a second, hand-drawn one.
//
// Everything the map does not cover is left alone on purpose: brand marks
// (`brands/`, `social/`, `wallets/`), chain/token art (`coins/`, `tokens/`,
// `networks/`), error-page illustrations and the Lux-specific domain marks
// (ABI, ENS, MUD, RPC, merits) are logos and illustrations, not UI glyphs.
//
//   pnpm icons:sync   # rewrite ./icons from the set, then rebuild the sprite
//
import { createRequire } from 'node:module';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const require_ = createRequire(import.meta.url);
const ICONS_DIR = resolve(import.meta.dirname, '../../icons');
const SET_DIR = join(dirname(require_.resolve('@hanzogui/lucide-icons-2/package.json')), 'dist/esm/icons');

// explorer glyph name -> Lucide name (+ `fill` for the filled half of a
// filled/outline pair; Lucide is one outline drawing, filled or not).
const MAP = {
  // --- root ---------------------------------------------------------------
  'advanced-filter': 'SlidersHorizontal',
  apps: 'LayoutGrid',
  apps_list: 'List',
  block: 'Box',
  block_countdown: 'Timer',
  burger: 'Menu',
  certified: 'BadgeCheck',
  check: 'Check',
  checkered_flag: 'Flag',
  clock: 'Clock',
  'clock-light': 'Clock',
  close: 'X',
  clusters: 'Network',
  collection: 'Layers',
  columns: 'Columns3',
  copy: 'Copy',
  copy_check: 'CopyCheck',
  cross: 'X',
  delete: 'Trash2',
  docs: 'BookOpen',
  dots: 'Ellipsis',
  edit: 'Pencil',
  email: 'Mail',
  explorer: 'Compass',
  filter: 'ListFilter',
  flame: 'Flame',
  flashblock: 'Zap',
  gas: 'Fuel',
  gas_xl: 'Fuel',
  gear: 'Settings',
  globe: 'Globe',
  heart_filled: { icon: 'Heart', fill: true },
  heart_outline: 'Heart',
  hexagon: 'Hexagon',
  hourglass: 'Hourglass',
  info: 'Info',
  // Filling Info would bury the "i" under the disc — Lucide draws one info mark,
  // and the hover state is a colour change, not a second drawing.
  info_filled: 'Info',
  interop: 'ArrowLeftRight',
  key: 'Key',
  lightning: 'Zap',
  lightning_navbar: 'Zap',
  link: 'Link',
  link_external: 'ExternalLink',
  list_view: 'List',
  lock: 'Lock',
  minus: 'Minus',
  moon: 'Moon',
  'moon-with-star': 'MoonStar',
  multisend: 'Send',
  networks: 'Network',
  nft_shield: 'ShieldCheck',
  'open-link': 'ExternalLink',
  operation: 'Activity',
  payment_link: 'CreditCard',
  pie_chart: 'ChartPie',
  plus: 'Plus',
  private_tags: 'Tags',
  profile: 'User',
  publictags: 'Tag',
  qr_code: 'QrCode',
  refresh: 'RefreshCw',
  repeat: 'Repeat',
  return: 'CornerDownLeft',
  revoke: 'Ban',
  rocket: 'Rocket',
  rocket_xl: 'Rocket',
  scam: 'TriangleAlert',
  scope: 'Crosshair',
  search: 'Search',
  share: 'Share2',
  sign_out: 'LogOut',
  star_filled: { icon: 'Star', fill: true },
  star_outline: 'Star',
  sun: 'Sun',
  swap: 'ArrowRightLeft',
  tokens: 'Coins',
  transactions: 'ArrowRightLeft',
  txn_batches: 'Layers',
  user_op: 'UserCog',
  verified: 'BadgeCheck',
  wallet: 'Wallet',

  // --- arrows -------------------------------------------------------------
  'arrows/down-right': 'ArrowDownRight',
  'arrows/east': 'ArrowRight',
  'arrows/east-mini': 'ChevronRight',
  'arrows/up-down': 'ChevronsUpDown',
  'arrows/up-head': 'ChevronUp',

  // --- status -------------------------------------------------------------
  'status/error': 'CircleX',
  'status/pending': 'LoaderCircle',
  'status/success': 'CircleCheck',
  'status/warning': 'TriangleAlert',
  'verification-steps/error': 'CircleX',
  'verification-steps/finalized': 'CircleCheck',
  'verification-steps/unfinalized': 'CircleDashed',

  // --- contracts ----------------------------------------------------------
  'contracts/proxy': 'FileCode2',
  'contracts/regular': 'FileCode',
  'contracts/regular_many': 'Files',
  'contracts/verified': 'FileCheck',
  'contracts/verified_many': 'FileCheck2',

  // --- navigation ---------------------------------------------------------
  'navigation/api_docs': 'BookOpen',
  'navigation/api_keys': 'KeyRound',
  'navigation/apps': 'LayoutGrid',
  'navigation/block': 'Box',
  'navigation/blockchain': 'Blocks',
  'navigation/chain_stats': 'ChartColumn',
  'navigation/cross_chain_txs': 'ArrowLeftRight',
  'navigation/custom_abi': 'FileJson',
  'navigation/deposits': 'ArrowDownToLine',
  'navigation/dex_tracker': 'CandlestickChart',
  'navigation/ecosystems': 'Boxes',
  'navigation/games': 'Gamepad2',
  'navigation/gas_tracker': 'Fuel',
  'navigation/hot_contracts': 'Flame',
  'navigation/hourglass': 'Hourglass',
  'navigation/internal_txns': 'GitBranch',
  'navigation/mud': 'Grid3x3',
  'navigation/name_services': 'Globe',
  'navigation/operation': 'Activity',
  'navigation/other': 'Ellipsis',
  'navigation/output_roots': 'GitCommitHorizontal',
  'navigation/private_tags': 'Tags',
  'navigation/public_tags': 'Tag',
  'navigation/stats': 'ChartLine',
  'navigation/token_transfers': 'ArrowRightLeft',
  'navigation/tokens': 'Coins',
  'navigation/top_accounts': 'Trophy',
  'navigation/transactions': 'ArrowLeftRight',
  'navigation/txn_batches': 'Layers',
  'navigation/uptime': 'Signal',
  'navigation/user_op': 'UserCog',
  'navigation/validator': 'ShieldCheck',
  'navigation/verified_contracts': 'FileCheck',
  'navigation/watchlist': 'Star',
  'navigation/withdrawals': 'ArrowUpFromLine',
};

/**
 * Turn one `dist/esm/icons/<Name>.mjs` into an SVG body.
 *
 * The file is one `jsx(Svg, { …, children: jsx(Path, {…}) })` tree, so the prop
 * objects nest — a `[^}]*` match would swallow the first child. Each `{` is
 * scanned to its balanced `}` instead. `stroke: color` is the themed default and
 * is expressed once on the root element as `stroke="currentColor"`.
 */
function body(name) {
  const src = readFileSync(join(SET_DIR, `${ name }.mjs`), 'utf8');
  const out = [];
  const call = /jsx[s]?\((_?[A-Z][A-Za-z]*), \{/g;
  for (let m = call.exec(src); m; m = call.exec(src)) {
    let depth = 1;
    let i = call.lastIndex;
    for (; depth > 0 && i < src.length; i++) {
      if (src[i] === '{') depth++;
      else if (src[i] === '}') depth--;
    }
    if (m[1] === 'Svg') continue;
    const attrs = [ ...src.slice(call.lastIndex, i - 1).matchAll(/(\w+): "([^"]*)"/g) ]
      .filter(([ , k ]) => k !== 'stroke')
      .map(([ , k, v ]) => `${ k.replace(/[A-Z]/g, (c) => `-${ c.toLowerCase() }`) }="${ v }"`);
    out.push(`  <${ m[1].replace(/^_/, '').toLowerCase() } ${ attrs.join(' ') }/>`);
  }
  if (!out.length) throw new Error(`no geometry parsed out of ${ name }`);
  return out.join('\n');
}

const written = [];
for (const [ target, spec ] of Object.entries(MAP)) {
  const { icon, fill } = typeof spec === 'string' ? { icon: spec } : spec;
  const file = join(ICONS_DIR, `${ target }.svg`);
  mkdirSync(dirname(file), { recursive: true });
  writeFileSync(file, [
    `<svg viewBox="0 0 24 24" fill="${ fill ? 'currentColor' : 'none' }" stroke="currentColor"`,
    ` stroke-width="2" stroke-linecap="round" stroke-linejoin="round" xmlns="http://www.w3.org/2000/svg">`,
    `\n${ body(icon) }\n</svg>\n`,
  ].join(''));
  written.push(`${ target } <- ${ icon }${ fill ? ' (filled)' : '' }`);
}

console.log(`${ written.length } glyphs written from @hanzogui/lucide-icons-2 into ./icons`);
