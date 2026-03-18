import React from 'react';

import { CollapsibleList } from 'toolkit/chakra/collapsible';
import NftEntity from 'ui/shared/entities/nft/NftEntity';

interface Props {
  items: Array<{ total: { token_id: string | null } }>;
  tokenAddress: string;
  isLoading?: boolean;
}

const TxStateTokenIdList = ({ items, tokenAddress, isLoading }: Props) => {
  const renderItem = React.useCallback((item: typeof items[number], index: number) => {
    if (item.total.token_id !== null) {
      return <NftEntity key={ index } hash={ tokenAddress } id={ item.total.token_id } isLoading={ isLoading }/>;
    }

    return <span key={ index }>N/A</span>;
  }, [ isLoading, tokenAddress ]);

  return (
    <CollapsibleList
      items={ items }
      renderItem={ renderItem }
      triggerProps={{
        className: 'pb-[5px] md:pb-0',
      }}
      className="gap-y-2"
    />
  );
};

export default React.memo(TxStateTokenIdList);
