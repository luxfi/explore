// @vitest-environment jsdom

import useApiQuery from 'lib/api/useApiQuery';
import type { Mock } from 'vitest';
import { describe, it, expect, vi } from 'vitest';
import { renderHook } from 'vitest/lib';

import useQuickSearchQuery from './useQuickSearchQuery';

vi.mock('lib/api/useApiQuery', () => ({ 'default': vi.fn(() => ({ data: undefined })) }));
vi.mock('lib/hooks/useDebounce', () => ({ 'default': (value: unknown) => value }));

const mockUseApiQuery = useApiQuery as Mock<typeof useApiQuery>;

// Recorded verbatim from https://api-explore.lux.network/search/quick?q=1 (HTTP 200).
const PRODUCTION_PAYLOAD = {
  items: [ { block_number: 1, type: 'block' } ],
  next_page_params: null,
};

function getQuickSearchSelect() {
  renderHook(() => useQuickSearchQuery());

  const call = mockUseApiQuery.mock.calls.find(([ resource ]) => resource === 'general:quick_search');
  expect(call).toBeDefined();

  // the response has to be settled into an array here, at the API boundary —
  // every consumer downstream iterates it
  const select = call?.[1]?.queryOptions?.select;
  expect(select).toBeInstanceOf(Function);

  return select as (data: unknown) => unknown;
}

describe('useQuickSearchQuery', () => {
  it('hands consumers an array when the backend returns the paginated envelope', () => {
    // Before the fix the envelope reached SearchBarSuggest untouched and
    // `query.data?.forEach(...)` threw, blanking the whole explorer.
    expect(getQuickSearchSelect()(PRODUCTION_PAYLOAD)).toEqual([ { block_number: 1, type: 'block' } ]);
  });

  it('hands consumers an array when the backend returns a bare list', () => {
    const items = [ { type: 'block' } ];
    expect(getQuickSearchSelect()(items)).toEqual(items);
  });

  it('degrades to an empty list instead of crashing on an error body', () => {
    const select = getQuickSearchSelect();
    for (const payload of [ null, undefined, 'Too Many Requests', { message: 'nope' } ]) {
      expect(select(payload)).toEqual([]);
    }
  });
});
