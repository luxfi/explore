import React from 'react';

import { route } from 'nextjs-routes';

import useIsMobile from 'lib/hooks/useIsMobile';
import { cn } from 'lib/utils/cn';
import { Link } from 'toolkit/next/link';
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
      <div className="grid items-center overflow-hidden gap-2" style={{ gridTemplateColumns: 'auto 24px' }}>
        <div className="overflow-hidden whitespace-nowrap text-ellipsis">
          { text }
        </div>
        <CopyToClipboard text={ currentUrl } type="link" className="mx-0 text-[var(--color-icon-secondary)]"/>
      </div>
    );
  }

  return (
    <div className="grid items-center overflow-hidden gap-2" style={{ gridTemplateColumns: 'auto 24px' }}>
      <Link
        href={ href }
        onClick={ onLinkClick }
        className="overflow-hidden text-ellipsis whitespace-nowrap"
      >
        { text }
      </Link>
      { !isLast && <IconSvg name="arrows/east" className="w-6 h-6 text-gray-300 dark:text-gray-600"/> }
    </div>
  );
};

const AddressMudBreadcrumbs = (props: TableViewProps | RecordViewProps) => {
  const queryParams = { tab: 'mud', hash: props.hash };
  const isMobile = useIsMobile();

  const addressQuery = useAddressQuery({ hash: props.hash });

  return (
    <div
      className={ cn(
        isMobile ? 'flex flex-wrap' : 'grid',
        'gap-2 items-center w-fit text-sm',
        props.className,
      ) }
      style={ !isMobile ? { gridTemplateColumns: '20px auto auto auto' } : undefined }
    >
      <IconSvg name="MUD" className={ cn('w-5 h-5', addressQuery.data?.is_verified ? 'text-green-500' : 'text-[var(--color-icon-primary)]') }/>
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
