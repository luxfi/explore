import * as RadixTabs from '@radix-ui/react-tabs';
import * as React from 'react';

import { cn } from 'lib/utils/cn';

// ---------------------------------------------------------------------------
// Variant / size / fitted types (match the old Chakra recipe)
// ---------------------------------------------------------------------------

type TabsVariant = 'solid' | 'secondary' | 'segmented' | 'unstyled';
type TabsSize = 'sm' | 'md' | 'free';

// ---------------------------------------------------------------------------
// TabsRoot
// ---------------------------------------------------------------------------

export interface TabsProps extends React.ComponentPropsWithoutRef<typeof RadixTabs.Root> {

  /** Visual variant. Default: "solid". */
  variant?: TabsVariant;

  /** Size preset. Default: "md". */
  size?: TabsSize;

  /** Stretch triggers to fill the list width. */
  fitted?: boolean;

  /**
   * @deprecated Chakra-compat. Radix mounts lazily by default (content only
   * renders when active). Kept so call-sites don't break at compile time.
   */
  lazyMount?: boolean;

  /**
   * @deprecated Chakra-compat. Radix unmounts inactive content by default.
   * Kept so call-sites don't break at compile time.
   */
  unmountOnExit?: boolean;

  /**
   * Chakra-compatible value-change handler.
   * Accepts both `(details: { value: string }) => void` (Chakra convention)
   * and `(value: string) => void` (Radix convention).
   */
  onValueChange?: ((details: { value: string }) => void) | ((value: string) => void);
}

const ROOT_SIZE_CLASSES: Record<TabsSize, string> = {
  sm: '[--tabs-height:2rem] [--tabs-content-padding:1.5rem]',
  md: '[--tabs-height:2.5rem] [--tabs-content-padding:1.5rem]',
  free: '',
};

export const TabsRoot = React.forwardRef<HTMLDivElement, TabsProps>(
  function TabsRoot(props, ref) {
    const {
      variant = 'solid',
      size = 'md',
      fitted,
      lazyMount: _lazyMount,
      unmountOnExit: _unmountOnExit,
      onValueChange,
      className,
      ...rest
    } = props;

    // Bridge Chakra-style `onValueChange({value})` to Radix `onValueChange(value)`
    const handleValueChange = React.useCallback(
      (value: string) => {
        if (!onValueChange) return;
        // Detect which signature the caller expects by trying the Chakra shape.
        // Both signatures are valid TS, so we call with the object form since
        // all existing consumers use `({ value })`.
        (onValueChange as (details: { value: string }) => void)({ value });
      },
      [ onValueChange ],
    );

    return (
      <RadixTabs.Root
        ref={ ref }
        data-variant={ variant }
        data-size={ size }
        data-fitted={ fitted ? '' : undefined }
        className={ cn(
          'relative',
          ROOT_SIZE_CLASSES[size],
          className,
        ) }
        onValueChange={ onValueChange ? handleValueChange : undefined }
        { ...rest }
      />
    );
  },
);

// ---------------------------------------------------------------------------
// TabsList
// ---------------------------------------------------------------------------

export interface TabsListProps extends React.ComponentPropsWithoutRef<typeof RadixTabs.List> {}

export const TabsList = React.forwardRef<HTMLDivElement, TabsListProps>(
  function TabsList(props, ref) {
    const { className, ...rest } = props;

    return (
      <RadixTabs.List
        ref={ ref }
        className={ cn(
          'inline-flex w-full relative isolate flex-row',
          'min-h-[var(--tabs-height,2.5rem)]',
          className,
        ) }
        { ...rest }
      />
    );
  },
);

// ---------------------------------------------------------------------------
// TabsTrigger
// ---------------------------------------------------------------------------

export interface TabsTriggerProps extends React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger> {}

const TRIGGER_BASE =
  'outline-none min-w-[var(--tabs-height,2.5rem)] h-[var(--tabs-height,2.5rem)]' +
  ' flex items-center relative cursor-pointer gap-2' +
  ' focus-visible:z-[1] focus-visible:outline-2 focus-visible:outline-offset-0' +
  ' disabled:cursor-not-allowed disabled:opacity-50';

const TRIGGER_SIZE_CLASSES: Record<TabsSize, string> = {
  sm: 'py-1 px-3 text-sm',
  md: 'py-2 px-4 text-base',
  free: '',
};

const TRIGGER_VARIANT_CLASSES: Record<TabsVariant, string> = {
  solid:
    'font-semibold gap-1 rounded-base bg-transparent' +
    ' text-tabs-solid-fg' +
    ' data-[state=active]:bg-selected-control-bg data-[state=active]:text-selected-control-text' +
    ' data-[state=active]:hover:text-selected-control-text' +
    ' hover:text-hover',
  secondary:
    'font-medium bg-transparent' +
    ' text-tabs-secondary-fg' +
    ' border-2 border-solid border-tabs-secondary-border rounded-base' +
    ' data-[state=active]:bg-selected-control-bg data-[state=active]:text-selected-control-text' +
    ' data-[state=active]:border-transparent data-[state=active]:hover:border-transparent' +
    ' hover:text-hover hover:border-hover',
  segmented:
    'bg-transparent' +
    ' text-text-primary' +
    ' border-2 border-solid border-selected-control-bg' +
    ' hover:text-hover' +
    ' data-[state=active]:text-selected-control-text data-[state=active]:bg-selected-control-bg' +
    ' data-[state=active]:border-selected-control-bg' +
    ' data-[state=active]:hover:text-selected-control-text',
  unstyled: '',
};

export const TabsTrigger = React.forwardRef<HTMLButtonElement, TabsTriggerProps>(
  function TabsTrigger(props, ref) {
    const { className, ...rest } = props;

    // Read variant / size from the closest TabsRoot via DOM data attributes.
    // We could use React context, but reading from data-* keeps the API surface
    // identical to Chakra where recipe tokens cascade automatically.
    const internalRef = React.useRef<HTMLButtonElement>(null);
    const mergedRef = useMergedRef(ref, internalRef);
    const { variant, size, fitted } = useTabsContext(internalRef);

    return (
      <RadixTabs.Trigger
        ref={ mergedRef }
        className={ cn(
          'group',
          TRIGGER_BASE,
          TRIGGER_SIZE_CLASSES[size],
          TRIGGER_VARIANT_CLASSES[variant],
          fitted && 'flex-1 text-center justify-center',
          className,
        ) }
        { ...rest }
      />
    );
  },
);

// ---------------------------------------------------------------------------
// TabsContent
// ---------------------------------------------------------------------------

export interface TabsContentProps extends React.ComponentPropsWithoutRef<typeof RadixTabs.Content> {}

export const TabsContent = React.forwardRef<HTMLDivElement, TabsContentProps>(
  function TabsContent(props, ref) {
    const { className, ...rest } = props;

    return (
      <RadixTabs.Content
        ref={ ref }
        className={ cn(
          'w-full pt-[var(--tabs-content-padding,1.5rem)]',
          'focus-visible:outline-2 focus-visible:outline-offset-[-2px]',
          className,
        ) }
        { ...rest }
      />
    );
  },
);

// ---------------------------------------------------------------------------
// TabsCounter
// ---------------------------------------------------------------------------

export interface TabsCounterProps {
  count?: number | null;
}

const COUNTER_OVERLOAD = 50;

export const TabsCounter = ({ count }: TabsCounterProps): React.ReactElement | null => {
  if (count === undefined || count === null) {
    return null;
  }

  return (
    <span
      className={ cn(
        'group-hover:text-inherit',
        count > 0 ?
          'text-text-secondary' :
          'text-[rgba(16,17,18,0.24)] dark:text-[rgba(255,255,255,0.24)]',
      ) }
    >
      { count > COUNTER_OVERLOAD ? `${ COUNTER_OVERLOAD }+` : count }
    </span>
  );
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Read variant / size / fitted from the nearest ancestor [data-variant] element. */
function useTabsContext(triggerRef: React.RefObject<HTMLButtonElement | null>): {
  variant: TabsVariant;
  size: TabsSize;
  fitted: boolean;
} {
  const [ ctx, setCtx ] = React.useState<{
    variant: TabsVariant;
    size: TabsSize;
    fitted: boolean;
  }>({ variant: 'solid', size: 'md', fitted: false });

  React.useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;
    const root = el.closest('[data-variant]');
    if (!root) return;
    setCtx({
      variant: (root.getAttribute('data-variant') as TabsVariant) ?? 'solid',
      size: (root.getAttribute('data-size') as TabsSize) ?? 'md',
      fitted: root.hasAttribute('data-fitted'),
    });
  }, [ triggerRef ]);

  return ctx;
}

/** Merge multiple refs into one callback ref. */
function useMergedRef<T>(
  ...refs: Array<React.Ref<T> | undefined>
): React.RefCallback<T> {
  return React.useCallback(
    (instance: T | null) => {
      for (const ref of refs) {
        if (!ref) continue;
        if (typeof ref === 'function') {
          ref(instance);
        } else {
          (ref as React.MutableRefObject<T | null>).current = instance;
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    refs,
  );
}
