import { useRewardsContext } from 'lib/contexts/rewards';
import { Skeleton } from 'toolkit/chakra/skeleton';

import RewardsReadOnlyInputWithCopy from '../../RewardsReadOnlyInputWithCopy';
import RewardsDashboardCard from '../RewardsDashboardCard';

export default function ReferralsTab() {
  const { rewardsConfigQuery, referralsQuery } = useRewardsContext();

  return (
    <RewardsDashboardCard
      title="Referral program"
      description={ (
        <>
          Refer friends and boost your Merits! You receive a{ ' ' }
          <Skeleton as="span" loading={ rewardsConfigQuery.isPending } className="inline">
            { rewardsConfigQuery.data?.rewards?.referral_share ?
              `${ Number(rewardsConfigQuery.data.rewards.referral_share) * 100 }%` :
              'N/A'
            }
          </Skeleton>
          { ' ' }bonus on all Merits earned by your referrals.
        </>
      ) }
      contentDirection="row"
    >
      <div className="flex flex-1 gap-2 lg:gap-6 px-4 lg:px-6 py-4 lg:py-0 flex-col lg:flex-row">
        <RewardsReadOnlyInputWithCopy
          label="Referral link"
          value={ referralsQuery.data?.link || 'N/A' }
          isLoading={ referralsQuery.isPending }
          className="flex-[2]"
        />
        <RewardsReadOnlyInputWithCopy
          label="Referral code"
          value={ referralsQuery.data?.code || 'N/A' }
          isLoading={ referralsQuery.isPending }
          className="flex-1"
        />
      </div>
    </RewardsDashboardCard>
  );
}
