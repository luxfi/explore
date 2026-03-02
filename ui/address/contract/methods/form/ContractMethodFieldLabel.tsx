import React from 'react';

import type { ContractAbiItemInput } from '../types';

import { cn } from 'lib/utils/cn';
import { Hint } from 'toolkit/components/Hint/Hint';

import { getFieldLabel } from './utils';

interface Props {
  data: ContractAbiItemInput;
  isOptional?: boolean;
  level: number;
}

const ContractMethodFieldLabel = ({ data, isOptional, level }: Props) => {
  return (
    <div
      className={ cn(
        'w-[250px] text-sm py-1.5 shrink-0 font-medium break-all',
        level > 1 && 'text-black/60 dark:text-white/60',
      ) }
    >
      { getFieldLabel(data, !isOptional) }
      { data.type === 'string' && <Hint label={ `The "" string will be treated as an empty string` } className="ml-2"/> }
    </div>
  );
};

export default React.memo(ContractMethodFieldLabel);
