import React from 'react';

import AddressIdenticon from 'ui/shared/entities/address/AddressIdenticon';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  address: string;
  isAutoConnectDisabled?: boolean;
};

const UserIdenticon = ({ address, isAutoConnectDisabled }: Props) => {
  return (
    <div className="relative">
      <AddressIdenticon size={ 20 } hash={ address }/>
      { isAutoConnectDisabled && (
        <div
          className="flex items-center justify-center w-[14px] h-[14px] absolute -bottom-px -right-[3px] rounded-full border border-orange-100 dark:border-orange-900"
          style={{ backgroundColor: 'rgba(16, 17, 18, 0.80)' }}
        >
          <IconSvg
            name="integration/partial"
            color="white"
          />
        </div>
      ) }
    </div>
  );
};

export default React.memo(UserIdenticon);
