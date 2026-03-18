import React from 'react';

import config from 'configs/app';
import { Image } from '@luxfi/ui/image';
import { Link } from 'toolkit/chakra/link';
import { Tooltip } from '@luxfi/ui/tooltip';
import TxEntity from 'ui/shared/entities/tx/TxEntity';

const externalTxFeature = config.features.externalTxs;

interface Props {
  data: Array<string>;
}

const TxExternalTxs: React.FC<Props> = ({ data }) => {
  if (!externalTxFeature.isEnabled) {
    return null;
  }

  const content = (
    <div className="text-sm">
      <div className="flex items-center gap-2 text-base mb-3">
        <Image src={ externalTxFeature.chainLogoUrl } alt={ externalTxFeature.chainName } width={ 5 } height={ 5 }/>
        { externalTxFeature.chainName } transaction{ data.length > 1 ? 's' : '' }
      </div>
      <div className="flex flex-col gap-2 w-full max-h-[460px] overflow-y-auto">
        { data.map((txHash) => (
          <TxEntity
            key={ txHash }
            hash={ txHash }
            href={ externalTxFeature.explorerUrlTemplate.replace('{hash}', txHash) }
            link={{ external: true }}
            noCopy
            // tooltip inside tooltip doesn't work well
            noTooltip
          />
        )) }
      </div>
    </div>
  );

  return (
    <Tooltip
      content={ content }
      variant="popover"
      interactive
      positioning={{ placement: 'bottom' }}
      openDelay={ 300 }
      contentProps={{ className: 'w-[300px] lg:w-[460px]' }}
    >
      <Link
        className="inline-flex items-center gap-2 underline decoration-dashed"
      >
        <Image src={ externalTxFeature.chainLogoUrl } alt={ externalTxFeature.chainName } boxSize={ 5 }/>
        { `${ data.length } ${ externalTxFeature.chainName } txn${ data.length > 1 ? 's' : '' }` }
      </Link>
    </Tooltip>
  );
};

export default TxExternalTxs;
