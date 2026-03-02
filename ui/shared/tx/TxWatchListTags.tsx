import React from 'react';

import type { Transaction } from 'types/api/transaction';

import { Badge } from '@luxfi/ui/badge';

interface Props {
  tx: Transaction;
  isLoading?: boolean;
}

const TxWatchListTags = ({ tx, isLoading }: Props) => {
  const tags = [
    ...(tx.from?.watchlist_names || []),
    ...(tx.to?.watchlist_names || []),
  ].filter(Boolean);

  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-x-2 gap-y-2 flex-wrap overflow-hidden max-w-full">
      { tags.map((tag) => (
        <Badge
          key={ tag.label }
          loading={ isLoading }
          truncated
          className="max-w-[115px] lg:max-w-full"
          colorPalette="gray"
        >
          { tag.display_name }
        </Badge>
      )) }
    </div>
  );
};

export default React.memo(TxWatchListTags);
