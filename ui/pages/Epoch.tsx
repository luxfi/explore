import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import useIsMobile from 'lib/hooks/useIsMobile';
import getQueryParamString from 'lib/router/getQueryParamString';
import { CELO_EPOCH } from 'stubs/epoch';
import { Tag } from 'toolkit/chakra/tag';
import { Tooltip } from 'toolkit/chakra/tooltip';
import EpochDetails from 'ui/epochs/EpochDetails';
import TextAd from 'ui/shared/ad/TextAd';
import BlockEntity from 'ui/shared/entities/block/BlockEntity';
import PageTitle from 'ui/shared/Page/PageTitle';

const EpochPageContent = () => {
  const isMobile = useIsMobile();
  const router = useRouter();
  const number = getQueryParamString(router.query.number);

  const epochQuery = useApiQuery('general:epoch_celo', {
    pathParams: {
      number: number,
    },
    queryOptions: {
      placeholderData: CELO_EPOCH,
    },
  });

  throwOnResourceLoadError(epochQuery);

  const isLoading = epochQuery.isPlaceholderData;

  const titleContentAfter = (() => {
    switch (epochQuery.data?.type) {
      case 'L1':
        return (
          <Tooltip content="Epoch finalized while Celo was still an L1 network">
            <Tag loading={ isLoading }>{ epochQuery.data.type }</Tag>
          </Tooltip>
        );
      case 'L2':
        return (
          <Tooltip content="Epoch finalized after Celo migrated to the OP‐stack, when it became an L2 rollup">
            <Tag loading={ isLoading }>{ epochQuery.data.type }</Tag>
          </Tooltip>
        );
    }

    return null;
  })();

  const titleSecondRow = (() => {
    if (!epochQuery.data || epochQuery.data?.start_block_number === null) {
      return null;
    }

    const isTruncated = isMobile && Boolean(epochQuery.data.end_block_number);
    const truncationProps = isTruncated ? { truncation: 'constant' as const, truncationMaxSymbols: 6 } : undefined;

    return (
      <div className="flex flex-wrap">
        <div className="text-[var(--color-text-secondary)]">Ranging from</div>
        <BlockEntity
          number={ epochQuery.data.start_block_number }
          variant="subheading"
          { ...truncationProps }
        />
        { epochQuery.data.end_block_number && (
          <>
            <div className="text-[var(--color-text-secondary)]">to</div>
            <BlockEntity number={ epochQuery.data.end_block_number } variant="subheading" { ...truncationProps }/>
          </>
        ) }
      </div>
    );
  })();

  return (
    <>
      <TextAd className="mb-6"/>
      <PageTitle
        title={ `Epoch #${ number }` }
        contentAfter={ titleContentAfter }
        secondRow={ titleSecondRow }
        isLoading={ isLoading }
      />
      { epochQuery.data && <EpochDetails data={ epochQuery.data } isLoading={ isLoading }/> }
    </>
  );
};

export default EpochPageContent;
