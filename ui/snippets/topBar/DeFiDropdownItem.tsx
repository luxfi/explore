import React from 'react';

import type { DeFiDropdownItem as TDeFiDropdownItem } from 'types/client/deFiDropdown';

import { route } from 'nextjs-routes';

import { Link } from 'toolkit/chakra/link';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  item: TDeFiDropdownItem & { onClick: () => void };
};

const DeFiDropdownItem = ({ item }: Props) => {
  return (
    <Link
      href={ item.dappId ?
        route({
          pathname: item.isEssentialDapp ? '/essential-dapps/[id]' : '/apps/[id]',
          query: { id: item.dappId, action: 'connect' },
        }) :
        item.url
      }
      external={ !item.dappId }
      className="w-full h-[34px]"
      variant="menu"
      onClick={ item.onClick }
    >
      { item.icon && <IconSvg name={ item.icon } boxSize={ 5 } mr={ 2 }/> }
      <span className="text-sm">{ item.text }</span>
    </Link>
  );
};

export default React.memo(DeFiDropdownItem);
