import config from 'configs/app';

const currencySymbol = config.chain.currency.symbol || 'LUX';

/**
 * Replaces occurrences of "ETH" (as a whole word) with the chain's native
 * currency symbol.  The stats API returns hardcoded "ETH" in titles,
 * descriptions, and counter units.
 */
export default function replaceNativeCoinName(text: string): string {
  if (currencySymbol === 'ETH') {
    return text;
  }

  return text.replace(/\bETH\b/g, currencySymbol);
}
