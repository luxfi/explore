import React from 'react';

import IconSvg from 'ui/shared/IconSvg';

const UserWalletAutoConnectAlert = () => {
  return (
    <div
     
    >
      <IconSvg
        name="integration/partial"
        color="text.primary"
      />
      <span>
        Connect your wallet in the app below
      </span>
    </div>
  );
};

export default React.memo(UserWalletAutoConnectAlert);
