import { describe, it, expect } from 'vitest';

import { selectRpcAddress } from './useAddressQuery';

/**
 * Regression: every never-transacted address rendered `Balance Pending`
 * forever on the live v1.1.23 build.
 *
 * The RPC was answering correctly the whole time — captured on the wire,
 * eth_getBalance returned {"result":"0x0"}. One line disagreed: `if (!balance)`
 * treats 0n as falsy, so a genuine zero was reported as an RPC failure. The
 * fallback was then discarded, AddressDetails substituted error404Data
 * (coin_balance: null), and AddressBalance's pruned-node guard fired on a
 * healthy address.
 *
 * Nothing about it looked broken: no hang, no skeleton, no error alert, zero JS
 * exceptions. Only the one field was wrong, and setRefetchEnabled(false) made it
 * permanent.
 */
const HASH = '0x0000000000000000000000000000000000000abc';

describe('selectRpcAddress', () => {
  it('maps a ZERO balance to "0", not to null', () => {
    // The whole bug in one assertion: 0n is falsy.
    const result = selectRpcAddress([ 0n ], HASH);

    expect(result).not.toBeNull();
    expect(result?.coin_balance).toBe('0');
  });

  it('maps a non-zero balance', () => {
    const result = selectRpcAddress([ 1994739890239601769114804651924n ], HASH);

    expect(result?.coin_balance).toBe('1994739890239601769114804651924');
  });

  it('returns null ONLY when the RPC could not answer', () => {
    expect(selectRpcAddress([ null ], HASH)).toBeNull();
  });

  it('carries the hash through, so the page can render an identity', () => {
    expect(selectRpcAddress([ 0n ], HASH)?.hash).toBe(HASH);
  });

  it('a zero-balance address is a normal EOA, not a contract', () => {
    const result = selectRpcAddress([ 0n ], HASH);

    expect(result?.is_contract).toBe(false);
    expect(result?.token).toBeNull();
  });
});
