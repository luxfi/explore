import React from 'react';

import { Link } from 'toolkit/chakra/link';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  url: string;
}

const SupportLink = ({ url }: Props) => {
  const isEmail = url.includes('@');
  const href = isEmail ? `mailto:${ url }` : url;

  return (
    <Link
      href={ href }
      external
      noIcon
      className="inline-flex items-center gap-1"
    >
      <IconSvg name={ isEmail ? 'email' : 'link' } className="w-6 h-6 text-[var(--color-icon-primary)]"/>
      <span>{ url }</span>
    </Link>
  );
};

export default SupportLink;
