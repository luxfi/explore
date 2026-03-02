import type { FC } from 'react';
import React from 'react';

import type { NovesResponseData } from 'types/api/noves';

import { Badge } from '@luxfi/ui/badge';
import { Skeleton } from '@luxfi/ui/skeleton';
import type { NovesFlowViewItem } from 'ui/tx/assetFlows/utils/generateFlowViewData';

import AddressEntity from '../entities/address/AddressEntity';
import { getActionFromTo, getFromTo } from './utils';

interface Props {
  isLoaded: boolean;
  txData?: NovesResponseData;
  currentAddress?: string;
  item?: NovesFlowViewItem;
}

const NovesFromTo: FC<Props> = ({ isLoaded, txData, currentAddress = '', item }) => {
  const data = React.useMemo(() => {
    if (txData) {
      return getFromTo(txData, currentAddress);
    }
    if (item) {
      return getActionFromTo(item);
    }

    return { text: 'Sent to', address: '' };
  }, [ currentAddress, item, txData ]);

  const isSent = data.text.startsWith('Sent');

  const address = { hash: data.address || '', name: data.name || '' };

  return (
    <Skeleton borderRadius="sm" loading={ !isLoaded } className="rounded-sm">
      <div className="flex">
        <Badge
          colorPalette={ isSent ? 'yellow' : 'green' }
          className="px-0 w-[113px] shrink-0 justify-center"
        >
          { data.text }
        </Badge>

        <AddressEntity
          address={ address }
          className="font-medium ml-2"
          noCopy={ !data.address }
          noLink={ !data.address }
          noIcon={ address.name === 'Validators' }
          truncation="dynamic"
        />
      </div>
    </Skeleton>
  );
};

export default NovesFromTo;
