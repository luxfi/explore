import React from 'react';

import { getEnvValue } from 'configs/app/utils';
import { Link } from 'toolkit/chakra/link';

interface Props {
  className?: string;
}

const AdminSupportText = ({ className }: Props) => {
  const supportUrl = getEnvValue('NEXT_PUBLIC_NETWORK_SUPPORT_URL') || 'mailto:help@blockscout.com';
  const supportLabel = supportUrl.startsWith('mailto:') ? supportUrl.replace('mailto:', '') : 'support';

  return (
    <div className={ className }>
      <span>Need help? Contact the support team at </span>
      <Link href={ supportUrl }>{ supportLabel }</Link>
      <span> for assistance!</span>
    </div>
  );
};

export default AdminSupportText;
