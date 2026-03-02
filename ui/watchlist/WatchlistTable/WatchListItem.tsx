import { useMutation } from '@tanstack/react-query';
import React, { useCallback, useState } from 'react';

import type { WatchlistAddress } from 'types/api/account';

import useApiFetch from 'lib/api/useApiFetch';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Switch } from '@luxfi/ui/switch';
import { Tag } from '@luxfi/ui/tag';
import { toaster } from '@luxfi/ui/toaster';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import TableItemActionButtons from 'ui/shared/TableItemActionButtons';

import WatchListAddressItem from './WatchListAddressItem';

interface Props {
  item: WatchlistAddress;
  isLoading?: boolean;
  onEditClick: (data: WatchlistAddress) => void;
  onDeleteClick: (data: WatchlistAddress) => void;
  hasEmail: boolean;
}

const WatchListItem = ({ item, isLoading, onEditClick, onDeleteClick, hasEmail }: Props) => {
  const [ notificationEnabled, setNotificationEnabled ] = useState(item.notification_methods.email);
  const [ switchDisabled, setSwitchDisabled ] = useState(false);
  const onItemEditClick = useCallback(() => {
    return onEditClick(item);
  }, [ item, onEditClick ]);

  const onItemDeleteClick = useCallback(() => {
    return onDeleteClick(item);
  }, [ item, onDeleteClick ]);

  const apiFetch = useApiFetch();

  const showErrorToast = useCallback(() => {
    toaster.error({
      title: 'Error',
      description: 'There has been an error processing your request',
    });
  }, [ ]);

  const showNotificationToast = useCallback((isOn: boolean) => {
    toaster.success({
      title: 'Success',
      description: isOn ? 'Email notification is ON' : 'Email notification is OFF',
    });
  }, [ ]);

  const { mutate } = useMutation<WatchlistAddress>({
    mutationFn: () => {
      setSwitchDisabled(true);
      const body = { ...item, notification_methods: { email: !notificationEnabled } };
      setNotificationEnabled(prevState => !prevState);
      return apiFetch('general:watchlist', {
        pathParams: { id: String(item.id) },
        fetchParams: { method: 'PUT', body },
      }) as Promise<WatchlistAddress>;
    },
    onError: () => {
      showErrorToast();
      setNotificationEnabled(prevState => !prevState);
      setSwitchDisabled(false);
    },
    onSuccess: (data) => {
      setSwitchDisabled(false);
      showNotificationToast(data.notification_methods.email);
    },
  });

  const onSwitch = useCallback(() => {
    return mutate();
  }, [ mutate ]);

  return (
    <ListItemMobile>
      <div>
        <WatchListAddressItem item={ item } isLoading={ isLoading }/>
        <div className="flex flex-row">
          <span className="font-medium">Private tag</span>
          <Tag loading={ isLoading } truncated>{ item.name }</Tag>
        </div>
      </div>
      <div className="flex w-full">
        <div className="flex flex-row">
          <span className="font-medium">Email notification</span>
          <Skeleton loading={ isLoading } className="inline-block">
            <Switch
              checked={ notificationEnabled }
              onCheckedChange={ onSwitch }
              aria-label="Email notification"
              disabled={ !hasEmail || switchDisabled }
            />
          </Skeleton>
        </div>
        <TableItemActionButtons onDeleteClick={ onItemDeleteClick } onEditClick={ onItemEditClick } isLoading={ isLoading }/>
      </div>
    </ListItemMobile>
  );
};

export default WatchListItem;
