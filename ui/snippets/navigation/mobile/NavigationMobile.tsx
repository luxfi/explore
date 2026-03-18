import React, { useCallback } from 'react';

import useNavItems, { isGroupItem } from 'lib/hooks/useNavItems';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import IconSvg from 'ui/shared/IconSvg';
import useIsAuth from 'ui/snippets/auth/useIsAuth';

import NavigationPromoBanner from '../promoBanner/NavigationPromoBanner';
import NavLink from '../vertical/NavLink';
import NavLinkRewards from '../vertical/NavLinkRewards';
import NavLinkGroup from './NavLinkGroup';

const ANIMATION_DURATION = 300;

interface Props {
  onNavLinkClick?: () => void;
  isMarketplaceAppPage?: boolean;
}

const NavigationMobile = ({ onNavLinkClick, isMarketplaceAppPage }: Props) => {
  const timeoutRef = React.useRef<number | null>(null);
  const { mainNavItems, accountNavItems } = useNavItems();

  const [ openedGroupIndex, setOpenedGroupIndex ] = React.useState(-1);
  const [ isOpen, setIsOpen ] = React.useState(false);

  const onGroupItemOpen = (index: number) => () => {
    setOpenedGroupIndex(index);
    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(true);
    }, 100);
  };

  const onGroupItemClose = useCallback(() => {
    setIsOpen(false);
    timeoutRef.current = window.setTimeout(() => {
      setOpenedGroupIndex(-1);
    }, ANIMATION_DURATION);
  }, []);

  React.useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [ ]);

  const isAuth = useIsAuth();

  const iconColor = useColorModeValue('gray.600', 'gray.300');

  const openedItem = mainNavItems[openedGroupIndex];

  const isCollapsed = isMarketplaceAppPage ? false : undefined;

  return (
    <div className="relative flex flex-col grow">
      <div
        className="flex flex-col grow"
        style={{
          transform: isOpen ? 'translateX(calc(-100% - 24px))' : 'translateX(0)',
          transition: `transform ${ ANIMATION_DURATION }ms ease-in-out`,
          maxHeight: openedGroupIndex > -1 ? '100vh' : 'unset',
          overflowY: openedGroupIndex > -1 ? 'hidden' : 'unset',
        }}
      >
        <nav className="mt-6">
          <ul className="flex flex-col w-full gap-1 items-start">
            { mainNavItems.map((item, index) => {
              if (isGroupItem(item)) {
                return <NavLinkGroup key={ item.text } item={ item } onClick={ onGroupItemOpen(index) } isExpanded={ isMarketplaceAppPage }/>;
              } else {
                return <NavLink key={ item.text } item={ item } onClick={ onNavLinkClick } isCollapsed={ isCollapsed }/>;
              }
            }) }
          </ul>
        </nav>
        { isAuth && (
          <nav className="mt-3 pt-3 border-t border-[var(--color-border-divider)]">
            <ul className="flex flex-col gap-1 items-start">
              <NavLinkRewards onClick={ onNavLinkClick } isCollapsed={ isCollapsed }/>
              { accountNavItems.map((item) => <NavLink key={ item.text } item={ item } onClick={ onNavLinkClick } isCollapsed={ isCollapsed }/>) }
            </ul>
          </nav>
        ) }
        <NavigationPromoBanner isCollapsed={ isCollapsed }/>
      </div>
      <div
        key="sub"
        className="w-full mt-6 absolute top-0"
        style={{
          left: isOpen ? 0 : 'calc(100% + 24px)',
          transition: `left ${ ANIMATION_DURATION }ms ease-in-out`,
        }}
      >
        <div className="flex items-center px-2 py-2.5 w-full h-[50px] cursor-pointer mb-1" onClick={ onGroupItemClose }>
          <IconSvg name="arrows/east-mini" className="w-6 h-6 mr-2" style={{ color: `var(--color-${ iconColor.replace('.', '-') })` }}/>
          <span className="text-[var(--color-text-secondary)] text-sm">{ mainNavItems[openedGroupIndex]?.text }</span>
        </div>
        <ul className="w-full">
          { openedItem && isGroupItem(openedItem) && openedItem.subItems?.map(
            (item, index) => Array.isArray(item) ? (
              <ul
                key={ index }
                className="w-full [&:not(:last-child)]:mb-2 [&:not(:last-child)]:pb-2 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-[var(--color-border-divider)]"
              >
                { item.map(subItem => <NavLink key={ subItem.text } item={ subItem } onClick={ onNavLinkClick } isCollapsed={ isCollapsed }/>) }
              </ul>
            ) : (
              <li key={ item.text } className="mb-1 list-none">
                <NavLink item={ item } onClick={ onNavLinkClick } isCollapsed={ isCollapsed }/>
              </li>
            ),
          ) }
        </ul>
      </div>
    </div>
  );
};

export default NavigationMobile;
