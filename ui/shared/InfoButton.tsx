import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import { Button } from '@luxfi/ui/button';
import { DialogRoot, DialogContent, DialogTrigger, DialogHeader } from '@luxfi/ui/dialog';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '@luxfi/ui/popover';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  children: React.ReactNode;
  isLoading?: boolean;
}

const InfoButton = ({ children, isLoading }: Props) => {
  const isMobile = useIsMobile();

  const triggerButton = (
    <Button
      size="sm"
      variant="dropdown"
      aria-label="Show info"
      className="gap-0 font-medium pl-1 pr-2 max-lg:pr-1"
      loadingSkeleton={ isLoading }
    >
      <IconSvg name="info" className={ `size-6 ${ isMobile ? '' : 'mr-1' }`.trim() }/>
      { !isMobile && <span>Info</span> }
    </Button>
  );

  if (isMobile) {
    return (
      <DialogRoot size="full">
        <DialogTrigger>
          { triggerButton }
        </DialogTrigger>
        <DialogContent>
          <DialogHeader/>
          { children }
        </DialogContent>
      </DialogRoot>
    );
  }

  return (
    <PopoverRoot>
      <PopoverTrigger>
        { triggerButton }
      </PopoverTrigger>
      <PopoverContent className="w-[500px]">
        <PopoverBody>
          { children }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(InfoButton);
