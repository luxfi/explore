import React from 'react';

import type { NavGroupItem } from 'types/client/navigation';

import { Link } from 'toolkit/chakra/link';
import { Separator } from 'toolkit/chakra/separator';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import IconSvg from 'ui/shared/IconSvg';

import LightningLabel from '../LightningLabel';
import { checkRouteHighlight } from '../utils';
import NavLink from './NavLink';
interface Props {
  item: NavGroupItem;
}

const NavLinkGroup = ({ item }: Props) => {
  const { open, onOpenChange } = useDisclosure();

  const isHighlighted = checkRouteHighlight(item.subItems);
  const hasGroups = item.subItems.some((subItem) => Array.isArray(subItem));

  const content = hasGroups ? (
    <div className="flex flex-row items-stretch" style={{ gap: '1px' }}>
      { item.subItems.map((subItem, index) => {
        if (!Array.isArray(subItem)) {
          return <NavLink key={ subItem.text } item={ subItem }/>;
        }

        return (
          <React.Fragment key={ index }>
            { index > 0 && <Separator orientation="vertical"/> }
            <ul className="flex flex-col gap-y-1">
              { subItem.map((navItem) => <NavLink key={ navItem.text } item={ navItem }/>) }
            </ul>
          </React.Fragment>
        );
      }) }
    </div>
  ) : (
    <ul className="flex flex-col gap-y-1">
      { item.subItems.map((subItem) => {
        if (Array.isArray(subItem)) {
          return null;
        }
        return <NavLink key={ subItem.text } item={ subItem }/>;
      }) }
    </ul>
  );

  return (
    <Tooltip
      variant="popover"
      content={ content }
      onOpenChange={ onOpenChange }
      lazyMount={ false }
      positioning={{
        placement: 'bottom',
        offset: { mainAxis: 8 },
      }}
      interactive
    >
      <Link
        className="flex items-center px-2 py-1.5 text-sm font-medium rounded-base list-none"
        variant="navigation"
        { ...(item.isActive ? { 'data-selected': true } : {}) }
        { ...(open ? { 'data-active': true } : {}) }
      >
        { item.text }
        { isHighlighted && (
          <LightningLabel
            iconColor={ item.isActive ? 'link.navigation.bg.selected' : 'link.navigation.bg.group' }
            isCollapsed={ false }
          />
        ) }
        <IconSvg name="arrows/east-mini" className="w-5 h-5 -rotate-90 ml-1"/>
      </Link>
    </Tooltip>
  );
};

export default React.memo(NavLinkGroup);
