import type { UseQueryResult } from '@tanstack/react-query';
import React from 'react';

import type { Address } from 'types/api/address';
import type { TokenInfo, TokenVerifiedInfo as TTokenVerifiedInfo } from 'types/api/token';
import type { EntityTag } from 'ui/shared/EntityTags/types';

import config from 'configs/app';
import useAddressMetadataInfoQuery from 'lib/address/useAddressMetadataInfoQuery';
import type { ResourceError } from 'lib/api/resources';
import { useMultichainContext } from 'lib/contexts/multichain';
import { getTokenTypeName } from 'lib/token/tokenTypes';
import { Tooltip } from '@luxfi/ui/tooltip';
import AddressAlerts from 'ui/address/details/AddressAlerts';
import AddressQrCode from 'ui/address/details/AddressQrCode';
import AccountActionsMenu from 'ui/shared/AccountActionsMenu/AccountActionsMenu';
import AddressAddToWallet from 'ui/shared/address/AddressAddToWallet';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import EntityTags from 'ui/shared/EntityTags/EntityTags';
import formatUserTags from 'ui/shared/EntityTags/formatUserTags';
import sortEntityTags from 'ui/shared/EntityTags/sortEntityTags';
import IconSvg from 'ui/shared/IconSvg';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import PageTitle from 'ui/shared/Page/PageTitle';

import TokenVerifiedInfo from './TokenVerifiedInfo';

const PREDEFINED_TAG_PRIORITY = 100;

interface Props {
  tokenQuery: UseQueryResult<TokenInfo, ResourceError<unknown>>;
  addressQuery: UseQueryResult<Address, ResourceError<unknown>>;
  verifiedInfoQuery: UseQueryResult<TTokenVerifiedInfo, ResourceError<unknown>>;
  hash: string;
}

const TokenPageTitle = ({ tokenQuery, addressQuery, verifiedInfoQuery, hash }: Props) => {
  const multichainContext = useMultichainContext();
  const addressHash = !tokenQuery.isPlaceholderData ? (tokenQuery.data?.address_hash || '') : '';

  const addressesForMetadataQuery = React.useMemo(() => ([ hash ].filter(Boolean)), [ hash ]);
  const addressMetadataQuery = useAddressMetadataInfoQuery(addressesForMetadataQuery);

  const isLoading = tokenQuery.isPlaceholderData ||
    addressQuery.isPlaceholderData ||
    (config.features.verifiedTokens.isEnabled && verifiedInfoQuery.isPending);

  const tokenSymbolText = tokenQuery.data?.symbol ? ` (${ tokenQuery.data.symbol })` : '';

  const bridgedTokenTagBgColor = 'var(--color-blue-500)';
  const bridgedTokenTagTextColor = 'var(--color-white)';

  const tags: Array<EntityTag> = React.useMemo(() => {
    return [
      tokenQuery.data ? {
        slug: tokenQuery.data?.type,
        name: getTokenTypeName(tokenQuery.data.type, multichainContext?.chain?.app_config),
        tagType: 'custom' as const,
        ordinal: PREDEFINED_TAG_PRIORITY,
      } : undefined,
      config.features.bridgedTokens.isEnabled && tokenQuery.data?.is_bridged ?
        {
          slug: 'bridged',
          name: 'Bridged',
          tagType: 'custom' as const,
          ordinal: PREDEFINED_TAG_PRIORITY,
          meta: { bgColor: bridgedTokenTagBgColor, textColor: bridgedTokenTagTextColor },
        } :
        undefined,
      ...formatUserTags(addressQuery.data),
      verifiedInfoQuery.data?.projectSector ?
        { slug: verifiedInfoQuery.data.projectSector, name: verifiedInfoQuery.data.projectSector, tagType: 'custom' as const, ordinal: -30 } :
        undefined,
      ...(addressMetadataQuery.data?.addresses?.[hash.toLowerCase()]?.tags.filter(tag => tag.tagType !== 'note') || []),
    ].filter(Boolean).sort(sortEntityTags);
  }, [
    addressMetadataQuery.data?.addresses,
    addressQuery.data,
    bridgedTokenTagBgColor,
    bridgedTokenTagTextColor,
    tokenQuery.data,
    verifiedInfoQuery.data?.projectSector,
    hash,
    multichainContext?.chain?.app_config,
  ]);

  const contentAfter = (
    <>
      { tokenQuery.data && <TokenEntity.Reputation value={ tokenQuery.data.reputation }/> }
      { verifiedInfoQuery.data?.tokenAddress && (
        <Tooltip content={ `Information on this token has been verified by ${ config.chain.name }` }>
          <IconSvg name="certified" color="green.500"/>
        </Tooltip>
      ) }
      <EntityTags
        isLoading={ isLoading || (config.features.addressMetadata.isEnabled && addressMetadataQuery.isPending) }
        tags={ tags }
        addressHash={ addressQuery.data?.hash }
      />
    </>
  );

  const secondRow = (
    <div>
      { addressQuery.data && (
        <AddressEntity
          address={{ ...addressQuery.data, name: '' }}
          isLoading={ isLoading }
          variant="subheading"
          icon={ multichainContext?.chain ? {
            shield: { name: 'pie_chart', isLoading },
          } : undefined }
        />
      ) }
      { !isLoading && tokenQuery.data && <AddressAddToWallet token={ tokenQuery.data } variant="button"/> }
      { addressQuery.data && <AddressQrCode hash={ addressQuery.data.hash } isLoading={ isLoading }/> }
      <AccountActionsMenu isLoading={ isLoading }/>
      <div>
        <TokenVerifiedInfo verifiedInfoQuery={ verifiedInfoQuery }/>
        <NetworkExplorers type="token" pathParam={ addressHash }/>
      </div>
    </div>
  );

  return (
    <>
      <PageTitle
        title={ `${ tokenQuery.data?.name || 'Unnamed token' }${ tokenSymbolText }` }
        isLoading={ tokenQuery.isPlaceholderData }
        beforeTitle={ tokenQuery.data ? (
          <TokenEntity.Icon
            token={ tokenQuery.data }
            isLoading={ tokenQuery.isPlaceholderData }
            variant="heading"
            chain={ multichainContext?.chain }
          />
        ) : null }
        contentAfter={ contentAfter }
        secondRow={ secondRow }
      />
      { !addressMetadataQuery.isPending && (
        <AddressAlerts
          tags={ addressMetadataQuery.data?.addresses?.[hash.toLowerCase()]?.tags }
          isScamToken={ tokenQuery.data?.reputation === 'scam' }
        />
      ) }
    </>
  );
};

export default TokenPageTitle;
