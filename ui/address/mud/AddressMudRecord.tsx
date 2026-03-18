import { useRouter } from 'next/router';
import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import getQueryParamString from 'lib/router/getQueryParamString';
import { TableRoot, TableRow, TableCell } from 'toolkit/chakra/table';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import Time from 'ui/shared/time/Time';

import AddressMudBreadcrumbs from './AddressMudBreadcrumbs';
import AddressMudRecordValues from './AddressMudRecordValues';
import { getValueString } from './utils';

type Props = {
  isQueryEnabled?: boolean;
  tableId: string;
  recordId: string;
};

const AddressMudRecord = ({ tableId, recordId, isQueryEnabled = true }: Props) => {
  const router = useRouter();

  const hash = getQueryParamString(router.query.hash);

  const { data, isLoading, isError } = useApiQuery('general:mud_record', {
    pathParams: { hash, table_id: tableId, record_id: recordId },
    queryOptions: {
      enabled: isQueryEnabled,
    },
  });

  if (isLoading) {
    return <ContentLoader/>;
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  return (
    <>
      { data && (
        <AddressMudBreadcrumbs
          hash={ hash }
          tableId={ tableId }
          tableName={ data?.table.table_full_name }
          recordId={ recordId }
          recordName={ data.record.id }
          className="mb-6"
        />
      ) }
      <div className="hidden lg:block">
        <TableRoot borderRadius="8px" style={{ tableLayout: 'auto' }} width="100%" overflow="hidden">
          { data?.schema.key_names.length && data?.schema.key_names.map((keyName, index) => (
            <TableRow key={ keyName } borderBottomStyle={ index === data.schema.key_names.length - 1 ? 'hidden' : 'solid' }>
              <TableCell fontWeight={ 600 } whiteSpace="nowrap" fontSize="sm">
                { keyName } ({ data.schema.key_types[index] })
              </TableCell>
              <TableCell colSpan={ 2 } fontSize="sm">
                <div className="flex justify-between">
                  <TruncatedText text={ getValueString(data.record.decoded[keyName]) } className="mr-2"/>
                  { index === 0 && <Time color="text.secondary" timestamp={ data.record.timestamp }/> }
                </div>
              </TableCell>
            </TableRow>
          )) }
          <AddressMudRecordValues data={ data }/>
        </TableRoot>
      </div>
      <div className="lg:hidden">
        <>
          { data?.schema.key_names.length && data?.schema.key_names.map((keyName, index) => (
            <div className="flex flex-col items-start text-sm gap-1" key={ keyName }>
              <hr/>
              <span className="font-semibold whitespace-nowrap">
                { keyName } ({ data.schema.key_types[index] })
              </span>
              <span className="break-words">{ getValueString(data.record.decoded[keyName]) }</span>
              { index === 0 && <Time color="text.secondary" timestamp={ data.record.timestamp }/> }
            </div>
          )) }
          <TableRoot borderRadius="8px" style={{ tableLayout: 'auto' }} width="100%" mt={ 2 } overflow="hidden">
            <AddressMudRecordValues data={ data }/>
          </TableRoot>
        </>
      </div>
    </>
  );
};

export default AddressMudRecord;
