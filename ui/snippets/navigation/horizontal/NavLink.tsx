import React from 'react';

import type { NavItem } from 'types/client/navigation';

import { route } from 'nextjs-routes';

import { isInternalItem } from 'lib/hooks/useNavItems';
import { cn } from 'lib/utils/cn';
import { Link } from 'toolkit/chakra/link';

import LightningLabel from '../LightningLabel';
import NavLinkIcon from '../NavLinkIcon';
import { checkRouteHighlight } from '../utils';

interface Props {
  className?: string;
  item: NavItem;
  noIcon?: boolean;
}

const NavLink = ({ className, item, noIcon }: Props) => {
  const isInternalLink = isInternalItem(item);

  const isActive = 'isActive' in item && item.isActive;

  const isHighlighted = checkRouteHighlight(item);

  return (
    <li className="list-none">
      <Link
        className={ cn('flex items-center w-[224px] px-2 py-[9px] text-sm font-medium rounded-base', className) }
        href={ isInternalLink ? route(item.nextRoute) : item.url }
        external={ !isInternalLink }
        variant="navigation"
        { ...(isActive ? { 'data-selected': true } : {}) }
      >
        { !noIcon && <NavLinkIcon item={ item } className="mr-3"/> }
        <span>{ item.text }</span>
        { isHighlighted && (
          <LightningLabel
            iconColor={ isActive ? 'link.navigation.bg.selected' : 'link.navigation.bg.group' }
            isCollapsed={ false }
          />
        ) }
      </Link>
    </li>
  );
};

export default React.memo(NavLink);
