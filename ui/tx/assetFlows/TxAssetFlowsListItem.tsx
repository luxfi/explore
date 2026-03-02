import React from 'react';

import { Skeleton } from '@luxfi/ui/skeleton';
import IconSvg from 'ui/shared/IconSvg';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';
import NovesFromTo from 'ui/shared/Noves/NovesFromTo';

import NovesActionSnippet from './components/NovesActionSnippet';
import type { NovesFlowViewItem } from './utils/generateFlowViewData';

type Props = {
  isPlaceholderData: boolean;
  item: NovesFlowViewItem;
};

const TxAssetFlowsListItem = (props: Props) => {

  return (
    <ListItemMobile className="w-full">
      <Skeleton loading={ props.isPlaceholderData } className="w-full">

        <div>
          <IconSvg
            name="lightning"
            className="h-5 w-5 text-[var(--color-icon-primary)]"
          />

          <span>
            Action
          </span>
        </div>

      </Skeleton>

      <NovesActionSnippet item={ props.item } isLoaded={ !props.isPlaceholderData }/>

      <div>
        <NovesFromTo item={ props.item } isLoaded={ !props.isPlaceholderData }/>
      </div>
    </ListItemMobile>
  );
};

export default React.memo(TxAssetFlowsListItem);
