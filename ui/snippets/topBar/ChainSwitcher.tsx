import React from 'react';

import { getCurrentChain, getCurrentNetwork, getChainsForNetwork, NETWORKS } from 'configs/app/chainRegistry';
import { cn } from 'lib/utils/cn';
import { Link } from 'toolkit/next/link';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '@luxfi/ui/popover';

const ChainSwitcher = () => {
  const [ open, setOpen ] = React.useState(false);

  const handleOpenChange = React.useCallback(({ open: isOpen }: { open: boolean }) => {
    setOpen(isOpen);
  }, []);

  const handleToggle = React.useCallback(() => {
    setOpen((prev) => !prev);
  }, []);

  const current = getCurrentChain();
  const currentNetwork = getCurrentNetwork();
  const isMainChain = current.tier === 'primary';

  // For white-label subnets (Zoo, Pars, Hanzo, SPC), only show that chain's
  // mainnet/testnet entries — don't show the full Lux ecosystem.
  // For the main C-Chain explorer, show all chains.
  const chains = React.useMemo(() => {
    const allChains = getChainsForNetwork(currentNetwork.network);
    if (isMainChain) {
      return allChains;
    }
    // Filter to only chains with the same branding (same subnet)
    return allChains.filter((c) => c.branding.brandName === current.branding.brandName);
  }, [ currentNetwork.network, isMainChain, current.branding.brandName ]);

  // For subnets, show network switcher (mainnet/testnet) instead of chain switcher
  const availableNetworks = React.useMemo(() => {
    if (isMainChain) return [];
    return NETWORKS.filter((net) => {
      const chainsInNet = getChainsForNetwork(net.network);
      return chainsInNet.some((c) => c.branding.brandName === current.branding.brandName);
    });
  }, [ isMainChain, current.branding.brandName ]);

  return (
    <PopoverRoot
      positioning={{ placement: 'bottom-end', offset: { mainAxis: 8 } }}
      lazyMount
      open={ open }
      onOpenChange={ handleOpenChange }
    >
      <PopoverTrigger>
        <button
          className={ cn(
            'flex items-center gap-1.5 px-2 py-1 rounded-sm cursor-pointer',
            'border border-[var(--color-border-divider)] text-xs font-medium',
            'text-[var(--color-text-primary)] bg-transparent shrink-0',
            'hover:bg-[var(--color-blackAlpha-50)]',
            'dark:hover:bg-[var(--color-whiteAlpha-50)]',
            'transition-all duration-150',
          ) }
          onClick={ handleToggle }
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox={ current.branding.logoViewBox }
            className="w-3.5 h-3.5 shrink-0"
            dangerouslySetInnerHTML={{ __html: current.branding.logoContent }}
          />
          { current.name }
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-3 h-3"
          >
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
          { /* Network switcher for subnets (e.g. Zoo Mainnet / Zoo Testnet) */ }
          { availableNetworks.length > 1 && (
            <>
              <div className="px-2 py-1.5">
                <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Network
                </span>
              </div>
              { availableNetworks.map((net) => {
                const isCurrentNet = net.network === currentNetwork.network;
                const chainInNet = getChainsForNetwork(net.network)
                  .find((c) => c.branding.brandName === current.branding.brandName);
                return (
                  <a
                    key={ net.network }
                    { ...(!isCurrentNet && chainInNet ? { href: chainInNet.explorerUrl } : {}) }
                    className={ cn(
                      'flex items-center gap-2 px-2.5 py-2 rounded-sm',
                      'no-underline transition-[background] duration-150',
                      isCurrentNet ?
                        'cursor-default bg-[var(--color-whiteAlpha-50)]' :
                        'cursor-pointer hover:bg-[var(--color-whiteAlpha-50)]',
                    ) }
                  >
                    <span className={ cn(
                      'text-sm text-[var(--color-text-primary)]',
                      isCurrentNet ? 'font-semibold' : 'font-normal',
                    ) }>
                      { net.name }
                    </span>
                    { isCurrentNet && (
                      <span className="ml-auto text-[10px] text-[var(--color-text-secondary)]">
                        Current
                      </span>
                    ) }
                  </a>
                );
              }) }
            </>
          ) }

          { /* Chain switcher (only for main C-Chain explorer) */ }
          { chains.length > 1 && (
            <>
              <div className="px-2 py-1.5">
                <span className="text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  Switch Chain
                </span>
              </div>
              { chains.map((chain) => {
                const isCurrent = chain.name === current.name &&
                  chain.network === current.network;
                return (
                  <a
                    key={ `${ chain.network }-${ chain.name }` }
                    { ...(!isCurrent ? { href: chain.explorerUrl } : {}) }
                    className={ cn(
                      'flex items-center justify-between px-2.5 py-2',
                      'rounded-sm no-underline transition-[background] duration-150',
                      isCurrent ?
                        'cursor-default bg-[var(--color-whiteAlpha-50)]' :
                        'cursor-pointer hover:bg-[var(--color-whiteAlpha-50)]',
                    ) }
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox={ chain.branding.logoViewBox }
                        className="w-4 h-4 shrink-0"
                        dangerouslySetInnerHTML={{
                          __html: chain.branding.logoContent,
                        }}
                      />
                      <div className="flex flex-col min-w-0">
                        <span className={ cn(
                          'text-sm text-[var(--color-text-primary)] truncate',
                          isCurrent ? 'font-semibold' : 'font-normal',
                        ) }>
                          { chain.branding.brandName }
                        </span>
                        <span className="text-xs text-[var(--color-text-secondary)]">
                          { chain.label }
                        </span>
                      </div>
                    </div>
                    { /* No tier/VM badge — on white-label deployments it's just their chain */ }
                  </a>
                );
              }) }
            </>
          ) }

          { /* Only show "View all chains" link on main explorer */ }
          { isMainChain && (
            <div className="px-2 py-1.5 border-t border-[var(--color-border-divider)] mt-1">
              <Link
                href="/chains"
                className="text-xs text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                variant="plain"
              >
                View all chains
              </Link>
            </div>
          ) }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(ChainSwitcher);
