import React from 'react';

import { Tooltip } from 'toolkit/chakra/tooltip';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  internalWallet: boolean | undefined;
  external: boolean | undefined;
};

const MarketplaceAppIntegrationIcon = ({ external, internalWallet }: Props) => {
  const [ icon, iconColor, text, boxSize ] = React.useMemo(() => {
    let icon: IconName = 'integration/partial';
    let color = 'icon.secondary';
    let text = 'This app opens in the explorer without wallet functionality. Use your external web3 wallet to connect directly to this application';
    let boxSize = 5;

    if (external) {
      icon = 'link_external';
      color = 'icon.secondary';
      text = 'This app opens in a separate tab';
      boxSize = 4;
    } else if (internalWallet) {
      icon = 'integration/full';
      color = 'green.500';
      text = 'This app opens in the explorer and your wallet connects automatically';
    }

    return [ icon, color, text, boxSize ];
  }, [ external, internalWallet ]);

  return (
    <Tooltip
      content={ text }
      openDelay={ 300 }
      contentProps={{ className: 'max-w-[calc(100vw-8px)] lg:max-w-[400px]' }}
    >
      <IconSvg
        name={ icon }
        boxSize={ boxSize }
        color={ iconColor }
        position="relative"
        cursor="pointer"
        verticalAlign="middle"
      />
    </Tooltip>
  );
};

export default MarketplaceAppIntegrationIcon;
