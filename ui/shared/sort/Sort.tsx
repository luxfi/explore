import React from 'react';

import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import useIsMobile from 'lib/hooks/useIsMobile';
import { IconButton } from '@luxfi/ui/icon-button';
import type { SelectRootProps } from '@luxfi/ui/select';
import { SelectContent, SelectItem, SelectRoot, SelectControl, SelectValueText } from '@luxfi/ui/select';
import IconSvg from 'ui/shared/IconSvg';

export interface Props extends SelectRootProps {
  isLoading?: boolean;
}

const Sort = (props: Props) => {
  const { collection, isLoading, ...rest } = props;
  const isMobile = useIsMobile();
  const isInitialLoading = useIsInitialLoading(isLoading);

  const trigger = (() => {
    if (isMobile) {
      return (
        <SelectControl triggerProps={{ asChild: true }} noIndicator>
          <IconButton
            loadingSkeleton={ isInitialLoading }
            aria-label="sort"
            size="md"
            variant="dropdown"
            disabled={ isLoading }
          >
            <IconSvg name="arrows/up-down"/>
          </IconButton>
        </SelectControl>
      );
    }

    return (
      <SelectControl
        loading={ isInitialLoading }
      >
        <span className="shrink-0 font-normal text-[var(--color-blackAlpha-600)] dark:text-[var(--color-whiteAlpha-600)] group-hover:text-inherit group-data-[state=open]:text-inherit">
          Sort by
        </span>
        <SelectValueText
          className="text-[var(--color-text-secondary)] group-hover:text-inherit"
        />
      </SelectControl>
    );
  })();

  return (
    <SelectRoot collection={ collection } w="fit-content" variant="plain" disabled={ isLoading } { ...rest }>
      { trigger }
      <SelectContent>
        { collection?.items.map((item) => (
          <SelectItem item={ item } key={ item.value }>
            { item.label }
          </SelectItem>
        )) }
      </SelectContent>
    </SelectRoot>
  );
};

export default React.memo(Sort) as typeof Sort;
