import React from 'react';

import type { ItemsProps } from './types';
import type { SearchResultCluster } from 'types/api/search';

import { toBech32Address } from 'lib/address/bech32';
import { isEvmAddress } from 'lib/address/isEvmAddress';
import highlightText from 'lib/highlightText';
import ClusterIcon from 'ui/shared/ClusterIcon';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

const SearchBarSuggestCluster = ({ data, searchTerm, addressFormat }: ItemsProps<SearchResultCluster>) => {
  const hash = data.filecoin_robust_address || (addressFormat === 'bech32' ? toBech32Address(data.address_hash) : data.address_hash);
  const isClickable = isEvmAddress(data.address_hash);

  const shouldShowTrailingSlash = searchTerm.trim().endsWith('/');
  const displayName = shouldShowTrailingSlash ? data.cluster_info.name + '/' : data.cluster_info.name;
  const searchTermForHighlight = searchTerm.replace(/\/$/, '');

  const icon = <ClusterIcon clusterName={ data.cluster_info.name }/>;

  const name = (
    <span className="font-bold overflow-hidden whitespace-nowrap text-ellipsis">
      <span dangerouslySetInnerHTML={{ __html: highlightText(displayName, searchTermForHighlight) }}/>
    </span>
  );

  const address = (
    <span className="overflow-hidden whitespace-nowrap text-[var(--color-text-secondary)]">
      <HashStringShortenDynamic hash={ hash } noTooltip/>
    </span>
  );

  return (
    <div style={{ opacity: isClickable ? 1 : 0.6 }}>
      <div className="grid items-center gap-2" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(0, 1fr))' }}>
        <div className="flex items-center">
          { icon }
          { name }
        </div>
        <div className="flex items-center overflow-hidden gap-1">
          { address }
        </div>
      </div>
    </div>
  );
};

export default React.memo(SearchBarSuggestCluster);
