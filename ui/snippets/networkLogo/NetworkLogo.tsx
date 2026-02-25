import { chakra, Flex } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Image } from 'toolkit/chakra/image';

import { INVERT_FILTER } from './consts';

const LogoFallback = () => {
  return (
    <Flex alignItems="center" gap="8px" height="24px">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="24" height="24">
        <polygon points="25,46.65 50,3.35 0,3.35" fill="currentColor"/>
      </svg>
      <chakra.span fontWeight="700" fontSize="lg" letterSpacing="-0.02em">
        { config.chain.name }
      </chakra.span>
    </Flex>
  );
};

type Props = {
  className?: string;
};

const NetworkLogo = ({ className }: Props) => {

  const logoSrc = useColorModeValue(config.UI.navigation.logo.default, config.UI.navigation.logo.dark || config.UI.navigation.logo.default);

  return (
    <chakra.a
      className={ className }
      href={ route({ pathname: '/' }) }
      aria-label="Link to main page"
    >
      <Image
        h="24px"
        skeletonWidth="120px"
        src={ logoSrc }
        alt={ `${ config.chain.name } network logo` }
        fallback={ <LogoFallback/> }
        filter={{ _dark: !config.UI.navigation.logo.dark ? INVERT_FILTER : undefined }}
        objectFit="contain"
        objectPosition="left"
      />
    </chakra.a>
  );
};

export default React.memo(chakra(NetworkLogo));
