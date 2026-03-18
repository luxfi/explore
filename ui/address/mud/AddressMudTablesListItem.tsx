import { useRouter } from 'next/router';
import React from 'react';

import type { AddressMudTableItem } from 'types/api/address';

import { route } from 'nextjs-routes';

import { Badge } from '@luxfi/ui/badge';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import HashStringShorten from 'ui/shared/HashStringShorten';
import IconSvg from 'ui/shared/IconSvg';
import ListItemMobile from 'ui/shared/ListItemMobile/ListItemMobile';

type Props = {
  item: AddressMudTableItem;
  isLoading: boolean;
  scrollRef?: React.RefObject<HTMLDivElement>;
  hash: string;
};

const AddressMudTablesListItem = ({ item, isLoading, scrollRef, hash }: Props) => {
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

    scrollRef?.current?.scrollIntoView();
  }, [ router, scrollRef, hash ]);

  return (
    <ListItemMobile className="!gap-y-3 !text-sm !py-3">
      <div className="flex w-full">
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
        <div className="grow">
          <div className="flex items-center justify-between mb-3 h-6">
            <Skeleton loading={ isLoading }>
              <Link
                onClick={ onTableClick }
                data-id={ item.table.table_id }
                className="font-medium"
                href={ route({ pathname: '/address/[hash]', query: { hash, tab: 'mud', table_id: item.table.table_id } }) }
              >
                { item.table.table_full_name }
              </Link>
            </Skeleton>
            <Skeleton loading={ isLoading } color="text.secondary">
              { item.table.table_type }
            </Skeleton>
          </div>
          <Skeleton loading={ isLoading } color="text.secondary">
            <HashStringShorten hash={ item.table.table_id } type="long"/>
          </Skeleton>
        </div>
      </div>

      { isOpened && (
        <div className="grid w-full gap-[8px 24px] font-medium" style={{ gridTemplateColumns: '48px 1fr' }}>
          { Boolean(item.schema.key_names.length) && (
            <>
              <span className="leading-[24px]">Key</span>
              <div className="flex flex-col items-start gap-1">
                { item.schema.key_names.map((name, index) => (
                  <Badge key={ name }>
                    <span className="font-bold">{ item.schema.key_types[index] }</span> { name }
                  </Badge>
                )) }
              </div>
            </>
          ) }
          <div className="col-span-2"><hr/></div>
          <span className="leading-[24px]">Value</span>
          <div className="flex flex-col items-start gap-1">
            { item.schema.value_names.map((name, index) => (
              <span key={ name }>
                <span className="font-bold">{ item.schema.value_types[index] }</span> { name }
              </span>
            )) }
          </div>
        </div>
      ) }
    </ListItemMobile>
  );
};

export default React.memo(AddressMudTablesListItem);
