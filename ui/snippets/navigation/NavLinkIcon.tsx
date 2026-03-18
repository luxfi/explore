import React from 'react';

import { cn } from 'lib/utils/cn';
import type { NavItem, NavGroupItem } from 'types/client/navigation';

import IconSvg from 'ui/shared/IconSvg';

interface Props {
  className?: string;
  item: NavItem | NavGroupItem;
}

const NavLinkIcon = ({ item, className }: Props) => {
  if ('icon' in item && item.icon) {
    return <IconSvg className={ cn('w-[30px] h-[30px] shrink-0 fill-current', className) } name={ item.icon }/>;
  }
  if ('iconComponent' in item && item.iconComponent) {
    const IconComponent = item.iconComponent;
    return <IconComponent className={ className } size={ 30 }/>;
  }

  return null;
};

export default NavLinkIcon;
