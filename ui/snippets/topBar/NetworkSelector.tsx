import React from 'react';

import { NETWORKS, getCurrentNetwork } from 'configs/app/chainRegistry';
import { cn } from 'lib/utils/cn';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '@luxfi/ui/popover';

const NetworkSelector = () => {
  const [ open, setOpen ] = React.useState(false);

  const handleOpenChange = React.useCallback(({ open: isOpen }: { open: boolean }) => {
    setOpen(isOpen);
  }, []);

  const handleToggle = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const current = getCurrentNetwork();

  return (
    <PopoverRoot
      positioning={{ placement: 'bottom-end', offset: { mainAxis: 8 } }}
      lazyMount
      open={ open }
      onOpenChange={ handleOpenChange }
    >
      <PopoverTrigger>
        <button
          className={cn(
            'flex items-center gap-1.5 px-2 py-1 rounded-sm cursor-pointer',
            'bg-transparent border-none text-xs font-medium',
            'text-[var(--color-text-secondary)] shrink-0',
            'hover:text-[var(--color-text-primary)] hover:bg-[var(--color-blackAlpha-50)] dark:hover:bg-[var(--color-whiteAlpha-50)]',
            'transition-all duration-150',
          )}
          onClick={ handleToggle }
        >
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0"/>
          { current.name }
        </button>
      </PopoverTrigger>
      <PopoverContent w="200px">
        <PopoverBody className="p-1">
          { NETWORKS.map((network) => {
            const isCurrent = network.network === current.network;
            return (
              <a
                key={ network.network }
                { ...(!isCurrent ? { href: network.explorerUrl } : {}) }
                className={ cn(
                  'flex items-center gap-2 px-2.5 py-2 rounded-sm no-underline transition-[background] duration-150',
                  isCurrent
                    ? 'cursor-default bg-[var(--color-blackAlpha-50)] dark:bg-[var(--color-whiteAlpha-50)]'
                    : 'cursor-pointer bg-transparent hover:bg-[var(--color-blackAlpha-50)] dark:hover:bg-[var(--color-whiteAlpha-50)]',
                ) }
              >
                <span
                  className={ cn(
                    'w-1.5 h-1.5 rounded-full shrink-0',
                    isCurrent ? 'bg-green-400' : 'bg-[var(--color-text-secondary)] opacity-40',
                  ) }
                />
                <div className="flex flex-col">
                  <span className={ cn('text-sm text-[var(--color-text-primary)]', isCurrent ? 'font-semibold' : 'font-normal') }>
                    { network.name }
                  </span>
                  <span className="text-xs text-[var(--color-text-secondary)]">
                    { network.label }
                  </span>
                </div>
              </a>
            );
          }) }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(NetworkSelector);
