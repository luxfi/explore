import React from 'react';

import { cn } from 'lib/utils/cn';
import { Tooltip } from '@luxfi/ui/tooltip';
import IconSvg from 'ui/shared/IconSvg';

import type { TxCourseType } from './utils';

interface Props {
  isLoading?: boolean;
  type: TxCourseType;
  className?: string;
}

const TYPE_CLASSES: Record<TxCourseType, string> = {
  'in': 'text-green-500 dark:text-green-200 bg-green-50 dark:bg-green-800',
  out: 'text-yellow-600 dark:text-yellow-500 bg-orange-50 dark:bg-yellow-900',
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
