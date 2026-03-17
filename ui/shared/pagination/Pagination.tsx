import { Flex } from '@chakra-ui/react';
import React from 'react';

import type { PaginationParams } from './types';

import { Button } from 'toolkit/chakra/button';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Skeleton } from 'toolkit/chakra/skeleton';
import IconSvg from 'ui/shared/IconSvg';

interface Props extends PaginationParams {
  className?: string;
}

const Pagination = (props: Props) => {
  const { page, onNextPageClick, onPrevPageClick, resetPage, hasPages, hasNextPage, canGoBackwards, isLoading, isVisible, className } = props;

  if (!isVisible) {
    return null;
  }

  const showSkeleton = page === 1 && !hasPages && isLoading;

  return (
    <Flex
      as="nav"
      alignItems="center"
      className={ className }
    >
      <Skeleton loading={ showSkeleton } mr="12px">
        <Button
          variant="pagination"
          size="sm"
          onClick={ resetPage }
          disabled={ page === 1 || isLoading }
        >
          First
        </Button>
      </Skeleton>
      <IconButton
        aria-label="Prev page"
        variant="pagination"
        className="size-8"
        onClick={ onPrevPageClick }
        disabled={ !canGoBackwards || isLoading || page === 1 }
        loadingSkeleton={ showSkeleton }
      >
        <IconSvg name="arrows/east-mini" boxSize={ 5 }/>
      </IconButton>
      <Button
        variant="pagination"
        size="sm"
        selected={ !showSkeleton }
        className="pointer-events-none mx-2 min-w-8 px-2"
        loadingSkeleton={ showSkeleton }
      >
        { page }
      </Button>
      <IconButton
        aria-label="Next page"
        variant="pagination"
        className="size-8"
        onClick={ onNextPageClick }
        disabled={ !hasNextPage || isLoading }
        loadingSkeleton={ showSkeleton }
      >
        <IconSvg name="arrows/east-mini" boxSize={ 5 } className="rotate-180"/>
      </IconButton>
    </Flex>

  );
};

export default React.memo(Pagination);
