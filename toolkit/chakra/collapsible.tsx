import * as Collapsible from '@radix-ui/react-collapsible';
import React from 'react';
import { scroller, Element } from 'react-scroll';

import { cn } from 'lib/utils/cn';

import { useUpdateEffect } from '../hooks/useUpdateEffect';
import type { LinkProps } from './link';
import { Link } from './link';

export interface CollapsibleDetailsProps extends LinkProps {
  children: React.ReactNode;
  id?: string;
  isExpanded?: boolean;
  text?: [string, string];
  noScroll?: boolean;
}

const SCROLL_CONFIG = {
  duration: 500,
  smooth: true,
};

const CUT_ID = 'CollapsibleDetails';

export const CollapsibleDetails = (props: CollapsibleDetailsProps) => {

  const { children, id = CUT_ID, onClick, isExpanded: isExpandedProp = false, text: textProp, loading, noScroll, ...rest } = props;

  const [ isExpanded, setIsExpanded ] = React.useState(isExpandedProp);

  const handleClick = React.useCallback((event: React.MouseEvent<HTMLAnchorElement>) => {
    setIsExpanded((flag) => !flag);
    if (!noScroll) {
      scroller.scrollTo(id, SCROLL_CONFIG);
    }
    onClick?.(event);
  }, [ id, noScroll, onClick ]);

  useUpdateEffect(() => {
    setIsExpanded(isExpandedProp);
    isExpandedProp && !noScroll && scroller.scrollTo(id, SCROLL_CONFIG);
  }, [ isExpandedProp, id, noScroll ]);

  const text = isExpanded ? (textProp?.[1] ?? 'Hide details') : (textProp?.[0] ?? 'View details');

  return (
    <Collapsible.Root open={ isExpanded }>
      <Collapsible.Trigger asChild>
        <Link
          className="text-sm underline decoration-dashed w-fit"
          onClick={ handleClick }
          loading={ loading }
          { ...rest }
        >
          <Element name={ id }>{ text }</Element>
        </Link>
      </Collapsible.Trigger>
      <Collapsible.Content>
        { children }
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

interface CollapsibleListProps<T> extends React.ComponentPropsWithoutRef<'div'> {
  items: Array<T>;
  renderItem: (item: T, index: number) => React.ReactNode;
  triggerProps?: LinkProps;
  cutLength?: number;
  text?: [React.ReactNode, React.ReactNode];
  defaultExpanded?: boolean;
}

export const CollapsibleList = <T,>(props: CollapsibleListProps<T>) => {
  const CUT_LENGTH = 3;

  const { items, renderItem, triggerProps, cutLength = CUT_LENGTH, text: textProp, defaultExpanded = false, className, ...rest } = props;

  const [ isExpanded, setIsExpanded ] = React.useState(defaultExpanded);

  React.useEffect(() => {
    setIsExpanded(defaultExpanded);
  }, [ defaultExpanded ]);

  const handleToggle = React.useCallback(() => {
    setIsExpanded((flag) => !flag);
  }, []);

  const text = isExpanded ? (textProp?.[1] ?? 'Hide') : (textProp?.[0] ?? 'Show all');

  return (
    <Collapsible.Root open={ isExpanded }>
      <div className={ cn('flex flex-col w-full', className) } { ...rest }>
        { items.slice(0, isExpanded ? undefined : cutLength).map(renderItem) }
        { items.length > cutLength && (
          <Collapsible.Trigger asChild>
            <Link
              className="text-sm underline decoration-dashed w-fit min-w-0"
              onClick={ handleToggle }
              { ...triggerProps }
            >
              { text }
            </Link>
          </Collapsible.Trigger>
        ) }
      </div>
    </Collapsible.Root>
  );
};
