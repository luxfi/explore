import React from 'react';

import type { ItemsProps } from './types';
import type { SearchResultLabel } from 'types/api/search';

import { toBech32Address } from 'lib/address/bech32';
import highlightText from 'lib/highlightText';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';
import IconSvg from 'ui/shared/IconSvg';

const SearchBarSuggestLabel = ({ data, isMobile, searchTerm, addressFormat }: ItemsProps<SearchResultLabel>) => {
  const icon = <IconSvg name="publictags" className="w-5 h-5 text-[var(--color-icon-primary)]"/>;
  const hash = data.filecoin_robust_address || (addressFormat === 'bech32' ? toBech32Address(data.address_hash) : data.address_hash);

  const name = (
    <span className="font-bold overflow-hidden whitespace-nowrap text-ellipsis">
      <span dangerouslySetInnerHTML={{ __html: highlightText(data.name, searchTerm) }}/>
    </span>
  );

  const address = (
    <span className="overflow-hidden whitespace-nowrap text-[var(--color-text-secondary)]">
      <HashStringShortenDynamic hash={ hash } noTooltip/>
    </span>
  );

  const isContractVerified = data.is_smart_contract_verified && <IconSvg name="status/success" className="w-3.5 h-3.5 text-[var(--color-green-500)] shrink-0"/>;

  if (isMobile) {
    return (
      <>
        <div className="flex items-center overflow-hidden gap-2">
          { icon }
          { name }
        </div>
        <div className="flex items-center overflow-hidden gap-1">
          { address }
          { isContractVerified }
        </div>
      </>
    );
  }

  return (
    <div className="grid items-center gap-2" style={{ gridTemplateColumns: '228px max-content 24px' }}>
      <div className="flex items-center gap-2">
        { icon }
        { name }
      </div>
      <div className="flex items-center overflow-hidden gap-1">
        { address }
        { isContractVerified }
      </div>
    </div>
  );
};

export default React.memo(SearchBarSuggestLabel);
