import React from 'react';

import type { Pool } from 'types/api/pools';

import getItemIndex from 'lib/getItemIndex';
import getPoolLinks from 'lib/pools/getPoolLinks';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { TableCell, TableRow } from 'toolkit/chakra/table';
import { Tooltip } from 'toolkit/chakra/tooltip';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import PoolEntity from 'ui/shared/entities/pool/PoolEntity';
import HashStringShorten from 'ui/shared/HashStringShorten';

type Props = {
  item: Pool;
  index: number;
  page: number;
  isLoading?: boolean;
};

const PoolsTableItem = ({
  item,
  page,
  index,
  isLoading,
}: Props) => {
  const externalLinks = getPoolLinks(item);

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-start gap-2">
          <Skeleton loading={ isLoading }>
            <span className="px-2">{ getItemIndex(index, page) }</span>
          </Skeleton>
          <div className="overflow-hidden">
            <PoolEntity pool={ item } fontWeight={ 700 } mb={ 2 } isLoading={ isLoading }/>
            { item.is_contract ? (
              <AddressEntity
                address={{ hash: item.pool_id }}
                noIcon
                isLoading={ isLoading }
                truncation="constant_long"
                link={{ variant: 'secondary' }}
              />
            ) : (
              <div className="flex items-center text-[var(--color-text-secondary)]">
                <HashStringShorten hash={ item.pool_id } type="long"/>
                <CopyToClipboard text={ item.pool_id }/>
              </div>
            ) }
          </div>
        </div>
      </TableCell>
      <TableCell>
        <Skeleton loading={ isLoading }>{ item.dex.name }</Skeleton>
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading }>
          ${ Number(item.liquidity).toLocaleString(undefined, { maximumFractionDigits: 2, notation: 'compact' }) }
        </Skeleton>
      </TableCell>
      <TableCell isNumeric>
        <Skeleton loading={ isLoading } display="flex" justifyContent="center" className="gap-2">
          { externalLinks.map((link) => (
            <Tooltip content={ link.title } key={ link.url }>
              <div className="inline-block">
                <Link external noIcon href={ link.url } className="inline-flex">
                  <Image src={ link.image } alt={ link.title } boxSize={ 5 }/>
                </Link>
              </div>
            </Tooltip>
          )) }
        </Skeleton>
      </TableCell>
    </TableRow>
  );
};

export default PoolsTableItem;
