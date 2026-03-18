import React from 'react';

import { Button } from 'toolkit/chakra/button';
import IconSvg from 'ui/shared/IconSvg';
import StatusTag from 'ui/shared/statusTag/StatusTag';

import type { Status } from './useUptimeSocketData';

interface Props {
  status: Status;
  onReconnect: () => void;
}

const UptimeStatus = ({ status, onReconnect }: Props) => {

  const statusTag = (() => {
    switch (status) {
      case 'connected':
        return <StatusTag type="ok" text="Connected"/>;
      case 'disconnected':
      case 'error':
        return <StatusTag type="error" text="Disconnected"/>;
      case 'initial':
        return <StatusTag type="pending" text="Initializing"/>;
    }

    return null;
  })();

  return (
    <div ml="auto" columnGap={ 3 }>
      { statusTag }
      <Button variant="link" className="gap-1" onClick={ onReconnect } disabled={ status === 'connected' }>
        <IconSvg name="refresh" boxSize={ 5 }/>
        <span className="text-sm hidden lg:inline">Refresh</span>
      </Button>
    </div>
  );
};

export default React.memo(UptimeStatus);
