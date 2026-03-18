import React, { useCallback } from 'react';

import type { TransactionTag } from 'types/api/account';

import { Tag } from 'toolkit/chakra/tag';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

interface Props {
  item: TransactionTag;
  isLoading?: boolean;
  onEditClick: (data: TransactionTag) => void;
  onDeleteClick: (data: TransactionTag) => void;
}

const TransactionTagListItem = ({ item, isLoading, onEditClick, onDeleteClick }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <ListItemMobile>
      <div className="flex flex-col items-start max-w-full">
        <TxEntity
          hash={ item.transaction_hash }
          isLoading={ isLoading }
          className="font-semibold max-w-full"
        />
        <div className="flex mt-4 gap-3">
          <span className="font-medium">Private tag</span>
          <Tag loading={ isLoading } truncated>{ item.name }</Tag>
        </div>
      </div>
      <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
    </ListItemMobile>
  );
};

export default React.memo(TransactionTagListItem);
