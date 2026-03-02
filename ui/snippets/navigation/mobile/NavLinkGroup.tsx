import React from 'react';

import type { NavGroupItem } from 'types/client/navigation';

import IconSvg from 'ui/shared/IconSvg';

import LightningLabel from '../LightningLabel';
import NavLinkIcon from '../NavLinkIcon';
import useNavLinkStyleProps from '../useNavLinkStyleProps';
import { checkRouteHighlight } from '../utils';

type Props = {
  item: NavGroupItem;
  onClick: () => void;
  isExpanded?: boolean;
};

const NavLinkGroup = ({ item, onClick, isExpanded }: Props) => {
  const styleProps = useNavLinkStyleProps({ isActive: item.isActive, isExpanded });

  const isHighlighted = checkRouteHighlight(item.subItems);

  return (
    <li className="list-none w-full" onClick={ onClick }>
      <div
        { ...styleProps.itemProps }
        className="w-full px-2"
        aria-label={ `${ item.text } link group` }
        style={{
          color: item.isActive ? 'var(--color-link-navigation-fg-selected)' : 'var(--color-link-navigation-fg)',
          backgroundColor: item.isActive ? 'var(--color-link-navigation-bg-selected)' : 'transparent',
        }}
      >
        <div className="flex justify-between w-full items-center pr-1">
          <div className="flex gap-0 overflow-hidden items-center">
            <NavLinkIcon item={ item }/>
            <span
              { ...styleProps.textProps }
              className="ml-3"
            >
              { item.text }
            </span>
            { isHighlighted && (<LightningLabel iconColor={ item.isActive ? 'link.navigation.bg.selected' : 'link.navigation.bg' }/>) }
          </div>
          <IconSvg name="arrows/east-mini" className="w-6 h-6 rotate-180"/>
        </div>
      </div>
    </li>
  );
};

export default NavLinkGroup;
