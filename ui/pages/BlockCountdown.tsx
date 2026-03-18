import { useRouter } from 'next/router';
import React from 'react';

import { route } from 'nextjs/routes';

import useApiQuery from 'lib/api/useApiQuery';
import { useMultichainContext } from 'lib/contexts/multichain';
import dayjs from 'lib/date/dayjs';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import getQueryParamString from 'lib/router/getQueryParamString';
import { Button } from 'toolkit/chakra/button';
import { Heading } from 'toolkit/chakra/heading';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import { downloadBlob } from 'toolkit/utils/file';
import BlockCountdownTimer from 'ui/blockCountdown/BlockCountdownTimer';
import createGoogleCalendarLink from 'ui/blockCountdown/createGoogleCalendarLink';
import createIcsFileBlob from 'ui/blockCountdown/createIcsFileBlob';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import IconSvg from 'ui/shared/IconSvg';
import StatsWidget from 'ui/shared/stats/StatsWidget';
import Time from 'ui/shared/time/Time';

import CapybaraRunner from '../games/CapybaraRunner';

type Props = {
  hideCapybaraRunner?: boolean;
};

const BlockCountdown = ({ hideCapybaraRunner }: Props) => {
  const multichainContext = useMultichainContext();
  const router = useRouter();
  const height = getQueryParamString(router.query.height);

  const { data, isPending, isError, error } = useApiQuery('general:block_countdown', {
    queryParams: {
      module: 'block',
      action: 'getblockcountdown',
      blockno: height,
    },
  });

  const handleAddToAppleCalClick = React.useCallback(() => {
    if (!data?.result?.EstimateTimeInSec) {
      return;
    }
    const fileBlob = createIcsFileBlob({ blockHeight: height, date: dayjs().add(Number(data.result.EstimateTimeInSec), 's'), multichainContext });
    downloadBlob(fileBlob, `Block #${ height } creation event.ics`);
  }, [ data?.result?.EstimateTimeInSec, height, multichainContext ]);

  const handleTimerFinish = React.useCallback(() => {
    window.location.assign(route({ pathname: '/block/[height_or_hash]', query: { height_or_hash: height } }, multichainContext));
  }, [ height, multichainContext ]);

  React.useEffect(() => {
    if (!isError && !isPending && !data.result) {
      handleTimerFinish();
    }
  }, [ data?.result, handleTimerFinish, isError, isPending ]);

  if (isError) {
    throwOnResourceLoadError({ isError, error, resource: 'general:block_countdown' });
  }

  if (isPending || !data?.result) {
    return <div className="h-full"><ContentLoader/></div>;
  }

  return (
    <div className="flex h-full items-start lg:items-center">
      <div className="flex flex-col w-fit max-w-full lg:max-w-[700px] xl:max-w-[1000px]">
        <div className="flex items-start w-full gap-x-8 justify-between lg:justify-start">
          <div className="max-w-[calc(100% - 65px - 32px)] lg:max-w-[calc(100% - 125px - 32px)]">
            <Heading
              level="1"
            >
              <TruncatedText text={ `Block #${ height }` } className="w-full"/>
            </Heading>
            <div className="text-[var(--color-text-secondary)] mt-2">
              <div className="font-semibold">Estimated target date</div>
              <Time timestamp={ dayjs().add(Number(data.result.EstimateTimeInSec), 's').valueOf() }/>
            </div>
            <div className="flex mt-3 gap-x-2">
              <Link
                external
                variant="underlaid"
                className="text-sm px-2 inline-flex"
                href={ createGoogleCalendarLink({ blockHeight: height, timeFromNow: Number(data.result.EstimateTimeInSec), multichainContext }) }
              >
                <Image src="/static/google_calendar.svg" alt="Google calendar logo" boxSize={ 5 } mr={ 2 }/>
                <span>Google</span>
              </Link>
              <Button
                variant="plain"
                size="sm"
                className="px-2 font-normal text-[var(--color-link-primary)] hover:text-[var(--color-link-primary-hover)] bg-[var(--color-link-underlaid-bg)] inline-flex"
                onClick={ handleAddToAppleCalClick }
              >
                <Image src="/static/apple_calendar.svg" alt="Apple calendar logo" boxSize={ 5 }/>
                <span>Apple</span>
              </Button>
            </div>
          </div>
          <div className="relative">
            <IconSvg
              name="block"
              w={{ base: '65px', lg: '125px' }}
              h={{ base: '75px', lg: '140px' }}
              color={{ _light: 'gray.300', _dark: 'gray.600' }}
              flexShrink={ 0 }
            />
            { multichainContext?.chain && (
              <ChainIcon
                data={ multichainContext.chain }
                className="absolute bottom-[5px] lg:bottom-[6px] right-[45px] lg:right-[86px] lg:w-[60px] lg:h-[60px] bg-[var(--color-bg-primary)] rounded-full"
              />
            ) }
          </div>
        </div>
        { data.result.EstimateTimeInSec && (
          <BlockCountdownTimer
            value={ Math.ceil(Number(data.result.EstimateTimeInSec)) }
            onFinish={ handleTimerFinish }
          />
        ) }
        <div className="grid mt-2 gap-x-2 grid-cols-2">
          <StatsWidget label="Remaining blocks" value={ data.result.RemainingBlock } icon="apps"/>
          <StatsWidget label="Current block" value={ data.result.CurrentBlock } icon="block"/>
        </div>
        { !hideCapybaraRunner && <CapybaraRunner/> }
      </div>
    </div>
  );
};

export default React.memo(BlockCountdown);
