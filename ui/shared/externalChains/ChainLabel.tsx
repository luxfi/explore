import React from 'react';

import type { ExternalChain } from 'types/externalChains';

import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

import ChainIcon from './ChainIcon';

interface Props {
  data: Omit<ExternalChain, 'explorer_url'> | undefined;
  isLoading?: boolean;
  fallback?: React.ReactNode;
  className?: string;
}

const ChainLabel = ({ data, isLoading, fallback, className }: Props) => {
  if (!data) {
    return fallback || null;
  }

  const content = (
    <>
      <span className="font-semibold">{ data.name }</span>
      <span className="flex items-center justify-center">
        ChainID: { data.id }
        <CopyToClipboard text={ data.id } noTooltip/>
      </span>
    </>
  );

  return (
    <div className={ `flex items-center gap-2 w-full whitespace-nowrap ${ className ?? '' }`.trim() }>
      <ChainIcon data={ data } isLoading={ isLoading } noTooltip/>
      <Tooltip content={ content } interactive>
        <Skeleton loading={ isLoading } className="overflow-hidden text-ellipsis">
          { data.name }
        </Skeleton>
      </Tooltip>
    </div>
  );
};

export default React.memo(ChainLabel);
