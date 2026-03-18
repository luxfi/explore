import React from 'react';

import { Skeleton } from '@luxfi/ui/skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  apiKey: string;
  name: string;
  isLoading?: boolean;
}

const ApiKeySnippet = ({ apiKey, name, isLoading }: Props) => {
  return (
    <div className="flex flex-row gap-2 items-start">
      <IconSvg name="key" className="w-6 h-6 text-[var(--color-icon-primary)]" isLoading={ isLoading }/>
      <div>
        <div className="flex items-start lg:items-center">
          <Skeleton loading={ isLoading } display="inline-block" fontWeight={ 600 } mr={ 1 }>
            <span>{ apiKey }</span>
          </Skeleton>
          <CopyToClipboard text={ apiKey } isLoading={ isLoading }/>
        </div>
        { name && (
          <Skeleton loading={ isLoading } display="inline-block" fontSize="sm" color="text.secondary" mt={ 1 }>
            <span>{ name }</span>
          </Skeleton>
        ) }
      </div>
    </div>
  );
};

export default React.memo(ApiKeySnippet);
