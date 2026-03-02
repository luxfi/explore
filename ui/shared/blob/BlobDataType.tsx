import React from 'react';

import * as blobUtils from 'lib/blob';
import { Skeleton } from '@luxfi/ui/skeleton';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';
interface Props {
  data: string;
  isLoading?: boolean;
}

const TYPES: Record<string, { iconName: IconName; label: string }> = {
  image: { iconName: 'blobs/image', label: 'Image' },
  text: { iconName: 'blobs/text', label: 'Text' },
  raw: { iconName: 'blobs/raw', label: 'Raw' },
};

const BlobDataType = ({ data, isLoading }: Props) => {
  const guessedType = React.useMemo(() => {
    if (isLoading) {
      return;
    }
    return blobUtils.guessDataType(data);
  }, [ data, isLoading ]);

  const { iconName, label } = (() => {
    if (guessedType?.mime?.startsWith('image/')) {
      return TYPES.image;
    }

    if (
      guessedType?.mime?.startsWith('text/') ||
      [
        'application/json',
        'application/xml',
        'application/javascript',
      ].includes(guessedType?.mime || '')
    ) {
      return TYPES.text;
    }

    return TYPES.raw;
  })();

  return (
    <div className="flex items-center gap-x-2">
      <IconSvg name={ iconName } className="w-5 h-5 text-[var(--color-icon-primary)]" isLoading={ isLoading }/>
      <Skeleton loading={ isLoading }>{ label }</Skeleton>
    </div>
  );
};

export default React.memo(BlobDataType);
