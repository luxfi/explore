import React from 'react';

import { cn } from 'lib/utils/cn';
import IconSvg from 'ui/shared/IconSvg';

const NftFallback = ({ className }: { className?: string }) => {
  return (
    <IconSvg
      className={ cn(
        'p-[50px] text-[var(--color-blackAlpha-500)] dark:text-[var(--color-whiteAlpha-500)]',
        'bg-[var(--color-blackAlpha-50)] dark:bg-[var(--color-whiteAlpha-50)]',
        className,
      ) }
      name="nft_shield"
    />
  );
};

export default NftFallback;
