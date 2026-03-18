import React from 'react';

import { AccordionItemContent, AccordionItemTrigger } from 'toolkit/chakra/accordion';

import MetadataAccordionItem from './MetadataAccordionItem';
import MetadataAccordionItemTitle from './MetadataAccordionItemTitle';
import MetadataItemPrimitive from './MetadataItemPrimitive';

interface Props {
  name: string;
  value: Array<unknown>;
  level: number;
}

const MetadataItemArray = ({ name, value, level }: Props) => {

  return (
    <MetadataAccordionItem
      value={ name }
      className="lg:flex-col items-stretch pl-0 py-0"
    >
      <AccordionItemTrigger
        className="px-0 py-2 hover:bg-inherit text-sm text-left data-[state=open]:border-[var(--color-border-divider)] data-[state=open]:border-b"
        indicatorPlacement="start"
      >
        <MetadataAccordionItemTitle name={ name }/>
      </AccordionItemTrigger>
      <AccordionItemContent className={ `p-0 ${ level === 0 ? 'ml-6 lg:ml-[126px]' : 'ml-6' }` }>
        { value.map((item, index) => {
          const content = (() => {
            switch (typeof item) {
              case 'string':
              case 'number':
              case 'boolean': {
                return <MetadataItemPrimitive name={ name } value={ item } level={ level }/>;
              }
              case 'object': {
                if (item) {
                  if (Array.isArray(item)) {
                    return <span>{ JSON.stringify(item, undefined, 2) }</span>;
                  } else {
                    return Object.entries(item).map(([ name, value ], index) => {
                      return (
                        <div key={ index }>
                          <MetadataAccordionItemTitle name={ name } className="w-[90px]"/>
                          <MetadataItemPrimitive
                            value={ typeof value === 'object' ? JSON.stringify(value, undefined, 2) : value }
                            level={ level }
                          />
                        </div>
                      );
                    });
                  }
                } else {
                  return <span>{ String(item) }</span>;
                }
              }
              default: {
                return <span>{ String(item) }</span>;
              }
            }
          })();

          return (
            <div
              key={ index }
            >
              { content }
            </div>
          );
        }) }
      </AccordionItemContent>
    </MetadataAccordionItem>
  );
};

export default React.memo(MetadataItemArray);
