import React from 'react';

import { Skeleton } from 'toolkit/chakra/skeleton';
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
    <ListItemMobile w="full" >
      <Skeleton loading={ props.isPlaceholderData } w="full">

        <div >
          <IconSvg
            name="lightning"
            height="5"
            width="5"
            color="icon.primary"
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
