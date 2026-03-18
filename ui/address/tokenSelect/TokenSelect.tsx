import { useQueryClient, useIsFetching } from '@tanstack/react-query';
import { sumBy } from 'es-toolkit';
import { useRouter } from 'next/router';
import React from 'react';

import type { Address } from 'types/api/address';

import { route } from 'nextjs/routes';

import { getResourceKey } from 'lib/api/useApiQuery';
import { useMultichainContext } from 'lib/contexts/multichain';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as mixpanel from 'lib/mixpanel/index';
import getQueryParamString from 'lib/router/getQueryParamString';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

import useFetchTokens from '../utils/useFetchTokens';
import TokenSelectDesktop from './TokenSelectDesktop';
import TokenSelectMobile from './TokenSelectMobile';

const TokenSelect = () => {
  const router = useRouter();
  const isMobile = useIsMobile();
  const queryClient = useQueryClient();
  const multichainContext = useMultichainContext();

  const addressHash = getQueryParamString(router.query.hash);
  const addressResourceKey = getResourceKey('general:address', { pathParams: { hash: addressHash }, chainId: multichainContext?.chain?.id });

  const addressQueryData = queryClient.getQueryData<Address>(addressResourceKey);

  const { data, isError, isPending } = useFetchTokens({ hash: addressQueryData?.hash });
  const tokensResourceKey = getResourceKey('general:address_tokens', {
    pathParams: { hash: addressQueryData?.hash },
    queryParams: { type: 'ERC-20' },
    chainId: multichainContext?.chain?.id,
  });
  const tokensIsFetching = useIsFetching({ queryKey: tokensResourceKey });

  const handleIconButtonClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Tokens show all (icon)' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [ ]);

  if (isPending) {
    return (
      <div className="flex gap-x-3">
        <Skeleton loading={ true } h="32px" w="150px" borderRadius="base"/>
        <Skeleton loading={ true } h="32px" w="36px" borderRadius="base"/>
      </div>
    );
  }

  const hasTokens = sumBy(Object.values(data), ({ items }) => items.length) > 0;
  if (isError || !hasTokens) {
    return <div className="py-[6px]">0</div>;
  }

  return (
    <div className="flex gap-x-3 mt-1 lg:mt-0">
      { isMobile ?
        <TokenSelectMobile data={ data } isLoading={ tokensIsFetching === 1 }/> :
        <TokenSelectDesktop data={ data } isLoading={ tokensIsFetching === 1 }/>
      }
      <Tooltip content="Show all tokens">
        <Link
          href={ route({ pathname: '/address/[hash]', query: { hash: addressHash, tab: 'tokens' } }, { chain: multichainContext?.chain }) }
          scroll={ false }
        >
          <IconButton
            aria-label="Show all tokens"
            variant="icon_background"
            size="md"
            onClick={ handleIconButtonClick }
          >
            <IconSvg name="wallet"/>
          </IconButton>
        </Link>
      </Tooltip>
    </div>
  );
};

export default React.memo(TokenSelect);
