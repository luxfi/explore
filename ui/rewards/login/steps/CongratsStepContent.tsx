import React from 'react';

import { route } from 'nextjs-routes';

import { useRewardsContext } from 'lib/contexts/rewards';
import { Button } from '@luxfi/ui/button';
import { Skeleton } from '@luxfi/ui/skeleton';
import IconSvg from 'ui/shared/IconSvg';

import MeritsIcon from '../../MeritsIcon';
import RewardsReadOnlyInputWithCopy from '../../RewardsReadOnlyInputWithCopy';

type Props = {
  isReferral: boolean;
  customReferralReward: string | undefined;
};

const CongratsStepContent = ({ isReferral, customReferralReward }: Props) => {
  const { referralsQuery, rewardsConfigQuery } = useRewardsContext();

  const registrationReward = Number(rewardsConfigQuery.data?.rewards?.registration);
  const registrationWithReferralReward = customReferralReward ?
    Number(customReferralReward) + registrationReward :
    Number(rewardsConfigQuery.data?.rewards?.registration_with_referral);
  const referralReward = registrationWithReferralReward - registrationReward;

  const refLink = referralsQuery.data?.link || 'N/A';
  const shareText = `I joined the @luxnetwork Rewards Program and got my first ${ registrationReward || 'N/A' } #Merits! Use this link for a sign-up bonus and start earning rewards with @luxnetwork block explorer.\n\n${ refLink }`; // eslint-disable-line max-len

  return (
    <>
      <div
        className="flex items-center rounded-md p-2 mb-8 h-[90px]"
        style={{
          paddingLeft: isReferral ? undefined : '2rem',
          background: 'var(--color-light, linear-gradient(254.96deg, #9CD8FF 9.09%, #D0EFFF 88.45%))',
        }}
      >
        <MeritsIcon className={ `w-12 h-12 mr-2 ${ isReferral ? 'w-8 md:w-12 h-8 md:h-12 mr-1 md:mr-2' : '' }` }/>
        <Skeleton loading={ rewardsConfigQuery.isLoading }>
          <span className="text-[30px] font-bold text-blue-700 dark:text-blue-100" style={{ fontSize: isReferral ? undefined : '30px' }}>
            +{ (isReferral ? registrationWithReferralReward : registrationReward) || 'N/A' }
          </span>
        </Skeleton>
        { isReferral && (
          <div className="flex items-center h-[56px]">
            <div className="w-px h-full bg-[var(--color-whiteAlpha-800)] dark:bg-[var(--color-whiteAlpha-100)] mx-3 md:mx-8"/>
            <div className="flex flex-col justify-between gap-2">
              { [
                {
                  title: 'Registration',
                  value: registrationReward || 'N/A',
                },
                {
                  title: 'Referral program',
                  value: referralReward || 'N/A',
                },
              ].map(({ title, value }) => (
                <div key={ title } className="flex items-center gap-1 md:gap-2">
                  <MeritsIcon className="w-5 md:w-6 h-5 md:h-6"/>
                  <Skeleton loading={ rewardsConfigQuery.isLoading }>
                    <span className="text-sm font-bold text-blue-700 dark:text-blue-100">
                      +{ value }
                    </span>
                  </Skeleton>
                  <span className="text-sm text-blue-700 dark:text-blue-100">
                    { title }
                  </span>
                </div>
              )) }
            </div>
          </div>
        ) }
      </div>
      <div className="flex flex-col items-start px-3 mb-8">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-[8px] text-blue-500 dark:text-blue-100 bg-blue-50 dark:bg-blue-800">
            <IconSvg name="profile" className="w-5 h-5"/>
          </div>
          <span className="text-lg font-medium">
            Referral program
          </span>
        </div>
        <p className="text-base mt-2">
          Receive a{ ' ' }
          <Skeleton as="span" loading={ rewardsConfigQuery.isLoading } className="inline">
            { rewardsConfigQuery.data?.rewards?.referral_share ?
              `${ Number(rewardsConfigQuery.data.rewards.referral_share) * 100 }%` :
              'N/A'
            }
          </Skeleton>
          { ' ' }bonus on all Merits earned by your referrals
        </p>
        <RewardsReadOnlyInputWithCopy
          label="Referral link"
          value={ refLink }
          isLoading={ referralsQuery.isLoading }
          className="mt-3 w-full"
        />
        <Skeleton loading={ referralsQuery.isLoading } className="mt-6">
          <Button asChild>
            <a href={ `https://x.com/intent/tweet?text=${ encodeURIComponent(shareText) }` } target="_blank" rel="noopener noreferrer">
              Share on <IconSvg name="social/twitter" className="w-6 h-6 ml-1"/>
            </a>
          </Button>
        </Skeleton>
      </div>
      <div className="flex flex-col items-start px-3">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-8 h-8 rounded-[8px] text-blue-500 dark:text-blue-100 bg-blue-50 dark:bg-blue-800">
            { /* FIXME use non-navigation icon */ }
            <IconSvg name="navigation/stats" className="w-6 h-6"/>
          </div>
          <span className="text-lg font-medium">
            Dashboard
          </span>
        </div>
        <p className="text-base mt-2">
          Explore your current Merits balance, find activities to boost your Merits,
          and view your capybara NFT badge collection on the dashboard
        </p>
        <Button asChild className="mt-3">
          <a href={ route({ pathname: '/account/merits' }) }>Open</a>
        </Button>
      </div>
    </>
  );
};

export default CongratsStepContent;
