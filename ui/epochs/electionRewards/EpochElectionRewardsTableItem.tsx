import React from 'react';

import type { CeloEpochDetails, CeloEpochElectionReward } from 'types/api/epochs';

import { IconButton } from '@luxfi/ui/icon-button';
import { Skeleton } from '@luxfi/ui/skeleton';
import { TableCell, TableRow } from '@luxfi/ui/table';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import EpochRewardTypeTag from 'ui/shared/EpochRewardTypeTag';
import IconSvg from 'ui/shared/IconSvg';
import TokenValue from 'ui/shared/value/TokenValue';

import EpochElectionRewardDetailsDesktop from './EpochElectionRewardDetailsDesktop';
import { getRewardNumText } from './utils';

interface Props {
  data: CeloEpochElectionReward;
  type: keyof CeloEpochDetails['aggregated_election_rewards'];
  isLoading?: boolean;
}

const EpochElectionRewardsTableItem = ({ isLoading, data, type }: Props) => {
  const section = useDisclosure();

  const mainRowBorderColor = section.open ? 'transparent' : 'border.divider';

  return (
    <>
      <TableRow
        onClick={ isLoading || !data.count ? undefined : section.onToggle }
        className={ isLoading || !data.count ? undefined : 'cursor-pointer' }
      >
        <TableCell className={ section.open ? 'border-transparent' : undefined }>
          { Boolean(data.count) && (
            <Skeleton loading={ isLoading } display="flex" borderRadius="sm">
              <IconButton
                aria-label={ section.open ? 'Collapse section' : 'Expand section' }
                variant="link"
              >
                <IconSvg
                  name="arrows/east-mini"
                  className={ `w-6 h-6 transition-transform duration-100 ${ section.open ? 'rotate-[270deg]' : 'rotate-180' }` }
                />
              </IconButton>
            </Skeleton>
          ) }
        </TableCell>
        <TableCell className={ section.open ? 'border-transparent' : undefined }>
          <EpochRewardTypeTag type={ type } isLoading={ isLoading }/>
        </TableCell>
        <TableCell className={ section.open ? 'border-transparent' : undefined }>
          <Skeleton loading={ isLoading } fontWeight={ 400 } className="my-1">
            { getRewardNumText(type, data.count) }
          </Skeleton>
        </TableCell>
        <TableCell className={ section.open ? 'border-transparent' : undefined } textAlign="right">
          <TokenValue
            amount={ data.total }
            token={ data.token }
            accuracy={ 0 }
            loading={ isLoading }
            my="2px"
          />
        </TableCell>
      </TableRow>
      { section.open && (
        <TableRow>
          <TableCell/>
          <TableCell colSpan={ 3 } pr={ 0 } pt={ 0 }>
            <EpochElectionRewardDetailsDesktop type={ type } token={ data.token }/>
          </TableCell>
        </TableRow>
      ) }
    </>
  );
};

export default React.memo(EpochElectionRewardsTableItem);
