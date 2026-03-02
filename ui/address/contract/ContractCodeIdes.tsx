import React from 'react';

import config from 'configs/app';
import { Button } from '@luxfi/ui/button';
import { Image } from '@luxfi/ui/image';
import { Link } from 'toolkit/next/link';
import { PopoverRoot, PopoverTrigger, PopoverContent, PopoverBody } from '@luxfi/ui/popover';
import { Skeleton } from '@luxfi/ui/skeleton';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  className?: string;
  hash: string;
  isLoading?: boolean;
}

const ContractCodeIde = ({ className, hash, isLoading }: Props) => {
  const { open, onOpenChange } = useDisclosure();

  const ideLinks = React.useMemo(() => {
    return config.UI.ides.items
      .map((ide) => {
        const url = decodeURIComponent(ide.url.replace('{hash}', hash).replace('{domain}', config.app.host || ''));
        const icon = 'icon_url' in ide ?
          <Image boxSize={ 5 } mr={ 2 } src={ ide.icon_url } alt={ `${ ide.title } icon` }/> :
          <IconSvg name="ABI" className="w-5 h-5 text-[var(--color-icon-primary)] mr-2"/>;

        return (
          <Link external key={ ide.title } href={ url } display="inline-flex" alignItems="center">
            { icon }
            { ide.title }
          </Link>
        );
      });
  }, [ hash ]);

  if (isLoading) {
    return <Skeleton loading h={ 8 } w="92px" borderRadius="base"/>;
  }

  if (ideLinks.length === 0) {
    return null;
  }

  return (
    <PopoverRoot open={ open } onOpenChange={ onOpenChange }>
      <PopoverTrigger>
        <Button
          className={ className }
          size="sm"
          variant="dropdown"
          aria-label="Open source code in IDE"
          fontWeight={ 500 }
          gap={ 0 }
          h="32px"
          flexShrink={ 0 }
        >
          <span>Open in</span>
          <IconSvg name="arrows/east-mini" className="w-5 h-5 transition-transform duration-150" style={{ transform: open ? 'rotate(90deg)' : 'rotate(-90deg)' }}/>
        </Button>
      </PopoverTrigger>
      <PopoverContent w="240px">
        <PopoverBody >
          <span className="text-[var(--color-text-secondary)] text-xs">Redactors</span>
          <div className="flex flex-col items-start gap-x-6 gap-y-3 mt-3">
            { ideLinks }
          </div>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(ContractCodeIde);
