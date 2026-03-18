/* eslint-disable max-len */
import React from 'react';

import { route } from 'nextjs-routes';

import { Button } from '@luxfi/ui/button';
import { Link } from 'toolkit/chakra/link';
import Puzzle15 from 'ui/games/Puzzle15';
import IconSvg from 'ui/shared/IconSvg';

import AppErrorTitle from '../AppErrorTitle';
const AppErrorTxNotFound = () => {

  const [ isPuzzleOpen, setIsPuzzleOpen ] = React.useState(false);

  const showPuzzle = React.useCallback(() => {
    setIsPuzzleOpen(true);
  }, []);

  return (
    <>
      <div className="p-4 border border-[var(--color-blackAlpha-300)] dark:border-[var(--color-whiteAlpha-300)] rounded-md w-[230px]">
        <div className="flex items-center pb-4 border-b border-[var(--color-blackAlpha-300)] dark:border-[var(--color-whiteAlpha-300)]">
          { /* FIXME use non-navigation icon */ }
          <IconSvg name="navigation/transactions" className="w-8 h-8 p-1 rounded-md text-white dark:text-black bg-[var(--color-blackAlpha-800)] dark:bg-[var(--color-whiteAlpha-800)]"/>
          <div className="ml-2">
            <div className="w-[125px] h-[8px] rounded-full bg-[var(--color-blackAlpha-800)] dark:bg-[var(--color-whiteAlpha-800)]"/>
            <div className="w-[30px] h-[8px] rounded-full bg-[var(--color-blackAlpha-300)] dark:bg-[var(--color-whiteAlpha-300)] mt-1.5"/>
          </div>
        </div>
        <div className="flex justify-between items-center mt-3">
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-[var(--color-blackAlpha-300)] dark:bg-[var(--color-whiteAlpha-300)]"/>
            <div className="w-[65px] h-[8px] rounded-full bg-[var(--color-blackAlpha-300)] dark:bg-[var(--color-whiteAlpha-300)] ml-1.5"/>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 rounded-full bg-[var(--color-blackAlpha-300)] dark:bg-[var(--color-whiteAlpha-300)]"/>
            <div className="w-[65px] h-[8px] rounded-full bg-[var(--color-blackAlpha-300)] dark:bg-[var(--color-whiteAlpha-300)] ml-1.5"/>
          </div>
        </div>
      </div>
      <AppErrorTitle title="Sorry, we are unable to locate this transaction hash"/>
      <ol className="mt-3 flex flex-col gap-3 pl-5 list-decimal">
        <li>
          If you have just submitted this transaction please wait for at least 30 seconds before refreshing this page.
        </li>
        <li>
          It could still be in the TX Pool of a different node, waiting to be broadcasted.
        </li>
        <li>
          During times when the network is busy (i.e during ICOs) it can take a while for your transaction to propagate through the network and for us to index it.
        </li>
        <li>
          <span>If it still does not show up after 1 hour, please check with your </span>
          <span className="font-semibold">sender/exchange/wallet/transaction provider</span>
          <span> for additional information.</span>
        </li>
        <li>
          <span>If you don&apos;t want to look for a txn and just want to have fun, <Link onClick={ showPuzzle }>solve the puzzle</Link>, and be rewarded with a secret prize.</span>
        </li>
      </ol>
      { isPuzzleOpen && <Puzzle15/> }
      <Link href={ route({ pathname: '/' }) }>
        <Button
          className="mt-8"
          variant="outline"
        >
          Back to home
        </Button>
      </Link>
    </>
  );
};

export default AppErrorTxNotFound;
