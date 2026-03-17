import React from 'react';

import { cn } from 'lib/utils/cn';
import { AccordionItem } from 'toolkit/chakra/accordion';

interface Props {
  children: React.ReactNode;
  level?: number;
  className?: string;
  isFlat?: boolean;
  value: string;
}

const MetadataAccordionItem = ({ children, className, level, isFlat, value }: Props) => {
  return (
    <AccordionItem
      value={ value }
      className={ cn(
        'flex items-start flex-col lg:flex-row py-2 gap-x-3 border-[var(--color-border-divider)] break-all gap-y-1',
        isFlat ? 'pl-0' : 'pl-6',
        level === 0 ? 'first:border-t first:border-t-[var(--color-border-divider)] last:border-b last:border-b-[var(--color-border-divider)]'
          : 'first:border-t-0 last:border-b-0',
        className,
      ) }
    >
      { children }
    </AccordionItem>
  );
};

export default React.memo(MetadataAccordionItem);
