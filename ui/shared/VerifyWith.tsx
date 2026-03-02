import React from 'react';

import { Button } from '@luxfi/ui/button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '@luxfi/ui/popover';
import { Tooltip } from '@luxfi/ui/tooltip';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  className?: string;
  links: Array<React.ReactNode>;
  label: string;
  longText: string;
  shortText?: string;
}

const VerifyWith = ({ className, links, label, longText, shortText }: Props) => {
  const popover = useDisclosure();

  return (
    <PopoverRoot open={ popover.open } onOpenChange={ popover.onOpenChange }>
      <Tooltip content={ label } disabled={ popover.open } disableOnMobile closeOnClick>
        <div className={ className }>
          <PopoverTrigger>
            <Button
              size="sm"
              variant="dropdown"
              aria-label={ label }
              className="font-medium shrink-0 gap-x-1"
              style={{ padding: shortText ? '0 0.5rem' : '0 0.25rem' }}
            >
              <IconSvg name="explorer" className="w-5 h-5"/>
              <span className="hidden xl:inline">{ longText }</span>
              { shortText && <span className="xl:hidden">{ shortText }</span> }
            </Button>
          </PopoverTrigger>
        </div>
      </Tooltip>
      <PopoverContent style={{ width: 'auto' }}>
        <PopoverBody>
          <span className="text-[var(--color-text-secondary)] text-xs">{ label }</span>
          <div
            className={ `grid items-center gap-x-4 gap-y-2 mt-3 ${ links.length > 1 ? 'grid-cols-[auto_auto]' : 'grid-cols-1' }` }
          >
            { links }
          </div>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default VerifyWith;
