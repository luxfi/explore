import type { ApiResource } from '../../types';
import type { AddressTagsResponse, ApiKeys, CustomAbis, TransactionTagsResponse, UserInfo, WatchlistResponse } from 'types/api/account';

export const GENERAL_API_ACCOUNT_RESOURCES = {
  // ACCOUNT
  csrf: {
    path: '/account/get_csrf',
  },
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

  // AUTH
  auth_send_otp: {
    path: '/account/send_otp',
  },
  auth_confirm_otp: {
    path: '/account/confirm_otp',
  },
  auth_siwe_message: {
    path: '/account/siwe_message',
  },
  auth_siwe_verify: {
    path: '/account/authenticate_via_wallet',
  },
  auth_link_email: {
    path: '/account/email/link',
  },
  auth_link_address: {
    path: '/account/address/link',
  },
  auth_logout: {
    path: '/account/auth/logout',
  },
  auth_dynamic: {
    path: '/account/authenticate_via_dynamic',
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
