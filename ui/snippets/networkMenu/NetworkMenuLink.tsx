import React from 'react';

import type { FeaturedNetwork } from 'types/networks';

import { useColorModeValue } from 'toolkit/next/color-mode';
import { Image } from '@luxfi/ui/image';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends FeaturedNetwork {
  isActive?: boolean;
  isMobile?: boolean;
}

const NetworkMenuLink = ({ title, icon, isActive: isActiveProp, isMobile, url, invertIconInDarkMode }: Props) => {
  const darkModeFilter = { filter: 'brightness(0) invert(1)' };
  const style = useColorModeValue({}, invertIconInDarkMode ? darkModeFilter : {});

  const iconEl = icon ? (
    <Image w="20px" h="20px" src={ icon } alt={ `${ title } network icon` } style={ style }/>
  ) : (
    <IconSvg
      name="networks/icon-placeholder"
      className="w-5 h-5 text-[var(--color-blackAlpha-100)] dark:text-[var(--color-whiteAlpha-300)]"
    />
  );

  const isActive = (() => {
    if (isActiveProp !== undefined) {
      return isActiveProp;
    }

    try {
      const itemOrigin = new URL(url).origin;
      const currentOrigin = window.location.origin;

      return itemOrigin === currentOrigin;
    } catch (error) {
      return false;
    }
  })();

  return (
    <li className="list-none">
      <a
        className={ `flex px-2 py-[5px] items-center cursor-pointer rounded-base ${ isActive ? 'opacity-60 pointer-events-none' : '' } hover:text-[var(--color-hover)]` }
        href={ url }
        target="_blank"
        rel="noopener noreferrer"
      >
        { iconEl }
        <span
          className={ `ml-2 text-inherit text-sm ${ isMobile ? 'leading-5' : 'leading-6' }` }
        >
          { title }
        </span>
        { isActive && (
          <IconSvg
            name="check"
            className="w-5 h-5 ml-auto"
          />
        ) }
      </a>
    </li>
  );
};

export default React.memo(NetworkMenuLink);
