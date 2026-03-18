import React from 'react';

import { Heading } from 'toolkit/chakra/heading';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Hint } from 'toolkit/components/Hint/Hint';

import MeritsIcon from '../MeritsIcon';

type Props = {
  label?: string;
  value: number | string | undefined;
  withIcon?: boolean;
  hint?: string | React.ReactNode;
  isLoading?: boolean;
  bottomText?: string;
  isBottomTextLoading?: boolean;
};

const RewardsDashboardCardValue = ({ label, value, withIcon, hint, isLoading, bottomText, isBottomTextLoading }: Props) => (
  <div key={ label } className="flex flex-col items-center gap-1 md:gap-2">
    { label && (
      <div className="flex items-center gap-1">
        { hint && <Hint label={ hint }/> }
        <span className="text-xs font-medium text-[var(--color-text-secondary)]">
          { label }
        </span>
      </div>
    ) }
    <Skeleton
      loading={ isLoading }
      display="flex"
      alignItems="center"
      justifyContent="center"
      gap={ 2 }
      minW="100px"
    >
      { withIcon && <MeritsIcon className="w-8 h-8"/> }
      <Heading level="1">
        { value }
      </Heading>
    </Skeleton>
    { bottomText && (
      <Skeleton loading={ isBottomTextLoading || isLoading } minW="100px">
        <span className="text-xs md:text-sm text-[var(--color-text-secondary)]">
          { bottomText }
        </span>
      </Skeleton>
    ) }
  </div>
);

export default RewardsDashboardCardValue;
