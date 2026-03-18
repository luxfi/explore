import React from 'react';

import type { NavLink } from './types';

import { Link } from 'toolkit/chakra/link';
import IconSvg from 'ui/shared/IconSvg';

const UserProfileContentNavLink = ({ href, icon, text, onClick }: NavLink) => {
  return (
    <Link
      href={ href }
      className="flex items-center gap-3 py-3.5"
      onClick={ onClick }
      variant="menu"
    >
      <IconSvg name={ icon }/>
      <div>{ text }</div>
    </Link>
  );
};

export default React.memo(UserProfileContentNavLink);
