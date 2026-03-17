import * as AccordionPrimitive from '@radix-ui/react-accordion';
import * as React from 'react';
import { scroller } from 'react-scroll';

import IndicatorIcon from 'icons/arrows/east-mini.svg';
import { cn } from 'lib/utils/cn';

// ---------------------------------------------------------------------------
// AccordionRoot
// ---------------------------------------------------------------------------

interface AccordionRootProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'defaultValue' | 'dir'> {

  /** Open multiple items simultaneously. Defaults to true. */
  readonly multiple?: boolean;

  /** Controlled open items (array of `value` strings). */
  readonly value?: Array<string>;

  /** Uncontrolled initial open items. */
  readonly defaultValue?: Array<string>;

  /**
   * Called when open items change.
   * Wraps the value in `{ value }` to stay compatible with the Chakra callback shape
   * that consumers already rely on.
   */
  readonly onValueChange?: (details: { value: Array<string> }) => void;
  readonly variant?: 'outline' | 'faq';
  readonly size?: 'sm' | 'md';

  /** Accepted for compatibility; not applied visually. */
  readonly noAnimation?: boolean;

  /** Accepted for compatibility; Radix defers rendering internally. */
  readonly lazyMount?: boolean;
  readonly children?: React.ReactNode;
}

export const AccordionRoot = React.forwardRef<HTMLDivElement, AccordionRootProps>(
  function AccordionRoot(props, ref) {
    const {
      multiple: _multiple,
      value,
      defaultValue,
      onValueChange,
      variant,
      size,
      noAnimation: _noAnimation,
      lazyMount: _lazyMount,
      className,
      children,
      ...rest
    } = props;

    // Radix requires `type` discriminant.  We default to "multiple" to match
    // the original Chakra wrapper behavior.
    const handleValueChange = React.useCallback(
      (next: Array<string>) => {
        onValueChange?.({ value: next });
      },
      [ onValueChange ],
    );

    return (
      <AccordionPrimitive.Root
        ref={ ref }
        type="multiple"
        value={ value }
        defaultValue={ defaultValue }
        onValueChange={ handleValueChange }
        className={ cn(
          'w-full',
          variant === 'faq' && 'accordion-faq',
          size === 'sm' && 'accordion-sm',
          className,
        ) }
        data-variant={ variant }
        data-size={ size }
        { ...rest }
      >
        { children }
      </AccordionPrimitive.Root>
    );
  },
);

// ---------------------------------------------------------------------------
// AccordionItem
// ---------------------------------------------------------------------------

interface AccordionItemProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Item> {}

export const AccordionItem = React.forwardRef<HTMLDivElement, AccordionItemProps>(
  function AccordionItem(props, ref) {
    const { className, ...rest } = props;
    return (
      <AccordionPrimitive.Item
        ref={ ref }
        className={ cn(
          'border-b border-[var(--color-border-divider)]',
          className,
        ) }
        { ...rest }
      />
    );
  },
);

// ---------------------------------------------------------------------------
// AccordionItemTrigger
// ---------------------------------------------------------------------------

interface AccordionItemTriggerProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger> {
  readonly indicatorPlacement?: 'start' | 'end';
  readonly noIndicator?: boolean;
  readonly variant?: 'outline' | 'faq';
}

export const AccordionItemTrigger = React.forwardRef<
  HTMLButtonElement,
  AccordionItemTriggerProps
>(function AccordionItemTrigger(props, ref) {
  const { children, indicatorPlacement: indicatorPlacementProp, variant, noIndicator, className, ...rest } = props;

  const indicatorPlacement = variant === 'faq' ? 'start' : (indicatorPlacementProp ?? 'end');

  const indicator = variant === 'faq' ? (
    <span
      className={ cn(
        'relative inline-block h-3 w-3 shrink-0',
        // horizontal bar (always visible)
        'before:absolute before:left-0 before:top-1/2 before:block before:h-[2px] before:w-full before:-translate-y-1/2 before:rounded-[2px] before:bg-current',
        // vertical bar (rotates to 0 when open)
        'after:absolute after:left-1/2 after:top-0 after:block after:h-full after:w-[2px]',
        'after:-translate-x-1/2 after:rounded-[2px] after:bg-current',
        'after:transition-transform after:duration-200 after:ease-in-out',
        // When parent trigger has data-state="open", rotate vertical bar
        'group-data-[state=open]/trigger:after:rotate-90',
      ) }
    />
  ) : (
    <span
      className={ cn(
        'inline-flex shrink-0 transition-transform duration-200',
        'rotate-180',
        'group-data-[state=open]/trigger:rotate-[270deg]',
      ) }
    >
      <IndicatorIcon className="h-5 w-5"/>
    </span>
  );

  return (
    <AccordionPrimitive.Header asChild>
      <div>
        <AccordionPrimitive.Trigger
          ref={ ref }
          className={ cn(
            'group/trigger flex w-full cursor-pointer items-center gap-2 py-3 text-left text-[var(--color-text-primary)]',
            'hover:text-[var(--color-hover)]',
            'focus-visible:outline-none',
            className,
          ) }
          { ...rest }
        >
          { indicatorPlacement === 'start' && !noIndicator && indicator }
          { children }
          { indicatorPlacement === 'end' && !noIndicator && indicator }
        </AccordionPrimitive.Trigger>
      </div>
    </AccordionPrimitive.Header>
  );
});

// ---------------------------------------------------------------------------
// AccordionItemContent
// ---------------------------------------------------------------------------

export interface AccordionItemContentProps extends React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content> {}

export const AccordionItemContent = React.forwardRef<
  HTMLDivElement,
  AccordionItemContentProps
>(function AccordionItemContent(props, ref) {
  const { className, children, ...rest } = props;
  return (
    <AccordionPrimitive.Content
      ref={ ref }
      className={ cn(
        'overflow-hidden text-[var(--color-text-primary)]',
        'data-[state=open]:animate-accordion-down',
        'data-[state=closed]:animate-accordion-up',
        className,
      ) }
      { ...rest }
    >
      <div className="pb-3">
        { children }
      </div>
    </AccordionPrimitive.Content>
  );
});

// ---------------------------------------------------------------------------
// useAccordion
// ---------------------------------------------------------------------------

export function useAccordion(items: Array<{ id: string }>) {
  const [ value, setValue ] = React.useState<Array<string>>([]);

  const onValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setValue(value);
  }, []);

  const scrollToItemFromUrl = React.useCallback(() => {
    const hash = window.location.hash.replace('#', '');

    if (!hash) {
      return;
    }

    const itemToScroll = items.find((item) => item.id === hash);
    if (itemToScroll) {
      scroller.scrollTo(itemToScroll.id, {
        duration: 500,
        smooth: true,
        offset: -100,
      });
      setValue([ itemToScroll.id ]);
    }
  }, [ items ]);

  return React.useMemo(() => {
    return {
      value,
      onValueChange,
      scrollToItemFromUrl,
    };
  }, [ value, onValueChange, scrollToItemFromUrl ]);
}
