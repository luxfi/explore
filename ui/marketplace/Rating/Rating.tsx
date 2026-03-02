import React from 'react';

import config from 'configs/app';
import { cn } from 'lib/utils/cn';
import type { EventTypes, EventPayload } from 'lib/mixpanel/index';
import type { PopoverContentProps } from '@luxfi/ui/popover';
import { PopoverBody, PopoverContent, PopoverRoot } from '@luxfi/ui/popover';
import { Rating as RatingComponent } from '@luxfi/ui/rating';
import { Skeleton } from '@luxfi/ui/skeleton';
import useIsAuth from 'ui/snippets/auth/useIsAuth';

import Content from './PopoverContent';
import TriggerButton from './TriggerButton';

const feature = config.features.marketplace;
const isEnabled = feature.isEnabled && 'api' in feature;

type Props = {
  appId: string; rating?: number; ratingsTotalCount?: number; userRating?: number;
  isLoading?: boolean; fullView?: boolean;
  source: EventPayload<EventTypes.APP_FEEDBACK>['Source'];
  popoverContentProps?: PopoverContentProps;
};

const Rating = ({ appId, rating, ratingsTotalCount, userRating, isLoading, fullView, source, popoverContentProps }: Props) => {
  const isAuth = useIsAuth();
  if (!isEnabled) { return null; }

  return (
    <Skeleton display="flex" alignItems="center" loading={ isLoading } w={ (isLoading && !fullView) ? '40px' : 'auto' }>
      { fullView && (
        <>
          <RatingComponent defaultValue={ Math.floor(rating || 0) } readOnly key={ rating }/>
          { rating && <span className="text-base ml-2">{ rating }</span> }
          { ratingsTotalCount && <span className="text-[var(--color-text-secondary)] text-base ml-1">({ ratingsTotalCount })</span> }
        </>
      ) }
      <PopoverRoot positioning={{ placement: 'bottom' }}>
        <TriggerButton rating={ rating } count={ ratingsTotalCount } fullView={ fullView } canRate={ isAuth }/>
        { isAuth ? (
          <PopoverContent className={ cn('w-[250px]', popoverContentProps?.className) } { ...popoverContentProps }>
            <PopoverBody><Content appId={ appId } userRating={ userRating } source={ source }/></PopoverBody>
          </PopoverContent>
        ) : <PopoverContent/> }
      </PopoverRoot>
    </Skeleton>
  );
};

export default Rating;
