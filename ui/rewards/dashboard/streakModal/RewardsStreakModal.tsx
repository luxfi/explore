import React from 'react';

import type { GetAvailableBadgesResponse } from '@luxfi/points-types';

import { Separator } from '@luxfi/ui/separator';
import { DialogBody, DialogContent, DialogHeader, DialogRoot } from '@luxfi/ui/dialog';
import { Heading } from '@luxfi/ui/heading';

import BadgeCard from './BadgeCard';
import ProgressSegment from './ProgressSegment';

type Props = {
  open: boolean;
  onOpenChange: ({ open }: { open: boolean }) => void;
  currentStreak: number;
  badges?: GetAvailableBadgesResponse['items'];
};

const EMPTY_ARRAY: GetAvailableBadgesResponse['items'] = [];

const RewardsStreakModal = ({ open, onOpenChange, currentStreak, badges = EMPTY_ARRAY }: Props) => {

  return (
    <DialogRoot open={ open } onOpenChange={ onOpenChange } size={{ lgDown: 'full', lg: 'md' }}>
      <DialogContent>
        <DialogHeader>Streak progress</DialogHeader>
        <DialogBody>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-6 lg:gap-3">
              <p className="text-sm lg:text-base">
                Build your streak day by day and unlock exclusive badges as a reward for staying consistent.
              </p>
              <div className="flex flex-col lg:flex-row gap-3 lg:gap-10 bg-gray-50 dark:bg-[var(--color-whiteAlpha-100)] p-4 lg:p-8 lg:pl-5 rounded-lg justify-between">
                <div className="flex flex-col items-center gap-1 lg:gap-2">
                  <Heading level="1">{ currentStreak }</Heading>
                  <span className="text-xs text-[var(--color-text-secondary)]">Day streak</span>
                </div>
                <div className="flex flex-1 pl-2 lg:pl-0">
                  { badges.map((badge, i) => {
                    const target = Number(badge.requirements?.streak || 0);
                    const prevTarget = i > 0 ? Number(badges[i - 1]?.requirements?.streak || 0) : 0;
                    const value = (badge.is_whitelisted || badge.is_minted) ? target : currentStreak;
                    return (
                      <ProgressSegment
                        key={ i }
                        value={ value }
                        target={ target }
                        prevTarget={ prevTarget }
                        isFirst={ i === 0 }
                      />
                    );
                  }) }
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Heading level="3">Rewards</Heading>
              <div className="flex flex-col lg:flex-row gap-2 lg:gap-6 justify-between">
                { badges.map((badge, i) => (
                  <React.Fragment key={ i }>
                    <BadgeCard
                      badge={ badge }
                      currentStreak={ currentStreak }
                      index={ i }
                    />
                    { i < badges.length - 1 && (
                      <Separator
                        className="hidden lg:block"
                        orientation="vertical"
                      />
                    ) }
                  </React.Fragment>
                )) }
              </div>
            </div>
          </div>
        </DialogBody>
      </DialogContent>
    </DialogRoot>
  );
};

export default RewardsStreakModal;
