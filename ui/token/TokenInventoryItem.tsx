import React from 'react';

import type { TokenInfo, TokenInstance } from 'types/api/token';

import { route } from 'nextjs/routes';

import { useMultichainContext } from 'lib/contexts/multichain';
import useIsMobile from 'lib/hooks/useIsMobile';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TruncatedTextTooltip } from 'toolkit/components/truncation/TruncatedTextTooltip';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import NftMedia from 'ui/shared/nft/NftMedia';

type Props = { item: TokenInstance; token: TokenInfo; isLoading: boolean };

const TokenInventoryItem = ({ item, token, isLoading }: Props) => {

  const isMobile = useIsMobile();
  const multichainContext = useMultichainContext();

  const mediaElement = (
    <NftMedia
      data={ item }
      isLoading={ isLoading }
      autoplayVideo={ false }
      size="md"
    />
  );

  const url = route({ pathname: '/token/[hash]/instance/[id]', query: { hash: token.address_hash, id: item.id } }, multichainContext);

  return (
    <div
      className="w-full lg:w-[210px] p-[10px]"
    >
      <Link href={ isLoading ? undefined : url } className="inline">
        { mediaElement }
      </Link>
      { item.id && (
        <div>
          <span className="text-[var(--color-text-secondary)]">ID# </span>
          <TruncatedTextTooltip label={ item.id }>
            <Skeleton loading={ isLoading } className="overflow-hidden">
              <Link
                className="overflow-hidden text-ellipsis whitespace-nowrap block"
                loading={ isLoading }
                href={ url }
              >
                { item.id }
              </Link>
            </Skeleton>
          </TruncatedTextTooltip>
        </div>
      ) }
      { item.owner && (
        <div>
          <span className="text-[var(--color-text-secondary)]">Owner</span>
          <AddressEntity
            address={ item.owner }
            isLoading={ isLoading }
            truncation="constant"
            noCopy
            noIcon={ isMobile }
          />
        </div>
      ) }
    </div>
  );
};

export default TokenInventoryItem;
