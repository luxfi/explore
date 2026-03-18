import React from 'react';

import { Button } from '@luxfi/ui/button';
import IconSvg from 'ui/shared/IconSvg';
import StatusTag from 'ui/shared/statusTag/StatusTag';

import type { Status } from './useUptimeSocketData';

interface Props { status: Status; onReconnect: () => void }

const UptimeStatus = ({ status, onReconnect }: Props) => {
  const statusTag = (() => {
    switch (status) {
      case 'connected': return <StatusTag type="ok" text="Connected"/>;
      case 'disconnected': case 'error': return <StatusTag type="error" text="Disconnected"/>;
      case 'initial': return <StatusTag type="pending" text="Initializing"/>;
    }
    return null;
  })();

  return (
    <div className="flex ml-auto gap-x-3">
      { statusTag }
      <Button variant="link" className="gap-1" onClick={ onReconnect } disabled={ status === 'connected' }>
        <IconSvg name="refresh" className="w-5 h-5"/>
        <span className="text-sm hidden lg:inline">Refresh</span>
      </Button>
    </div>
  );
};

export default React.memo(UptimeStatus);
