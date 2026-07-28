// Fee burn and staking rewards, both read from ONE balance.
//
// While the fee split is active, creditTxFee credits floor(fee/2) to the fee
// reward vault and destroys the rest, so the vault's balance is simultaneously
// the rewards counter and the burn counter — they differ by at most one wei per
// transaction. That is why this panel needs no indexer, no event log and no
// receipts: one eth_getBalance is the whole data set.
//
// It must also be honest when nothing is happening. On a chain where the split
// has never fired the counters read zero, and a zero rendered without that
// context reads as "burning, just slowly". Every state below says plainly which
// one it is, and while the split is off the panel shows where the fees actually
// go instead.

import { Heading } from '@luxfi/ui/heading';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tag } from '@luxfi/ui/tag';
import React from 'react';

import config from 'configs/app';
import type { FeeSplitStatus } from 'lib/api/cchain';
import { useFeeSplit, burnedWei, toCoinSeries, FEE_REWARD_VAULT, FEE_COINBASE } from 'lib/api/cchain';
import dayjs from 'lib/date/dayjs';
import { currencyUnits } from 'lib/units';
import { cn } from 'lib/utils/cn';
import { ChartWidget } from 'toolkit/components/charts/ChartWidget';
import { useChartsConfig } from 'ui/shared/chart/config';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import StatsWidget from 'ui/shared/stats/StatsWidget';
import NativeCoinValue from 'ui/shared/value/NativeCoinValue';

const ACCURACY = 4;

const STATUS_LABEL: Record<FeeSplitStatus, string> = {
  active: 'Active',
  scheduled: 'Scheduled',
  inactive: 'Not active',
  unknown: 'Unverified',
};

const STATUS_DOT: Record<FeeSplitStatus, string> = {
  active: 'bg-[var(--color-green-500)]',
  scheduled: 'bg-[var(--color-status-warn)]',
  inactive: 'bg-[var(--color-gray-400)]',
  unknown: 'bg-[var(--color-gray-400)]',
};

function statusText(status: FeeSplitStatus, activatesAt: number | null): string {
  const coin = currencyUnits.ether;

  switch (status) {
    case 'active':
      return `Every transaction fee is split in half. One half accrues to the fee reward vault for the ` +
        `P-Chain staking-reward pool; the other half is destroyed and leaves the supply. Both figures ` +
        `below are read from that one balance.`;
    case 'scheduled':
      return `The split is scheduled for ${ dayjs((activatesAt ?? 0) * 1000).utc().format('llll') }. ` +
        `Until this chain builds a block at or after that time, the whole fee still goes to the block ` +
        `coinbase and no ${ coin } is burned.`;
    case 'inactive':
      return `The fee split is not active on ${ config.chain.name || 'this chain' }. Every transaction fee ` +
        `is credited to the block coinbase in full: nothing is burned, and the supply is not deflationary.`;
    case 'unknown':
      return `This node does not report a chain config, so whether the split is active cannot be verified ` +
        `here. The vault balance is shown exactly as read.`;
  }
}

const FeeSplitPanel = () => {
  const { reading, series, isLoading, isError } = useFeeSplit();
  const chartsConfig = useChartsConfig();

  // Undefined until the first read lands: 'unknown' is a verified answer
  // ("this node will not tell us"), not a stand-in for "still loading".
  const status = reading?.status;
  const isActive = status === 'active';
  // Legacy routing is in force and provably lands in one account: the coinbase
  // is only a single address when block builders may not claim fees.
  const showsCoinbase = (status === 'inactive' || status === 'scheduled') && !reading?.allowFeeRecipients;

  const charts = React.useMemo(() => [ {
    id: 'fee-vault',
    name: 'Fee reward vault',
    items: toCoinSeries(series ?? []),
    charts: chartsConfig,
    units: currencyUnits.ether,
  } ], [ series, chartsConfig ]);

  // Zero before activation, the vault balance after it, and a dash when the
  // activation state could not be read at all — never the raw balance on a
  // chain that has burned nothing. See burnedWei().
  const burned = burnedWei(reading);

  if (isError) {
    return null;
  }

  return (
    <section className="mt-6 sm:mt-8">
      <div className="flex items-center gap-2 mb-2">
        <Heading level="3" className="text-sm">Fee burn &amp; staking rewards</Heading>
        { status && (
          <Tag
            size="sm"
            variant="subtle"
            startElement={ <span className={ cn('inline-block size-1.5 rounded-full', STATUS_DOT[status]) }/> }
          >
            { STATUS_LABEL[status] }
          </Tag>
        ) }
      </div>

      <Skeleton loading={ isLoading } className="mb-3">
        <p className="text-xs text-[var(--color-text-secondary)] max-w-[80ch]">
          { status ? statusText(status, reading?.activatesAt ?? null) : 'Reading the fee reward vault.' }
        </p>
      </Skeleton>

      { /*
        sm/lg, never md: this repo redefines sm=415px and lg=1000px in
        nextjs/global.css, and the generated `md` rules land AFTER `lg`, so
        `md:grid-cols-2 lg:grid-cols-3` measured 682px 682px at 1440px — two
        columns, with the third card orphaned on its own row.
      */ }
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        <StatsWidget
          label={ `${ currencyUnits.ether } burned` }
          icon="flame"
          value={ burned === undefined && status ?
            '\u2014' :
            <NativeCoinValue amount={ burned } accuracy={ ACCURACY } loading={ isLoading }/> }
          isLoading={ isLoading }
          isFallback={ !isActive }
          hint={
            `Supply destroyed by the fee split: the half of every fee that is credited to no account at all, ` +
            `so it leaves the total supply. Equal to the vault balance to within one wei per transaction, and ` +
            `never rounded up. Exactly zero until the split activates — no fee has been destroyed before then.`
          }
        />
        <StatsWidget
          label="Staking rewards accrued"
          icon="lightning"
          value={ <NativeCoinValue amount={ reading?.vaultWei } accuracy={ ACCURACY } loading={ isLoading }/> }
          isLoading={ isLoading }
          isFallback={ !isActive }
          hint={
            `The other half of every fee, parked in the protocol-owned fee reward vault for the P-Chain ` +
            `staking-reward pool. Still in circulation — moved, never minted.`
          }
        />
        { showsCoinbase && (
          <StatsWidget
            label="Held by the fee coinbase"
            icon="gas"
            value={ <NativeCoinValue amount={ reading?.coinbaseWei } accuracy={ ACCURACY } loading={ isLoading }/> }
            isLoading={ isLoading }
            hint={
              `Where fees go while the split is off. This coinbase has no code and no private key, so the ` +
              `${ currencyUnits.ether } credited to it is stranded, not burned — the supply is unchanged by it.`
            }
          />
        ) }
      </div>

      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-3 text-2xs text-[var(--color-text-secondary)]">
        <span>Fee reward vault</span>
        <AddressEntity address={{ hash: FEE_REWARD_VAULT }} noIcon noCopy truncation="constant" className="text-2xs"/>
        { showsCoinbase && (
          <>
            <span>{ '\u00B7' }</span>
            <span>coinbase</span>
            <AddressEntity address={{ hash: FEE_COINBASE }} noIcon noCopy truncation="constant" className="text-2xs"/>
          </>
        ) }
        { reading && (
          <>
            <span>{ '\u00B7' }</span>
            <span>read at block #{ reading.blockNumber.toLocaleString() }</span>
          </>
        ) }
      </div>

      { isActive ? (
        <ChartWidget
          className="h-[240px] mt-4"
          title="Fee reward vault"
          description="Vault balance, sampled once per block while this page is open. Nodes prune state, so no history can be backfilled."
          charts={ charts }
          isLoading={ isLoading }
          isError={ false }
          emptyText="Not enough samples yet — the vault is read once per new block while this page is open."
        />
      ) : status && (
        <p className="mt-3 text-2xs text-[var(--color-text-secondary)]">
          The vault chart appears once the split is active — until then there is nothing to plot but a flat zero.
        </p>
      ) }
    </section>
  );
};

export default React.memo(FeeSplitPanel);
