import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Image } from '@luxfi/ui/image';

const LogoFallback = () => {
  return (
    <div className="flex items-center gap-2 h-6">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 50 50" width="24" height="24">
        <polygon points="25,46.65 50,3.35 0,3.35" fill="currentColor"/>
      </svg>
      <span className="font-bold text-lg tracking-tight">
        { config.chain.name }
      </span>
    </div>
  );
};

type Props = {
  className?: string;
};

const NetworkLogo = ({ className }: Props) => {

  const logoSrc = useColorModeValue(config.UI.navigation.logo.default, config.UI.navigation.logo.dark || config.UI.navigation.logo.default);

  return (
    <a
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
        objectFit="contain"
        objectPosition="left"
        className={ !config.UI.navigation.logo.dark ? 'dark:brightness-0 dark:invert' : undefined }
      />
    </a>
  );
};

export default React.memo(NetworkLogo);
