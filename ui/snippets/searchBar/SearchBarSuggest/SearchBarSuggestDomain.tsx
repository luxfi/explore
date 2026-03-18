import React from 'react';

import type { ItemsProps } from './types';
import type { SearchResultDomain } from 'types/api/search';
import type * as multichain from 'types/client/multichainAggregator';

import { toBech32Address } from 'lib/address/bech32';
import dayjs from 'lib/date/dayjs';
import highlightText from 'lib/highlightText';
import * as EnsEntity from 'ui/shared/entities/ens/EnsEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';

const SearchBarSuggestDomain = ({ data, isMobile, searchTerm, addressFormat }: ItemsProps<SearchResultDomain | multichain.QuickSearchResultDomain>) => {
  const icon = <EnsEntity.Icon protocol={ data.ens_info.protocol }/>;
  const hash = (() => {
    if ('filecoin_robust_address' in data && data.filecoin_robust_address) {
      return data.filecoin_robust_address;
    }
    return addressFormat === 'bech32' && data.address_hash ? toBech32Address(data.address_hash) : data.address_hash;
  })();

  const name = (
    <span className="font-bold overflow-hidden whitespace-nowrap text-ellipsis">
      <span dangerouslySetInnerHTML={{ __html: highlightText(data.ens_info.name, searchTerm) }}/>
    </span>
  );

  const address = hash ? (
    <span className="overflow-hidden whitespace-nowrap text-[var(--color-text-secondary)]">
      <HashStringShortenDynamic hash={ hash } noTooltip/>
    </span>
  ) : null;

  const isContractVerified = 'is_smart_contract_verified' in data && data.is_smart_contract_verified &&
    <IconSvg name="status/success" boxSize="14px" color="green.500" flexShrink={ 0 }/>;

  const namesCount = 'names_count' in data.ens_info ? data.ens_info.names_count : 0;

  const expiresText = data.ens_info?.expiry_date ? ` expires ${ dayjs(data.ens_info.expiry_date).fromNow() }` : '';
  const ensNamesCount = namesCount > 39 ? '40+' : `+${ namesCount - 1 }`;
  const additionalInfo = (
    <span className={ `text-[var(--color-text-secondary)] ${ isMobile ? 'text-start' : 'text-end' }` }>
      { namesCount > 1 ? ensNamesCount : expiresText }
    </span>
  );

  if (isMobile) {
    return (
      <>
        <div className="flex items-center overflow-hidden">
          { icon }
          { name }
        </div>
        <div className="flex items-center overflow-hidden gap-1">
          { address }
          { isContractVerified }
        </div>
        { additionalInfo }
      </>
    );
  }

  return (
    <div className="grid items-center gap-2" style={{ gridTemplateColumns: '228px minmax(auto, max-content) auto' }}>
      <div className="flex items-center">
        { icon }
        { name }
      </div>
      <div className="flex items-center overflow-hidden gap-1">
        { address }
        { isContractVerified }
      </div>
      { additionalInfo }
    </div>
  );
};

export default React.memo(SearchBarSuggestDomain);
