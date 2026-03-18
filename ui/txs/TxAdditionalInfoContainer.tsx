import React from 'react';

import useApiQuery from 'lib/api/useApiQuery';
import { Skeleton } from 'toolkit/chakra/skeleton';
import DataFetchAlert from 'ui/shared/DataFetchAlert';

import TxAdditionalInfoContent from './TxAdditionalInfoContent';

interface Props {
  hash: string;
}

const TxAdditionalInfoContainer = ({ hash }: Props) => {
  const { data, isError, isPending } = useApiQuery('general:tx', {
    pathParams: { hash },
    queryOptions: {
      refetchOnMount: false,
    },
  });

  if (isPending) {
    return (
      <div>
        <Skeleton loading/>
        <div>
          <Skeleton loading/>
          <Skeleton loading className="w-full"/>
        </div>
        <hr/>
        <div>
          <Skeleton loading/>
          <Skeleton loading className="w-full"/>
        </div>
        <hr/>
        <div>
          <Skeleton loading/>
          <Skeleton loading className="w-full"/>
        </div>
        <hr/>
        <div>
          <Skeleton loading/>
          <Skeleton loading/>
          <Skeleton loading/>
          <Skeleton loading/>
        </div>
        <hr/>
        <Skeleton loading/>
      </div>
    );
  }

  if (isError) {
    return <DataFetchAlert/>;
  }

  return <TxAdditionalInfoContent tx={ data }/>;
};

export default React.memo(TxAdditionalInfoContainer);
