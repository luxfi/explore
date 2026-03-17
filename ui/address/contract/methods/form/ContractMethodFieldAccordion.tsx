import React from 'react';

import { cn } from 'lib/utils/cn';
import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from 'toolkit/chakra/accordion';
import ArrayButton from 'ui/shared/forms/ArrayButton';

export interface Props {
  label: string;
  level: number;
  children: React.ReactNode;
  onAddClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  onRemoveClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  index?: number;
  isInvalid?: boolean;
}

const ContractMethodFieldAccordion = ({ label, level, children, onAddClick, onRemoveClick, index, isInvalid }: Props) => {
  return (
    <AccordionRoot
      className={ cn(
        'w-full rounded-base',
        level === 0
          ? 'bg-black/5 dark:bg-white/5'
          : 'bg-white/70 dark:bg-black/70',
      ) }
    >
      <AccordionItem value="default" className="first:border-t-0 last:border-b-0">
        <AccordionItemTrigger
          indicatorPlacement="start"
          className="px-1.5 py-1.5 break-all text-left hover:bg-inherit"
        >
          <div className={ cn('text-sm font-bold mr-auto', isInvalid && 'text-[var(--color-text-error)]') }>
            { label }
          </div>
          { onRemoveClick && index !== undefined && <ArrayButton index={ index } onClick={ onRemoveClick } type="remove"/> }
          { onAddClick && index !== undefined && <ArrayButton index={ index } onClick={ onAddClick } type="add" className="ml-1"/> }
        </AccordionItemTrigger>
        <AccordionItemContent className="flex flex-col gap-y-1 pl-[18px] pr-1.5">
          { children }
        </AccordionItemContent>
      </AccordionItem>
    </AccordionRoot>
  );
};

export default React.memo(ContractMethodFieldAccordion);
