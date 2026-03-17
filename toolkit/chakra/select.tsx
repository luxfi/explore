'use client';

import * as RadixSelect from '@radix-ui/react-select';
import { useDebounce } from '@uidotdev/usehooks';
import * as React from 'react';

// Minimal ListCollection compatible with Chakra's API but without the dependency
export interface ListCollection<T> {
  items: Array<T>;
}

export function createListCollection<T>(config: { items: Array<T> }): ListCollection<T> {
  return { items: config.items };
}

import ArrowIcon from 'icons/arrows/east-mini.svg';
import CheckIcon from 'icons/check.svg';
import { cn } from 'lib/utils/cn';

import { FilterInput } from '../components/filters/FilterInput';
import { Skeleton } from './skeleton';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ViewMode = 'default' | 'compact';

export interface SelectOption<Value extends string = string> {
  label: string;
  renderLabel?: (place: 'item' | 'value-text') => React.ReactNode;
  value: Value;
  icon?: React.ReactNode;
  afterElement?: React.ReactNode;
}

// ---------------------------------------------------------------------------
// Internal context — replaces Chakra's useSelectContext
// ---------------------------------------------------------------------------

interface SelectInternalContextValue {
  value: Array<string>;
  selectedItems: Array<SelectOption>;
  collection: ListCollection<SelectOption>;
  onValueChange: (details: { value: Array<string>; items: Array<SelectOption> }) => void;
  open: boolean;
  size?: 'sm' | 'lg';
  variant?: string;
  disabled?: boolean;
}

const SelectInternalContext = React.createContext<SelectInternalContextValue | null>(null);

function useSelectInternalContext(): SelectInternalContextValue {
  const ctx = React.useContext(SelectInternalContext);
  if (!ctx) {
    throw new Error('Select compound components must be rendered inside <SelectRoot>');
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// SelectRoot
// ---------------------------------------------------------------------------

export interface SelectRootProps {
  children?: React.ReactNode;
  collection?: ListCollection<SelectOption>;
  defaultValue?: Array<string>;
  value?: Array<string>;
  onValueChange?: (details: { value: Array<string>; items: Array<SelectOption> }) => void;
  onInteractOutside?: () => void;
  name?: string;
  disabled?: boolean;
  readOnly?: boolean;
  required?: boolean;
  invalid?: boolean;
  size?: 'sm' | 'lg';
  variant?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  // Chakra compat — accepted but handled via className/style
  positioning?: { sameWidth?: boolean; offset?: { mainAxis?: number; crossAxis?: number } };
  lazyMount?: boolean;
  unmountOnExit?: boolean;
  asChild?: boolean;
  className?: string;
  style?: React.CSSProperties;
  // Chakra style prop shims
  w?: string | Record<string, string>;
  maxW?: string | Record<string, string>;
  minW?: string | Record<string, string>;
  hideFrom?: string;
}

export const SelectRoot = React.forwardRef<HTMLDivElement, SelectRootProps>(
  function SelectRoot(props, ref) {
    const {
      children,
      collection: collectionProp,
      defaultValue: defaultValueArr,
      value: valueProp,
      onValueChange: onValueChangeProp,
      onInteractOutside,
      name,
      disabled,
      readOnly,
      required,
      invalid,
      size,
      variant,
      open: openProp,
      defaultOpen,
      onOpenChange,
      positioning: _positioning,
      lazyMount: _lazyMount,
      unmountOnExit: _unmountOnExit,
      asChild: _asChild,
      className,
      style,
      w,
      maxW,
      minW,
      hideFrom: _hideFrom,
    } = props;

    // Provide a fallback empty collection
    const collection = collectionProp ?? createListCollection<SelectOption>({ items: [] });

    // Controlled / uncontrolled value (always Array<string> externally)
    const [ internalValue, setInternalValue ] = React.useState<Array<string>>(defaultValueArr ?? []);
    const currentValue = valueProp ?? internalValue;

    const selectedItems = React.useMemo(() => {
      return currentValue
        .map((v) => collection.items.find((item) => item.value === v))
        .filter(Boolean) as Array<SelectOption>;
    }, [ currentValue, collection.items ]);

    const [ open, setOpen ] = React.useState(defaultOpen ?? false);
    const isOpen = openProp ?? open;

    const handleOpenChange = React.useCallback((nextOpen: boolean) => {
      setOpen(nextOpen);
      onOpenChange?.(nextOpen);
      if (!nextOpen) {
        onInteractOutside?.();
      }
    }, [ onOpenChange, onInteractOutside ]);

    const handleRadixValueChange = React.useCallback((radixValue: string) => {
      const nextArr = [ radixValue ];
      if (!valueProp) {
        setInternalValue(nextArr);
      }
      const items = collection.items.filter((item) => nextArr.includes(item.value));
      onValueChangeProp?.({ value: nextArr, items });
    }, [ valueProp, collection.items, onValueChangeProp ]);

    const ctxValue = React.useMemo<SelectInternalContextValue>(() => ({
      value: currentValue,
      selectedItems,
      collection,
      onValueChange: (details) => {
        if (!valueProp) {
          setInternalValue(details.value);
        }
        onValueChangeProp?.(details);
      },
      open: isOpen,
      size,
      variant,
      disabled,
    }), [ currentValue, selectedItems, collection, valueProp, onValueChangeProp, isOpen, size, variant, disabled ]);

    // Extract Chakra-style shorthand props into inline style
    const resolveVal = (v: string | Record<string, string> | undefined) => {
      if (!v) return undefined;
      if (typeof v === 'string') return v;
      return v.base ?? v.lg ?? Object.values(v)[0];
    };
    const inlineStyle = React.useMemo(() => {
      const s: React.CSSProperties = { ...style };
      const rw = resolveVal(w); if (rw) s.width = rw;
      const rmw = resolveVal(maxW); if (rmw) s.maxWidth = rmw;
      const rminw = resolveVal(minW); if (rminw) s.minWidth = rminw;
      return s;
    }, [ style, w, maxW, minW ]);

    return (
      <SelectInternalContext.Provider value={ ctxValue }>
        <RadixSelect.Root
          value={ currentValue[0] ?? '' }
          defaultValue={ defaultValueArr?.[0] }
          onValueChange={ handleRadixValueChange }
          open={ isOpen }
          onOpenChange={ handleOpenChange }
          disabled={ disabled || readOnly }
          name={ name }
          required={ required }
        >
          <div
            ref={ ref }
            className={ cn('relative inline-flex', className) }
            style={ inlineStyle }
            data-invalid={ invalid || undefined }
            data-disabled={ disabled || undefined }
            data-variant={ variant || undefined }
            data-size={ size || undefined }
          >
            { children }
          </div>
        </RadixSelect.Root>
      </SelectInternalContext.Provider>
    );
  },
);

// ---------------------------------------------------------------------------
// SelectControl
// ---------------------------------------------------------------------------

export interface SelectControlProps {
  children?: React.ReactNode;
  noIndicator?: boolean;
  triggerProps?: React.ComponentPropsWithoutRef<typeof RadixSelect.Trigger> & {
    asChild?: boolean;
    px?: string | number;
    className?: string;
  };
  loading?: boolean;
  defaultValue?: Array<string>;
  className?: string;
  style?: React.CSSProperties;
}

export const SelectControl = React.forwardRef<HTMLButtonElement, SelectControlProps>(
  function SelectControl(props, ref) {
    const { children, noIndicator, triggerProps, loading, defaultValue } = props;
    const ctx = useSelectInternalContext();

    const isDefaultValue = Array.isArray(defaultValue) ?
      ctx.value.every((item) => defaultValue.includes(item)) :
      false;

    const { asChild, px: _px, className: triggerClassName, ...radixTriggerProps } = triggerProps ?? {};

    const trigger = (
      <RadixSelect.Trigger
        ref={ ref }
        asChild={ asChild }
        className={ cn(
          'group peer inline-flex items-center gap-2 cursor-pointer',
          'rounded-lg text-sm transition-colors outline-none',
          'border border-[var(--color-input-border)] bg-[var(--color-input-bg)] text-[var(--color-input-fg)]',
          'hover:border-[var(--color-input-border-hover)]',
          'focus-visible:border-[var(--color-input-border-focus)]',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          ctx.variant === 'plain' && 'border-transparent bg-transparent px-1 py-0.5',
          ctx.variant !== 'plain' && ctx.size === 'lg' && 'px-4 py-2.5 min-h-[52px]',
          ctx.variant !== 'plain' && ctx.size !== 'lg' && 'px-3 py-1.5 min-h-[36px]',
          triggerClassName,
        ) }
        data-default-value={ isDefaultValue || undefined }
        { ...radixTriggerProps }
      >
        { asChild ? children : (
          <>
            { children }
            { !noIndicator && (
              <span className="ml-auto shrink-0 transition-transform data-[state=open]:rotate-180 text-[var(--color-icon-secondary)]">
                <ArrowIcon className="h-5 w-5 -rotate-90"/>
              </span>
            ) }
          </>
        ) }
      </RadixSelect.Trigger>
    );

    if (loading) {
      return (
        <Skeleton loading={ loading } asChild>
          { trigger }
        </Skeleton>
      );
    }

    return trigger;
  },
);

// ---------------------------------------------------------------------------
// SelectClearTrigger
// ---------------------------------------------------------------------------

export interface SelectClearTriggerProps {
  className?: string;
}

export const SelectClearTrigger = React.forwardRef<HTMLButtonElement, SelectClearTriggerProps>(
  function SelectClearTrigger(props, ref) {
    const { className, ...rest } = props;
    const ctx = useSelectInternalContext();

    const handleClick = React.useCallback(() => {
      ctx.onValueChange({ value: [], items: [] });
    }, [ ctx ]);

    return (
      <button
        ref={ ref }
        type="button"
        onClick={ handleClick }
        className={ cn('pointer-events-auto', className) }
        aria-label="Clear selection"
        { ...rest }
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
    );
  },
);

// ---------------------------------------------------------------------------
// SelectContent
// ---------------------------------------------------------------------------

export interface SelectContentProps {
  children?: React.ReactNode;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  className?: string;
  style?: React.CSSProperties;
}

export const SelectContent = React.forwardRef<HTMLDivElement, SelectContentProps>(
  function SelectContent(props, ref) {
    const { portalled = true, portalRef, children, className, ...rest } = props;

    const content = (
      <RadixSelect.Content
        ref={ ref }
        position="popper"
        sideOffset={ 4 }
        className={ cn(
          'z-50 min-w-[8rem] overflow-hidden rounded-lg',
          'bg-[var(--color-popover-bg)] shadow-[var(--shadow-popover)]',
          'border border-[var(--color-border-divider)]',
          'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
          'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
          className,
        ) }
        { ...rest }
      >
        <RadixSelect.Viewport className="p-1">
          { children }
        </RadixSelect.Viewport>
      </RadixSelect.Content>
    );

    if (portalled) {
      return (
        <RadixSelect.Portal container={ portalRef?.current ?? undefined }>
          { content }
        </RadixSelect.Portal>
      );
    }

    return content;
  },
);

// ---------------------------------------------------------------------------
// SelectItem
// ---------------------------------------------------------------------------

export interface SelectItemProps {
  item: SelectOption;
  children?: React.ReactNode;
  className?: string;
}

export const SelectItem = React.forwardRef<HTMLDivElement, SelectItemProps>(
  function SelectItem(props, ref) {
    const { item, children, className, ...rest } = props;

    return (
      <RadixSelect.Item
        ref={ ref }
        value={ item.value }
        textValue={ item.label }
        className={ cn(
          'relative flex cursor-pointer select-none items-center gap-2',
          'rounded-md px-3 py-2 text-sm outline-none',
          'text-[var(--color-text-primary)]',
          'data-[highlighted]:bg-[var(--color-selected-control-bg)]',
          'data-[state=checked]:font-medium',
          'data-[disabled]:opacity-50 data-[disabled]:pointer-events-none',
          className,
        ) }
        { ...rest }
      >
        { item.icon }
        <RadixSelect.ItemText>
          { children }
        </RadixSelect.ItemText>
        <RadixSelect.ItemIndicator className="ml-auto shrink-0">
          <CheckIcon className="h-5 w-5"/>
        </RadixSelect.ItemIndicator>
      </RadixSelect.Item>
    );
  },
);

// ---------------------------------------------------------------------------
// SelectValueText
// ---------------------------------------------------------------------------

interface SelectValueTextProps {
  children?: (items: Array<SelectOption>) => React.ReactNode;
  placeholder?: string;
  size?: SelectRootProps['size'];
  required?: boolean;
  invalid?: boolean;
  errorText?: string;
  mode?: ViewMode;
  className?: string;
  style?: React.CSSProperties;
}

export const SelectValueText = React.forwardRef<HTMLSpanElement, SelectValueTextProps>(
  function SelectValueText(props, ref) {
    const { children, size, required, invalid, errorText, mode, className, style, placeholder: placeholderProp, ...rest } = props;
    const ctx = useSelectInternalContext();

    const placeholderText = `${ placeholderProp ?? '' }${ required ? '*' : '' }${ invalid && errorText ? ` - ${ errorText }` : '' }`;

    const content = (() => {
      const items = ctx.selectedItems;

      if (items.length === 0) return null;

      if (children) return children(items);

      if (items.length === 1) {
        const item = items[0] as SelectOption;

        if (!item) return null;

        const label = size === 'lg' ? (
          <span
            className={ cn(
              'text-xs block',
              invalid ? 'text-[var(--color-text-error)]' : 'text-[var(--color-input-placeholder)]',
            ) }
            style={{ display: '-webkit-box' }}
          >
            { placeholderText }
          </span>
        ) : null;

        return (
          <>
            { label }
            <span className="inline-flex items-center flex-nowrap gap-1">
              { item.icon }
              { mode !== 'compact' && (
                <span
                  style={{
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: 'vertical',
                    display: '-webkit-box',
                    overflow: 'hidden',
                  }}
                >
                  { item.renderLabel ? item.renderLabel('value-text') : item.label }
                </span>
              ) }
            </span>
          </>
        );
      }

      return `${ items.length } selected`;
    })();

    // Radix SelectValue renders the selected value or placeholder.
    // We override with our custom content.
    return (
      <RadixSelect.Value
        ref={ ref }
        placeholder={ placeholderText }
        className={ cn('flex flex-col justify-center min-w-0 truncate', className) }
        { ...rest }
      >
        { content }
      </RadixSelect.Value>
    );
  },
);

// ---------------------------------------------------------------------------
// SelectItemGroup
// ---------------------------------------------------------------------------

interface SelectItemGroupProps {
  children?: React.ReactNode;
  label: React.ReactNode;
  className?: string;
}

export const SelectItemGroup = React.forwardRef<HTMLDivElement, SelectItemGroupProps>(
  function SelectItemGroup(props, ref) {
    const { children, label, className, ...rest } = props;
    return (
      <RadixSelect.Group ref={ ref } className={ cn('py-1', className) } { ...rest }>
        <RadixSelect.Label className="px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)]">
          { label }
        </RadixSelect.Label>
        { children }
      </RadixSelect.Group>
    );
  },
);

// ---------------------------------------------------------------------------
// SelectLabel / SelectItemText
// ---------------------------------------------------------------------------

export const SelectLabel = RadixSelect.Label;
export const SelectItemText = RadixSelect.ItemText;

// ---------------------------------------------------------------------------
// Select (composite)
// ---------------------------------------------------------------------------

export interface SelectProps extends SelectRootProps {
  collection: ListCollection<SelectOption>;
  placeholder: string;
  portalled?: boolean;
  loading?: boolean;
  errorText?: string;
  contentProps?: SelectContentProps;
  contentHeader?: React.ReactNode;
  itemFilter?: (item: SelectOption) => boolean;
  mode?: ViewMode;
}

export const Select = React.forwardRef<HTMLDivElement, SelectProps>((props, ref) => {
  const { collection, placeholder, portalled = true, loading, errorText, contentProps, contentHeader, itemFilter, mode, ...rest } = props;
  return (
    <SelectRoot
      ref={ ref }
      collection={ collection }
      { ...rest }
    >
      <SelectControl loading={ loading }>
        <SelectValueText
          placeholder={ placeholder }
          size={ props.size }
          required={ props.required }
          invalid={ props.invalid }
          errorText={ errorText }
          mode={ mode }
        />
      </SelectControl>
      <SelectContent portalled={ portalled } { ...contentProps }>
        { contentHeader }
        { collection.items
          .filter(itemFilter ?? (() => true))
          .map((item: SelectOption) => (
            <React.Fragment key={ item.value }>
              <SelectItem item={ item }>
                { item.renderLabel ? item.renderLabel('item') : item.label }
              </SelectItem>
              { item.afterElement }
            </React.Fragment>
          )) }
      </SelectContent>
    </SelectRoot>
  );
});

// ---------------------------------------------------------------------------
// SelectAsync
// ---------------------------------------------------------------------------

export interface SelectAsyncProps extends Omit<SelectProps, 'collection'> {
  placeholder: string;
  portalled?: boolean;
  loading?: boolean;
  loadOptions: (input: string, currentValue: Array<string>) => Promise<ListCollection<SelectOption>>;
  extraControls?: React.ReactNode;
  mode?: ViewMode;
}

export const SelectAsync = React.forwardRef<HTMLDivElement, SelectAsyncProps>((props, ref) => {
  const { placeholder, portalled = true, loading, loadOptions, extraControls, onValueChange, errorText, mode, contentHeader, ...rest } = props;

  const [ collection, setCollection ] = React.useState<ListCollection<SelectOption>>(createListCollection<SelectOption>({ items: [] }));
  const [ inputValue, setInputValue ] = React.useState('');
  const [ value, setValue ] = React.useState<Array<string>>([]);

  const debouncedInputValue = useDebounce(inputValue, 300);

  React.useEffect(() => {
    loadOptions(debouncedInputValue, value).then(setCollection);
  }, [ debouncedInputValue, loadOptions, value ]);

  const handleFilterChange = React.useCallback((val: string) => {
    setInputValue(val);
  }, []);

  const handleValueChange = React.useCallback(({ value: v, items }: { value: Array<string>; items: Array<SelectOption> }) => {
    setValue(v);
    onValueChange?.({ value: v, items });
  }, [ onValueChange ]);

  return (
    <SelectRoot
      ref={ ref }
      collection={ collection }
      onValueChange={ handleValueChange }
      { ...rest }
    >
      <SelectControl loading={ loading }>
        <SelectValueText
          placeholder={ placeholder }
          size={ props.size }
          required={ props.required }
          invalid={ props.invalid }
          errorText={ errorText }
          mode={ mode }
        />
      </SelectControl>
      <SelectContent portalled={ portalled }>
        <div className="px-4">
          <FilterInput
            placeholder="Search"
            initialValue={ inputValue }
            onChange={ handleFilterChange }
          />
          { extraControls }
        </div>
        { contentHeader }
        { collection.items.map((item) => (
          <SelectItem item={ item } key={ item.value }>
            { item.renderLabel ? item.renderLabel('item') : item.label }
          </SelectItem>
        )) }
      </SelectContent>
    </SelectRoot>
  );
});
