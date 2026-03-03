import React from 'react';

import { CctxStatusReduced } from '@luxfi/zetachain-cctx-types';

import StatusTag, { type StatusTagType } from 'ui/shared/statusTag/StatusTag';

type Props = {
  status: CctxStatusReduced;
  isLoading?: boolean;
  type?: 'reduced' | 'full';
};

const ZetaChainCCTXReducedStatus = ({ status, isLoading, type = 'reduced' }: Props) => {
  let statusTagType: StatusTagType;
  switch (status) {
    case CctxStatusReduced.Success:
      statusTagType = 'ok';
      break;
    case CctxStatusReduced.Pending:
      statusTagType = 'pending';
      break;
    case CctxStatusReduced.Failed:
      statusTagType = 'error';
      break;
    case CctxStatusReduced.UNRECOGNIZED:
      statusTagType = 'pending';
      break;
  }

  if (type === 'full') {
    let text: string;
    switch (status) {
      case CctxStatusReduced.Success:
        text = 'Success';
        break;
      case CctxStatusReduced.Pending:
        text = 'Pending';
        break;
      case CctxStatusReduced.Failed:
        text = 'Failed';
        break;
      case CctxStatusReduced.UNRECOGNIZED:
        text = 'Unrecognized';
        break;
    }
    return <StatusTag type={ statusTagType } text={ text } size="md" loading={ isLoading }/>;
  }

  return <StatusTag type={ statusTagType } size="sm" loading={ isLoading }/>;
};

export default ZetaChainCCTXReducedStatus;
