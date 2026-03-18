import React, { useCallback } from 'react';

import type { AddressTag } from 'types/api/account';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tag } from 'toolkit/chakra/tag';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

interface Props {
  item: AddressTag;
  onEditClick: (data: AddressTag) => void;
  onDeleteClick: (data: AddressTag) => void;
  isLoading?: boolean;
}

const AddressTagListItem = ({ item, onEditClick, onDeleteClick, isLoading }: Props) => {
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  return (
    <ListItemMobile>
      <div className="flex flex-col items-start max-w-full">
        <AddressEntity
          address={ item.address }
          isLoading={ isLoading }
          fontWeight="600"
          w="100%"
        />
        <div className="flex mt-4 gap-3">
          <span className="font-medium">Private tag</span>
          <Skeleton loading={ isLoading } display="inline-block" borderRadius="sm">
            <Tag>
              { item.name }
            </Tag>
          </Skeleton>
        </div>
      </div>
      <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
    </ListItemMobile>
  );
};

export default React.memo(AddressTagListItem);
