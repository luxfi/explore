import React from 'react';

import type { GasPriceInfo, GasPrices } from 'types/api/stats';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { SECOND } from 'toolkit/utils/consts';
import { asymp } from 'toolkit/utils/htmlEntities';
import GasPrice from 'ui/shared/gas/GasPrice';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  type: keyof GasPrices;
  data: GasPriceInfo;
  isLoading: boolean;
}

const TITLES: Record<keyof GasPrices, string> = {
  fast: 'Fast',
  average: 'Normal',
  slow: 'Slow',
};
const ICONS: Record<keyof GasPrices, IconName> = {
  fast: 'rocket_xl',
  average: 'gas_xl',
  slow: 'gas_xl',
};

const GasTrackerPriceSnippet = ({ data, type, isLoading }: Props) => {
  const bgColors = {
    fast: 'transparent',
    average: { _light: 'gray.50', _dark: 'whiteAlpha.200' },
    slow: { _light: 'gray.50', _dark: 'whiteAlpha.200' },
  };
  const borderColor = { _light: 'gray.200', _dark: 'whiteAlpha.300' };

  return (
    <li className="list-none px-9 py-6 lg:w-1/3 [&:not(:last-child)]:border-b-2 lg:[&:not(:last-child)]:border-b-0 lg:[&:not(:last-child)]:border-r-2 border-gray-200 dark:border-white/30">

      <Skeleton loading={ isLoading } textStyle="heading.lg" w="fit-content">{ TITLES[type] }</Skeleton>
      <div className="flex gap-x-3 items-center mt-3">
        <IconSvg name={ ICONS[type] } className="w-[30px] h-[30px] xl:w-10 xl:h-10 shrink-0" isLoading={ isLoading }/>
        <Skeleton loading={ isLoading }>
          <GasPrice data={ data } className="text-[36px] xl:text-[48px] leading-[48px] font-semibold tracking-tight font-heading"/>
        </Skeleton>
      </div>
      <Skeleton loading={ isLoading } color="text.secondary" mt={ 3 } w="fit-content" className="text-sm">
        { data.price !== null && data.fiat_price !== null && <GasPrice data={ data } prefix={ `${ asymp } ` } unitMode="secondary"/> }
        <span> per transaction</span>
        { typeof data.time === 'number' && data.time > 0 && <span> / { (data.time / SECOND).toLocaleString(undefined, { maximumFractionDigits: 1 }) }s</span> }
      </Skeleton>
      <Skeleton loading={ isLoading } color="text.secondary" mt={ 2 } w="fit-content" className="text-sm whitespace-pre">
        { typeof data.base_fee === 'number' && <span>Base { data.base_fee.toLocaleString(undefined, { maximumFractionDigits: 0 }) }</span> }
        { typeof data.base_fee === 'number' && typeof data.priority_fee === 'number' && <span> / </span> }
        { typeof data.priority_fee === 'number' && <span>Priority { data.priority_fee.toLocaleString(undefined, { maximumFractionDigits: 0 }) }</span> }
      </Skeleton>
    </li>
  );
};

export default React.memo(GasTrackerPriceSnippet);
