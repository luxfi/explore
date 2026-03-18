import React from 'react';

import { IconButton } from 'toolkit/chakra/icon-button';
import { Link } from 'toolkit/chakra/link';
import { Tooltip } from 'toolkit/chakra/tooltip';

import IconSvg from '../IconSvg';

interface Props {
  className?: string;
  label?: string;
  href: string;
}

const LinkNewTab = ({ className, label, href }: Props) => {

  return (
    <Tooltip content={ label }>
      <Link href={ href } external noIcon className={ `size-5 rounded-none inline-flex items-center justify-center text-[var(--color-icon-secondary)] hover:text-[var(--color-hover)] ${ className ?? '' }`.trim() }>
        <IconSvg name="open-link"/>
      </Link>
    </Tooltip>
  );
};

export default React.memo(LinkNewTab);
