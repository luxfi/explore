import React from 'react';

import type { InteropMessage } from 'types/api/interop';

import AddressFromToIcon from 'ui/shared/address/AddressFromToIcon';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import AddressEntityInterop from 'ui/shared/entities/address/AddressEntityInterop';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import InteropMessageStatus from 'ui/shared/statusTag/InteropMessageStatus';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

import InteropMessageAdditionalInfo from './InteropMessageAdditionalInfo';
import InteropMessageDestinationTx from './InteropMessageDestinationTx';
import InteropMessageSourceTx from './InteropMessageSourceTx';

interface Props {
  item: InteropMessage;
  isLoading?: boolean;
}

const InteropMessagesListItem = ({ item, isLoading }: Props) => {
  return (
    <ListItemMobile className="!gap-y-2">
      <div className="flex items-center justify-between w-full">
        <InteropMessageStatus status={ item.status } isLoading={ isLoading }/>
        <InteropMessageAdditionalInfo payload={ item.payload } isLoading={ isLoading }/>
      </div>
      <div className="flex flex-col items-start gap-2 w-full">
        <div className="flex w-full">
          <span className="font-medium grow">#{ item.nonce }</span>
          <TimeWithTooltip timestamp={ item.timestamp } isLoading={ isLoading } color="text.secondary"/>
        </div>
        <div className="grid grid-cols-[120px_1fr] gap-y-2">
          <span className="text-[var(--chakra-colors-text-secondary)]">Source tx</span>
          <InteropMessageSourceTx { ...item } isLoading={ isLoading }/>
          <span className="text-[var(--chakra-colors-text-secondary)]">Destination tx</span>
          <InteropMessageDestinationTx { ...item } isLoading={ isLoading }/>
        </div>
        <div className="flex gap-2 justify-between mt-2">
          { item.init_chain !== undefined ? (
            <AddressEntityInterop
              chain={ item.init_chain }
              address={{ hash: item.sender_address_hash }}
              isLoading={ isLoading }
              truncation="constant"
            />
          ) : (
            <AddressEntity address={{ hash: item.sender_address_hash }} isLoading={ isLoading } truncation="constant"/>
          ) }
          <AddressFromToIcon
            isLoading={ isLoading }
            type={ item.init_chain !== undefined ? 'in' : 'out' }
          />
          { item.relay_chain !== undefined ? (
            <AddressEntityInterop
              chain={ item.relay_chain }
              address={{ hash: item.target_address_hash }}
              isLoading={ isLoading }
              truncation="constant"
            />
          ) : (
            <AddressEntity address={{ hash: item.target_address_hash }} isLoading={ isLoading } truncation="constant"/>
          ) }
        </div>
      </div>
    </ListItemMobile>
  );
};

export default React.memo(InteropMessagesListItem);
