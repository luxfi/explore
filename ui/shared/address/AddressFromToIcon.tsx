import { Tooltip } from '@luxfi/ui/tooltip';
import React from 'react';

import { cn } from 'lib/utils/cn';
import IconSvg from 'ui/shared/IconSvg';

import type { TxCourseType } from './utils';

interface Props {
  isLoading?: boolean;
  type: TxCourseType;
  className?: string;
}

const TYPE_CLASSES: Record<TxCourseType, string> = {
  'in': 'text-good dark:text-good bg-good/10 dark:bg-good/10',
  out: 'text-warn dark:text-warn bg-warn/10 dark:bg-warn/10',
  self: 'text-[var(--color-blackAlpha-400)] dark:text-[var(--color-whiteAlpha-400)] bg-[var(--color-blackAlpha-50)] dark:bg-[var(--color-whiteAlpha-50)]',
  unspecified: 'text-[var(--color-icon-primary)] bg-transparent',
};

const AddressFromToIcon = ({ isLoading, type, className }: Props) => {
  const labels = {
    'in': 'Incoming txn',
    out: 'Outgoing txn',
    self: 'Txn to the same address',
  };

  const icon = (
    <IconSvg
      name="arrows/east"
      className={ cn('w-5 h-5 shrink-0 rounded-sm', TYPE_CLASSES[type], className) }
      isLoading={ isLoading }
    />
  );

  if (type === 'unspecified') {
    return icon;
  }

  return (
    <Tooltip content={ labels[type] }>
      { icon }
    </Tooltip>
  );
};

export default React.memo(AddressFromToIcon);
