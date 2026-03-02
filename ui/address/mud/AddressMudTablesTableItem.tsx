import { useRouter } from 'next/router';
import React from 'react';

import type { AddressMudTableItem } from 'types/api/address';

import { route } from 'nextjs-routes';

import { Badge } from '@luxfi/ui/badge';
import { Link } from 'toolkit/next/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import { TableBody, TableCell, TableRoot, TableRow } from '@luxfi/ui/table';
import IconSvg from 'ui/shared/IconSvg';
type Props = {
  item: AddressMudTableItem;
  isLoading: boolean;
  hash: string;
};

const AddressMudTablesTableItem = ({ item, isLoading, hash }: Props) => {
  const [ isOpened, setIsOpened ] = React.useState(false);

  const router = useRouter();

  const handleIconClick = React.useCallback(() => {
    setIsOpened((prev) => !prev);
  }, []);

  const onTableClick = React.useCallback((e: React.MouseEvent) => {
    if (e.metaKey || e.ctrlKey) {
      // Allow opening in a new tab/window with right-click or ctrl/cmd+click
      return;
    }

    e.preventDefault();

    const tableId = e.currentTarget.getAttribute('data-id');
    if (tableId) {
      router.push(
        { pathname: '/address/[hash]', query: { hash, tab: 'mud', table_id: tableId } },
        undefined,
        { shallow: true },
      );
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [ router, hash ]);

  return (
    <>
      <TableRow borderBottomStyle={ isOpened ? 'hidden' : 'unset' }>
        <TableCell verticalAlign="middle">
          <Skeleton loading={ isLoading }>
            <Link className="block">
              <IconSvg
                name="arrows/east-mini"
                style={{ transform:  isOpened ? 'rotate(270deg)' : 'rotate(180deg)'  }}
                className="w-6 h-6 transition-transform duration-150 cursor-pointer"
               
                onClick={ handleIconClick }
               
                aria-label="View schema"
              />
            </Link>
          </Skeleton>
        </TableCell>
        <TableCell verticalAlign="middle">
          <Skeleton loading={ isLoading }>
            <Link
              href={ route({ pathname: '/address/[hash]', query: { hash, tab: 'mud', table_id: item.table.table_id } }) }
              data-id={ item.table.table_id }
              onClick={ onTableClick }
              className="font-bold"
            >
              { item.table.table_full_name }
            </Link>
          </Skeleton>
        </TableCell>
        <TableCell verticalAlign="middle">
          <Skeleton loading={ isLoading }>
            { item.table.table_id }
          </Skeleton>
        </TableCell>
        <TableCell verticalAlign="middle">
          <Skeleton loading={ isLoading }>
            { item.table.table_type }
          </Skeleton>
        </TableCell>
      </TableRow>
      { isOpened && (
        <TableRow>
          <TableCell pt={ 0 }></TableCell>
          <TableCell colSpan={ 3 } pt={ 0 }>
            <TableRoot>
              <TableBody>
                { Boolean(item.schema.key_names.length) && (
                  <TableRow>
                    <TableCell width="80px" fontSize="sm" fontWeight={ 600 } py={ 2 } pl={ 0 } verticalAlign="middle">Key</TableCell>
                    <TableCell py={ 2 }>
                      <div className="flex flex-col items-start gap-1">
                        { item.schema.key_names.map((name, index) => (
                          <Badge key={ name }>
                            <span className="font-bold">{ item.schema.key_types[index] }</span> { name }
                          </Badge>
                        )) }
                      </div>
                    </TableCell>
                  </TableRow>
                ) }
                <TableRow borderBottomStyle="hidden">
                  <TableCell width="80px" fontSize="sm" fontWeight={ 600 } py={ 2 } pl={ 0 } >Value</TableCell>
                  <TableCell fontSize="sm" py={ 2 }>
                    <div className="flex flex-col items-start gap-1">
                      { item.schema.value_names.map((name, index) => (
                        <span key={ name }>
                          <span className="font-bold">{ item.schema.value_types[index] }</span> { name }
                        </span>
                      )) }
                    </div>
                  </TableCell>
                </TableRow>
              </TableBody>
            </TableRoot>
          </TableCell>
        </TableRow>
      ) }
    </>
  );
};

export default React.memo(AddressMudTablesTableItem);
