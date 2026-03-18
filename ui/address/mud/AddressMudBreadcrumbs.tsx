import React from 'react';

import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import { Link } from 'toolkit/chakra/link';
import { isBrowser } from 'toolkit/utils/isBrowser';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import IconSvg from 'ui/shared/IconSvg';

import useAddressQuery from '../utils/useAddressQuery';

type TableViewProps = {
  className?: string;
  hash: string;
  tableId: string;
  tableName: string;
  recordId?: never;
  recordName?: never;
};

type RecordViewProps = Omit<TableViewProps, 'recordId' | 'recordName'> & {
  recordId: string;
  recordName: string;
};

type BreadcrumbItemProps = {
  text: string;
  href: string;
  isLast?: boolean;
};

const BreadcrumbItem = ({ text, href, isLast }: BreadcrumbItemProps) => {
  const currentUrl = isBrowser() ? window.location.href : '';

  const onLinkClick = React.useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  if (isLast) {
    return (
      <div className="grid" gap={ 2 } overflow="hidden" templateColumns="auto 24px" alignItems="center">
        <div
          overflow="hidden"
          whiteSpace="nowrap"
          textOverflow="ellipsis"
        >
          { text }
        </div>
        <CopyToClipboard text={ currentUrl } type="link" className="mx-0 text-[var(--color-icon-secondary)]"/>
      </div>
    );
  }

  return (
    <div className="grid" gap={ 2 } overflow="hidden" templateColumns="auto 24px" alignItems="center">
      <Link
        href={ href }
        onClick={ onLinkClick }
        className="overflow-hidden text-ellipsis whitespace-nowrap"
      >
        { text }
      </Link>
      { !isLast && <IconSvg name="arrows/east" boxSize={ 6 } color={{ _light: 'gray.300', _dark: 'gray.600' }}/> }
    </div>
  );
};

const AddressMudBreadcrumbs = (props: TableViewProps | RecordViewProps) => {
  const queryParams = { tab: 'mud', hash: props.hash };
  const isMobile = useIsMobile();

  const addressQuery = useAddressQuery({ hash: props.hash });

  return (
    <div
      display={ isMobile ? 'flex' : 'grid' }
      flexWrap="wrap"
      gridTemplateColumns="20px auto auto auto"
      gap={ 2 }
      alignItems="center"
      className={ props.className }
      width="fit-content"
      fontSize="sm"
    >
      <IconSvg name="MUD" boxSize={ 5 } color={ addressQuery.data?.is_verified ? 'green.500' : 'icon.primary' }/>
      <BreadcrumbItem
        text="MUD World"
        href={ route({ pathname: '/address/[hash]', query: queryParams }) }
      />
      <BreadcrumbItem
        text={ props.tableName }
        href={ route({ pathname: '/address/[hash]', query: { ...queryParams, table_id: props.tableId } }) }
        isLast={ !('recordId' in props) }
      />
      { ('recordId' in props && typeof props.recordId === 'string') && ('recordName' in props && typeof props.recordName === 'string') && (
        <BreadcrumbItem
          text={ props.recordName }
          href={ route({ pathname: '/address/[hash]', query: { ...queryParams, table_id: props.tableId, record_id: props.recordId } }) }
          isLast

        />
      ) }
    </div>
  );
};

export default React.memo(AddressMudBreadcrumbs);
