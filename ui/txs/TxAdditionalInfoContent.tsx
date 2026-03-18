import BigNumber from 'bignumber.js';
import React from 'react';

import type { Transaction } from 'types/api/transaction';

import { route } from 'nextjs/routes';

import config from 'configs/app';
import { useMultichainContext } from 'lib/contexts/multichain';
import { currencyUnits } from 'lib/units';
import { Link } from 'toolkit/chakra/link';
import BlobEntity from 'ui/shared/entities/blob/BlobEntity';
import TxStatus from 'ui/shared/statusTag/TxStatus';
import TextSeparator from 'ui/shared/TextSeparator';
import TxFee from 'ui/shared/tx/TxFee';
import Utilization from 'ui/shared/Utilization/Utilization';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

const TxAdditionalInfoContent = ({ tx }: { tx: Transaction }) => {
  const multichainContext = useMultichainContext();

  const sectionProps = {
    borderBottom: '1px solid',
    borderColor: 'border.divider',
    paddingBottom: 4,
  };

  const sectionTitleProps = {
    color: 'text.secondary',
    fontWeight: 600,
    marginBottom: 3,
  };

  return (
    <>
      <TxStatus status={ tx.status } errorText={ tx.status === 'error' ? tx.result : undefined } className="mb-3"/>
      { tx.blob_versioned_hashes && tx.blob_versioned_hashes.length > 0 && (
        <div { ...sectionProps }>
          <div className="flex">
            <span { ...sectionTitleProps }>Blobs: { tx.blob_versioned_hashes.length }</span>
            { tx.blob_versioned_hashes.length > 3 && (
              <Link
                href={ route({ pathname: '/tx/[hash]', query: { hash: tx.hash, tab: 'blobs' } }) }
                className="mb-3"
              >
                view all
              </Link>
            ) }
          </div>
          <div className="flex flex-col">
            { tx.blob_versioned_hashes.slice(0, 3).map((hash, index) => (
              <div className="flex" key={ hash }>
                <div className="font-medium">{ index + 1 }</div>
                <BlobEntity hash={ hash } noIcon/>
              </div>
            )) }
          </div>
        </div>
      ) }
      <div { ...sectionProps }>
        <span { ...sectionTitleProps }>Value</span>
        <NativeCoinValue
          amount={ tx.value }
          exchangeRate={ tx.exchange_rate }
          historicalExchangeRate={ tx.historic_exchange_rate }
          noTooltip
        />
      </div>
      { !config.UI.views.tx.hiddenFields?.tx_fee && (tx.stability_fee !== undefined || tx.fee.value !== null) && (
        <div { ...sectionProps }>
          <span { ...sectionTitleProps }>Transaction fee</span>
          <TxFee tx={ tx } noTooltip/>
        </div>
      ) }
      { tx.gas_used !== null && (
        <div { ...sectionProps }>
          <span { ...sectionTitleProps }>Gas limit & usage by transaction</span>
          <div className="flex">
            <span>{ BigNumber(tx.gas_used).toFormat() }</span>
            <TextSeparator/>
            <span>{ BigNumber(tx.gas_limit).toFormat() }</span>
            <Utilization value={ Number(BigNumber(tx.gas_used).dividedBy(BigNumber(tx.gas_limit)).toFixed(2)) }/>
          </div>
        </div>
      ) }
      { !config.UI.views.tx.hiddenFields?.gas_fees &&
        (tx.base_fee_per_gas !== null || tx.max_fee_per_gas !== null || tx.max_priority_fee_per_gas !== null) && (
        <div { ...sectionProps }>
          <span { ...sectionTitleProps }>Gas fees ({ currencyUnits.gwei })</span>
          { tx.base_fee_per_gas !== null && (
            <div>
              <span className="font-medium">Base: </span>
              <NativeCoinValue
                amount={ tx.base_fee_per_gas }
                units="gwei"
                unitsTooltip="wei"
                noSymbol
                className="font-bold"
              />
            </div>
          ) }
          { tx.max_fee_per_gas !== null && (
            <div>
              <span className="font-medium">Max: </span>
              <NativeCoinValue
                amount={ tx.max_fee_per_gas }
                units="gwei"
                unitsTooltip="wei"
                noSymbol
                className="font-bold"
              />
            </div>
          ) }
          { tx.max_priority_fee_per_gas !== null && (
            <div>
              <span className="font-medium">Max priority: </span>
              <NativeCoinValue
                amount={ tx.max_priority_fee_per_gas }
                units="gwei"
                unitsTooltip="wei"
                noSymbol
                className="font-bold"
              />
            </div>
          ) }
        </div>
      ) }
      { !(tx.blob_versioned_hashes && tx.blob_versioned_hashes.length > 0) && (
        <div { ...sectionProps }>
          <span { ...sectionTitleProps }>Others</span>
          <div>
            <span className="font-medium">Txn type: </span>
            <span className="font-semibold">{ tx.type }</span>
            { tx.type === 2 && <span>(EIP-1559)</span> }
          </div>
          <div>
            <span className="font-medium">Nonce: </span>
            <span className="font-semibold">{ tx.nonce }</span>
          </div>
          <div>
            <span className="font-medium">Position: </span>
            <span className="font-semibold">{ tx.position }</span>
          </div>
        </div>
      ) }
      <Link href={ route({ pathname: '/tx/[hash]', query: { hash: tx.hash } }, multichainContext) }>More details</Link>
    </>
  );
};

export default React.memo(TxAdditionalInfoContent);
