import React from 'react';

import type { AddressParam } from 'types/api/addressParams';

import config from 'configs/app';
import { cn } from 'lib/utils/cn';
import useApiQuery from 'lib/api/useApiQuery';
import { useMultichainContext } from 'lib/contexts/multichain';
import { NOVES_TRANSLATE } from 'stubs/noves/NovesTranslate';
import { TX_INTERPRETATION } from 'stubs/txInterpretation';
import { Link } from 'toolkit/next/link';
import AccountActionsMenu from 'ui/shared/AccountActionsMenu/AccountActionsMenu';
import AppActionButton from 'ui/shared/AppActionButton/AppActionButton';
import useAppActionData from 'ui/shared/AppActionButton/useAppActionData';
import { TX_ACTIONS_BLOCK_ID } from 'ui/shared/DetailedInfo/DetailedInfoActionsWrapper';
import TxEntity from 'ui/shared/entities/tx/TxEntity';
import NetworkExplorers from 'ui/shared/NetworkExplorers';
import TxInterpretation from 'ui/shared/tx/interpretation/TxInterpretation';

import { createNovesSummaryObject } from './assetFlows/utils/createNovesSummaryObject';
import type { TxQuery } from './useTxQuery';

type Props = {
  hash: string;
  hasTag: boolean;
  txQuery: TxQuery;
};

const TxSubHeading = ({ hash, hasTag, txQuery }: Props) => {
  const multichainContext = useMultichainContext();
  const feature = multichainContext?.chain?.app_config.features.txInterpretation || config.features.txInterpretation;

  const hasInterpretationFeature = feature.isEnabled;
  const isNovesInterpretation = hasInterpretationFeature && feature.provider === 'noves';

  const appActionData = useAppActionData(txQuery.data?.to?.hash, !txQuery.isPlaceholderData);

  const txInterpretationQuery = useApiQuery('general:tx_interpretation', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash) && (hasInterpretationFeature && !isNovesInterpretation),
      placeholderData: TX_INTERPRETATION,
    },
  });

  const novesInterpretationQuery = useApiQuery('general:noves_transaction', {
    pathParams: { hash },
    queryOptions: {
      enabled: Boolean(hash) && isNovesInterpretation,
      placeholderData: NOVES_TRANSLATE,
    },
  });

  const hasNovesInterpretation = isNovesInterpretation &&
    (novesInterpretationQuery.isPlaceholderData || Boolean(novesInterpretationQuery.data?.classificationData.description));

  const hasInternalInterpretation = (hasInterpretationFeature && !isNovesInterpretation) &&
  (txInterpretationQuery.isPlaceholderData || Boolean(txInterpretationQuery.data?.data.summaries.length));

  const hasViewAllInterpretationsLink =
    !txInterpretationQuery.isPlaceholderData && txInterpretationQuery.data?.data.summaries && txInterpretationQuery.data?.data.summaries.length > 1;

  const addressDataMap: Record<string, AddressParam> = {};
  [ txQuery.data?.from, txQuery.data?.to ]
    .filter((data): data is AddressParam => Boolean(data && data.hash))
    .forEach(data => {
      addressDataMap[data.hash] = data;
    });

  const content = (() => {
    if (hasNovesInterpretation && novesInterpretationQuery.data) {
      const novesSummary = createNovesSummaryObject(novesInterpretationQuery.data);
      return (
        <TxInterpretation
          summary={ novesSummary }
          isLoading={ novesInterpretationQuery.isPlaceholderData || txQuery.isPlaceholderData }
          addressDataMap={ addressDataMap }
          className="text-lg mr-0 lg:mr-2"
          isNoves
          chainData={ multichainContext?.chain }
        />
      );
    } else if (hasInternalInterpretation) {
      return (
        <div className="flex mr-0 lg:mr-2 flex-wrap items-center">
          <TxInterpretation
            summary={ txInterpretationQuery.data?.data.summaries[0] }
            isLoading={ txInterpretationQuery.isPlaceholderData || txQuery.isPlaceholderData }
            addressDataMap={ addressDataMap }
            className={ cn('text-lg', hasViewAllInterpretationsLink ? 'mr-3' : 'mr-0') }
            chainData={ multichainContext?.chain }
          />
          { hasViewAllInterpretationsLink &&
          <Link href={ `#${ TX_ACTIONS_BLOCK_ID }` }>View all</Link> }
        </div>
      );
    } else if (hasInterpretationFeature && txQuery.data?.method && txQuery.data?.from && txQuery.data?.to && !txQuery.isPlaceholderData) {
      return (
        <TxInterpretation
          summary={{
            summary_template: `{sender_hash} ${ txQuery.data.status === 'error' ? 'failed to call' : 'called' } {method} on {receiver_hash}`,
            summary_template_variables: {
              sender_hash: {
                type: 'address',
                value: txQuery.data.from,
              },
              method: {
                type: 'method',
                value: txQuery.data.method,
              },
              receiver_hash: {
                type: 'address',
                value: txQuery.data.to,
              },
            },
          }}
          className="text-lg mr-0 lg:mr-2"
          chainData={ multichainContext?.chain }
        />
      );
    } else {
      return <TxEntity hash={ hash } noLink variant="subheading" className="mr-0 lg:mr-2" chain={ multichainContext?.chain }/>;
    }
  })();

  const isLoading =
    txQuery.isPlaceholderData ||
    (hasNovesInterpretation && novesInterpretationQuery.isPlaceholderData) ||
    (hasInternalInterpretation && txInterpretationQuery.isPlaceholderData);

  return (
    <div className="block lg:flex lg:items-center w-full">
      { content }
      <div className="flex items-center justify-start lg:justify-between grow gap-3 mt-3 lg:mt-0">
        { !hasTag && <AccountActionsMenu isLoading={ isLoading }/> }
        { appActionData && (
          <AppActionButton data={ appActionData } txHash={ hash } source="Txn"/>
        ) }
        <NetworkExplorers type="tx" pathParam={ hash } className="ml-auto"/>
      </div>
    </div>
  );
};

export default TxSubHeading;
