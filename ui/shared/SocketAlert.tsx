import React from 'react';

import { Alert } from 'toolkit/chakra/alert';
import { Link } from 'toolkit/chakra/link';

interface Props {
  className?: string;
}

const SocketAlert = ({ className }: Props) => {
  return (
    <Alert status="warning" className={ className }>
      <span className="whitespace-pre">Connection lost, click </span>
      <Link href={ window.document.location.href }>to load newer records</Link>
    </Alert>
  );
};

export default SocketAlert;
