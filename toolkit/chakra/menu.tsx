'use client';

import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as React from 'react';
import { LuCheck, LuChevronRight } from 'react-icons/lu';

import { cn } from 'lib/utils/cn';

// --- Utility: map Chakra-style placement string to Radix side + align ---

type Side = 'top' | 'right' | 'bottom' | 'left';
type Align = 'start' | 'center' | 'end';

interface PlacementMapping {
  readonly side: Side;
  readonly align: Align;
}

function parsePlacement(placement: string | undefined): PlacementMapping {
  if (!placement) {
    return { side: 'bottom', align: 'start' };
  }

  const parts = placement.split('-');
  const side = (parts[0] as Side) ?? 'bottom';
  const alignPart = parts[1];

  let align: Align = 'center';
  if (alignPart === 'start') {
    align = 'start';
  } else if (alignPart === 'end') {
    align = 'end';
  }

  return { side, align };
}

// --- Positioning context (mirrors popover.tsx pattern) ---

interface Positioning {
  readonly placement?: string;
  readonly offset?: {
    readonly mainAxis?: number;
    readonly crossAxis?: number;
  };
}

interface MenuPositioning {
  readonly side: Side;
  readonly align: Align;
  readonly sideOffset: number;
  readonly alignOffset: number;
}

const PositioningContext = React.createContext<MenuPositioning>({
  side: 'bottom',
  align: 'start',
  sideOffset: 4,
  alignOffset: 0,
});

// --- MenuRoot ---

export interface MenuRootProps {
  readonly children?: React.ReactNode;
  readonly open?: boolean;
  readonly defaultOpen?: boolean;
  readonly onOpenChange?: (details: { open: boolean }) => void;
  readonly positioning?: Positioning;
  readonly lazyMount?: boolean;
  readonly unmountOnExit?: boolean;
  readonly modal?: boolean;
}

export const MenuRoot = (props: MenuRootProps): React.ReactElement => {
  const {
    children,
    open,
    defaultOpen,
    onOpenChange,
    positioning,
    modal = true,
    // lazyMount / unmountOnExit have no direct Radix equivalent; Radix handles
    // mount/unmount automatically.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    lazyMount: _lazyMount,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    unmountOnExit: _unmountOnExit,
  } = props;

  const mergedPositioning: Positioning = {
    placement: 'bottom-start',
    ...positioning,
    offset: {
      mainAxis: 4,
      ...positioning?.offset,
    },
  };

  const { side, align } = parsePlacement(mergedPositioning.placement);

  const positioningValue = React.useMemo<MenuPositioning>(() => ({
    side,
    align,
    sideOffset: mergedPositioning.offset?.mainAxis ?? 4,
    alignOffset: mergedPositioning.offset?.crossAxis ?? 0,
  }), [ side, align, mergedPositioning.offset?.mainAxis, mergedPositioning.offset?.crossAxis ]);

  const handleOpenChange = React.useCallback((isOpen: boolean) => {
    onOpenChange?.({ open: isOpen });
  }, [ onOpenChange ]);

  return (
    <PositioningContext.Provider value={ positioningValue }>
      <DropdownMenu.Root
        open={ open }
        defaultOpen={ defaultOpen }
        onOpenChange={ handleOpenChange }
        modal={ modal }
      >
        { children }
      </DropdownMenu.Root>
    </PositioningContext.Provider>
  );
};

// --- MenuTrigger ---

export interface MenuTriggerProps extends React.ComponentPropsWithoutRef<'button'> {
  readonly asChild?: boolean;
}

export const MenuTrigger = React.forwardRef<
  HTMLButtonElement,
  MenuTriggerProps
>(function MenuTrigger(props, ref) {
  const { asChild = false, ...rest } = props;
  return <DropdownMenu.Trigger asChild={ asChild } ref={ ref } { ...rest }/>;
});

// --- MenuContent ---

export interface MenuContentProps extends React.ComponentPropsWithoutRef<'div'> {
  readonly portalled?: boolean;
  readonly portalRef?: React.RefObject<HTMLElement>;
  /** Legacy Chakra zIndex prop - mapped to inline style */
  readonly zIndex?: string | number;
  /** Legacy Chakra minW prop - mapped to inline style */
  readonly minW?: string | number;
}

export const MenuContent = React.forwardRef<
  HTMLDivElement,
  MenuContentProps
>(function MenuContent(props, ref) {
  const { portalled = true, portalRef, className, zIndex, minW, style, ...rest } = props;
  const positioning = React.useContext(PositioningContext);

  const mergedStyle: React.CSSProperties = {
    ...style,
    ...(zIndex !== undefined ? { zIndex: typeof zIndex === 'string' ? `var(--z-index-${zIndex}, ${zIndex})` : zIndex } : {}),
    ...(minW !== undefined ? { minWidth: minW } : {}),
  };

  const content = (
    <DropdownMenu.Content
      ref={ ref }
      side={ positioning.side }
      align={ positioning.align }
      sideOffset={ positioning.sideOffset }
      alignOffset={ positioning.alignOffset }
      className={ cn(
        'z-50 min-w-[8rem] overflow-hidden rounded-lg p-1',
        'border border-[var(--color-popover-border,var(--color-border-divider))]',
        'bg-[var(--color-popover-bg,var(--color-dialog-bg))]',
        'shadow-[0_4px_12px_var(--color-popover-shadow)]',
        'outline-none',
        'data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95',
        'data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95',
        'data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2',
        'data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2',
        className,
      ) }
      style={ Object.keys(mergedStyle).length > 0 ? mergedStyle : undefined }
      { ...rest }
    />
  );

  if (!portalled) {
    return content;
  }

  return (
    <DropdownMenu.Portal container={ portalRef?.current ?? undefined }>
      { content }
    </DropdownMenu.Portal>
  );
});

// --- MenuItem ---

export interface MenuItemProps extends React.ComponentPropsWithoutRef<'div'> {
  /** Informational value identifier (not used by Radix but kept for API compat) */
  readonly value?: string;
  readonly disabled?: boolean;
  readonly asChild?: boolean;
}

export const MenuItem = React.forwardRef<
  HTMLDivElement,
  MenuItemProps
>(function MenuItem(props, ref) {
  const { className, value: _value, asChild, ...rest } = props;
  return (
    <DropdownMenu.Item
      ref={ ref }
      asChild={ asChild }
      className={ cn(
        'relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm',
        'outline-none transition-colors',
        'text-[var(--color-text-primary,inherit)]',
        'data-[highlighted]:bg-[var(--color-popover-item-hover,rgba(0,0,0,0.04))]',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      ) }
      { ...rest }
    />
  );
});

// --- MenuItemText ---

export interface MenuItemTextProps extends React.ComponentPropsWithoutRef<'span'> {}

export const MenuItemText = React.forwardRef<
  HTMLSpanElement,
  MenuItemTextProps
>(function MenuItemText(props, ref) {
  const { className, ...rest } = props;
  return <span ref={ ref } className={ cn('flex-1', className) } { ...rest }/>;
});

// --- MenuItemCommand ---

export interface MenuItemCommandProps extends React.ComponentPropsWithoutRef<'span'> {}

export const MenuItemCommand = React.forwardRef<
  HTMLSpanElement,
  MenuItemCommandProps
>(function MenuItemCommand(props, ref) {
  const { className, ...rest } = props;
  return (
    <span
      ref={ ref }
      className={ cn('ml-auto text-xs tracking-widest opacity-60', className) }
      { ...rest }
    />
  );
});

// --- MenuSeparator ---

export interface MenuSeparatorProps extends React.ComponentPropsWithoutRef<'div'> {}

export const MenuSeparator = React.forwardRef<
  HTMLDivElement,
  MenuSeparatorProps
>(function MenuSeparator(props, ref) {
  const { className, ...rest } = props;
  return (
    <DropdownMenu.Separator
      ref={ ref }
      className={ cn('-mx-1 my-1 h-px bg-[var(--color-border-divider)]', className) }
      { ...rest }
    />
  );
});

// --- MenuItemGroup ---

export interface MenuItemGroupProps extends React.ComponentPropsWithoutRef<'div'> {
  readonly title?: string;
}

export const MenuItemGroup = React.forwardRef<
  HTMLDivElement,
  MenuItemGroupProps
>(function MenuItemGroup(props, ref) {
  const { title, children, className, ...rest } = props;
  return (
    <DropdownMenu.Group ref={ ref } className={ className } { ...rest }>
      { title && (
        <DropdownMenu.Label className="px-2 py-1.5 text-xs font-semibold select-none opacity-60">
          { title }
        </DropdownMenu.Label>
      ) }
      { children }
    </DropdownMenu.Group>
  );
});

// --- MenuArrow ---

export interface MenuArrowProps extends React.ComponentPropsWithoutRef<'svg'> {}

export const MenuArrow = React.forwardRef<
  SVGSVGElement,
  MenuArrowProps
>(function MenuArrow(props, ref) {
  const { className, ...rest } = props;
  return (
    <DropdownMenu.Arrow
      ref={ ref }
      className={ cn('fill-[var(--color-popover-bg,var(--color-dialog-bg))]', className) }
      { ...rest }
    />
  );
});

// --- MenuCheckboxItem ---

export interface MenuCheckboxItemProps extends React.ComponentPropsWithoutRef<'div'> {
  readonly checked?: boolean;
  readonly onCheckedChange?: (checked: boolean) => void;
}

export const MenuCheckboxItem = React.forwardRef<
  HTMLDivElement,
  MenuCheckboxItemProps
>(function MenuCheckboxItem(props, ref) {
  const { className, children, checked, onCheckedChange, ...rest } = props;
  return (
    <DropdownMenu.CheckboxItem
      ref={ ref }
      checked={ checked }
      onCheckedChange={ onCheckedChange }
      className={ cn(
        'relative flex cursor-pointer select-none items-center rounded-md py-1.5 pr-2 pl-8 text-sm',
        'outline-none transition-colors',
        'data-[highlighted]:bg-[var(--color-popover-item-hover,rgba(0,0,0,0.04))]',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      ) }
      { ...rest }
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenu.ItemIndicator>
          <LuCheck className="h-4 w-4"/>
        </DropdownMenu.ItemIndicator>
      </span>
      { children }
    </DropdownMenu.CheckboxItem>
  );
});

// --- MenuRadioItemGroup ---

export interface MenuRadioItemGroupProps extends React.ComponentPropsWithoutRef<'div'> {
  readonly value?: string;
  readonly onValueChange?: (value: string) => void;
}

export const MenuRadioItemGroup = React.forwardRef<
  HTMLDivElement,
  MenuRadioItemGroupProps
>(function MenuRadioItemGroup(props, ref) {
  const { value, onValueChange, ...rest } = props;
  return (
    <DropdownMenu.RadioGroup
      ref={ ref }
      value={ value }
      onValueChange={ onValueChange }
      { ...rest }
    />
  );
});

// --- MenuRadioItem ---

export interface MenuRadioItemProps extends React.ComponentPropsWithoutRef<'div'> {
  readonly value: string;
}

export const MenuRadioItem = React.forwardRef<
  HTMLDivElement,
  MenuRadioItemProps
>(function MenuRadioItem(props, ref) {
  const { className, children, value, ...rest } = props;
  return (
    <DropdownMenu.RadioItem
      ref={ ref }
      value={ value }
      className={ cn(
        'relative flex cursor-pointer select-none items-center rounded-md py-1.5 pr-2 pl-8 text-sm',
        'outline-none transition-colors',
        'data-[highlighted]:bg-[var(--color-popover-item-hover,rgba(0,0,0,0.04))]',
        'data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className,
      ) }
      { ...rest }
    >
      <span className="absolute left-2 flex h-3.5 w-3.5 items-center justify-center">
        <DropdownMenu.ItemIndicator>
          <LuCheck className="h-4 w-4"/>
        </DropdownMenu.ItemIndicator>
      </span>
      <span>{ children }</span>
    </DropdownMenu.RadioItem>
  );
});

// --- MenuContextTrigger ---
// Radix DropdownMenu does not have a native context-menu trigger.
// For API compatibility, export a no-op wrapper. Real context-menu
// support would require @radix-ui/react-context-menu.

export interface MenuContextTriggerProps extends React.ComponentPropsWithoutRef<'span'> {
  readonly asChild?: boolean;
}

export const MenuContextTrigger = React.forwardRef<
  HTMLSpanElement,
  MenuContextTriggerProps
>(function MenuContextTrigger(props, ref) {
  const { asChild: _asChild, ...rest } = props;
  return <span ref={ ref } { ...rest }/>;
});

// --- MenuTriggerItem ---

export interface MenuTriggerItemProps extends React.ComponentPropsWithoutRef<'div'> {
  readonly startIcon?: React.ReactNode;
}

export const MenuTriggerItem = React.forwardRef<
  HTMLDivElement,
  MenuTriggerItemProps
>(function MenuTriggerItem(props, ref) {
  const { startIcon, children, className, ...rest } = props;
  return (
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger
        ref={ ref }
        className={ cn(
          'relative flex cursor-pointer select-none items-center gap-2 rounded-md px-2 py-1.5 text-sm',
          'outline-none transition-colors',
          'data-[highlighted]:bg-[var(--color-popover-item-hover,rgba(0,0,0,0.04))]',
          className,
        ) }
        { ...rest }
      >
        { startIcon }
        <span className="flex-1">{ children }</span>
        <LuChevronRight className="h-4 w-4"/>
      </DropdownMenu.SubTrigger>
    </DropdownMenu.Sub>
  );
});
