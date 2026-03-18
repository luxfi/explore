import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';

type Props = {
  name: string;
  value: string;
  icon: React.ReactNode;
  valueSecondary?: string;
  isLoading: boolean;
  contentAfter?: React.ReactNode;
};

const TokenBalancesItem = ({ name, icon, value, valueSecondary, isLoading, contentAfter }: Props) => {

  return (
    <div px="12px" py="10px" bgColor={{ _light: 'theme.stats.bg._light', _dark: 'theme.stats.bg._dark' }} borderRadius="base">
      <span color="text.secondary" textStyle="xs" fontWeight={ 500 } mb={ 1 }>{ name }</span>
      <div className="flex" alignItems="center">
        { icon }
        <Skeleton loading={ isLoading } fontWeight="500" whiteSpace="pre-wrap" wordBreak="break-word" display="flex" ml={ 2 }>
          { value }
          { Boolean(valueSecondary) && <span color="text.secondary"> ({ valueSecondary })</span> }
        </Skeleton>
        { contentAfter }
      </div>
    </div>
  );
};

export default React.memo(TokenBalancesItem);
