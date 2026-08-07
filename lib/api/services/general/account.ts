import type { ApiResource } from '../../types';
import type { AddressTagsResponse, ApiKeys, CustomAbis, TransactionTagsResponse, UserInfo, WatchlistResponse } from 'types/api/account';

export const GENERAL_API_ACCOUNT_RESOURCES = {
  // ACCOUNT
  user_info: {
    path: '/account/user/info',
  },
  custom_abi: {
    path: '/account/user/custom_abis{/:id}',
    pathParams: [ 'id' as const ],
  },
  watchlist: {
    path: '/account/user/watchlist{/:id}',
    pathParams: [ 'id' as const ],
    filterFields: [ ],
    paginated: true,
  },
  private_tags_address: {
    path: '/account/user/tags/address{/:id}',
    pathParams: [ 'id' as const ],
    filterFields: [ ],
    paginated: true,
  },
  private_tags_tx: {
    path: '/account/user/tags/transaction{/:id}',
    pathParams: [ 'id' as const ],
    filterFields: [ ],
    paginated: true,
  },
  api_keys: {
    path: '/account/user/api_keys{/:id}',
    pathParams: [ 'id' as const ],
  },
} satisfies Record<string, ApiResource>;

export type GeneralApiAccountResourceName = `general:${ keyof typeof GENERAL_API_ACCOUNT_RESOURCES }`;

/* eslint-disable @stylistic/indent */
export type GeneralApiAccountResourcePayload<R extends GeneralApiAccountResourceName> =
R extends 'general:user_info' ? UserInfo :
R extends 'general:custom_abi' ? CustomAbis :
R extends 'general:private_tags_address' ? AddressTagsResponse :
R extends 'general:private_tags_tx' ? TransactionTagsResponse :
R extends 'general:api_keys' ? ApiKeys :
R extends 'general:watchlist' ? WatchlistResponse :
never;
/* eslint-enable @stylistic/indent */
