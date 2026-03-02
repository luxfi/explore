import React, { useCallback } from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { useRewardsContext } from 'lib/contexts/rewards';
import useIsMobile from 'lib/hooks/useIsMobile';
import type { ButtonProps } from '@luxfi/ui/button';
import { Button } from '@luxfi/ui/button';
import { Tooltip } from '@luxfi/ui/tooltip';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  size?: ButtonProps['size'];
  variant?: ButtonProps['variant'];
};

const RewardsButton = ({ variant = 'header', size }: Props) => {
  const { isInitialized, isAuth, openLoginModal, dailyRewardQuery, balancesQuery } = useRewardsContext();
  const isMobile = useIsMobile();
  const isLoading = !isInitialized || dailyRewardQuery.isLoading || balancesQuery.isLoading;

  const handleFocus = useCallback((e: React.FocusEvent<HTMLButtonElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Tooltip
      content={ `Earn Merits for using ${ config.chain.name || '' } Explorer`.trim() }
      openDelay={ 500 }
      disabled={ isMobile || isLoading || isAuth }
    >
      <Button
        variant={ variant }
        selected={ !isLoading && isAuth }
        className="shrink-0 px-[10px] lg:px-3 hover:no-underline"
        { ...(isAuth ? { href: route({ pathname: '/account/merits' }) } : {}) }
        onClick={ isAuth ? undefined : openLoginModal }
        onFocus={ handleFocus }
        size={ size }
        loading={ isLoading }
      >
        <IconSvg
          name={ dailyRewardQuery.data?.available ? 'merits_with_dot' : 'merits' }
          className={ `shrink-0 ${ variant === 'hero' ? 'w-6 h-6' : 'w-5 h-5' }` }
        />
        <span
          className={ `hidden md:inline ${ isAuth ? 'font-bold' : 'font-semibold' }` }
        >
          { isAuth ? (balancesQuery.data?.total || 'N/A') : 'Merits' }
        </span>
      </Button>
    </Tooltip>
  );
};

export default RewardsButton;
