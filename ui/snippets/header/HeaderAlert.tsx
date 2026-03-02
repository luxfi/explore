import React from 'react';

import config from 'configs/app';
import AlertWithExternalHtml from 'ui/shared/alerts/AlertWithExternalHtml';

import IndexingBlocksAlert from './alerts/IndexingBlocksAlert';

const maintenanceAlertHtml = config.UI.maintenanceAlert.message || '';

interface Props {
  className?: string;
  [key: string]: unknown;
}

const HeaderAlert = ({ className, ...props }: Props) => {
  return (
    <div className={ `flex flex-col gap-y-1 mb-6 lg:mb-3 empty:hidden ${ className ?? '' }`.trim() } { ...props }>
      { maintenanceAlertHtml && <AlertWithExternalHtml html={ maintenanceAlertHtml } status="info" showIcon/> }
      <IndexingBlocksAlert/>
    </div>
  );
};

export default React.memo(HeaderAlert);
