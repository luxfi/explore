import React from 'react';

import type { Log } from 'types/api/log';
import type { ClusterChainConfig } from 'types/multichain';

import { route } from 'nextjs-routes';

import { Alert } from '@luxfi/ui/alert';
import { Link } from 'toolkit/next/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import { space } from 'toolkit/utils/htmlEntities';
import DetailedInfoTimestamp from 'ui/shared/DetailedInfo/DetailedInfoTimestamp';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import LogDecodedInputData from 'ui/shared/logs/LogDecodedInputData';
import LogTopic from 'ui/shared/logs/LogTopic';
import type { DataType } from 'ui/shared/RawInputData';
import RawInputData from 'ui/shared/RawInputData';

import LogIndex from './LogIndex';

type Props = Log & {
  type: 'address' | 'transaction';
  isLoading?: boolean;
  defaultDataType?: DataType;
  chainData?: ClusterChainConfig;
};

const RowHeader = ({ children, isLoading }: { children: React.ReactNode; isLoading?: boolean }) => (
  <div>
    <Skeleton fontWeight={ 500 } loading={ isLoading } display="inline-block">{ children }</Skeleton>
  </div>
);

const LogItem = ({
  address,
  index,
  topics,
  data,
  decoded,
  type,
  transaction_hash: txHash,
  block_timestamp: blockTimestamp,
  isLoading,
  defaultDataType,
  chainData,
}: Props) => {

  const hasTxInfo = type === 'address' && txHash;

  return (
    <div
      className="grid py-8"
      style={{
        gridTemplateColumns: 'minmax(0, 1fr)',
        gap: '8px',
      }}
    >
      { !decoded && !address.is_verified && type === 'transaction' && (
        <div className="col-span-full">
          <Alert status="warning" className="inline-table whitespace-normal">
            To see accurate decoded input data, the contract must be verified.{ space }
            <Link href={ route({ pathname: '/address/[hash]/contract-verification', query: { hash: address.hash } }) }>Verify the contract here</Link>
          </Alert>
        </div>
      ) }
      { hasTxInfo ? <RowHeader isLoading={ isLoading }>Transaction</RowHeader> : <RowHeader isLoading={ isLoading }>Address</RowHeader> }
      <div className="flex items-center">
        { type === 'address' && txHash ? (
          <TxEntity
            hash={ txHash }
            isLoading={ isLoading }
            className="mr-9 lg:mr-4 w-full"
            chain={ chainData }
            noCopy
          />
        ) : (
          <AddressEntity
            address={ address }
            isLoading={ isLoading }
            className="mr-9 lg:mr-4"
          />
        ) }
        <LogIndex
          isLoading={ isLoading }
          className="text-sm ml-auto min-w-8 h-8"
        >
          { index }
        </LogIndex>
      </div>
      { hasTxInfo && blockTimestamp ? (
        <>
          <RowHeader isLoading={ isLoading }>Timestamp</RowHeader>
          <div>
            <DetailedInfoTimestamp timestamp={ blockTimestamp } isLoading={ isLoading }/>
          </div>
        </>
      ) : null }
      { decoded && (
        <>
          <RowHeader isLoading={ isLoading }>Decode input data</RowHeader>
          <div>
            <LogDecodedInputData data={ decoded } isLoading={ isLoading }/>
          </div>
        </>
      ) }
      <RowHeader isLoading={ isLoading }>Topics</RowHeader>
      <div>
        { topics.filter(Boolean).map((item, index) => (
          <LogTopic
            key={ index }
            hex={ item }
            index={ index }
            isLoading={ isLoading }
          />
        )) }
      </div>
      <RowHeader isLoading={ isLoading }>Data</RowHeader>
      { defaultDataType ? (
        <RawInputData hex={ data } isLoading={ isLoading } defaultDataType={ defaultDataType } minHeight="53px"/>
      ) : (
        <Skeleton
          loading={ isLoading }
          borderRadius="md"
          className={ `p-4 text-sm ${ isLoading ? '' : 'bg-[var(--color-skeleton-start)]' }` }
        >
          { data }
        </Skeleton>
      ) }
    </div>
  );
};

export default React.memo(LogItem);
