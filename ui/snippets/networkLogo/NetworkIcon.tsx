import { chakra } from '@chakra-ui/react';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Image } from 'toolkit/chakra/image';

import { INVERT_FILTER } from './consts';

const IconFallback = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="30" height="30" aria-label={ `${ config.chain.name } icon` }>
      <polygon points="25,46.65 50,3.35 0,3.35" fill="currentColor"/>
    </svg>
  );
};

type Props = {
  className?: string;
};

const NetworkIcon = ({ className }: Props) => {

  const iconSrc = useColorModeValue(config.UI.navigation.icon.default, config.UI.navigation.icon.dark || config.UI.navigation.icon.default);

  return (
    <chakra.a
      className={ className }
      href={ route({ pathname: '/' }) }
      aria-label="Link to main page"
    >
      <Image
        w="30px"
        h="30px"
        src={ iconSrc }
        alt={ `${ config.chain.name } network icon` }
        fallback={ <IconFallback/> }
        filter={{ _dark: !config.UI.navigation.icon.dark ? INVERT_FILTER : undefined }}
        objectFit="contain"
        objectPosition="left"
      />
    </chakra.a>
  );
};

export default React.memo(chakra(NetworkIcon));
