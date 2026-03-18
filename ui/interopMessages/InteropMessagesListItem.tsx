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
    <ListItemMobile rowGap={ 2 }>
      <div alignItems="center" justifyContent="space-between" w="100%">
        <InteropMessageStatus status={ item.status } isLoading={ isLoading }/>
        <InteropMessageAdditionalInfo payload={ item.payload } isLoading={ isLoading }/>
      </div>
      <div alignItems="flex-start" flexDirection="column" gap={ 2 } w="100%">
        <div w="100%">
          <span fontWeight={ 500 } flexGrow={ 1 }>#{ item.nonce }</span>
          <TimeWithTooltip timestamp={ item.timestamp } isLoading={ isLoading } color="text.secondary"/>
        </div>
        <div templateColumns="120px 1fr" rowGap={ 2 }>
          <span as="span" color="text.secondary">Source tx</span>
          <InteropMessageSourceTx { ...item } isLoading={ isLoading }/>
          <span as="span" color="text.secondary">Destination tx</span>
          <InteropMessageDestinationTx { ...item } isLoading={ isLoading }/>
        </div>
        <div gap={ 2 } justifyContent="space-between" mt={ 2 }>
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
