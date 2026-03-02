import { useRouter } from 'next/router';
import React from 'react';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getPoolLinks from 'lib/pools/getPoolLinks';
import { getPoolTitle } from 'lib/pools/getPoolTitle';
import getQueryParamString from 'lib/router/getQueryParamString';
import * as addressStubs from 'stubs/address';
import { POOL } from 'stubs/pools';
import { Image } from '@luxfi/ui/image';
import { Link } from 'toolkit/next/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tag } from '@luxfi/ui/tag';
import PoolInfo from 'ui/pool/PoolInfo';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as PoolEntity from 'ui/shared/entities/pool/PoolEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import InfoButton from 'ui/shared/InfoButton';
import PageTitle from 'ui/shared/Page/PageTitle';
import VerifyWith from 'ui/shared/VerifyWith';

const Pool = () => {
  const router = useRouter();
  const hash = getQueryParamString(router.query.hash);

  const { data, isPlaceholderData, isError, error } = useApiQuery('contractInfo:pool', {
    pathParams: { hash, chainId: config.chain.id },
    queryOptions: {
      placeholderData: POOL,
      refetchOnMount: false,
    },
  });

  const addressQuery = useApiQuery('general:address', {
    pathParams: { hash: data?.pool_id },
    queryOptions: {
      enabled: Boolean(data?.is_contract),
      placeholderData: addressStubs.ADDRESS_INFO,
    },
  });

  const content = (() => {
    if (isError) {
      if (isCustomAppError(error)) {
        throwOnResourceLoadError({ resource: 'contractInfo:pool', error, isError: true });
      }

      return <DataFetchAlert/>;
    }

    if (!data) {
      return null;
    }

    return (
      <PoolInfo
        data={ data }
        isPlaceholderData={ isPlaceholderData }
      />
    );
  })();

  const externalLinks = getPoolLinks(data);
  const hasLinks = externalLinks.length > 0;

  const externalLinksComponents = React.useMemo(() => {
    return externalLinks
      .map((link) => {
        return (
          <Link external key={ link.url } href={ link.url } className="h-[34px] items-center inline-flex min-w-[120px]">
            <Image boxSize={ 5 } mr={ 2 } src={ link.image } alt={ `${ link.title } icon` }/>
            { link.title }
          </Link>
        );
      });
  }, [ externalLinks ]);

  const poolIdOrContract = React.useMemo(() => {
    if (data?.is_contract && addressQuery.data) {
      return <AddressEntity address={ addressQuery.data } isLoading={ addressQuery.isPlaceholderData }/>;
    } else if (data?.pool_id) {
      return (
        <Skeleton loading={ isPlaceholderData } display="flex" alignItems="center" className="overflow-hidden">
          <div className="overflow-hidden">
            <HashStringShortenDynamic hash={ data?.pool_id }/>
          </div>
          <CopyToClipboard text={ data?.pool_id }/>
        </Skeleton>
      );
    }

    return null;
  }, [ data, isPlaceholderData, addressQuery.isPlaceholderData, addressQuery.data ]);

  const titleSecondRow = (
    <div className="flex items-center justify-between w-full">
      { poolIdOrContract }
      <div className="flex ml-2 gap-2">
        <InfoButton>
          { `This Liquidity Provider (LP) token represents ${ data?.base_token_symbol }/${ data?.quote_token_symbol } pairing.` }
        </InfoButton>
        { hasLinks && (
          <VerifyWith
            links={ externalLinksComponents }
            label="Verify with"
            longText="View in"
            shortText=""
          />
        ) }
      </div>
    </div>
  );

  const poolTitle = data ? getPoolTitle(data) : '';

  return (
    <>
      <PageTitle
        title={ poolTitle }
        beforeTitle={ data ? (
          <PoolEntity.Icon
            pool={ data }
            isLoading={ isPlaceholderData }
            variant="heading"
          />
        ) : null }
        contentAfter={ <Skeleton loading={ isPlaceholderData }><Tag>Pool</Tag></Skeleton> }
        secondRow={ titleSecondRow }
        isLoading={ isPlaceholderData }
        withTextAd
      />
      { content }
    </>
  );
};

export default Pool;
