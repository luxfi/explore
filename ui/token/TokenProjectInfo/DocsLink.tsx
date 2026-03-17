import React from 'react';

import { Link } from 'toolkit/chakra/link';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  href: string;
}

const DocsLink = ({ href }: Props) => {
  return (
    <Link
      href={ href }
      external
      noIcon
      className="inline-flex items-center gap-1"
    >
      <IconSvg name="docs" boxSize={ 5 } color="icon.primary"/>
      <span>Documentation</span>
    </Link>
  );
};

export default DocsLink;
