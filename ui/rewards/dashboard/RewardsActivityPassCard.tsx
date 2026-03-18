import config from 'configs/app';
import { useRewardsContext } from 'lib/contexts/rewards';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Heading } from 'toolkit/chakra/heading';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';

export default function RewardsActivityPassCard() {
  const { rewardsConfigQuery } = useRewardsContext();
  const backgroundImage = useColorModeValue('/static/merits/cells.svg', '/static/merits/cells_dark.svg');

  const activityPassUrl = config.apis.rewards ?

    `${ config.apis.rewards.endpoint }/?tab=spend&id=${ rewardsConfigQuery.data?.rewards?.blockscout_activity_pass_id }&utm_source=lux&utm_medium=tasks` :
    undefined;

  return (
    <div className="flex p-1.5 md:p-2 border border-gray-200 dark:border-[var(--color-whiteAlpha-200)] rounded-lg gap-1 md:gap-10 flex-col md:flex-row">
      <div className="flex flex-1 flex-col p-3 gap-2">
        <Heading level="3">
          Activity pass
        </Heading>
        <p className="text-sm">
          Grab your{ ' ' }
          <Link external href={ activityPassUrl } loading={ rewardsConfigQuery.isLoading }>
            Activity pass
          </Link>{ ' ' }
          then engage with various { config.chain.name || '' } Explorer products and features to earn Merits every day!{ ' ' }
          <Link external href="https://docs.blockscout.com/using-blockscout/merits/activity-pass">
            Learn more
          </Link>
        </p>
      </div>
      <div
        className="flex flex-col md:flex-row justify-between items-center h-[160px] md:h-[120px] pr-0 md:pr-8 pl-0 md:pl-[86px] pt-4 md:pt-0 pb-3 md:pb-0 rounded-base overflow-hidden relative"
        style={{ flex: 'none', backgroundColor: 'var(--color-light, #FFEFCE)' }}
      >
        <Image
          src={ backgroundImage }
          alt="Background"
          width="268px"
          height="184px"
          position="absolute"
          top="-20px"
          left={{ base: 'calc(50% - 134px)', md: '-8px' }}
        />
        <Image
          src="/static/merits/activity_pass.svg"
          alt="Activity pass"
          width="79px"
          height="86px"
          zIndex={ 1 }
        />
        <Link
          external
          href={ activityPassUrl }
          variant="underlaid"
          iconColor="rgba(43, 26, 63, 0.3)"
          className="font-medium shrink-0 z-[1]"
          style={{ backgroundColor: 'var(--color-bg-light, #FFD57C)', color: '#2B1A3F' }}
        >
          Grab Activity pass
        </Link>
      </div>
    </div>
  );
}
