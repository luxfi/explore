import { Box, Grid } from '@chakra-ui/react';
import React from 'react';

import { Button } from 'toolkit/chakra/button';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { Tooltip } from 'toolkit/chakra/tooltip';
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
        <Box className={ className }>
          <PopoverTrigger>
            <Button
              size="sm"
              variant="dropdown"
              aria-label={ label }
              className="font-medium shrink-0 gap-x-1"
              style={{ padding: shortText ? '0 0.5rem' : '0 0.25rem' }}
            >
              <IconSvg name="explorer" boxSize={ 5 }/>
              <span className="hidden xl:inline">{ longText }</span>
              { shortText && <span className="xl:hidden">{ shortText }</span> }
            </Button>
          </PopoverTrigger>
        </Box>
      </Tooltip>
      <PopoverContent style={{ width: 'auto' }}>
        <PopoverBody>
          <span className="text-[var(--color-text-secondary)] text-xs">{ label }</span>
          <Grid
            alignItems="center"
            templateColumns={ links.length > 1 ? 'auto auto' : '1fr' }
            columnGap={ 4 }
            rowGap={ 2 }
            mt={ 3 }
          >
            { links }
          </Grid>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default VerifyWith;
