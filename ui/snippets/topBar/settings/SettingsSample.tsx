import React from 'react';

import { cn } from 'lib/utils/cn';
import { Tooltip } from 'toolkit/chakra/tooltip';

interface Props {
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  isActive: boolean;
  bg: string;
  value: string;
  label: string;
}

const SettingsSample = ({ label, value, bg, onClick, isActive }: Props) => {
  return (
    <div className={ cn('p-[9px] rounded', isActive ? 'bg-gray-100 dark:bg-[var(--color-whiteAlpha-100)]' : 'bg-transparent') }>
      <Tooltip content={ label }>
        <div
          className={ cn(
            'w-[22px] h-[22px] rounded-full border cursor-pointer relative',
            'before:absolute before:block before:content-[\'\'] before:-top-[3px] before:-left-[3px]',
            'before:w-[calc(100%+2px)] before:h-[calc(100%+2px)] before:border-solid before:rounded-full before:border-2',
            'before:box-content',
            isActive
              ? 'border-gray-100 dark:border-[var(--color-whiteAlpha-100)] before:border-[var(--color-blackAlpha-800)] dark:before:border-gray-50'
              : 'border-white dark:border-gray-900 before:border-transparent hover:before:border-[var(--color-hover)]',
          ) }
          style={{ background: bg }}
          data-value={ value }
          onClick={ onClick }
        />
      </Tooltip>
    </div>
  );
};

export default React.memo(SettingsSample);
