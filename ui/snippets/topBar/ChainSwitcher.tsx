import React from 'react';

import { getCurrentChain, getCurrentNetwork, getChainsForNetwork } from 'configs/app/chainRegistry';
import { cn } from 'lib/utils/cn';
import { Link } from 'toolkit/chakra/link';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';

const ChainSwitcher = () => {
  const [ open, setOpen ] = React.useState(false);

  const handleOpenChange = React.useCallback(({ open: isOpen }: { open: boolean }) => {
    setOpen(isOpen);
  }, []);

  const handleToggle = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const current = getCurrentChain();
  const network = getCurrentNetwork();
  const chains = getChainsForNetwork(network.network);

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
            'border border-[var(--color-border-divider)] text-xs font-medium',
            'text-[var(--color-text-primary)] bg-transparent shrink-0',
            'hover:bg-[var(--color-blackAlpha-50)] dark:hover:bg-[var(--color-whiteAlpha-50)]',
            'transition-all duration-150',
          )}
          onClick={ handleToggle }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={ current.branding.logoViewBox }
            width="14"
            height="14"
            style={{ flexShrink: 0 }}
            dangerouslySetInnerHTML={{ __html: current.branding.logoContent }}
          />
          { current.name }
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
            <path
              fillRule="evenodd"
              d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </PopoverTrigger>
      <PopoverContent w="240px">
        <PopoverBody className="p-1">
          <div className="px-2 py-1.5">
            <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
              Switch Chain
            </span>
          </div>
          { chains.map((chain) => {
            const isCurrent = chain.name === current.name && chain.network === current.network;
            return (
              <a
                key={ `${ chain.network }-${ chain.name }` }
                { ...(!isCurrent ? { href: chain.explorerUrl } : {}) }
                className={ cn(
                  'flex items-center justify-between px-2.5 py-2 rounded-sm no-underline transition-[background] duration-150',
                  isCurrent
                    ? 'cursor-default bg-[var(--color-blackAlpha-50)] dark:bg-[var(--color-whiteAlpha-50)]'
                    : 'cursor-pointer bg-transparent hover:bg-[var(--color-blackAlpha-50)] dark:hover:bg-[var(--color-whiteAlpha-50)]',
                ) }
              >
                <div className="flex items-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox={ chain.branding.logoViewBox }
                    width="16"
                    height="16"
                    style={{ flexShrink: 0 }}
                    dangerouslySetInnerHTML={{ __html: chain.branding.logoContent }}
                  />
                  <div className="flex flex-col">
                    <span className={ cn('text-sm text-[var(--color-text-primary)]', isCurrent ? 'font-semibold' : 'font-normal') }>
                      { chain.branding.brandName }
                    </span>
                    <span className="text-xs text-[var(--color-text-secondary)]">
                      { chain.label }
                    </span>
                  </div>
                </div>
                <span className="bg-[var(--color-blackAlpha-50)] dark:bg-[var(--color-whiteAlpha-100)] text-[var(--color-text-secondary)] rounded-sm px-1.5 py-0.5 text-[10px] font-mono">
                  { chain.vm }
                </span>
              </a>
            );
          }) }
          <div className="px-2 py-1.5 border-t border-[var(--color-border-divider)] mt-1">
            <Link href="/chains" className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]" variant="plain">
              View all chains
            </Link>
          </div>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(ChainSwitcher);
