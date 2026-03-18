import { useRouter } from 'next/router';
import React from 'react';

import { routeParams } from 'nextjs/routes';

import { useMultichainContext } from 'lib/contexts/multichain';
import { Heading } from 'toolkit/chakra/heading';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import ChainIcon from 'ui/shared/externalChains/ChainIcon';
import IconSvg from 'ui/shared/IconSvg';

const BlockCountdownIndex = () => {
  const router = useRouter();
  const multichainContext = useMultichainContext();

  const handleFormSubmit = React.useCallback((event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.target as HTMLFormElement);
    const searchTerm = formData.get('search_term');
    if (typeof searchTerm === 'string' && searchTerm) {
      const url = routeParams({ pathname: '/block/countdown/[height]', query: { height: searchTerm } }, multichainContext);
      router.push(url, undefined, { shallow: true });
    }
  }, [ router, multichainContext ]);

  return (
    <div className="flex flex-col text-center h-full justify-start lg:justify-center pt-8 lg:pt-0">
      <div className="relative">
        <IconSvg
          name="block_countdown"
          className="text-neutral-300 dark:text-neutral-600 w-[160px] lg:w-[240px] h-[123px] lg:h-[184px]"
        />
        { multichainContext?.chain && (
          <ChainIcon
            data={ multichainContext.chain }
            className="absolute bottom-[15px] lg:bottom-[22px] left-[105px] lg:left-[150px] lg:w-[60px] lg:h-[60px] bg-[var(--color-bg-primary)] rounded-full"
          />
        ) }
      </div>
      <Heading
        level="1"
        className="mt-3 lg:mt-6"
      >
        Block countdown
      </Heading>
      <div className="mt-2">
        The estimated time for a block to be created and added to the blockchain.
      </div>
      <form className="w-full lg:w-[360px] mt-3 lg:mt-6" noValidate onSubmit={ handleFormSubmit }>
        <FilterInput
          placeholder="Search by block number"
          size="sm"
          type="number"
          name="search_term"
        />
      </form>
    </div>
  );
};

export default React.memo(BlockCountdownIndex);
