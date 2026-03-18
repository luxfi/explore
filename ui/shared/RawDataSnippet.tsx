import React from 'react';

import { cn } from 'lib/utils/cn';
import { Skeleton } from 'toolkit/chakra/skeleton';

import CopyToClipboard from './CopyToClipboard';

interface Props {
  data: React.ReactNode;
  title?: string;
  className?: string;
  rightSlot?: React.ReactNode;
  beforeSlot?: React.ReactNode;
  textareaMaxHeight?: string;
  textareaMinHeight?: string;
  showCopy?: boolean;
  isLoading?: boolean;
  contentProps?: React.HTMLAttributes<HTMLDivElement>;
}

const RawDataSnippet = ({
  data,
  className,
  title,
  rightSlot,
  beforeSlot,
  textareaMaxHeight,
  textareaMinHeight,
  showCopy = true,
  isLoading,
  contentProps,
}: Props) => {
  return (
    <section className={ className } title={ title }>
      { (title || rightSlot || showCopy) && (
        <div className={ cn('flex items-center mb-1 lg:mb-3', title ? 'justify-between' : 'justify-end') }>
          { title && <Skeleton fontWeight={ 500 } loading={ isLoading } className="font-medium">{ title }</Skeleton> }
          { rightSlot }
          { typeof data === 'string' && showCopy && <CopyToClipboard text={ data } isLoading={ isLoading }/> }
        </div>
      ) }
      { beforeSlot }
      <Skeleton
        loading={ isLoading }
        borderRadius="md"
        className="p-4 text-sm break-all whitespace-pre-wrap overflow-x-hidden overflow-y-auto"
        style={{
          maxHeight: textareaMaxHeight || '400px',
          minHeight: textareaMinHeight || (isLoading ? '200px' : undefined),
          backgroundColor: isLoading ? 'inherit' : undefined,
        }}
        { ...contentProps }
      >
        { data }
      </Skeleton>
    </section>
  );
};

export default React.memo(RawDataSnippet);
