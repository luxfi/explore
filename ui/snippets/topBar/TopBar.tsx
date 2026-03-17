import { Flex, Box, HStack, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { route } from 'nextjs-routes';

import { getCurrentChain } from 'configs/app/chainRegistry';
import { cn } from 'lib/utils/cn';
import { Link } from 'toolkit/chakra/link';
import { MenuContent, MenuItem, MenuRoot, MenuTrigger } from 'toolkit/chakra/menu';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
import SearchBar from 'ui/snippets/searchBar/SearchBarDesktop';
import UserProfileDesktop from 'ui/snippets/user/UserProfileDesktop';

import ChainSwitcher from './ChainSwitcher';
import NetworkSelector from './NetworkSelector';

// ── Nav link ──

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

// ── Blockchain sub-menu items ──

const BLOCKCHAIN_ITEMS = [
  { text: 'Blocks', pathname: '/blocks' as const },
  { text: 'Transactions', pathname: '/txs' as const },
  { text: 'Tokens', pathname: '/tokens' as const },
  { text: 'Accounts', pathname: '/accounts' as const },
  { text: 'Verified Contracts', pathname: '/verified-contracts' as const },
] as const;

// ── Main component ──

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
    <Box
      bgColor={{ _light: 'rgba(255, 255, 255, 0.97)', _dark: 'rgba(16, 17, 18, 0.97)' }}
      position="sticky"
      top={ 0 }
      left={ 0 }
      width="100%"
      maxWidth="100vw"
      zIndex="sticky"
      borderBottom="1px solid"
      borderColor="border.divider"
      backdropFilter="blur(16px)"
    >
      <Flex
        py={ 2 }
        px={{ base: 3, lg: 6 }}
        m="0 auto"
        alignItems="center"
        maxW={ `${ CONTENT_MAX_WIDTH }px` }
        gap={ 1 }
      >
        { /* ── Logo + Brand + Chain/Network selectors (grouped) ── */ }
        <Flex alignItems="center" gap={ 1.5 } flexShrink={ 0 }>
          <chakra.a
            href={ route({ pathname: '/' as const }) }
            display="flex"
            alignItems="center"
            gap="6px"
            flexShrink={ 0 }
            aria-label={ `${ chain.branding.brandName } home` }
            textDecoration="none"
            _hover={{ textDecoration: 'none', opacity: 0.8 }}
            transition="opacity 0.15s"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox={ chain.branding.logoViewBox }
              width="18"
              height="18"
              dangerouslySetInnerHTML={{ __html: chain.branding.logoContent }}
            />
            <chakra.span
              fontWeight={ 700 }
              fontSize="sm"
              letterSpacing="-0.02em"
              whiteSpace="nowrap"
              color="text.primary"
            >
              { chain.branding.brandName }
            </chakra.span>
          </chakra.a>

          { /* Chain & Network selectors — directly next to brand name */ }
          <NetworkSelector/>
          <ChainSwitcher/>
        </Flex>

        { /* ── Divider ── */ }
        <Box h="16px" w="1px" bgColor="border.divider" flexShrink={ 0 } mx={ 1 }/>

        { /* ── Navigation (no Home — logo click does that) ── */ }
        <HStack as="nav" gap={ 0 } display={{ base: 'none', lg: 'flex' }} flexShrink={ 0 }>
          { /* Blockchain dropdown */ }
          <MenuRoot>
            <MenuTrigger asChild>
              <chakra.button
                px={ 2 }
                py={ 1 }
                textStyle="xs"
                fontWeight={ isBlockchainActive ? 600 : 500 }
                borderRadius="sm"
                color={ isBlockchainActive ? 'text.primary' : 'text.secondary' }
                _hover={{ color: 'text.primary', bg: { _light: 'blackAlpha.50', _dark: 'whiteAlpha.50' } }}
                cursor="pointer"
                transition="all 0.15s"
                display="flex"
                alignItems="center"
                gap={ 0.5 }
                bg="transparent"
                border="none"
              >
                Blockchain
                <chakra.svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  w="14px"
                  h="14px"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                    clipRule="evenodd"
                  />
                </chakra.svg>
              </chakra.button>
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
        </HStack>

        { /* ── Search bar (center, flexible) ── */ }
        <Box flex={ 1 } mx={ 2 } display={{ base: 'none', lg: 'block' }} maxW="480px">
          <SearchBar isHeroBanner={ false }/>
        </Box>

        { /* ── Spacer ── */ }
        <Box flex={ 1 } display={{ base: 'block', lg: 'none' }}/>

        { /* ── User profile / Sign in ── */ }
        <Box flexShrink={ 0 } ml="auto">
          <UserProfileDesktop buttonSize="sm"/>
        </Box>
      </Flex>
    </Box>
  );
};

export default React.memo(TopBar);
