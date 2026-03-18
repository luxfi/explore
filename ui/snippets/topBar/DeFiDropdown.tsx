import { useRouter } from 'next/router';
import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import getPageType from 'lib/mixpanel/getPageType';
import * as mixpanel from 'lib/mixpanel/index';
import { Button } from 'toolkit/chakra/button';
import { Link } from 'toolkit/chakra/link';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { space } from 'toolkit/utils/htmlEntities';
import IconSvg from 'ui/shared/IconSvg';

import DeFiDropdownItem from './DeFiDropdownItem';

const feature = config.features.deFiDropdown;

const DeFiDropdown = () => {
  const router = useRouter();
  const source = getPageType(router.pathname);

  const handleClick = React.useCallback((content: string) => {
    mixpanel.logEvent(mixpanel.EventTypes.BUTTON_CLICK, { Content: `DeFi button: ${ content }`, Source: source });
  }, [ source ]);

  if (!feature.isEnabled) {
    return null;
  }

  const items = feature.items.map((item) => ({
    ...item,
    onClick: () => handleClick(item.text),
  }));

  return items.length > 1 ? (
    <PopoverRoot>
      <PopoverTrigger>
        <Button size="2xs" className="gap-0">
          <span className="hidden lg:inline whitespace-pre-wrap">
            { config.chain.name || 'Explorer' }{ space }
          </span>
          DeFi
          <IconSvg name="arrows/east-mini" className="w-4 h-4 ml-1 -rotate-90"/>
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{ width: 'auto', minWidth: '132px' }}>
        <PopoverBody >
          <div className="flex flex-col gap-1">
            { items.map((item, index) => (
              <DeFiDropdownItem key={ index } item={ item }/>
            )) }
          </div>
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  ) : (
    <Link
      href={
        items[0].dappId ?
          route({
            pathname: items[0].isEssentialDapp ? '/essential-dapps/[id]' : '/apps/[id]',
            query: { id: items[0].dappId, action: 'connect' },
          }) :
          items[0].url
      }
      external={ !items[0].dappId }
    >
      <Button onClick={ items[0].onClick } size="2xs">
        { items[0].icon && <IconSvg name={ items[0].icon } className="w-3 h-3 mr-0 sm:mr-1"/> }
        <span className="hidden sm:inline">
          { items[0].text }
        </span>
      </Button>
    </Link>
  );
};

export default React.memo(DeFiDropdown);
