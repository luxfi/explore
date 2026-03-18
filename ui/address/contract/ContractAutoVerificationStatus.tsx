import React from 'react';

import { Tooltip } from 'toolkit/chakra/tooltip';
import IconSvg from 'ui/shared/IconSvg';

const STATUS_MAP = {
  pending: {
    text: 'Checking contract verification',
    leftElement: <div className="animate-spin rounded-full border-2 border-current border-t-transparent h-5 w-5"/>,
  },
  success: {
    text: 'Contract successfully verified',
    leftElement: <IconSvg name="verified" className="w-5 h-5 text-green-500"/>,
  },
  failed: {
    text: 'Contract not verified automatically. Please verify manually.',
    leftElement: <IconSvg name="status/warning" className="w-5 h-5 text-orange-400"/>,
  },
};

export type TContractAutoVerificationStatus = keyof typeof STATUS_MAP;

interface Props {
  status: TContractAutoVerificationStatus;
  mode?: 'inline' | 'tooltip';
}

const ContractAutoVerificationStatus = ({ status, mode = 'inline' }: Props) => {
  return (
    <Tooltip content={ STATUS_MAP[status].text } disabled={ mode === 'inline' }>
      <div className="flex flex-row gap-2 whitespace-pre-wrap">
        { STATUS_MAP[status].leftElement }
        <div className={ `text-sm ${ mode === 'inline' ? 'inline' : 'hidden' }` }>{ STATUS_MAP[status].text }</div>
      </div>
    </Tooltip>
  );
};

export default React.memo(ContractAutoVerificationStatus);
