import React from 'react';

import type { TokenInfoApplication } from 'types/api/account';

interface Props {
  status?: TokenInfoApplication['status'];
}

const VerifiedAddressesStatus = ({ status }: Props) => {
  switch (status) {
    case 'IN_PROCESS': {
      return <span className="font-medium">In progress</span>;
    }
    case 'APPROVED': {
      return <span className="font-medium text-good">Approved</span>;
    }
    case 'UPDATE_REQUIRED': {
      return <span className="font-medium text-warn">Waiting for update</span>;
    }
    case 'REJECTED': {
      return <span className="font-medium text-bad">Rejected</span>;
    }

    default:
      return null;
  }
};

export default VerifiedAddressesStatus;
