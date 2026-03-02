import React from 'react';

import type { ItemsProps } from './types';
import type { SearchResultAddressOrContract, SearchResultMetadataTag } from 'types/api/search';
import type * as multichain from 'types/client/multichainAggregator';

import { toBech32Address } from 'lib/address/bech32';
import dayjs from 'lib/date/dayjs';
import highlightText from 'lib/highlightText';
import * as contract from 'lib/multichain/contract';
import { ADDRESS_REGEXP } from 'toolkit/utils/regexp';
import SearchResultEntityTag from 'ui/searchResults/SearchResultEntityTag';
import ContractCertifiedLabel from 'ui/shared/ContractCertifiedLabel';
import * as AddressEntity from 'ui/shared/entities/address/AddressEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

type Props = ItemsProps<SearchResultAddressOrContract | SearchResultMetadataTag | multichain.QuickSearchResultAddress>;

const SearchBarSuggestAddress = ({ data, isMobile, searchTerm, addressFormat }: Props) => {
  const shouldHighlightHash = ADDRESS_REGEXP.test(searchTerm);
  const hash = 'filecoin_robust_address' in data ? data.filecoin_robust_address ||
    (addressFormat === 'bech32' ? toBech32Address(data.address_hash) : data.address_hash) : data.address_hash;

  const isContract = (() => {
    if ('chain_infos' in data) {
      return contract.isContract(data);
    }
    return data.type === 'contract' || data.is_smart_contract_address;
  })();

  const isVerified = (() => {
    if ('chain_infos' in data) {
      return contract.isVerified(data);
    }
    return data.is_smart_contract_verified;
  })();

  const icon = (
    <AddressEntity.Icon
      address={{
        hash: data.address_hash,
        is_contract: isContract,
        name: '',
        is_verified: isVerified,
        ens_domain_name: null,
        implementations: null,
      }}
    />
  );
  const addressName = (() => {
    if ('chain_infos' in data) {
      return contract.getName(data);
    }
    return data.name || data.ens_info?.name;
  })();
  const expiresText = 'ens_info' in data && data.ens_info?.expiry_date ? ` (expires ${ dayjs(data.ens_info.expiry_date).fromNow() })` : '';

  const nameEl = addressName && (
    <div className="flex items-center overflow-hidden">
      <span className="text-[var(--color-text-secondary)] overflow-hidden whitespace-nowrap text-ellipsis">
        <span className="font-medium" dangerouslySetInnerHTML={{ __html: highlightText(addressName, searchTerm) }}/>
        { 'ens_info' in data && data.ens_info && (
          data.ens_info.names_count > 1 ?
            <span> ({ data.ens_info.names_count > 39 ? '40+' : `+${ data.ens_info.names_count - 1 }` })</span> :
            <span>{ expiresText }</span>
        ) }
      </span>
      { 'certified' in data && data.certified && <ContractCertifiedLabel iconSize={ 4 } className="ml-1 shrink-0"/> }
    </div>
  );
  const tagEl = data.type === 'metadata_tag' ? (
    <SearchResultEntityTag metadata={ data.metadata } addressHash={ hash } searchTerm={ searchTerm } className="lg:ml-auto"/>
  ) : null;
  const addressEl = <HashStringShortenDynamic hash={ hash } noTooltip/>;

  if (isMobile) {
    return (
      <>
        <div className="flex items-center">
          { icon }
          <span
            className={ `block overflow-hidden whitespace-nowrap font-bold ${ shouldHighlightHash ? '' : '' }` }
            { ...(shouldHighlightHash ? {} : {}) }
          >
            { shouldHighlightHash ? <mark className="block overflow-hidden whitespace-nowrap font-bold">{ addressEl }</mark> : <span className="block overflow-hidden whitespace-nowrap font-bold">{ addressEl }</span> }
          </span>
        </div>
        <div className="flex items-center justify-between flex-wrap gap-2">
          { nameEl }
          { tagEl }
        </div>
      </>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2">
      <div className="flex items-center mr-2 min-w-0">
        { icon }
        { shouldHighlightHash ? (
          <mark className="block overflow-hidden whitespace-nowrap font-bold min-w-0">{ addressEl }</mark>
        ) : (
          <span className="block overflow-hidden whitespace-nowrap font-bold min-w-0">{ addressEl }</span>
        ) }
      </div>
      <div className="flex items-center justify-between gap-2 min-w-0">
        { nameEl }
        { tagEl }
      </div>
    </div>
  );
};

export default React.memo(SearchBarSuggestAddress);
