import { useRouter } from 'next/router';
import React from 'react';

import { route } from 'nextjs-routes';

import { getCurrentChain, isChainSelectorEnabled, isNetworkSelectorEnabled } from 'configs/app/chainRegistry';
import { cn } from 'lib/utils/cn';
import { Link } from 'toolkit/chakra/link';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from 'toolkit/chakra/menu';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
import SearchBar from 'ui/snippets/searchBar/SearchBarDesktop';
import UserProfileDesktop from 'ui/snippets/user/UserProfileDesktop';

import ChainSwitcher from './ChainSwitcher';
import NetworkSelector from './NetworkSelector';

// -- Nav link --

interface NavLinkProps {
  readonly text: string;
  readonly href: string;
  readonly isActive: boolean;
}

const NavLinkItem = ({ text, href, isActive }: NavLinkProps) => (
  <Link
    href={ href }
    className={ cn(
      'px-2 py-1 text-xs rounded-sm no-underline whitespace-nowrap transition-all duration-150',
      'hover:text-[var(--color-text-primary)] hover:bg-[var(--color-blackAlpha-50)] dark:hover:bg-[var(--color-whiteAlpha-50)]',
      isActive ? 'font-semibold text-[var(--color-text-primary)]' : 'font-medium text-[var(--color-text-secondary)]',
    ) }
    variant="plain"
  >
    { text }
  </Link>
);

// -- Blockchain sub-menu items --

const BLOCKCHAIN_ITEMS = [
  { text: 'Blocks', pathname: '/blocks' as const },
  { text: 'Transactions', pathname: '/txs' as const },
  { text: 'Tokens', pathname: '/tokens' as const },
  { text: 'Accounts', pathname: '/accounts' as const },
  { text: 'Verified Contracts', pathname: '/verified-contracts' as const },
] as const;

// -- Main component --

const TopBar = () => {
  const router = useRouter();
  const pathname = router.pathname;
  const chain = getCurrentChain();

  const isBlockchainActive = pathname === '/blocks' || pathname.startsWith('/block/') ||
    pathname === '/txs' || pathname.startsWith('/tx/') ||
    pathname === '/tokens' || pathname.startsWith('/token/') ||
    pathname === '/accounts' || pathname.startsWith('/address/') ||
    pathname === '/verified-contracts';

  return (
    <div
      className="sticky top-0 left-0 w-full max-w-[100vw] z-sticky border-b border-[var(--color-border-divider)] backdrop-blur-[16px] bg-[rgba(255,255,255,0.97)] dark:bg-[rgba(16,17,18,0.97)]"
    >
      <div
        className="flex py-2 px-3 lg:px-6 mx-auto items-center gap-1"
        style={{ maxWidth: `${ CONTENT_MAX_WIDTH }px` }}
      >
        { /* -- Logo + Brand + Chain/Network selectors (grouped) -- */ }
        <div className="flex items-center gap-1.5 shrink-0">
          <a
            href={ route({ pathname: '/' as const }) }
            className="flex items-center gap-[6px] shrink-0 no-underline hover:no-underline hover:opacity-80 transition-opacity duration-150"
            aria-label={ `${ chain.branding.brandName } home` }
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={ chain.branding.logoViewBox }
              width="18"
              height="18"
              dangerouslySetInnerHTML={{ __html: chain.branding.logoContent }}
            />
            <span className="font-bold text-sm tracking-[-0.02em] whitespace-nowrap text-[var(--color-text-primary)]">
              { chain.branding.brandName }
            </span>
          </a>

          { /* Chain & Network selectors (hidden in white-label mode unless explicitly enabled) */ }
          { isNetworkSelectorEnabled() && <NetworkSelector/> }
          { isChainSelectorEnabled() && <ChainSwitcher/> }
        </div>

        { /* -- Divider -- */ }
        <div className="h-4 w-px bg-[var(--color-border-divider)] shrink-0 mx-1"/>

        { /* -- Navigation -- */ }
        <nav className="hidden lg:flex items-center gap-0 shrink-0">
          { /* Blockchain dropdown */ }
          <MenuRoot>
            <MenuTrigger asChild>
              <button
                className={ cn(
                  'px-2 py-1 text-xs rounded-sm cursor-pointer transition-all duration-150',
                  'flex items-center gap-0.5 bg-transparent border-none',
                  'hover:text-[var(--color-text-primary)] hover:bg-[var(--color-blackAlpha-50)] dark:hover:bg-[var(--color-whiteAlpha-50)]',
                  isBlockchainActive ? 'font-semibold text-[var(--color-text-primary)]' : 'font-medium text-[var(--color-text-secondary)]',
                ) }
              >
                Blockchain
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-[14px] h-[14px]"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </MenuTrigger>
            <MenuContent minW="180px">
              { BLOCKCHAIN_ITEMS.map((item) => (
                <MenuItem
                  key={ item.pathname }
                  value={ item.pathname }
                  asChild
                >
                  <Link
                    href={ route({ pathname: item.pathname }) }
                    className="no-underline hover:no-underline"
                    variant="plain"
                  >
                    { item.text }
                  </Link>
                </MenuItem>
              )) }
            </MenuContent>
          </MenuRoot>

          <NavLinkItem
            text="Chains"
            href={ route({ pathname: '/chains' as const }) }
            isActive={ pathname === '/chains' || pathname.startsWith('/chain/') }
          />
          <NavLinkItem
            text="Validators"
            href={ route({ pathname: '/validators' as const }) }
            isActive={ pathname === '/validators' || pathname.startsWith('/validators/') }
          />
          <NavLinkItem
            text="Stats"
            href={ route({ pathname: '/stats' as const }) }
            isActive={ pathname.startsWith('/stats') }
          />
          <NavLinkItem
            text="Bridge"
            href={ route({ pathname: '/bridge' as const }) }
            isActive={ pathname === '/bridge' }
          />
          <NavLinkItem
            text="DEX"
            href={ route({ pathname: '/dex' as const }) }
            isActive={ pathname === '/dex' }
          />
        </nav>

        { /* -- Search bar (center, flexible) -- */ }
        <div className="flex-1 mx-2 hidden lg:block max-w-[480px]">
          <SearchBar isHeroBanner={ false }/>
        </div>

        { /* -- Spacer -- */ }
        <div className="flex-1 block lg:hidden"/>

        { /* -- User profile / Sign in -- */ }
        <div className="shrink-0 ml-auto">
          <UserProfileDesktop buttonSize="sm"/>
        </div>
      </div>
    </div>
  );
};

export default React.memo(TopBar);
