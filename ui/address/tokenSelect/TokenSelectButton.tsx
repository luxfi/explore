import React from 'react';

import type { FormattedData } from './types';

import * as mixpanel from 'lib/mixpanel/index';
import { cn } from 'lib/utils/cn';
import { Button } from 'toolkit/chakra/button';
import { space, thinsp } from 'toolkit/utils/htmlEntities';
import IconSvg from 'ui/shared/IconSvg';

import { getTokensTotalInfo } from '../utils/tokenUtils';

interface Props {
  isOpen: boolean;
  isLoading?: boolean;
  data: FormattedData;
}

const TokenSelectButton = ({ isOpen, isLoading, data, ...rest }: Props, ref: React.ForwardedRef<HTMLButtonElement>) => {
  const { usd, num, isOverflow } = getTokensTotalInfo(data);

  const prefix = isOverflow ? ` >${ thinsp }` : '';

  const handleClick = React.useCallback(() => {
    if (isLoading && !isOpen) {
      return;
    }

    mixpanel.logEvent(mixpanel.EventTypes.PAGE_WIDGET, { Type: 'Tokens dropdown' });
  }, [ isLoading, isOpen ]);

  return (
    <div className="relative group">
      <Button
        ref={ ref }
        size="sm"
        variant="dropdown"
        onClick={ handleClick }
        className="gap-0"
        aria-label="Token select"
        loadingSkeleton={ isLoading && !isOpen }
        { ...rest }
      >
        <IconSvg name="tokens" className="w-4 h-4 mr-2"/>
        <span className="font-semibold">{ prefix }{ num }</span>
        <span
          className={ cn(
            'whitespace-pre text-ellipsis font-normal overflow-hidden max-w-[calc(100vw-230px)] lg:max-w-[500px]',
            isOpen ? 'text-inherit' : 'text-[var(--color-text-secondary)] group-hover:text-inherit',
          ) }
        >
          { space }({ prefix }${ usd.toFormat(2) })
        </span>
        <IconSvg name="arrows/east-mini" style={{ transform:  isOpen ? 'rotate(90deg)' : 'rotate(-90deg)'  }} className="transition-transform duration-150 w-5 h-5 ml-3"/>
      </Button>
    </div>
  );
};

export default React.forwardRef(TokenSelectButton);
