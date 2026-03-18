import React from 'react';

import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import { layerLabels } from 'lib/rollups/utils';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import SocketNewItemsNotice from 'ui/shared/SocketNewItemsNotice';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

type DepositsItem = {
  l1BlockNumber: number | null;
  l1TxHash: string | null;
  l2TxHash: string;
  timestamp: string | null;
};

type Props = {
  isLoading?: boolean;
  items: Array<DepositsItem>;
  socketItemsNum: number;
  showSocketErrorAlert?: boolean;
};

type ItemProps = {
  item: DepositsItem;
  isLoading?: boolean;
};

const LatestDepositsItem = ({ item, isLoading }: ItemProps) => {
  const isMobile = useIsMobile();

  const l1BlockLink = item.l1BlockNumber ? (
    <BlockEntityL1
      number={ item.l1BlockNumber }
      isLoading={ isLoading }
      className="font-bold"
    />
  ) : (
    <BlockEntityL1
      number="TBD"
      isLoading={ isLoading }
      className="font-bold"
      noLink
    />
  );

  const l1TxLink = item.l1TxHash ? (
    <TxEntityL1
      isLoading={ isLoading }
      hash={ item.l1TxHash }
      truncation={ isMobile ? 'constant_long' : 'dynamic' }
      noCopy
    />
  ) : (
    <TxEntityL1
      isLoading={ isLoading }
      hash="To be determined"
      truncation="none"
      noLink
      noCopy
    />
  );

  const l2TxLink = (
    <TxEntity
      isLoading={ isLoading }
      hash={ item.l2TxHash }
      truncation={ isMobile ? 'constant_long' : 'dynamic' }
    />
  );

  const content = (() => {
    if (isMobile) {
      return (
        <>
          <div className="flex justify-between items-center mb-1">
            { l1BlockLink }
            { item.timestamp ? (
              <TimeWithTooltip
                timestamp={ item.timestamp }
                timeFormat="relative"
                isLoading={ isLoading }
                color="text.secondary"
              />
            ) : <div/> }
          </div>
          <div className="grid grid-cols-[56px_auto]">
            <Skeleton loading={ isLoading } className="my-[5px] w-fit">
              { layerLabels.parent } txn
            </Skeleton>
            { l1TxLink }
            <Skeleton loading={ isLoading } className="my-[3px] w-fit">
              { layerLabels.current } txn
            </Skeleton>
            { l2TxLink }
          </div>
        </>
      );
    }

    return (
      <div className="grid w-full gap-x-4 gap-y-2 grid-cols-[max-content_max-content_auto]">
        { l1BlockLink }
        <Skeleton loading={ isLoading } className="w-fit h-fit my-[5px]">
          { layerLabels.parent } txn
        </Skeleton>
        { l1TxLink }
        { item.timestamp ? (
          <TimeWithTooltip
            timestamp={ item.timestamp }
            timeFormat="relative"
            isLoading={ isLoading }
            color="text.secondary"
            w="fit-content"
            h="fit-content"
            my="2px"
          />
        ) : <div/> }
        <Skeleton loading={ isLoading } className="w-fit h-fit my-[2px]">
          { layerLabels.current } txn
        </Skeleton>
        { l2TxLink }
      </div>
    );
  })();

  return (
    <div className="w-full border-b border-[var(--color-border-divider)] py-4 px-0 lg:px-4 text-sm">
      { content }
    </div>
  );
};

const LatestDeposits = ({ isLoading, items, showSocketErrorAlert, socketItemsNum }: Props) => {
  const depositsUrl = route({ pathname: '/deposits' });
  return (
    <>
      <SocketNewItemsNotice
        className="rounded-b-none"
        url={ depositsUrl }
        num={ socketItemsNum }
        showErrorAlert={ showSocketErrorAlert }
        type="deposit"
        isLoading={ isLoading }
      />
      <div className="mb-3 lg:mb-4">
        { items.map(((item, index) => (
          <LatestDepositsItem
            key={ item.l1TxHash + item.l2TxHash + (isLoading ? index : '') }
            item={ item }
            isLoading={ isLoading }
          />
        ))) }
      </div>
      <div className="flex justify-center">
        <Link className="text-sm" href={ depositsUrl }>View all deposits</Link>
      </div>
    </>
  );
};

export default LatestDeposits;
