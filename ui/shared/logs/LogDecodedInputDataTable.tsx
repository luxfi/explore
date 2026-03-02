import React from 'react';

import type { DecodedInput } from 'types/api/decodedInput';
import type { ArrayElement } from 'types/utils';

import { Skeleton } from '@luxfi/ui/skeleton';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';

interface Props {
  data: DecodedInput['parameters'];
  isLoading?: boolean;
}

const HeaderItem = ({ children, isLoading }: { children: React.ReactNode; isLoading?: boolean }) => {
  return (
    <Skeleton
      fontWeight={ 600 }
      loading={ isLoading }
      display="inline-block"
      className="w-fit h-fit pb-1"
    >
      { children }
    </Skeleton>
  );
};

const Row = ({ name, type, indexed, value, isLoading }: ArrayElement<DecodedInput['parameters']> & { isLoading?: boolean }) => {
  const content = (() => {
    if (type === 'address' && typeof value === 'string') {
      return (
        <AddressEntity
          address={{ hash: value, name: '' }}
          isLoading={ isLoading }
        />
      );
    }

    if (typeof value === 'object') {
      const text = JSON.stringify(value, undefined, 4);
      return (
        <div className="flex items-start whitespace-normal break-all">
          <TruncatedText text={ text } loading={ isLoading }/>
          <CopyToClipboard text={ text } isLoading={ isLoading }/>
        </div>
      );
    }

    return (
      <div className="flex items-start whitespace-normal break-all">
        <TruncatedText text={ value } loading={ isLoading }/>
        <CopyToClipboard text={ value } isLoading={ isLoading }/>
      </div>
    );
  })();

  return (
    <>
      <TruncatedText text={ name } loading={ isLoading }/>
      <TruncatedText text={ type } loading={ isLoading }/>
      { indexed !== undefined && (
        <Skeleton loading={ isLoading } display="inline-block">{ indexed ? 'true' : 'false' }</Skeleton>
      ) }
      <Skeleton loading={ isLoading } display="inline-block">{ content }</Skeleton>
    </>
  );
};

const LogDecodedInputDataTable = ({ data, isLoading }: Props) => {
  const hasIndexed = data.some(({ indexed }) => indexed !== undefined);

  const gridTemplateColumnsBase = hasIndexed ?
    '50px 60px 40px minmax(0, 1fr)' :
    '50px 60px minmax(0, 1fr)';
  const gridTemplateColumnsLg = hasIndexed ?
    '80px 80px 80px minmax(0, 1fr)' :
    '80px 80px minmax(0, 1fr)';

  return (
    <div className="grid rounded-bl-md rounded-br-md gap-x-5 gap-y-5 p-4 mt-2 w-full text-sm bg-[var(--color-blackAlpha-50)] dark:bg-[var(--color-whiteAlpha-50)]" style={{ gridTemplateColumns: gridTemplateColumnsBase }}
    >
      <HeaderItem isLoading={ isLoading }>Name</HeaderItem>
      <HeaderItem isLoading={ isLoading }>Type</HeaderItem>
      { hasIndexed && <HeaderItem isLoading={ isLoading }>Inde<wbr/>xed?</HeaderItem> }
      <HeaderItem isLoading={ isLoading }>Data</HeaderItem>
      { data.map((item) => {

        return <Row key={ item.name } { ...item } isLoading={ isLoading }/>;
      }) }
    </div>
  );
};

export default LogDecodedInputDataTable;
