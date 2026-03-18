import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import { layerLabels } from 'lib/rollups/utils';
import { Skeleton } from 'toolkit/chakra/skeleton';
import BlockEntityL1 from 'ui/shared/entities/block/BlockEntityL1';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import TxEntityL1 from 'ui/shared/entities/tx/TxEntityL1';
import TimeWithTooltip from 'ui/shared/time/TimeWithTooltip';

type Props = {
  l1BlockNumber: number;
  l1TxHash: string;
  l2TxHash: string | null;
  timestamp: string | null;
  isLoading?: boolean;
};

const LatestDepositsItem = ({ l1BlockNumber, l1TxHash, l2TxHash, timestamp, isLoading }: Props) => {
  const isMobile = useIsMobile();

  const l1BlockLink = (
    <BlockEntityL1
      number={ l1BlockNumber }
      isLoading={ isLoading }
      className="text-sm leading-5 font-bold"
    />
  );

  const l1TxLink = (
    <TxEntityL1
      isLoading={ isLoading }
      hash={ l1TxHash }
      className="text-sm leading-5"
      truncation={ isMobile ? 'constant_long' : 'dynamic' }
    />
  );

  const l2TxLink = l2TxHash ? (
    <TxEntity
      isLoading={ isLoading }
      hash={ l2TxHash }
      className="text-sm leading-5"
      truncation={ isMobile ? 'constant_long' : 'dynamic' }
    />
  ) : null;

  const content = (() => {
    if (isMobile) {
      return (
        <>
          <div justifyContent="space-between" alignItems="center" mb={ 1 }>
            { l1BlockLink }
            <TimeWithTooltip
              timestamp={ timestamp }
              timeFormat="relative"
              isLoading={ isLoading }
              color="text.secondary"
            />
          </div>
          <div gridTemplateColumns="56px auto">
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
      <div width="100%" columnGap={ 4 } rowGap={ 2 } templateColumns="max-content max-content auto" w="100%">
        { l1BlockLink }
        <Skeleton loading={ isLoading } className="w-fit h-fit my-[5px]">
          { layerLabels.parent } txn
        </Skeleton>
        { l1TxLink }
        <TimeWithTooltip
          timestamp={ timestamp }
          timeFormat="relative"
          isLoading={ isLoading }
          color="text.secondary"
          w="fit-content"
          h="fit-content"
          my="2px"
        />
        <Skeleton loading={ isLoading } className="w-fit h-fit my-[2px]">
          { layerLabels.current } txn
        </Skeleton>
        { l2TxLink }
      </div>
    );
  })();

  return (
    <div
      width="100%"
      borderTop="1px solid"
      borderColor="border.divider"
      py={ 4 }
      px={{ base: 0, lg: 4 }}
      _last={{ borderBottom: '1px solid', borderColor: 'border.divider' }}
      fontSize="sm"
      lineHeight={ 5 }
    >
      { content }
    </div>
  );
};

export default React.memo(LatestDepositsItem);
