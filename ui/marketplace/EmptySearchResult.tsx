import React from 'react';

import { MarketplaceCategory } from 'types/client/marketplace';

import config from 'configs/app';
import { EmptyState } from '@luxfi/ui/empty-state';
import { Link } from 'toolkit/next/link';
import { apos, space } from 'toolkit/utils/htmlEntities';
import IconSvg from 'ui/shared/IconSvg';

const feature = config.features.marketplace;

type Props = {
  favoriteApps: Array<string>;
  selectedCategoryId?: string;
};

const EmptySearchResult = ({ favoriteApps, selectedCategoryId }: Props) => (
  <EmptyState
    description={
      (selectedCategoryId === MarketplaceCategory.FAVORITES && !favoriteApps.length) ? (
        <>
          You don{ apos }t have any favorite apps.<br/>
          Click on the <IconSvg name="heart_outline" className="w-5 h-5 align-text-bottom text-[var(--color-icon-secondary)] inline-block"/>{ space }
          icon on the app{ apos }s card to add it to Favorites.
        </>
      ) : (
        <>
          No matching apps found.
          { 'suggestIdeasFormUrl' in feature && (
            <>
              { ' ' }Have a groundbreaking idea or app suggestion?<br/>
              <Link external href={ feature.suggestIdeasFormUrl }>Share it with us</Link>
            </>
          ) }
        </>
      )
    }
  />
);

export default React.memo(EmptySearchResult);
