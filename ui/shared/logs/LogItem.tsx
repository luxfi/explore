import React from 'react';

import type { Log } from 'types/api/log';
import type { ClusterChainConfig } from 'types/multichain';

import { route } from 'nextjs-routes';

// import searchIcon from 'icons/search.svg';
import { Alert } from 'toolkit/chakra/alert';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
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
    <div className="grid py-8"       gridTemplateColumns={{ base: 'minmax(0, 1fr)', lg: '200px minmax(0, 1fr)' }}
      gap={{ base: 2, lg: 8 }}
    >
      { !decoded && !address.is_verified && type === 'transaction' && (
        <div colSpan={{ base: 1, lg: 2 }}>
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
            mr={{ base: 9, lg: 4 }}
            w="100%"
            chain={ chainData }
            noCopy
          />
        ) : (
          <AddressEntity
            address={ address }
            isLoading={ isLoading }
            mr={{ base: 9, lg: 4 }}
          />
        ) }
        { /* api doesn't have find topic feature yet */ }
        { /* <Tooltip label="Find matches topic">
          <Link ml={ 2 } mr={{ base: 9, lg: 0 }} display="inline-flex">
            <Icon as={ searchIcon } boxSize={ 5 }/>
          </Link>
        </Tooltip> */ }
        <LogIndex
          isLoading={ isLoading }
          textStyle="sm"
          ml="auto"
          minW={ 8 }
          height={ 8 }
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
