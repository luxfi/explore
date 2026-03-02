import React from 'react';

import type { NavGroupItem } from 'types/client/navigation';

import { cn } from 'lib/utils/cn';
import { Tooltip } from '@luxfi/ui/tooltip';
import IconSvg from 'ui/shared/IconSvg';

import LightningLabel from '../LightningLabel';
import NavLinkIcon from '../NavLinkIcon';
import useNavLinkStyleProps from '../useNavLinkStyleProps';
import { checkRouteHighlight } from '../utils';
import NavLink from './NavLink';

type Props = {
  item: NavGroupItem;
  isCollapsed?: boolean;
};

const NavLinkGroup = ({ item, isCollapsed }: Props) => {
  const isExpanded = isCollapsed === false;

  const styleProps = useNavLinkStyleProps({ isCollapsed, isExpanded, isActive: item.isActive });

  const isHighlighted = checkRouteHighlight(item.subItems);

  const content = (
    <div className="w-[228px]">
      <span
        className={ `text-[var(--color-text-secondary)] text-sm mb-1 ${ isExpanded ? 'lg:hidden' : 'lg:block' } ${ isCollapsed ? 'xl:block' : 'xl:hidden' }` }
      >
        { item.text }
      </span>
      <ul className="flex flex-col gap-1 items-start">
        { item.subItems.map((subItem, index) => Array.isArray(subItem) ? (
          <li
            key={ index }
            className="w-full list-none [&:not(:last-child)]:mb-2 [&:not(:last-child)]:pb-2 [&:not(:last-child)]:border-b [&:not(:last-child)]:border-[var(--color-border-divider)]"
          >
            <ul>
              { subItem.map(subSubItem => <NavLink key={ subSubItem.text } item={ subSubItem } isCollapsed={ false }/>) }
            </ul>
          </li>
        ) :
          <NavLink key={ subItem.text } item={ subItem } isCollapsed={ false }/>,
        ) }
      </ul>
    </div>
  );

  return (
    <li className="list-none w-full">
      <Tooltip
        content={ content }
        positioning={{ placement: 'right', offset: { crossAxis: 0, mainAxis: 8 } }}
        // should not be lazy to help google indexing pages
        lazyMount={ false }
        variant="popover"
        interactive
      >
        <div
          { ...styleProps.itemProps }
          className={ cn(
            'cursor-pointer relative',
            isExpanded ? 'lg:w-[180px] lg:pl-2 lg:pr-0' : 'lg:w-[60px] lg:pl-[15px] lg:pr-[15px]',
            isCollapsed ? 'xl:w-[60px] xl:pl-[15px] xl:pr-[15px]' : 'xl:w-[180px] xl:pl-2 xl:pr-0',
          ) }
          aria-label={ `${ item.text } link group` }
          style={{
            color: item.isActive ? 'var(--color-link-navigation-fg-selected)' : 'var(--color-link-navigation-fg)',
            backgroundColor: item.isActive ? 'var(--color-link-navigation-bg-selected)' : 'var(--color-link-navigation-bg)',
          }}
        >
          <div className="flex gap-0 overflow-hidden items-center">
            <NavLinkIcon item={ item }/>
            <span
              { ...styleProps.textProps }
              className="ml-3 whitespace-nowrap"
            >
              { item.text }
            </span>
            { isHighlighted && (
              <LightningLabel
                iconColor={ item.isActive ? 'link.navigation.bg.selected' : 'link.navigation.bg.group' }
                isCollapsed={ isCollapsed }
              />
            ) }
            <IconSvg
              name="arrows/east-mini"
              className={ cn(
                'absolute right-[7px] rotate-180 w-6 h-6 transition-opacity duration-200 ease-in-out',
                isExpanded ? 'lg:opacity-100' : 'lg:opacity-0',
                isCollapsed ? 'xl:opacity-0' : 'xl:opacity-100',
              ) }
            />
          </div>
        </div>
      </Tooltip>
    </li>
  );
};

export default NavLinkGroup;
