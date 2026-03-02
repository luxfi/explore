import React from 'react';

import { AccordionItemContent, AccordionItemTrigger } from '@luxfi/ui/accordion';

import MetadataAccordion from './MetadataAccordion';
import MetadataAccordionItem from './MetadataAccordionItem';
import MetadataAccordionItemTitle from './MetadataAccordionItemTitle';

interface Props {
  name: string;
  value: Record<string, unknown>;
  level: number;
}

const MetadataItemObject = ({ name, value, level }: Props) => {

  if (level >= 4) {
    return (
      <MetadataAccordionItem value={ name } level={ level } isFlat>
        <MetadataAccordionItemTitle name={ name }/>
        <div>{ JSON.stringify(value, undefined, 2) }</div>
      </MetadataAccordionItem>
    );
  }

  return (
    <MetadataAccordionItem
      value={ name }
      className="lg:flex-col items-stretch py-0"
      isFlat
      level={ level }
    >
      <AccordionItemTrigger
        className="px-0 py-2 hover:bg-inherit text-sm text-left data-[state=open]:border-[var(--color-border-divider)] data-[state=open]:border-b"
        indicatorPlacement="start"
      >
        <MetadataAccordionItemTitle name={ name }/>
      </AccordionItemTrigger>
      <AccordionItemContent className="p-0">
        <MetadataAccordion data={ value as Record<string, unknown> } level={ level + 1 }/>
      </AccordionItemContent>
    </MetadataAccordionItem>
  );
};

export default React.memo(MetadataItemObject);
