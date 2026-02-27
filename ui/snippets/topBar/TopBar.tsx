import { Flex, Box, HStack, chakra } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';

import { route } from 'nextjs-routes';

import { Link } from 'toolkit/chakra/link';
import { CONTENT_MAX_WIDTH } from 'ui/shared/layout/utils';
import UserProfileDesktop from 'ui/snippets/user/UserProfileDesktop';

import ChainSwitcher from './ChainSwitcher';
import NetworkSelector from './NetworkSelector';

interface NavLinkProps {
  readonly text: string;
  readonly href: string;
  readonly isActive: boolean;
}

const NavLinkItem = ({ text, href, isActive }: NavLinkProps) => (
  <Link
    href={ href }
    px={ 2.5 }
    py={ 1.5 }
    textStyle="sm"
    fontWeight={ 500 }
    borderRadius="base"
    variant="navigation"
    { ...(isActive ? { 'data-selected': true } : {}) }
    textDecoration="none"
    whiteSpace="nowrap"
  >
    { text }
  </Link>
);

const TopBar = () => {
  const router = useRouter();
  const pathname = router.pathname;

  const navItems = React.useMemo(() => [
    { text: 'Home', href: route({ pathname: '/' as const }), isActive: pathname === '/' },
    { text: 'Chains', href: route({ pathname: '/chains' as const }), isActive: pathname === '/chains' || pathname.startsWith('/chain/') },
    { text: 'Validators', href: route({ pathname: '/validators' as const }), isActive: pathname === '/validators' || pathname.startsWith('/validators/') },
    { text: 'Stats', href: route({ pathname: '/stats' as const }), isActive: pathname.startsWith('/stats') },
    { text: 'Bridge', href: route({ pathname: '/bridge' as const }), isActive: pathname === '/bridge' },
    { text: 'Blocks', href: route({ pathname: '/blocks' as const }), isActive: pathname === '/blocks' || pathname.startsWith('/block/') },
    { text: 'Txns', href: route({ pathname: '/txs' as const }), isActive: pathname === '/txs' || pathname.startsWith('/tx/') },
    { text: 'Tokens', href: route({ pathname: '/tokens' as const }), isActive: pathname === '/tokens' || pathname.startsWith('/token/') },
  ], [ pathname ]);

  return (
    <Box
      bgColor={{ _light: 'rgba(255, 255, 255, 0.95)', _dark: 'rgba(16, 17, 18, 0.95)' }}
      position="sticky"
      top={ 0 }
      left={ 0 }
      width="100%"
      maxWidth="100vw"
      zIndex="sticky"
      borderBottom="1px solid"
      borderColor="border.divider"
      backdropFilter="blur(12px)"
    >
      <Flex
        py={ 2 }
        px={{ base: 3, lg: 6 }}
        m="0 auto"
        alignItems="center"
        maxW={ `${ CONTENT_MAX_WIDTH }px` }
        gap={ 2 }
      >
        { /* Logo */ }
        <chakra.a
          href={ route({ pathname: '/' as const }) }
          display="flex"
          alignItems="center"
          gap="8px"
          flexShrink={ 0 }
          mr={ 4 }
          aria-label="Lux Network home"
          textDecoration="none"
          _hover={{ textDecoration: 'none' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="20" height="20">
            <polygon points="25,46.65 50,3.35 0,3.35" fill="currentColor"/>
          </svg>
          <chakra.span fontWeight={ 700 } fontSize="md" letterSpacing="-0.02em" whiteSpace="nowrap">
            Lux Network
          </chakra.span>
        </chakra.a>

        { /* Navigation */ }
        <HStack as="nav" gap={ 0 } display={{ base: 'none', lg: 'flex' }}>
          { navItems.map((item) => (
            <NavLinkItem key={ item.text } { ...item }/>
          )) }
        </HStack>

        { /* Spacer */ }
        <Box flex={ 1 }/>

        { /* Right controls */ }
        <HStack gap={ 2 } flexShrink={ 0 }>
          <NetworkSelector/>
          <ChainSwitcher/>
          <UserProfileDesktop buttonSize="sm"/>
        </HStack>
      </Flex>
    </Box>
  );
};

export default React.memo(TopBar);
