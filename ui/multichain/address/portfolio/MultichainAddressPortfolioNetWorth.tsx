import { Separator } from 'toolkit/chakra/separator';
import { BigNumber } from 'bignumber.js';
import React from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import { cn } from 'lib/utils/cn';
import * as mixpanel from 'lib/mixpanel';
import { Skeleton } from 'toolkit/chakra/skeleton';
import AddressMultichainButton from 'ui/address/details/AddressMultichainButton';
import AdBanner from 'ui/shared/ad/AdBanner';
import IconSvg from 'ui/shared/IconSvg';
import SimpleValue from 'ui/shared/value/SimpleValue';
import { DEFAULT_ACCURACY_USD } from 'ui/shared/value/utils';

import { formatPercentage } from './utils';

const multichainBalanceFeature = config.features.multichainButton;

const TOP_TOKENS_COLORS = [
  [ 'purple.300', 'pink.300', 'blackAlpha.300' ],
  [ 'purple.500', 'pink.600', 'whiteAlpha.300' ],
];

const getBgColor = (index: number) => {
  return {
    _light: TOP_TOKENS_COLORS[0][index],
    _dark: TOP_TOKENS_COLORS[1][index],
  };
};

interface Props {
  addressHash: string;
  netWorth?: string;
  isLoading: boolean;
  topTokens?: Array<{ symbol: string; share: number }>;
}

const MultichainAddressPortfolioNetWorth = ({ addressHash, netWorth, isLoading, topTokens }: Props) => {
  const isMobile = useIsMobile();

  const handleMultichainClick = React.useCallback(() => {
    mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: 'Multichain', Source: 'address' });
  }, []);

  const topTokensContent = (() => {
    if (!topTokens) {
      return (
        <span className="text-[var(--color-text-secondary)]">There are no tokens at this address</span>
      );
    }

    return (
      <>
        <Skeleton loading={ isLoading } className="w-full lg:w-[225px] rounded-full overflow-hidden" h={ 3 } display="flex" alignItems="center">
          { topTokens.map((token, index) => (
            <div
              key={ token.symbol }
              className="h-full min-w-px"
              style={{
                width: `${ token.share * 100 }%`,
                backgroundColor: `var(--color-${ getBgColor(token.symbol === 'Others' ? 2 : index)._light })`,
              }}
            />
          )) }
        </Skeleton>
        <div className="flex flex-wrap">
          { topTokens.map((token, index) => (
            <div key={ token.symbol }>
              <Skeleton
                w="16px"
                h="16px"
                borderRadius="full"
                loading={ isLoading }
              >
                <span/>
              </Skeleton>
              <Skeleton loading={ isLoading } fontWeight={ 600 } className="whitespace-pre">
                <span>{ token.symbol }</span>
                <span className="text-[var(--color-text-secondary)]"> { formatPercentage(token.share) }</span>
              </Skeleton>
            </div>
          )) }
        </div>
      </>
    );

  })();

  return (
    <div className="flex items-center w-full h-auto lg:h-[100px]">
      <div
        className="flex-grow rounded-[var(--radius-base,8px)] overflow-hidden h-full flex flex-col gap-px"
      >
        <div
          className="flex flex-col lg:flex-row items-start lg:items-center bg-black/5 dark:bg-white/10 basis-1/2 w-full p-3 gap-3 whitespace-pre text-sm"
        >
          <div className="flex items-center">
            <IconSvg name="wallet" className="w-5 h-5 shrink-0 text-[var(--color-icon-primary)]"/>
            <span className="ml-2 font-medium">Total net worth</span>
            <span className="text-[var(--color-text-secondary)]"> (without NFT)</span>
          </div>
          <div >
            <SimpleValue
              value={ BigNumber(netWorth ?? 0) }
              prefix="$"
              loading={ isLoading }
              accuracy={ DEFAULT_ACCURACY_USD }
              className={ cn('font-semibold', !netWorth && 'text-[var(--color-text-secondary)]') }
            />
            { multichainBalanceFeature.isEnabled && (
              <>
                <Separator className="mx-3 h-4" orientation="vertical"/>
                <div className="flex gap-3">
                  { multichainBalanceFeature.providers.map((item) => (
                    <AddressMultichainButton
                      key={ item.name }
                      item={ item }
                      addressHash={ addressHash }
                      onClick={ handleMultichainClick }
                    />
                  )) }
                </div>
              </>
            ) }
          </div>
        </div>
        <div
          className="flex flex-col lg:flex-row items-start lg:items-center bg-black/5 dark:bg-white/10 basis-1/2 w-full p-3 gap-3 text-xs"
        >
          { topTokensContent }
        </div>
      </div>
      { !isMobile && <AdBanner format="mobile" className="w-fit"/> }
    </div>
  );
};

export default React.memo(MultichainAddressPortfolioNetWorth);
