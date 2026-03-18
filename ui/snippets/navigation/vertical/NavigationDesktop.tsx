import React from 'react';

import { useAppContext } from 'lib/contexts/app';
import * as cookies from 'lib/cookies';
import { cn } from 'lib/utils/cn';
import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import IconSvg from 'ui/shared/IconSvg';
import useIsAuth from 'ui/snippets/auth/useIsAuth';
import NetworkIcon from 'ui/snippets/networkLogo/NetworkIcon';
import NetworkLogo from 'ui/snippets/networkLogo/NetworkLogo';

import NavigationPromoBanner from '../promoBanner/NavigationPromoBanner';
import RollupStageBadge from '../RollupStageBadge';
import TestnetBadge from '../TestnetBadge';
import NavLink from './NavLink';
import NavLinkGroup from './NavLinkGroup';
import NavLinkRewards from './NavLinkRewards';

const NavigationDesktop = () => {
  const appProps = useAppContext();
  const cookiesString = appProps.cookies;

  const isNavBarCollapsedCookie = cookies.get(cookies.NAMES.NAV_BAR_COLLAPSED, cookiesString);
  let isNavBarCollapsed;
  if (isNavBarCollapsedCookie === 'true') {
    isNavBarCollapsed = true;
  }
  if (isNavBarCollapsedCookie === 'false') {
    isNavBarCollapsed = false;
  }

  const { mainNavItems, accountNavItems } = useNavItems();

  const isAuth = useIsAuth();

  const [ isCollapsed, setCollapsedState ] = React.useState<boolean | undefined>(isNavBarCollapsed);

  const handleTogglerClick = React.useCallback(() => {
    setCollapsedState((flag) => !flag);
    cookies.set(cookies.NAMES.NAV_BAR_COLLAPSED, isCollapsed ? 'false' : 'true');
  }, [ isCollapsed ]);

  const handleContainerClick = React.useCallback((event: React.MouseEvent) => {
    if (event.target === event.currentTarget) {
      handleTogglerClick();
    }
  }, [ handleTogglerClick ]);

  const isExpanded = isCollapsed === false;

  return (
    <div
      className={ cn(
        'hidden lg:flex group relative flex-col items-stretch border-r border-solid border-[var(--color-border-divider)] pt-12 pb-6',
        'transition-[width,padding] duration-[var(--duration-normal)] ease-[var(--ease-ease)]',
        isExpanded ? 'lg:px-6 lg:w-[229px]' : 'lg:px-4 lg:w-[92px]',
        isCollapsed ? 'xl:px-4 xl:w-[92px]' : 'xl:px-6 xl:w-[229px]',
      ) }
      onClick={ handleContainerClick }
    >
      <TestnetBadge className="absolute pl-3 w-[49px] top-[34px]"/>
      <RollupStageBadge className={ cn('absolute top-[34px]', isExpanded ? 'lg:ml-3' : 'lg:ml-[10px]', isCollapsed ? 'xl:ml-[10px]' : 'xl:ml-3') }/>
      <header
        className={ cn(
          'flex justify-start items-center flex-row w-full h-10',
          'transition-[padding] duration-[var(--duration-normal)] ease-[var(--ease-ease)]',
          isExpanded ? 'lg:pl-3 lg:pr-0' : 'lg:pl-[15px] lg:pr-[15px]',
          isCollapsed ? 'xl:pl-[15px] xl:pr-[15px]' : 'xl:pl-3 xl:pr-0',
        ) }
      >
        <div className={ cn('hidden', isCollapsed === false ? 'lg:block' : 'lg:hidden', isCollapsed ? 'xl:hidden' : 'xl:block') }>
          <NetworkLogo/>
        </div>
        <div className={ cn('hidden', isCollapsed === false ? 'lg:hidden' : 'lg:block', isCollapsed ? 'xl:block' : 'xl:hidden') }>
          <NetworkIcon/>
        </div>
      </header>
      <nav className="mt-6 w-full">
        <ul className="flex flex-col gap-1 items-start">
          { mainNavItems.map((item) => {
            if (isGroupItem(item)) {
              return <NavLinkGroup key={ item.text } item={ item } isCollapsed={ isCollapsed }/>;
            } else {
              return <NavLink key={ item.text } item={ item } isCollapsed={ isCollapsed }/>;
            }
          }) }
        </ul>
      </nav>
      { isAuth && (
        <nav className="border-t border-[var(--color-border-divider)] w-full mt-3 pt-3">
          <ul className="flex flex-col gap-1 items-start">
            <NavLinkRewards isCollapsed={ isCollapsed }/>
            { accountNavItems.map((item) => <NavLink key={ item.text } item={ item } isCollapsed={ isCollapsed }/>) }
          </ul>
        </nav>
      ) }
      <NavigationPromoBanner isCollapsed={ isCollapsed }/>
      <IconSvg
        name="arrows/east-mini"
        width={ 6 }
        height={ 6 }
        _hover={{ color: 'hover' }}
        borderRadius="base"
        bgColor="bg.primary"
        color={{ base: 'blackAlpha.400', _dark: 'whiteAlpha.400' }}
        borderWidth="1px"
        borderColor="border.divider"
        transform={{ lg: isExpanded ? 'rotate(0)' : 'rotate(180deg)', xl: isCollapsed ? 'rotate(180deg)' : 'rotate(0)' }}
        transformOrigin="center"
        position="absolute"
        top="104px"
        left={{ lg: isExpanded ? '216px' : '80px', xl: isCollapsed ? '80px' : '216px' }}
        cursor="pointer"
        onClick={ handleTogglerClick }
        aria-label="Expand/Collapse menu"
        display="none"
        _groupHover={{ display: 'block' }}
        transitionProperty="transform, left"
        transitionDuration="normal"
        transitionTimingFunction="ease"
      />
    </div>
  );
};

export default NavigationDesktop;
