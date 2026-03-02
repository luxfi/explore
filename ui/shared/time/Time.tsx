import React from 'react';

import { useSettingsContext } from 'lib/contexts/settings';
import dayjs, { FORMATS } from 'lib/date/dayjs';

interface Props extends React.HTMLAttributes<HTMLSpanElement> {
  timestamp: string | number;
  format?: string;
  color?: string;
  fontWeight?: string;
  display?: string;
  mt?: string;
  textAlign?: string;
  flexShrink?: number;
  ml?: string;
}

const Time = ({ timestamp, format = 'lll', className, ...rest }: Props) => {
  const settings = useSettingsContext();
  const formatStr = FORMATS[format as keyof typeof FORMATS] || format;
  return <span className={ className } { ...rest }>{ dayjs(timestamp).utc(settings?.isLocalTime).format(formatStr) }</span>;
};

export default React.memo(Time);
