import React from 'react';

import type { TimeFormat } from 'types/settings';

import { useSettingsContext } from 'lib/contexts/settings';
import dayjs from 'lib/date/dayjs';
import useTimeAgoIncrement from 'lib/hooks/useTimeAgoIncrement';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tooltip } from '@luxfi/ui/tooltip';

type Props = {
  timestamp?: string | number | null;
  fallbackText?: string;
  isLoading?: boolean;
  enableIncrement?: boolean;
  className?: string;
  timeFormat?: TimeFormat;
  color?: string;
  fontWeight?: string;
  fontSize?: string;
  mt?: string;
  mb?: string;
  display?: string;
  w?: string;
  h?: string;
  my?: string;
  flexShrink?: number;
  ml?: string | number;
};

const TimeWithTooltip = ({ timestamp, fallbackText, isLoading, enableIncrement, className, timeFormat: timeFormatProp, my, ...rest }: Props) => {
  // Convert my (margin-y) to mt+mb for Skeleton
  if (my !== undefined) {
    if (rest.mt === undefined) {
      rest.mt = my;
    }
    if (rest.mb === undefined) {
      rest.mb = my;
    }
  }

  const settings = useSettingsContext();
  const timeFormat = timeFormatProp || settings?.timeFormat || 'relative';
  const timeAgo = useTimeAgoIncrement(timestamp || '', enableIncrement && !isLoading && timeFormat === 'relative');

  if (!timestamp && !fallbackText) {
    return null;
  }

  const content = (() => {
    if (!timestamp) {
      return fallbackText;
    }

    if (timeFormat === 'relative') {
      const content = settings?.isLocalTime ? dayjs(timestamp).format('llll') : dayjs(timestamp).utc().format('llll');
      return <Tooltip content={ content }><span>{ timeAgo }</span></Tooltip>;
    }

    return <Tooltip content={ timeAgo }><span>{ dayjs(timestamp).utc(settings?.isLocalTime).format('lll') }</span></Tooltip>;
  })();

  return (
    <Skeleton loading={ isLoading } className={ className } { ...rest }>
      { content }
    </Skeleton>
  );
};

export default TimeWithTooltip;
