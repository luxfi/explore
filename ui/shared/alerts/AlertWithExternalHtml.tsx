import React from 'react';

import type { AlertProps } from 'toolkit/chakra/alert';
import { Alert } from 'toolkit/chakra/alert';

type Props = {
  html: string;
  status: AlertProps['status'];
  showIcon?: boolean;
  className?: string;
};

const AlertWithExternalHtml = ({ html, status, showIcon, className }: Props) => {
  return (
    <Alert status={ status } showIcon={ showIcon } className={ className }>
      <div
        dangerouslySetInnerHTML={{ __html: html }}
        style={{ }}
      />
    </Alert>
  );
};

export default React.memo(AlertWithExternalHtml);
