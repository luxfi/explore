import React from 'react';
import xss from 'xss';

import type { SearchResultItem } from 'types/client/search';
import type { AddressFormat } from 'types/views/address';

import { route } from 'nextjs-routes';

import { toBech32Address } from 'lib/address/bech32';
import dayjs from 'lib/date/dayjs';
import highlightText from 'lib/highlightText';
import * as mixpanel from 'lib/mixpanel/index';
import { saveToRecentKeywords } from 'lib/recentSearchKeywords';
import { useColorMode } from 'toolkit/chakra/color-mode';
import { Image } from '@luxfi/ui/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tag } from '@luxfi/ui/tag';
import { SECOND } from 'toolkit/utils/consts';
import { ADDRESS_REGEXP } from 'toolkit/utils/regexp';
import ContractCertifiedLabel from 'ui/shared/ContractCertifiedLabel';
import * as AddressEntity from 'ui/shared/entities/address/AddressEntity';
import * as BlobEntity from 'ui/shared/entities/blob/BlobEntity';
import * as BlockEntity from 'ui/shared/entities/block/BlockEntity';
import * as EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import * as OperationEntity from 'ui/shared/entities/operation/OperationEntity';
import * as TokenEntity from 'ui/shared/entities/token/TokenEntity';
import * as TxEntity from 'ui/shared/entities/tx/TxEntity';
import * as UserOpEntity from 'ui/shared/entities/userOp/UserOpEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import type { SearchResultAppItem } from 'ui/shared/search/utils';
import { getItemCategory, searchItemTitles } from 'ui/shared/search/utils';
import TacOperationStatus from 'ui/shared/statusTag/TacOperationStatus';
import Time from 'ui/shared/time/Time';

import SearchResultEntityTag from './SearchResultEntityTag';

interface Props {
  data: SearchResultItem | SearchResultAppItem;
  searchTerm: string;
  isLoading?: boolean;
  addressFormat?: AddressFormat;
}

const SearchResultListItem = ({ data, searchTerm, isLoading, addressFormat }: Props) => {

  const handleLinkClick = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
    saveToRecentKeywords(searchTerm);
    mixpanel.logEvent(mixpanel.EventTypes.SEARCH_QUERY, {
      'Search query': searchTerm,
      'Source page type': 'Search results',
      'Result URL': e.currentTarget.href,
    });
  }, [ searchTerm ]);

  const { colorMode } = useColorMode();

  const firstRow = (() => {
    switch (data.type) {
      case 'token': {
        const name = data.name + (data.symbol ? ` (${ data.symbol })` : '');

        return (
          <div className="flex items-center overflow-hidden">
            <TokenEntity.Icon token={{ ...data, type: data.token_type }} isLoading={ isLoading }/>
            <Link
              href={ route({ pathname: '/token/[hash]', query: { hash: data.address_hash } }) }
              className="font-bold break-all overflow-hidden"
              loading={ isLoading }
              onClick={ handleLinkClick }
            >
              <Skeleton
                loading={ isLoading }
                dangerouslySetInnerHTML={{ __html: highlightText(name, searchTerm) }}
                whiteSpace="nowrap"
                overflow="hidden"
                textOverflow="ellipsis" />
            </Link>
            { data.certified && <ContractCertifiedLabel iconSize={ 4 } className="ml-1"/> }
            { data.is_verified_via_admin_panel && !data.certified && <IconSvg name="certified" className="w-4 h-4 ml-1 text-green-500"/> }
            { data.reputation && <TokenEntity.Reputation value={ data.reputation }/> }
          </div>
        );
      }

      case 'metadata_tag':
      case 'contract':
      case 'address': {
        const shouldHighlightHash = ADDRESS_REGEXP.test(searchTerm);
        const hash = addressFormat === 'bech32' ? toBech32Address(data.address_hash) : data.address_hash;

        const address = {
          hash: data.address_hash,
          filecoin: {
            robust: data.filecoin_robust_address,
          },
          is_contract: data.type === 'contract' || data.is_smart_contract_address,
          is_verified: data.is_smart_contract_verified,
          name: null,
          implementations: null,
          ens_domain_name: null,
        };

        return (
          <AddressEntity.Container>
            <AddressEntity.Icon address={ address }/>
            <AddressEntity.Link
              address={ address }
              onClick={ handleLinkClick }
            >
              <AddressEntity.Content
                asProp={ shouldHighlightHash ? 'mark' : 'span' }
                address={{ ...address, hash }}
                className="text-sm font-bold"
              />
            </AddressEntity.Link>
            <AddressEntity.Copy address={{ ...address, hash }}/>
          </AddressEntity.Container>
        );
      }

      case 'label': {
        return (
          <div className="flex items-center">
            <IconSvg name="publictags" className="w-6 h-6 mr-2 text-[var(--color-icon-primary)]"/>
            <Link
              href={ route({ pathname: '/address/[hash]', query: { hash: data.address_hash } }) }
              className="font-bold break-all"
              loading={ isLoading }
              onClick={ handleLinkClick }
            >
              <span dangerouslySetInnerHTML={{ __html: highlightText(data.name, searchTerm) }}/>
            </Link>
          </div>
        );
      }

      case 'app': {
        const title = <span dangerouslySetInnerHTML={{ __html: highlightText(data.app.title, searchTerm) }}/>;
        return (
          <div className="flex items-center">
            <Image
              borderRadius="base"
              boxSize={ 6 }
              mr={ 2 }
              src={ colorMode === 'dark' && data.app.logoDarkMode ? data.app.logoDarkMode : data.app.logo }
              alt={ `${ data.app.title } app icon` }
            />
            <Link
              href={ data.app.external ?
                route({ pathname: '/apps', query: { selectedAppId: data.app.id } }) :
                route({ pathname: '/apps/[id]', query: { id: data.app.id } })
              }
              className="font-bold break-all"
              loading={ isLoading }
              onClick={ handleLinkClick }
            >
              { title }
            </Link>
          </div>
        );
      }

      case 'block': {
        const shouldHighlightHash = data.block_hash.toLowerCase() === searchTerm.toLowerCase();
        const isFutureBlock = data.timestamp === undefined;
        const href = isFutureBlock ?
          route({ pathname: '/block/countdown/[height]', query: { height: String(data.block_number) } }) :
          route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: data.block_hash ?? String(data.block_number) } });

        return (
          <BlockEntity.Container>
            <BlockEntity.Icon isLoading={ isLoading }/>
            <BlockEntity.Link
              href={ href }
              onClick={ handleLinkClick }
              isLoading={ isLoading }
            >
              <BlockEntity.Content
                asProp={ shouldHighlightHash ? 'span' : 'mark' }
                number={ Number(data.block_number) }
                className="text-sm font-bold"
                isLoading={ isLoading }
              />
            </BlockEntity.Link>
            { data.block_type === 'reorg' && !isLoading && <Tag className="ml-2">Reorg</Tag> }
            { data.block_type === 'uncle' && !isLoading && <Tag className="ml-2">Uncle</Tag> }
          </BlockEntity.Container>
        );
      }

      case 'transaction': {
        return (
          <TxEntity.Container>
            <TxEntity.Icon/>
            <TxEntity.Link
              isLoading={ isLoading }
              hash={ data.transaction_hash }
              onClick={ handleLinkClick }
            >
              <TxEntity.Content
                asProp="mark"
                hash={ data.transaction_hash }
                className="text-sm font-bold"
              />
            </TxEntity.Link>
          </TxEntity.Container>
        );
      }

      case 'zetaChainCCTX': {
        return (
          <TxEntity.Container>
            <IconSvg name="interop" className="w-5 h-5 mr-1 text-[var(--color-text-secondary)]"/>
            <TxEntity.Link
              isLoading={ isLoading }
              hash={ data.cctx.index }
              href={ route({ pathname: '/cc/tx/[hash]', query: { hash: data.cctx.index } }) }
              onClick={ handleLinkClick }
            >
              <TxEntity.Content
                asProp={ data.cctx.index === searchTerm ? 'mark' : 'span' }
                hash={ data.cctx.index }
                className="text-sm font-bold"
              />
            </TxEntity.Link>
          </TxEntity.Container>
        );
      }

      case 'tac_operation': {
        return (
          <OperationEntity.Container>
            <OperationEntity.Icon type={ data.tac_operation.type }/>
            <OperationEntity.Link
              isLoading={ isLoading }
              id={ data.tac_operation.operation_id }
              onClick={ handleLinkClick }
            >
              <OperationEntity.Content
                asProp="mark"
                id={ data.tac_operation.operation_id }
                className="text-sm font-bold mr-2"
              />
            </OperationEntity.Link>
            <TacOperationStatus status={ data.tac_operation.type }/>
          </OperationEntity.Container>
        );
      }

      case 'blob': {
        return (
          <BlobEntity.Container>
            <BlobEntity.Icon/>
            <BlobEntity.Link
              isLoading={ isLoading }
              hash={ data.blob_hash }
              onClick={ handleLinkClick }
            >
              <BlobEntity.Content
                asProp="mark"
                hash={ data.blob_hash }
                className="text-sm font-bold"
              />
            </BlobEntity.Link>
          </BlobEntity.Container>
        );
      }

      case 'user_operation': {
        return (
          <UserOpEntity.Container>
            <UserOpEntity.Icon/>
            <UserOpEntity.Link
              isLoading={ isLoading }
              hash={ data.user_operation_hash }
              onClick={ handleLinkClick }
            >
              <UserOpEntity.Content
                asProp="mark"
                hash={ data.user_operation_hash }
                className="text-sm font-bold"
              />
            </UserOpEntity.Link>
          </UserOpEntity.Container>
        );
      }

      case 'ens_domain': {
        return (
          <EnsEntity.Container>
            <EnsEntity.Icon protocol={ data.ens_info.protocol }/>
            <Link
              href={ data.address_hash ?
                route({ pathname: '/address/[hash]', query: { hash: data.address_hash } }) :
                route({ pathname: '/name-services/domains/[name]', query: { name: data.ens_info.name } })
              }
              className="font-bold break-all overflow-hidden"
              loading={ isLoading }
              onClick={ handleLinkClick }
            >
              <div
                dangerouslySetInnerHTML={{ __html: highlightText(data.ens_info.name, searchTerm) }}
                className="whitespace-nowrap overflow-hidden text-ellipsis"
              />
            </Link>
          </EnsEntity.Container>
        );
      }
    }
  })();

  const secondRow = (() => {
    switch (data.type) {
      case 'token': {
        const templateCols = `1fr
        ${ (data.token_type === 'ERC-20' && data.exchange_rate) || (data.token_type !== 'ERC-20' && data.total_supply) ? ' auto' : '' }`;
        const hash = data.filecoin_robust_address || (addressFormat === 'bech32' ? toBech32Address(data.address_hash) : data.address_hash);

        return (
          <div className="grid items-center gap-2" style={{ gridTemplateColumns: templateCols }}>
            <Skeleton loading={ isLoading } overflow="hidden" display="flex" alignItems="center">
              <span className="whitespace-nowrap overflow-hidden">
                <HashStringShortenDynamic hash={ hash } noTooltip/>
              </span>
              { data.is_smart_contract_verified && <IconSvg name="status/success" className="w-[14px] h-[14px] text-green-500 ml-1 shrink-0"/> }
            </Skeleton>
            <Skeleton loading={ isLoading } overflow="hidden" whiteSpace="nowrap" textOverflow="ellipsis" fontWeight={ 700 }>
              { data.token_type === 'ERC-20' && data.exchange_rate && `$${ Number(data.exchange_rate).toLocaleString() }` }
              { data.token_type !== 'ERC-20' && data.total_supply && `Items ${ Number(data.total_supply).toLocaleString() }` }
            </Skeleton>
          </div>
        );
      }
      case 'block': {
        const shouldHighlightHash = data.block_hash.toLowerCase() === searchTerm.toLowerCase();
        const isFutureBlock = data.timestamp === undefined;

        if (isFutureBlock) {
          return <Skeleton loading={ isLoading }>Learn estimated time for this block to be created.</Skeleton>;
        }

        return (
          <>
            <Skeleton loading={ isLoading } display="block" whiteSpace="nowrap" overflow="hidden" mb={ 1 }>
              <HashStringShortenDynamic hash={ data.block_hash } as={ shouldHighlightHash ? 'mark' : 'span' }/>
            </Skeleton>
            <Skeleton loading={ isLoading } color="text.secondary" mr={ 2 }>
              <Time timestamp={ data.timestamp } format="lll_s"/>
            </Skeleton>
          </>
        );
      }
      case 'transaction': {
        return (
          <Time timestamp={ data.timestamp } color="text.secondary" format="lll_s"/>
        );
      }
      case 'zetaChainCCTX': {
        return (
          <Time timestamp={ Number(data.cctx.last_update_timestamp) * SECOND } color="text.secondary" format="lll_s"/>
        );
      }
      case 'tac_operation': {
        return (
          <Time timestamp={ data.tac_operation.timestamp } color="text.secondary" format="lll_s"/>
        );
      }
      case 'user_operation': {

        return (
          <Time timestamp={ data.timestamp } color="text.secondary" format="lll_s"/>
        );
      }
      case 'label': {
        const hash = data.filecoin_robust_address || (addressFormat === 'bech32' ? toBech32Address(data.address_hash) : data.address_hash);

        return (
          <div className="flex items-center">
            <div className="overflow-hidden">
              <HashStringShortenDynamic hash={ hash }/>
            </div>
            { data.is_smart_contract_verified && <IconSvg name="status/success" className="w-[14px] h-[14px] text-green-500 ml-1 shrink-0"/> }
          </div>
        );
      }
      case 'app': {
        return (
          <p className="line-clamp-3">
            { data.app.description }
          </p>
        );
      }
      case 'metadata_tag':
      case 'contract':
      case 'address': {
        const shouldHighlightHash = ADDRESS_REGEXP.test(searchTerm);
        const addressName = data.name || data.ens_info?.name;
        const expiresText = data.ens_info?.expiry_date ? ` (expires ${ dayjs(data.ens_info.expiry_date).fromNow() })` : '';

        return (addressName || data.type === 'metadata_tag') ? (
          <div className="flex items-center gap-2 justify-between flex-wrap">
            { addressName && (
              <div className="flex items-center">
                <span className="overflow-hidden whitespace-nowrap text-ellipsis">
                  <span dangerouslySetInnerHTML={{ __html: shouldHighlightHash ? xss(addressName) : highlightText(addressName, searchTerm) }}/>
                  { data.ens_info && (
                    data.ens_info.names_count > 1 ?
                      <span className="text-[var(--color-text-secondary)]"> ({ data.ens_info.names_count > 39 ? '40+' : `+${ data.ens_info.names_count - 1 }` })</span> :
                      <span className="text-[var(--color-text-secondary)]">{ expiresText }</span>
                  ) }
                </span>
                { data.certified && <ContractCertifiedLabel iconSize={ 4 } className="ml-1"/> }
              </div>
            ) }
            { data.type === 'metadata_tag' && (
              <SearchResultEntityTag metadata={ data.metadata } addressHash={ data.address_hash } searchTerm={ searchTerm }/>
            ) }
          </div>
        ) :
          null;
      }
      case 'ens_domain': {
        const expiresText = data.ens_info?.expiry_date ? ` expires ${ dayjs(data.ens_info.expiry_date).fromNow() }` : '';
        const hash = data.filecoin_robust_address || (addressFormat === 'bech32' && data.address_hash ? toBech32Address(data.address_hash) : data.address_hash);

        return (
          <div className="flex items-center gap-3">
            { hash && (
              <div className="overflow-hidden">
                <HashStringShortenDynamic hash={ hash }/>
              </div>
            ) }
            {
              data.ens_info.names_count > 1 ?
                <span className="text-[var(--color-text-secondary)]"> ({ data.ens_info.names_count > 39 ? '40+' : `+${ data.ens_info.names_count - 1 }` })</span> :
                <span className="text-[var(--color-text-secondary)]">{ expiresText }</span>
            }
          </div>
        );
      }

      default:
        return null;
    }
  })();

  const category = getItemCategory(data);

  return (
    <ListItemMobile className="py-3 text-sm gap-y-2">
      <div className="grid w-full overflow-hidden" style={{ gridTemplateColumns: '1fr auto' }}>
        { firstRow }
        <Skeleton loading={ isLoading } color="text.secondary" ml={ 8 } textTransform="capitalize">
          <span>{ category ? searchItemTitles[category].itemTitleShort : '' }</span>
        </Skeleton>
      </div>
      { Boolean(secondRow) && (
        <div className={ `w-full overflow-hidden ${ data.type !== 'app' ? 'whitespace-nowrap' : '' }` }>
          { secondRow }
        </div>
      ) }
    </ListItemMobile>
  );
};

export default SearchResultListItem;
