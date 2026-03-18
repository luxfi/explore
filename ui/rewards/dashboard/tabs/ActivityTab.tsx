import { useCallback, useMemo, useState } from 'react';

import { getFeaturePayload } from 'configs/app/features/types';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import useApiQuery from 'lib/api/useApiQuery';
import { useRewardsContext } from 'lib/contexts/rewards';
import dayjs from 'lib/date/dayjs';
import useIsMobile from 'lib/hooks/useIsMobile';
import { USER_ACTIVITY } from 'stubs/rewards';
import { Button } from 'toolkit/chakra/button';
import { Heading } from 'toolkit/chakra/heading';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Hint } from 'toolkit/components/Hint/Hint';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import { mdash } from 'toolkit/utils/htmlEntities';
import IconSvg from 'ui/shared/IconSvg';
import useProfileQuery from 'ui/snippets/auth/useProfileQuery';

import MeritsIcon from '../../MeritsIcon';
import RewardsActivityPassCard from '../RewardsActivityPassCard';
import RewardsInstancesModal from '../RewardsInstancesModal';
import RewardsTaskDetailsModal from '../RewardsTaskDetailsModal';

const feature = config.features.rewards;
const marketplaceFeature = getFeaturePayload(config.features.marketplace);

function getMaxAmount(rewards: Record<string, string> | undefined) {
  if (!rewards) {
    return 0;
  }

  const values = Object.values(rewards).map(Number);

  if (values.length === 0) {
    return 0;
  }

  return Math.max(...values);
}

export default function ActivityTab() {
  const { isAuth, rewardsConfigQuery } = useRewardsContext();
  const explorersModal = useDisclosure();
  const taskDetailsModal = useDisclosure();
  const isMobile = useIsMobile();
  const [ selectedTaskIndex, setSelectedTaskIndex ] = useState<number>(0);

  const profileQuery = useProfileQuery();
  const checkActivityPassQuery = useApiQuery('rewards:user_check_activity_pass', {
    queryOptions: {
      enabled: feature.isEnabled && isAuth && Boolean(profileQuery.data?.address_hash),
    },
    queryParams: {
      address: profileQuery.data?.address_hash ?? '',
    },
  });
  const activityQuery = useApiQuery('rewards:user_activity', {
    queryOptions: {
      enabled: isAuth && feature.isEnabled,
      placeholderData: USER_ACTIVITY,
    },
  });
  const instancesQuery = useApiQuery('rewards:instances', {
    queryOptions: { enabled: feature.isEnabled },
  });

  const period = useMemo(() => {
    if (!activityQuery.data) {
      return undefined;
    }

    const item = activityQuery.data.items[0];
    const startDate = dayjs(item.date).format('MMM D');
    const endDate = dayjs(item.end_date).format('MMM D, YYYY');

    return `${ startDate } - ${ endDate }`;
  }, [ activityQuery ]);

  const activities = useMemo(() => {
    const calcActivity = (type: string) => {
      const current = activityQuery.data?.items.find((item) => item.activity === type);
      const previous = activityQuery.data?.last_week.find((item) => item.activity === type);

      const currentAmount = Number(current?.amount || 0);
      const previousAmount = Number(previous?.amount || 0);
      const currentPercentile = (current?.percentile || 0) * 100;
      const previousPercentile = (previous?.percentile || 0) * 100;
      const amountDiff = Number((currentAmount - previousAmount).toFixed(2));
      const percentileDiff = Number((currentPercentile - previousPercentile).toFixed(2));

      return {
        amount: currentAmount,
        percentile: `${ currentPercentile }%`,
        amountDiff: `${ amountDiff >= 0 ? '+' : '' }${ amountDiff }`,
        percentileDiff: `${ percentileDiff >= 0 ? '+' : '' }${ percentileDiff }%`,
      };
    };

    return {
      transactions: calcActivity('sent_transactions'),
      contracts: calcActivity('verified_contracts'),
      usage: calcActivity('blockscout_usage'),
    };
  }, [ activityQuery.data ]);

  const tasks = useMemo(() => (
    [
      {
        title: `${ config.chain.name || '' } Explorer activity`,
        description: (
          <>
            Use { config.chain.name || '' } Explorer tools like{ ' ' }
            <Link
              external={ !marketplaceFeature?.essentialDapps }
              href={ marketplaceFeature?.essentialDapps ?
                route({ pathname: '/apps' }) :
                `${ config.app.baseUrl }/apps?utm_source=explorer&utm_medium=transactions-task`
              }
            >
              Essential dapps
            </Link>, or{ ' ' }
            <Link href={ route({ pathname: '/verified-contracts' }) }>
              interact with smart contracts
            </Link>{ ' ' }
            to start earning Merits.
          </>
        ),
        percentile: activities.transactions?.percentile,
        percentileDiff: activities.transactions?.percentileDiff,
        amount: activities.transactions?.amount,
        amountDiff: activities.transactions?.amountDiff,
        maxAmount: getMaxAmount(rewardsConfigQuery.data?.rewards?.sent_transactions_activity_rewards),
      },
      {
        title: 'Contracts verification',
        description: (
          <>
            Log in and{ ' ' }
            <Link href={ route({ pathname: '/contract-verification' }) }>
              verify a smart contract
            </Link>{ ' ' }
            on the { config.chain.name || '' } Explorer to earn Merits.
          </>
        ),
        percentile: activities.contracts?.percentile,
        percentileDiff: activities.contracts?.percentileDiff,
        amount: activities.contracts?.amount,
        amountDiff: activities.contracts?.amountDiff,
        maxAmount: getMaxAmount(rewardsConfigQuery.data?.rewards?.verified_contracts_activity_rewards),
      },
      {
        title: `${ config.chain.name || '' } Explorer usage`,
        description: (
          <>
            Use { config.chain.name || '' } Explorer in your daily routine { mdash } check transactions, explore addresses,
            or add tokens/networks to MetaMask via { config.chain.name || '' } Explorer.
          </>
        ),
        percentile: activities.usage?.percentile,
        percentileDiff: activities.usage?.percentileDiff,
        amount: activities.usage?.amount,
        amountDiff: activities.usage?.amountDiff,
        maxAmount: getMaxAmount(rewardsConfigQuery.data?.rewards?.blockscout_usage_activity_rewards),
      },
    ]
  ), [ rewardsConfigQuery, activities ]);

  const labels = {
    period: { text: `Period: ${ period }`, hint: 'Current Merits period. All metrics reset weekly' },
    performanceRank: { text: 'Performance rank', hint: 'Your rank within a task group compared to other users in the same period. Higher rank = more Merits.' },
    meritsEarned: { text: 'Merits earned', hint: 'Estimated Merits based on your current rank. Final amount may change' },
  };

  const labelComponents = Object.fromEntries(Object.entries(labels).map(([ key, value ], index) => [ key, (
    <div key={ index } className={ `flex flex-1 items-center gap-1 ${ index === 0 ? 'min-w-0 md:min-w-[200px]' : '' }` }>
      <span className="text-sm md:text-xs text-[var(--color-text-primary)] md:text-[var(--color-text-secondary)] font-medium">
        { value.text }
      </span>
      <Hint label={ value.hint }/>
    </div>
  ) ]));

  const openTaskDetails = useCallback((index: number) => () => {
    setSelectedTaskIndex(index);
    taskDetailsModal.onOpen();
  }, [ taskDetailsModal ]);

  const isActivityDataLoading = activityQuery.isPlaceholderData || checkActivityPassQuery.isPending;

  if (checkActivityPassQuery.data && !checkActivityPassQuery.data.is_valid) {
    return <RewardsActivityPassCard/>;
  }

  return (
    <>
      <div className="flex p-1.5 md:p-2 border border-gray-200 dark:border-[var(--color-whiteAlpha-200)] rounded-lg gap-4 md:gap-10 flex-col md:flex-row">
        <div className="contents md:flex md:flex-col md:w-[340px] md:p-3 md:pr-0">
          <div className="flex flex-col p-1.5 md:p-0 pb-0">
            <Heading level="3" className="mb-2">Your activity</Heading>
            <p className="text-sm mb-2 md:mb-4">
              Use { config.chain.name || '' } Explorer and related products daily to earn Merits. Check each task for details and how to get started.
            </p>
            <div className="flex items-center gap-3 mb-0 md:mb-4">
              <Button
                loadingSkeleton={ instancesQuery.isLoading }
                onClick={ explorersModal.onOpen }
              >
                Earn
              </Button>
              <Link
                external
                href="https://docs.blockscout.com/using-blockscout/merits/activity-pass"
                className="text-base font-medium text-center"
              >
                Learn more
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-2.5 mt-auto order-3 md:order-none px-1.5 md:px-0">
            <IconSvg name="status/warning" className="w-6 h-6 text-[var(--color-icon-primary)]"/>
            <p className="text-sm">
              <span className="font-semibold">Your current Merit count is not final!</span><br/>
              Merits are calculated based on the activity of all users and may increase or decrease by the end of the weekly period.
            </p>
          </div>
        </div>
        <div className="flex md:hidden justify-between px-3">
          <div className="flex items-center gap-1">
            <span className="text-sm font-medium">
              Period
            </span>
            <Hint label={ labels.period.hint }/>
          </div>
          <span className="text-sm font-medium text-[var(--color-text-secondary)]">
            { period }
          </span>
        </div>
        <div className="contents md:flex md:flex-1 md:flex-col md:gap-1">
          <div className="hidden md:flex p-3 gap-8">
            { Object.values(labelComponents) }
          </div>
          <div className="flex flex-col gap-1.5 md:gap-1">
            { tasks.map((item, index) => (
              <div
                key={ index }
                className="flex flex-col md:flex-row px-3 py-4 gap-6 md:gap-8 rounded-lg md:rounded-[8px] bg-gray-50 dark:bg-[var(--color-whiteAlpha-50)]"
              >
                <div className="flex flex-1 flex-row md:flex-col gap-2 items-center md:items-start justify-between md:justify-start min-w-0 md:min-w-[200px]">
                  <span className="text-sm font-bold md:font-medium">
                    { item.title }
                  </span>
                  <Link
                    className="text-sm md:text-xs font-normal md:font-medium"
                    onClick={ openTaskDetails(index) }
                  >
                    Task details
                  </Link>
                </div>
                <div className="flex md:contents gap-8">
                  <div className="flex flex-1 flex-col gap-2 items-start">
                    <div className="flex md:hidden">
                      { labelComponents.performanceRank }
                    </div>
                    <Skeleton loading={ isActivityDataLoading }>
                      <Heading level="3">
                        { item.percentile }
                      </Heading>
                    </Skeleton>
                    <Skeleton loading={ isActivityDataLoading }>
                      <span className="text-sm md:text-xs text-[var(--color-text-secondary)] font-medium">
                        { item.percentileDiff } vs { isMobile ? 'prev.' : 'previous' } week
                      </span>
                    </Skeleton>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 items-start">
                    <div className="flex md:hidden">
                      { labelComponents.meritsEarned }
                    </div>
                    <Skeleton
                      loading={ isActivityDataLoading }
                      display="flex"
                      alignItems="center"
                    >
                      <MeritsIcon className="w-6 h-6 mr-2"/>
                      <Heading level="3" className="mr-0 md:mr-2">
                        { item.amount }
                      </Heading>
                      <span className="hidden md:inline text-sm text-gray-400 font-medium self-end">
                        /{ item.maxAmount }
                      </span>
                      <Heading level="3" className="inline md:hidden text-[var(--color-text-secondary)]">
                        /{ item.maxAmount }
                      </Heading>
                    </Skeleton>
                    <Skeleton loading={ isActivityDataLoading }>
                      <span className="text-sm md:text-xs text-[var(--color-text-secondary)] font-medium">
                        { item.amountDiff } vs { isMobile ? 'prev.' : 'previous' } week
                      </span>
                    </Skeleton>
                  </div>
                </div>
              </div>
            )) }
          </div>
          <div className="p-1.5 md:p-3 order-4 md:order-none">
            <span className="text-xs text-[var(--color-text-secondary)] font-medium">
              Metrics are not updated in real time. Please allow up to one hour for your Performance Rank and earned Merits to reflect recent activity.
              If you experience any issues, feel free to reach out on{ ' ' }
              <Link external href="https://discord.gg/luxnetwork">
                Discord
              </Link>
            </span>
          </div>
        </div>
      </div>
      <RewardsInstancesModal
        isOpen={ explorersModal.open }
        onClose={ explorersModal.onClose }
        items={ instancesQuery.data?.items }
      />
      <RewardsTaskDetailsModal
        isOpen={ taskDetailsModal.open }
        onClose={ taskDetailsModal.onClose }
        title={ tasks[selectedTaskIndex].title }
      >
        { tasks[selectedTaskIndex].description }
      </RewardsTaskDetailsModal>
    </>
  );
}
