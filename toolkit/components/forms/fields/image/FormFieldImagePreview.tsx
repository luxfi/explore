import React from 'react';

import type { ColorMode } from 'toolkit/next/color-mode';
import { Image } from '@luxfi/ui/image';
import { Skeleton } from '@luxfi/ui/skeleton';

interface Props {
  src: string | undefined;
  onLoad?: () => void;
  onError?: () => void;
  isInvalid: boolean;
  className?: string;
  fallback: React.ReactElement;
  colorMode?: ColorMode;
}

export const FormFieldImagePreview = React.memo(({
  src,
  isInvalid,
  onError,
  onLoad,
  className,
  fallback: fallbackProp,
  colorMode,
}: Props) => {
  const skeleton = <Skeleton loading className={ [ 'w-full h-full', className, colorMode === 'dark' ? 'dark' : undefined ].filter(Boolean).join(' ') }/>;

  const fallback = (() => {
    if (src && !isInvalid) {
      return skeleton;
    }
    return fallbackProp;
  })();

  return (
    <Image
      key={ src }
      className={ className }
      src={ src }
      alt="Image preview"
      w="auto"
      h="100%"
      fallback={ fallback }
      onError={ onError }
      onLoad={ onLoad }
    />
  );
});
