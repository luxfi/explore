import type { UseQueryResult } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import React from 'react';

import type { Address } from 'types/api/address';

import type { ResourceError } from 'lib/api/resources';
import useApiQuery from 'lib/api/useApiQuery';
import { retry } from 'lib/api/useQueryClientConfig';
import { publicClient } from 'lib/web3/client';
import { ADDRESS_INFO } from 'stubs/address';
import { GET_BALANCE } from 'stubs/RPC';
import { SECOND } from 'toolkit/utils/consts';

type RpcResponseType = [
    bigint | null,
];

export type AddressQuery = UseQueryResult<Address, ResourceError<{ status: number }>> & {
  isDegradedData: boolean;
};

interface Params {
  hash: string;
  isEnabled?: boolean;
}

const NO_RPC_FALLBACK_ERROR_CODES = [ 403 ];

/**
 * Maps the RPC fallback response to an Address, or null when the RPC could not
 * answer. Exported so the zero-balance case is testable — it shipped broken and
 * was invisible from source.
 */
export function selectRpcAddress(response: RpcResponseType, hash: string): Address | null {
  const [ balance ] = response;

  // `balance === null`, NOT `!balance`. getBalance() returns a bigint and 0n is
  // FALSY, so the truthy check threw away every genuine zero balance and
  // reported it as an RPC failure.
  //
  // The consequence was not a broken RPC path but a WRONG one: with the fallback
  // discarded, `query` reverted to the 404'd apiQuery, AddressDetails substituted
  // error404Data (coin_balance: null), and AddressBalance's pruned-node guard —
  // "coin_balance may be null while the address is known to exist, show Pending
  // instead of a misleading 0 LUX" — fired on a perfectly healthy address. Every
  // never-transacted address rendered `Balance Pending` forever, and
  // setRefetchEnabled(false) made it permanent rather than eventually-correct.
  //
  // Verified on the live v1.1.23 build: the RPC answered {"result":"0x0"}
  // correctly the whole time. Only this line disagreed. The type is already
  // `bigint | null`, so the null check is exact.
  if (balance === null) {
    return null;
  }

  return {
    hash,
    block_number_balance_updated_at: null,
    coin_balance: balance.toString(),
    creator_address_hash: null,
    creation_transaction_hash: null,
    creation_status: null,
    exchange_rate: null,
    ens_domain_name: null,
    has_logs: false,
    has_token_transfers: false,
    has_tokens: false,
    has_validated_blocks: false,
    implementations: null,
    is_contract: false,
    is_verified: false,
    name: null,
    token: null,
    watchlist_address_id: null,
    private_tags: null,
    public_tags: null,
    watchlist_names: null,
  } as Address;
}

export default function useAddressQuery({ hash, isEnabled = true }: Params): AddressQuery {
  const [ isRefetchEnabled, setRefetchEnabled ] = React.useState(false);

  const apiQuery = useApiQuery<'general:address', { status: number }>('general:address', {
    pathParams: { hash },
    queryOptions: {
      enabled: isEnabled && Boolean(hash),
      placeholderData: ADDRESS_INFO,
      refetchOnMount: false,
      retry: (failureCount, error) => {
        if (isRefetchEnabled) {
          return false;
        }

        return retry(failureCount, error);
      },
      refetchInterval: (): number | false => {
        return isRefetchEnabled ? 15 * SECOND : false;
      },
    },
  });

  const rpcQuery = useQuery<RpcResponseType, unknown, Address | null>({
    queryKey: [ 'RPC', 'address', { hash } ],
    queryFn: async() => {
      if (!publicClient) {
        throw new Error('No public RPC client');
      }

      const balance = publicClient.getBalance({ address: hash as `0x${ string }` }).catch(() => null);

      return Promise.all([
        balance,
      ]);
    },
    select: (response) => selectRpcAddress(response, hash),
    placeholderData: [ GET_BALANCE ],
    enabled: (apiQuery.isError || apiQuery.errorUpdateCount > 0) && !(apiQuery.error?.status && NO_RPC_FALLBACK_ERROR_CODES.includes(apiQuery.error?.status)),
    retry: false,
    refetchOnMount: false,
  });

  React.useEffect(() => {
    if (apiQuery.isPlaceholderData || !publicClient) {
      return;
    }

    if (apiQuery.isError && apiQuery.errorUpdateCount === 1) {
      setRefetchEnabled(true);
    } else if (!apiQuery.isError) {
      setRefetchEnabled(false);
    }
  }, [ apiQuery.errorUpdateCount, apiQuery.isError, apiQuery.isPlaceholderData, apiQuery.error?.status ]);

  React.useEffect(() => {
    if (!rpcQuery.isPlaceholderData && !rpcQuery.data) {
      setRefetchEnabled(false);
    }
  }, [ rpcQuery.data, rpcQuery.isPlaceholderData ]);

  const isRpcQuery = Boolean(

    (apiQuery.isError || apiQuery.isPlaceholderData) &&
    !(apiQuery.error?.status && NO_RPC_FALLBACK_ERROR_CODES.includes(apiQuery.error?.status)) &&
    !NO_RPC_FALLBACK_ERROR_CODES.includes(apiQuery.error?.status ?? 999) &&
    apiQuery.errorUpdateCount > 0 &&
    rpcQuery.data &&
    publicClient,
  );

  const query = isRpcQuery ? rpcQuery as UseQueryResult<Address, ResourceError<{ status: number }>> : apiQuery;

  return {
    ...query,
    isDegradedData: isRpcQuery,
  };
}
