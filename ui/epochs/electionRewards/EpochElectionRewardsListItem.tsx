import React from 'react';

import type { CeloEpochElectionReward, CeloEpochDetails } from 'types/api/epochs';

import { IconButton } from 'toolkit/chakra/icon-button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import EpochRewardTypeTag from 'ui/shared/EpochRewardTypeTag';
import IconSvg from 'ui/shared/IconSvg';
import TokenValue from 'ui/shared/value/TokenValue';

import EpochElectionRewardDetailsMobile from './EpochElectionRewardDetailsMobile';
import { getRewardNumText } from './utils';

interface Props {
  data: CeloEpochElectionReward;
  type: keyof CeloEpochDetails['aggregated_election_rewards'];
  isLoading?: boolean;
}

const EpochElectionRewardsListItem = ({ data, isLoading, type }: Props) => {
  const section = useDisclosure();

  return (
    <div
      className="py-3 border-b border-[var(--color-border-divider)] text-sm"
      onClick={ isLoading || !data.count ? undefined : section.onToggle }
      style={{ cursor: isLoading || !data.count ? undefined : 'pointer' }}
    >
      <div className="flex my-[3px] gap-x-3 items-center flex-wrap gap-y-2">
        { data.count ? (
          <Skeleton loading={ isLoading } display="flex" borderRadius="sm">
            <IconButton
              aria-label={ section.open ? 'Collapse section' : 'Expand section' }
              variant="link"
              className="size-6"
            >
              <IconSvg
                name="arrows/east-mini"
                className={ `w-6 h-6 transition-transform duration-100 ${ section.open ? 'rotate-[270deg]' : 'rotate-180' }` }
              />
            </IconButton>
          </Skeleton>
        ) : <div className="w-6 h-6"/> }
        <EpochRewardTypeTag type={ type } isLoading={ isLoading }/>
        <Skeleton loading={ isLoading } ml="auto">{ getRewardNumText(type, data.count) }</Skeleton>
        <TokenValue
          amount={ data.total }
          token={ data.token }
          accuracy={ 0 }
          loading={ isLoading }
          className="font-medium"
        />
      </div>
      { section.open && (
        <div className="mt-2">
          <EpochElectionRewardDetailsMobile type={ type } token={ data.token }/>
        </div>
      ) }
    </div>
  );
};

export default React.memo(EpochElectionRewardsListItem);
