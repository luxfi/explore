import React from 'react';

import type { RouteParams } from 'nextjs/routes';
import { route } from 'nextjs/routes';

import type { LinkProps } from 'toolkit/chakra/link';
import { Link } from 'toolkit/chakra/link';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends LinkProps {
  query?: Record<string, string | Array<string> | undefined>;
  routeParams?: RouteParams;
  adaptive?: boolean;
}

const AdvancedFilterLink = ({ query, routeParams, adaptive = true, className, ...rest }: Props) => {
  return (
    <Link
      href={ route({ pathname: '/advanced-filter', query }, routeParams) }
      className={ `flex items-center gap-1 text-sm ${ className ?? '' }`.trim() }
      { ...rest }
    >
      <IconSvg name="advanced-filter" boxSize={ 5 }/>
      <span className={adaptive ?"hidden lg:inline" :""}>Advanced</span>
    </Link>
  );
};

export default React.memo(AdvancedFilterLink);
