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
      return <span className="font-medium text-green-500">Approved</span>;
    }
    case 'UPDATE_REQUIRED': {
      return <span className="font-medium text-orange-500">Waiting for update</span>;
    }
    case 'REJECTED': {
      return <span className="font-medium text-red-500">Rejected</span>;
    }

    default:
      return null;
  }
};

export default VerifiedAddressesStatus;
