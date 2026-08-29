import type { AddressParam } from './addressParams';

// The list endpoints carry a projection of an address, not the full record:
// tags, names and implementations are resolved per-address and are simply
// absent here. Partial says so, which is what forces the read sites to reach
// for them optionally instead of assuming a null.
export type AddressesItem = Partial<AddressParam> & {
  hash: string;
  transactions_count: string;
  coin_balance: string | null;
};

export type AddressesResponse = {
  items: Array<AddressesItem>;
  next_page_params: {
    fetched_coin_balance: string;
    hash: string;
    items_count: number;
  } | null;
  total_supply?: string;
};

export interface AddressesMetadataSearchResult {
  items: Array<AddressesItem>;
  next_page_params: null;
}

export interface AddressesMetadataSearchFilters {
  slug: string;
  tag_type: string;
}
