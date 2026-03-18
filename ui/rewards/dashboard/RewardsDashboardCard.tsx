import React from 'react';

import { cn } from 'lib/utils/cn';
import { Badge } from '@luxfi/ui/badge';
import { Heading } from '@luxfi/ui/heading';
import { Hint } from 'toolkit/components/Hint/Hint';

type Props = {
  title: string;
  description: string | React.ReactNode;
  hint?: string | React.ReactNode;
  availableSoon?: boolean;
  blurFilter?: boolean;
  contentAfter?: React.ReactNode;
  contentDirection?: 'column' | 'column-reverse' | 'row';
  reverse?: boolean;
  children?: React.ReactNode;
  label?: string;
  isLoading?: boolean;
  cardValueStyle?: object;
};

const RewardsDashboardCard = ({
  title, description, availableSoon, contentAfter, cardValueStyle, hint,
  contentDirection = 'column', children, blurFilter, label, isLoading,
}: Props) => {
  return (
    <section
      className={ cn(
        'flex p-1.5 md:p-2 border border-gray-200 dark:border-[var(--color-whiteAlpha-200)] rounded-lg gap-4',
        contentDirection === 'row' ? 'flex-col md:flex-row md:gap-10 w-full' : '',
        contentDirection === 'column' ? 'flex-col' : '',
        contentDirection === 'column-reverse' ? 'flex-col-reverse justify-end' : '',
        contentDirection !== 'row' ? 'flex-1' : 'flex-none',
      ) }
    >
      <div
        className={ cn(
          'flex flex-col gap-2 px-1.5 md:px-3',
          contentDirection === 'column-reverse' ? 'pb-1.5 md:pb-3' : 'pt-1.5 md:pt-3',
          contentDirection === 'row' ? 'w-full md:w-[340px] flex-1' : 'w-full',
        ) }
      >
        { label && <Badge loading={ isLoading }>{ label }</Badge> }
        { title && (
          <div className="flex items-center gap-2">
            <Heading level="3">{ title }</Heading>
            { hint && <Hint label={ hint } tooltipProps={{ interactive: true }}/> }
            { availableSoon && <Badge colorPalette="blue">Available soon</Badge> }
          </div>
        ) }
        <div className="text-sm">
          { description }
        </div>
        <div className={ cn('flex flex-col', contentDirection === 'column-reverse' ? 'mt-auto' : '') }>
          { contentAfter }
        </div>
      </div>
      <div
        className={ cn(
          'flex items-center justify-around rounded-lg md:rounded-[8px] min-h-[104px] md:min-h-[128px]',
          'bg-gray-50 dark:bg-[var(--color-whiteAlpha-50)]',
          contentDirection === 'column' ? 'mt-auto' : '',
          contentDirection === 'row' ? 'flex-1' : 'flex-none',
          blurFilter ? 'blur-[4px]' : '',
        ) }
        { ...cardValueStyle }
      >
        { children }
      </div>
    </section>
  );
};

export default RewardsDashboardCard;
