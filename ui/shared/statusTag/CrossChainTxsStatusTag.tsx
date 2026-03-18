import React from 'react';

import { MessageStatus } from '@luxfi/interchain-indexer-types';

import type { BadgeProps } from '@luxfi/ui/badge';

import StatusTag, { type Props as StatusTagProps } from './StatusTag';

interface Props extends BadgeProps {
  status: MessageStatus;
  mode?: StatusTagProps['mode'];
}

const CrossChainTxsStatusTag = ({ status: statusProp, mode = 'compact', ...rest }: Props) => {

  const { status, text } = (() => {
    switch (statusProp) {
      case MessageStatus.MESSAGE_STATUS_COMPLETED:
        return { status: 'ok' as const, text: 'Completed' };
      case MessageStatus.MESSAGE_STATUS_FAILED:
        return { status: 'error' as const, text: 'Failed' };
      case MessageStatus.MESSAGE_STATUS_INITIATED:
        return { status: 'pending' as const, text: 'Initiated' };
      default:
        return { status: undefined, text: undefined };
    }
  })();

  if (!status) {
    return null;
  }

  return <StatusTag type={ status } text={ text } mode={ mode } { ...rest }/>;
};

export default React.memo(CrossChainTxsStatusTag);
