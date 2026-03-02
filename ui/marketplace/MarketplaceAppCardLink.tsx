import React from 'react';
import type { MouseEvent } from 'react';

import { route } from 'nextjs-routes';

import { cn } from 'lib/utils/cn';
import { LinkOverlay } from 'toolkit/next/link';

type Props = {
  id: string;
  url: string;
  external?: boolean;
  title: string;
  onClick?: (event: MouseEvent, id: string) => void;
  className?: string;
};

const MarketplaceAppCardLink = ({ url, external, id, title, onClick, className }: Props) => {
  const handleClick = React.useCallback((event: MouseEvent) => {
    onClick?.(event, id);
  }, [ onClick, id ]);

  return (
    <LinkOverlay
      href={ external ? url : route({ pathname: '/apps/[id]', query: { id } }) }
      className={ cn('mr-2', className) }
      external={ external }
      onClick={ handleClick }
      noIcon
    >
      { title }
    </LinkOverlay>
  );
};

export default MarketplaceAppCardLink;
