import React from 'react';

import { cn } from 'lib/utils/cn';
import IconSvg from 'ui/shared/IconSvg';

const TokenLogoPlaceholder = (props: Record<string, unknown>) => {
  const { className, ...rest } = props;
  return (
    <IconSvg
      className={ cn(
        'w-6 h-6 font-semibold rounded-base',
        'bg-[var(--color-gray-200)] dark:bg-[var(--color-gray-600)]',
        'text-[var(--color-gray-400)] dark:text-[var(--color-gray-200)]',
        'transition-colors duration-normal ease-in-out',
        className as string,
      ) }
      name="token-placeholder"
      { ...rest }
    />
  );
};

export default TokenLogoPlaceholder;
