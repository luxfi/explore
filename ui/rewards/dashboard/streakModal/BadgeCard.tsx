import type { GetAvailableBadgesResponse } from '@luxfi/points-types';

import { Image } from '@luxfi/ui/image';
import { Link } from 'toolkit/chakra/link';
import { Progress } from '@luxfi/ui/progress';

const BADGE_BG_COLORS = [ '#DFE8F5', '#D2E5FE', '#EFE1FF' ];

const BADGES = [
  '/static/merits/streak_30.png',
  '/static/merits/streak_90.png',
  '/static/merits/streak_180.png',
] as const;

const GHOST_BADGES = [
  '/static/merits/streak_30_ghost.png',
  '/static/merits/streak_90_ghost.png',
  '/static/merits/streak_180_ghost.png',
] as const;

type Props = {
  badge: GetAvailableBadgesResponse['items'][number];
  currentStreak: number;
  index: number;
};

export default function BadgeCard({ badge, currentStreak, index }: Props) {
  const target = Number(badge.requirements?.streak || 0);
  const isUnlocked = badge.is_whitelisted || badge.is_minted;
  const progress = Math.min(currentStreak, target);

  return (
    <div className="flex flex-row lg:flex-col items-center gap-3 flex-1">
      <div
        className="flex p-2.5 lg:p-4 rounded-lg items-center justify-center w-[92px] lg:w-full shrink-0"
        style={{ backgroundColor: isUnlocked ? BADGE_BG_COLORS[index] : undefined }}
      >
        <Image
          src={ isUnlocked ? BADGES[index] : GHOST_BADGES[index] }
          alt="Streak badge"
          h={{ base: '54px', lg: '82px' }}
        />
      </div>
      <div className="flex flex-col gap-3 w-full items-start lg:items-center">
        <span className="text-sm">{ target } Day streak</span>
        <div className="flex w-full items-center justify-start lg:justify-center gap-2 px-0 lg:px-2 h-[32px]">
          { (() => {
            if (badge.is_minted) {
              return (
                <span className="text-xs text-green-500">
                  Minted
                </span>
              );
            }
            if (badge.is_whitelisted) {
              return (
                <Link
                  href={ `https://badges.blockscout.com/mint/${ badge.address }` }
                  external
                  className="text-sm"
                >
                  Mint a badge
                </Link>
              );
            }
            return (
              <>
                <span className="text-xs text-[var(--color-text-secondary)] min-w-[50px]">
                  { progress }/{ target }
                </span>
                <Progress
                  value={ progress }
                  min={ 0 }
                  max={ target }
                  flex={ 1 }
                  color="green.400"
                />
              </>
            );
          })() }
        </div>
      </div>
    </div>
  );
}
