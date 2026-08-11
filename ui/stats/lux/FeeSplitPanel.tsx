// Fee burn and staking rewards, both read from ONE balance.
//
// creditTxFee credits floor(fee/2) to the fee reward vault and destroys the
// rest, so the vault's balance is simultaneously the rewards counter and the
// burn counter — they differ by at most one wei per transaction. That is why
// this panel needs no indexer, no event log and no receipts: one
// eth_getBalance is the whole data set.
//
// It renders only while the split is running. Before that every figure here is
// a zero, and a panel of zeros explaining why it is empty costs a reader the
// top of the page and tells them nothing they came for.

import { Heading } from '@luxfi/ui/heading';
import React from 'react';

import { useFeeSplit, burnedWei, toCoinSeries, FEE_REWARD_VAULT } from 'lib/api/cchain';
import { currencyUnits } from 'lib/units';
import { ChartWidget } from 'toolkit/components/charts/ChartWidget';
import { useChartsConfig } from 'ui/shared/chart/config';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import StatsWidget from 'ui/shared/stats/StatsWidget';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

const ACCURACY = 4;

const FeeSplitPanel = () => {
  const { reading, series, isLoading, isError } = useFeeSplit();
  const chartsConfig = useChartsConfig();

  const charts = React.useMemo(() => [ {
    id: 'fee-vault',
    name: 'Fee reward vault',
    items: toCoinSeries(series ?? []),
    charts: chartsConfig,
    units: currencyUnits.ether,
  } ], [ series, chartsConfig ]);

  if (isError || reading?.status !== 'active') {
    return null;
  }

  return (
    <section className="mt-6 sm:mt-8">
      <Heading level="3" className="text-sm mb-2">Fee burn &amp; staking rewards</Heading>

      { /*
        sm/lg, never md: this repo redefines sm=415px and lg=1000px in
        nextjs/global.css, and the generated `md` rules land AFTER `lg`, so
        `md:grid-cols-2 lg:grid-cols-3` measured 682px 682px at 1440px — two
        columns, with the third card orphaned on its own row.
      */ }
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <StatsWidget
          label={ `${ currencyUnits.ether } burned` }
          icon="flame"
          value={ <NativeCoinValue amount={ burnedWei(reading) } accuracy={ ACCURACY } loading={ isLoading }/> }
          isLoading={ isLoading }
          hint={
            `Supply destroyed by the fee split: the half of every fee that is credited to no account at all, ` +
            `so it leaves the total supply. Equal to the vault balance to within one wei per transaction, and ` +
            `never rounded up.`
          }
        />
        <StatsWidget
          label="Staking rewards accrued"
          icon="lightning"
          value={ <NativeCoinValue amount={ reading.vaultWei } accuracy={ ACCURACY } loading={ isLoading }/> }
          isLoading={ isLoading }
          hint={
            `The other half of every fee, parked in the protocol-owned fee reward vault for the P-Chain ` +
            `staking-reward pool. Still in circulation — moved, never minted.`
          }
        />
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-3 text-2xs text-[var(--color-text-secondary)]">
        <span>Fee reward vault</span>
        <AddressEntity address={{ hash: FEE_REWARD_VAULT }} noIcon noCopy truncation="constant" className="text-2xs"/>
        <span>·</span>
        <span>read at block #{ reading.blockNumber.toLocaleString() }</span>
      </div>

      <ChartWidget
        className="h-[240px] mt-4"
        title="Fee reward vault"
        description="Vault balance, sampled once per block while this page is open. Nodes prune state, so no history can be backfilled."
        charts={ charts }
        isLoading={ isLoading }
        isError={ false }
        emptyText="Not enough samples yet — the vault is read once per new block while this page is open."
      />
    </section>
  );
};

export default React.memo(FeeSplitPanel);
