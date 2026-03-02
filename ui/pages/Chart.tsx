import type { NextRouter } from 'next/router';
import { useRouter } from 'next/router';
import React from 'react';

import { Resolution } from '@luxfi/stats-types';
import type { StatsIntervalIds } from 'types/client/stats';
import { StatsIntervalId } from 'types/client/stats';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import throwOnResourceLoadError from 'lib/errors/throwOnResourceLoadError';
import replaceNativeCoinName from 'lib/stats/replaceNativeCoinName';
import useIsMobile from 'lib/hooks/useIsMobile';
import * as metadata from 'lib/metadata';
import * as mixpanel from 'lib/mixpanel/index';
import useRoutedChainSelect from 'lib/multichain/useRoutedChainSelect';
import getQueryParamString from 'lib/router/getQueryParamString';
import { Button } from '@luxfi/ui/button';
import type { SelectOption } from '@luxfi/ui/select';
import { Select } from '@luxfi/ui/select';
import { Skeleton } from '@luxfi/ui/skeleton';
import { ChartWidgetContent, useChartZoom } from 'toolkit/components/charts';
import ChartMenu from 'toolkit/components/charts/parts/ChartMenu';
import { isBrowser } from 'toolkit/utils/isBrowser';
import ChainSelect from 'ui/multichain/components/ChainSelect';
import isCustomAppError from 'ui/shared/AppError/isCustomAppError';
import ChartIntervalSelect from 'ui/shared/chart/ChartIntervalSelect';
import { useChartsConfig } from 'ui/shared/chart/config';
import useChartQuery from 'ui/shared/chart/useChartQuery';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import IconSvg from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';
import { STATS_RESOLUTIONS } from 'ui/stats/constants';
import { createListCollection } from '@luxfi/ui/select';

const DEFAULT_RESOLUTION = Resolution.DAY;

const getIntervalByResolution = (resolution: Resolution): StatsIntervalIds => {
  switch (resolution) {
    case 'DAY':
      return 'oneMonth';
    case 'WEEK':
      return 'oneMonth';
    case 'MONTH':
      return 'oneYear';
    case 'YEAR':
      return 'all';
    default:
      return 'oneMonth';
  }
};

const getIntervalFromQuery = (router: NextRouter): StatsIntervalIds | undefined => {
  const intervalFromQuery = getQueryParamString(router.query.interval);

  if (!intervalFromQuery || !Object.values(StatsIntervalId).includes(intervalFromQuery as StatsIntervalIds)) {
    return undefined;
  }

  return intervalFromQuery as StatsIntervalIds;
};

const getResolutionFromQuery = (router: NextRouter) => {
  const resolutionFromQuery = getQueryParamString(router.query.resolution);

  if (!resolutionFromQuery || !Resolution[resolutionFromQuery as keyof typeof Resolution]) {
    return DEFAULT_RESOLUTION;
  }

  return resolutionFromQuery as Resolution;
};

const Chart = () => {
  const router = useRouter();
  const id = getQueryParamString(router.query.id);
  const intervalFromQuery = getIntervalFromQuery(router);
  const resolutionFromQuery = getResolutionFromQuery(router);
  const defaultResolution = resolutionFromQuery || DEFAULT_RESOLUTION;
  const [ intervalState, setIntervalState ] = React.useState<StatsIntervalIds | undefined>(intervalFromQuery);
  const [ resolution, setResolution ] = React.useState<Resolution>(defaultResolution);
  const { zoomRange, handleZoom, handleZoomReset } = useChartZoom();

  const interval = intervalState || getIntervalByResolution(resolution);

  const ref = React.useRef<HTMLDivElement>(null);

  const isMobile = useIsMobile();
  const isInBrowser = isBrowser();
  const chartsConfig = useChartsConfig();
  const chainSelect = useRoutedChainSelect();
  const multichainContext = useMultichainContext();

  const onIntervalChange = React.useCallback((interval: StatsIntervalIds) => {
    setIntervalState(interval);
    router.push(
      {
        pathname: router.pathname,
        query: { ...router.query, interval },
      },
      undefined,
      { shallow: true },
    );
  }, [ setIntervalState, router ]);

  const onResolutionChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setResolution(value[0] as Resolution);
    router.push({
      pathname: router.pathname,
      query: { ...router.query, resolution: value[0] },
    },
    undefined,
    { shallow: true },
    );
  }, [ setResolution, router ]);

  const handleReset = React.useCallback(() => {
    handleZoomReset();
    onResolutionChange({ value: [ DEFAULT_RESOLUTION ] });
  }, [ handleZoomReset, onResolutionChange ]);

  const { items, info, lineQuery } = useChartQuery(id, resolution, interval);

  const charts = React.useMemo(() => {
    if (!info || !items) {
      return [];
    }

    return [
      {
        id: info.id,
        name: 'Value',
        items,
        charts: chartsConfig,
        units: info.units,
      },
    ];
  }, [ chartsConfig, info, items ]);

  const hasNonEmptyCharts = charts.some((chart) => chart.items.length > 2);

  React.useEffect(() => {
    if (info && !config.meta.seo.enhancedDataEnabled) {
      metadata.update({ pathname: '/stats/[id]', query: { id } }, info);
    }
  }, [ info, id ]);

  const onShare = React.useCallback(async() => {
    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Share chart', Info: id });
    try {
      await window.navigator.share({
        title: info?.title ? replaceNativeCoinName(info.title) : undefined,
        text: info?.description ? replaceNativeCoinName(info.description) : undefined,
        url: window.location.href,
      });
    } catch (error) {}
  }, [ info, id ]);

  if (lineQuery.isError) {
    if (isCustomAppError(lineQuery.error)) {
      throwOnResourceLoadError({ resource: 'stats:line', error: lineQuery.error, isError: true });
    }
  }

  const hasItems = (items && items.length > 2) || lineQuery.isPending;

  const isInfoLoading = !info && lineQuery.isPlaceholderData;

  const shareButton = (
    <Button
      size="sm"
      variant="outline"
      onClick={ onShare }
      className="ml-6"
      loadingSkeleton={ lineQuery.isPlaceholderData }
    >
      <IconSvg name="share" className="size-4"/>
      Share
    </Button>
  );

  const resolutionCollection = React.useMemo(() => {
    const resolutions = lineQuery.data?.info?.resolutions || [];
    const items = STATS_RESOLUTIONS
      .filter((resolution) => resolutions.includes(resolution.id))
      .map((resolution) => ({ value: resolution.id, label: resolution.title }));

    return createListCollection<SelectOption>({ items });
  }, [ lineQuery.data?.info?.resolutions ]);

  return (
    <>
      <PageTitle
        title={ replaceNativeCoinName(info?.title || lineQuery.data?.info?.title || '') }
        className="mb-3"
        isLoading={ isInfoLoading }
        secondRow={ replaceNativeCoinName(info?.description || lineQuery.data?.info?.description || '') || undefined }
        withTextAd
      />
      <div className="flex items-center justify-between">
        <div className="flex items-center max-w-full gap-3 lg:gap-6">
          { multichainContext?.chain && (
            <ChainSelect
              value={ chainSelect.value }
              onValueChange={ chainSelect.onValueChange }
              loading={ isInfoLoading }
            />
          ) }
          <div className="flex items-center gap-3">
            { !isMobile && <span>Period</span> }
            <ChartIntervalSelect interval={ interval } onIntervalChange={ onIntervalChange }/>
          </div>
          { (
            (info?.resolutions && info?.resolutions.length > 1) ||
            (!info && lineQuery.data?.info?.resolutions && lineQuery.data?.info?.resolutions.length > 1)
          ) && (
            <div className="flex items-center gap-3">
              <Skeleton loading={ isInfoLoading }>
                { isMobile ? 'Res.' : 'Resolution' }
              </Skeleton>
              <Select
                collection={ resolutionCollection }
                placeholder="Select resolution"
                defaultValue={ [ defaultResolution ] }
                onValueChange={ onResolutionChange }
                className="w-fit lg:w-[160px]"
                loading={ isInfoLoading }
              />
            </div>
          ) }
          { (Boolean(zoomRange)) && (
            <Button
              variant="link"
              onClick={ handleReset }
              className="flex items-center gap-2"
            >
              <IconSvg name="repeat" className="size-5"/>
              { !isMobile && 'Reset' }
            </Button>
          ) }
        </div>
        <div className="flex items-center gap-3">
          { /* TS thinks window.navigator.share can't be undefined, but it can */ }
          { /* eslint-disable-next-line @typescript-eslint/no-explicit-any */ }
          { !isMobile && (isInBrowser && ((window.navigator.share as any) ?
            shareButton :
            (
              <CopyToClipboard
                text={ config.app.baseUrl + router.asPath }
                type="link"
                className="ml-0 rounded-base"
                variant="icon_background"
                size="md"
              />
            )
          )) }
          { (hasItems || lineQuery.isPlaceholderData) && (
            <ChartMenu
              charts={ charts }
              title={ replaceNativeCoinName(info?.title || '') }
              description={ replaceNativeCoinName(info?.description || '') }
              isLoading={ lineQuery.isPlaceholderData }
              chartRef={ ref }
              resolution={ resolution }
              zoomRange={ zoomRange }
              handleZoom={ handleZoom }
              handleZoomReset={ handleZoomReset }
              chartUrl={ isMobile ? window.location.href : undefined }
            />
          ) }
        </div>
      </div>
      <div className="flex relative h-[50vh] mt-3 grow" ref={ ref }>
        <ChartWidgetContent
          isError={ lineQuery.isError }
          charts={ charts }
          isEnlarged
          isLoading={ lineQuery.isPlaceholderData }
          zoomRange={ zoomRange }
          handleZoom={ handleZoom }
          empty={ !hasNonEmptyCharts }
          emptyText="No data for the selected resolution & interval."
          resolution={ resolution }
        />
      </div>
    </>
  );
};

export default Chart;
