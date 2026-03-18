import React from 'react';

import { Tooltip } from 'toolkit/chakra/tooltip';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  internalWallet: boolean | undefined;
  external: boolean | undefined;
};

const MarketplaceAppIntegrationIcon = ({ external, internalWallet }: Props) => {
  const [ icon, iconColor, text, size ] = React.useMemo(() => {
    let icon: IconName = 'integration/partial';
    let color = 'text-[var(--color-icon-secondary)]';
    let text = 'This app opens in the explorer without wallet functionality. Use your external web3 wallet to connect directly to this application';
    let size = 'w-5 h-5';

    if (external) {
      icon = 'link_external';
      color = 'text-[var(--color-icon-secondary)]';
      text = 'This app opens in a separate tab';
      size = 'w-4 h-4';
    } else if (internalWallet) {
      icon = 'integration/full';
      color = 'text-green-500';
      text = 'This app opens in the explorer and your wallet connects automatically';
    }

    return [ icon, color, text, size ];
  }, [ external, internalWallet ]);

  return (
    <Tooltip
      content={ text }
      openDelay={ 300 }
      contentProps={{ className: 'max-w-[calc(100vw-8px)] lg:max-w-[400px]' }}
    >
      <IconSvg
        name={ icon }
        className={ `${ size } ${ iconColor } relative cursor-pointer align-middle` }
      />
    </Tooltip>
  );
};

export default MarketplaceAppIntegrationIcon;
