import { useRouter } from 'next/router';
import React from 'react';

import type { AddressMudTableItem } from 'types/api/address';

import { route } from 'nextjs-routes';

import { Badge } from 'toolkit/chakra/badge';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
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
    <ListItemMobile rowGap={ 3 } fontSize="sm" py={ 3 }>
      <div className="flex" w="100%">
        <Skeleton loading={ isLoading }>
          <Link className="block">
            <IconSvg
              name="arrows/east-mini"
              transform={ isOpened ? 'rotate(270deg)' : 'rotate(180deg)' }
              boxSize={ 6 }
              cursor="pointer"
              onClick={ handleIconClick }
              transitionDuration="faster"
              aria-label="View schema"
            />
          </Link>
        </Skeleton>
        <div flexGrow="1">
          <div className="flex" justifyContent="space-between" height={ 6 } alignItems="center" mb={ 3 }>
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
        <div className="grid" templateColumns="48px 1fr" gap="8px 24px" fontWeight={ 500 } w="100%">
          { Boolean(item.schema.key_names.length) && (
            <>
              <span lineHeight="24px">Key</span>
              <div className="flex flex-col" gap={ 1 } alignItems="start">
                { item.schema.key_names.map((name, index) => (
                  <Badge key={ name }>
                    <span fontWeight={ 700 }>{ item.schema.key_types[index] }</span> { name }
                  </Badge>
                )) }
              </div>
            </>
          ) }
          <div colSpan={ 2 }><hr/></div>
          <span lineHeight="24px">Value</span>
          <div className="flex flex-col" gap={ 1 } alignItems="start">
            { item.schema.value_names.map((name, index) => (
              <span key={ name }>
                <span fontWeight={ 700 }>{ item.schema.value_types[index] }</span> { name }
              </span>
            )) }
          </div>
        </div>
      ) }
    </ListItemMobile>
  );
};

export default React.memo(AddressMudTablesListItem);
