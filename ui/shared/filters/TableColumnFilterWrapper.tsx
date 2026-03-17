import { chakra } from '@chakra-ui/react';
import React from 'react';

import { Button } from 'toolkit/chakra/button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  columnName: string;
  isLoading?: boolean;
  selected?: boolean;
  className?: string;
  children: React.ReactNode;
  value?: string;
}

const TableColumnFilterWrapper = ({ columnName, className, children, isLoading, selected, value }: Props) => {
  return (
    <PopoverRoot>
      <PopoverTrigger>
        <Button
          className="inline-flex h-5 min-w-0 rounded text-sm font-medium p-0 border-0"
          aria-label={ `filter by ${ columnName }` }
          variant="icon_secondary"
          disabled={ isLoading }
          selected={ selected }
          size="sm"
        >
          <IconSvg name="filter" className="w-[19px] h-[19px]"/>
          { Boolean(value) && <chakra.span>{ value }</chakra.span> }
        </Button>
      </PopoverTrigger>
      <PopoverContent className={ className }>
        <PopoverBody className="flex flex-col gap-y-3">
          { children }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default chakra(TableColumnFilterWrapper);
