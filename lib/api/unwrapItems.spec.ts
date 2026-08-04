import { describe, it, expect } from 'vitest';

import unwrapItems from './unwrapItems';

// Recorded verbatim from https://api-explore.lux.network/search/quick?q=1
// (HTTP 200, application/json). Typing into the search box fed this object to
// `query.data?.forEach(...)`, which threw `forEach is not a function` and took
// the whole app down with "Oops! Something went wrong".
const PRODUCTION_PAYLOAD = {
  items: [ { block_number: 1, type: 'block' } ],
  next_page_params: null,
};

describe('unwrapItems', () => {
  it('unwraps the paginated envelope our backend returns', () => {
    expect(unwrapItems(PRODUCTION_PAYLOAD)).toEqual([ { block_number: 1, type: 'block' } ]);
  });

  it('reproduces the crash the envelope used to cause', () => {
    // what the component did before the fix
    expect(() => (PRODUCTION_PAYLOAD as unknown as Array<unknown>).forEach(() => {})).toThrow(TypeError);
    // what it does now
    expect(() => unwrapItems(PRODUCTION_PAYLOAD).forEach(() => {})).not.toThrow();
  });

  it('passes through the bare list upstream returns', () => {
    const items = [ { type: 'block' }, { type: 'token' } ];
    expect(unwrapItems(items)).toBe(items);
    expect(unwrapItems([])).toEqual([]);
  });

  it.each([
    [ 'null', null ],
    [ 'undefined', undefined ],
    [ 'an error body', { message: 'Rate limit exceeded' } ],
    [ 'a 429 text body', 'Too Many Requests' ],
    [ 'a null items field', { items: null } ],
    [ 'a non-list items field', { items: { '0': 'a' } } ],
    [ 'a number', 429 ],
  ])('yields an empty list for %s', (_label, payload) => {
    const result = unwrapItems(payload);
    expect(result).toEqual([]);
    expect(() => result.forEach(() => {})).not.toThrow();
  });
});
