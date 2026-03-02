// eslint-disable-next-line no-restricted-imports
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import minMax from 'dayjs/plugin/minMax';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';

import { nbsp } from 'toolkit/utils/htmlEntities';

const LUX_FORMATS = {
  LT: 'h:mm A',
  LTS: 'h:mm:ss A',
  L: 'MM/DD/YYYY',
  LL: 'MMMM D, YYYY',
  LLL: 'MMMM D, YYYY h:mm A',
  LLLL: 'dddd, MMMM D, YYYY h:mm A',
  llll: `MMM DD YYYY HH:mm:ss (Z${ nbsp }UTC)`,
  lll: 'MMM D, YYYY H:mm',
};

const relativeTimeConfig = {
  thresholds: [
    { l: 's', r: 1 },
    { l: 'ss', r: 59, d: 'second' },
    { l: 'm', r: 1 },
    { l: 'mm', r: 59, d: 'minute' },
    { l: 'h', r: 1 },
    { l: 'hh', r: 23, d: 'hour' },
    { l: 'd', r: 1 },
    { l: 'dd', r: 6, d: 'day' },
    { l: 'w', r: 1 },
    { l: 'ww', r: 4, d: 'week' },
    { l: 'M', r: 1 },
    { l: 'MM', r: 11, d: 'month' },
    { l: 'y', r: 17 },
    { l: 'yy', d: 'year' },
  ],
};

const LUX_RELATIVE_TIME = {
  s: '1s',
  ss: '%ds',
  future: 'in %s',
  past: '%s ago',
  m: '1m',
  mm: '%dm',
  h: '1h',
  hh: '%dh',
  d: '1d',
  dd: '%dd',
  w: '1w',
  ww: '%dw',
  M: '1mo',
  MM: '%dmo',
  y: '1y',
  yy: '%dy',
};

// Safety plugin: @reown/appkit-common sets the global dayjs locale to 'en-web3-modal'
// which has no `formats` property. The localizedFormat plugin crashes with
// "Cannot read properties of undefined (reading 'replace')" when lowercase format
// tokens (lll, llll) are used on a locale without formats. This plugin ensures
// formats are always present on whichever locale the instance uses.
// Must be registered AFTER localizedFormat.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const safeFormats: dayjs.PluginFunc = (_option, dayjsClass: any) => {
  const wrappedFormat = dayjsClass.prototype.format;
  dayjsClass.prototype.format = function(formatStr?: string) {
    const locale = this.$locale();
    if (locale && !locale.formats) {
      locale.formats = LUX_FORMATS;
    }
    return wrappedFormat.call(this, formatStr);
  };
};

// Safety plugin: the 'en-web3-modal' locale from @reown/appkit-common defines
// relativeTime WITHOUT 'w' and 'ww' (week) keys. Our custom thresholds include
// week entries, so when fromNow()/from() hits the 'w' threshold and looks up
// relativeTime['w'], it gets undefined and crashes with "TypeError: b is not a
// function". This plugin patches fromNow/from/toNow/to to ensure the locale's
// relativeTime always contains the required keys before the call proceeds.
// Must be registered AFTER relativeTime.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const safeRelativeTime: dayjs.PluginFunc = (_option, dayjsClass: any) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  function ensureRelativeTimeKeys(instance: any): void {
    const locale = instance.$locale();
    if (locale && locale.relativeTime) {
      const rt = locale.relativeTime;
      if (!rt.w || !rt.ww) {
        locale.relativeTime = { ...LUX_RELATIVE_TIME, ...rt };
      }
    }
  }

  for (const method of [ 'fromNow', 'from', 'toNow', 'to' ] as const) {
    const original = dayjsClass.prototype[method];
    if (original) {
      dayjsClass.prototype[method] = function(...args: Array<unknown>) {
        ensureRelativeTimeKeys(this);
        return original.apply(this, args);
      };
    }
  }
};

dayjs.extend(relativeTime, relativeTimeConfig);
dayjs.extend(updateLocale);
dayjs.extend(localizedFormat);
dayjs.extend(safeFormats);
dayjs.extend(safeRelativeTime);
dayjs.extend(duration);
dayjs.extend(weekOfYear);
dayjs.extend(minMax);
dayjs.extend(utc);

dayjs.updateLocale('en', {
  formats: LUX_FORMATS,
  relativeTime: LUX_RELATIVE_TIME,
});

dayjs.locale('en');

export default dayjs;

export const FORMATS = {
  // the "lll" format with seconds
  lll_s: 'MMM D, YYYY H:mm:ss',
};
