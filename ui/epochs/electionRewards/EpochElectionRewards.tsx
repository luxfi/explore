import React from 'react';

import type { CeloEpochDetails } from 'types/api/epochs';

import { Heading } from '@luxfi/ui/heading';
import { TableBody, TableColumnHeader, TableHeaderSticky, TableRoot, TableRow } from '@luxfi/ui/table';

import EpochElectionRewardsListItem from './EpochElectionRewardsListItem';
import EpochElectionRewardsTableItem from './EpochElectionRewardsTableItem';

interface Props {
  data: CeloEpochDetails;
  isLoading?: boolean;
}

const EpochElectionRewards = ({ data, isLoading }: Props) => {
  if (!data.aggregated_election_rewards) {
    return null;
  }

  return (
    <div className="mt-6">
      <Heading level="3" className="mb-3">Election rewards</Heading>
      <div className="hidden lg:block">
        <TableRoot style={{ tableLayout: 'auto' }}>
          <TableHeaderSticky>
            <TableRow>
              <TableColumnHeader width="24px"/>
              <TableColumnHeader width="180px">Reward type</TableColumnHeader>
              <TableColumnHeader/>
              <TableColumnHeader isNumeric>Value</TableColumnHeader>
            </TableRow>
          </TableHeaderSticky>
          <TableBody>
            { Object.entries(data.aggregated_election_rewards).map((entry) => {
              const key = entry[0] as keyof CeloEpochDetails['aggregated_election_rewards'];
              const value = entry[1];

              if (!value) {
                return null;
              }

              return (
                <EpochElectionRewardsTableItem
                  key={ key }
                  type={ key }
                  isLoading={ isLoading }
                  data={ value }
                />
              );
            }) }
          </TableBody>
        </TableRoot>
      </div>
      <div className="lg:hidden">
        { Object.entries(data.aggregated_election_rewards).map((entry) => {
          const key = entry[0] as keyof CeloEpochDetails['aggregated_election_rewards'];
          const value = entry[1];

          if (!value) {
            return null;
          }

          return (
            <EpochElectionRewardsListItem
              key={ key }
              type={ key }
              isLoading={ isLoading }
              data={ value }
            />
          );
        }) }
      </div>
    </div>
  );
};

export default React.memo(EpochElectionRewards);
