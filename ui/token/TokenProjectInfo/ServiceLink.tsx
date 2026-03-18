import React from 'react';

import type { TokenVerifiedInfo } from 'types/api/token';

import { Link } from 'toolkit/chakra/link';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

export interface Props {
  field: keyof TokenVerifiedInfo;
  icon: IconName;
  title: string;
  href?: string;
}

const ServiceLink = ({ href, title, icon }: Props) => {
  return (
    <Link
      href={ href }
      aria-label={ title }
      title={ title }
      external
      noIcon
      className="inline-flex items-center"
    >
      <IconSvg name={ icon } className="w-5 h-5 mr-2 text-[var(--color-icon-primary)]"/>
      <span>{ title }</span>
    </Link>
  );
};

export default ServiceLink;
