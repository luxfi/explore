// Formatting helpers for Lux P-chain validator data.

const LUX_DECIMALS = 6;
const TRUNCATE_PREFIX_LEN = 12;
const TRUNCATE_SUFFIX_LEN = 6;
const UPTIME_FRACTION_DIGITS = 2;
const STAKE_FRACTION_DIGITS = 2;

export function formatStake(nanoLux: bigint | string): string {
  const raw = typeof nanoLux === 'string' ? nanoLux : String(nanoLux);
  const lux = Number(BigInt(raw)) / Math.pow(10, LUX_DECIMALS);
  return lux.toLocaleString(undefined, { maximumFractionDigits: STAKE_FRACTION_DIGITS });
}

export function formatUptime(uptime: string): string {
  // uptime is already in percentage format (0–100), no scaling needed
  return `${ parseFloat(uptime).toFixed(UPTIME_FRACTION_DIGITS) }%`;
}

export function truncateNodeId(nodeId: string): string {
  const minLength = TRUNCATE_PREFIX_LEN + TRUNCATE_SUFFIX_LEN + 3;
  if (nodeId.length <= minLength) {
    return nodeId;
  }
  return `${ nodeId.slice(0, TRUNCATE_PREFIX_LEN) }...${ nodeId.slice(-TRUNCATE_SUFFIX_LEN) }`;
}
