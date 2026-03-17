import * as RadixTooltip from '@radix-ui/react-tooltip';
import { useClickAway } from '@uidotdev/usehooks';
import * as React from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import { cn } from 'lib/utils/cn';

export interface TooltipProps {
  selected?: boolean;
  showArrow?: boolean;
  portalled?: boolean;
  portalRef?: React.RefObject<HTMLElement>;
  content: React.ReactNode;
  contentProps?: React.ComponentPropsWithoutRef<typeof RadixTooltip.Content>;
  triggerProps?: React.ComponentPropsWithoutRef<typeof RadixTooltip.Trigger>;
  disabled?: boolean;
  disableOnMobile?: boolean;
  children?: React.ReactNode;
  variant?: string;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: { open: boolean }) => void;
  closeDelay?: number;
  openDelay?: number;
  interactive?: boolean;
  lazyMount?: boolean;
  unmountOnExit?: boolean;
  positioning?: {
    placement?: 'top' | 'bottom' | 'left' | 'right' | 'top-start' | 'top-end' | 'bottom-start' | 'bottom-end' | 'left-start' | 'left-end' | 'right-start' | 'right-end';
    overflowPadding?: number;
    offset?: { mainAxis?: number; crossAxis?: number };
  };
  closeOnClick?: boolean;
  closeOnPointerDown?: boolean;
}

export const Tooltip = React.forwardRef<HTMLDivElement, TooltipProps>(
  function Tooltip(props, ref) {
    const {
      showArrow: showArrowProp,
      onOpenChange,
      variant,
      selected,
      children,
      disabled,
      disableOnMobile,
      portalled = true,
      content,
      contentProps,
      portalRef,
      defaultOpen = false,
      triggerProps,
      closeDelay = 100,
      openDelay = 100,
      interactive,
      positioning,
    } = props;

    const [ open, setOpen ] = React.useState<boolean>(defaultOpen);
    const timeoutRef = React.useRef<number | null>(null);

    const isMobile = useIsMobile();

    const handleOpenChange = React.useCallback((nextOpen: boolean) => {
      setOpen(nextOpen);
      onOpenChange?.({ open: nextOpen });
    }, [ onOpenChange ]);

    const handleOpenChangeManual = React.useCallback((nextOpen: boolean) => {
      timeoutRef.current && window.clearTimeout(timeoutRef.current);
      timeoutRef.current = window.setTimeout(() => {
        setOpen(nextOpen);
        onOpenChange?.({ open: nextOpen });
      }, nextOpen ? openDelay : closeDelay);
    }, [ closeDelay, openDelay, onOpenChange ]);

    const handleClickAway = React.useCallback(() => {
      handleOpenChangeManual(false);
    }, [ handleOpenChangeManual ]);

    const triggerRef = useClickAway<HTMLButtonElement>(handleClickAway);

    const handleTriggerClick = React.useCallback(() => {
      handleOpenChangeManual(!open);
    }, [ handleOpenChangeManual, open ]);

    const handleContentClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
      event.stopPropagation();

      if (interactive) {
        const closestLink = (event.target as HTMLElement)?.closest('a');
        if (closestLink) {
          handleOpenChangeManual(false);
        }
      }
    }, [ interactive, handleOpenChangeManual ]);

    React.useEffect(() => {
      return () => {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
      };
    }, []);

    if (disabled || (disableOnMobile && isMobile)) return children;

    const defaultShowArrow = variant === 'popover' ? false : true;
    const showArrow = showArrowProp !== undefined ? showArrowProp : defaultShowArrow;

    const placement = positioning?.placement ?? 'top';
    const side = placement.split('-')[0] as 'top' | 'bottom' | 'left' | 'right';
    const align = placement.includes('-') ? (placement.split('-')[1] as 'start' | 'end') : undefined;
    const sideOffset = positioning?.offset?.mainAxis ?? 4;

    const isPopover = variant === 'popover';

    return (
      <RadixTooltip.Provider delayDuration={ openDelay } skipDelayDuration={ 0 }>
        <RadixTooltip.Root
          open={ open }
          onOpenChange={ handleOpenChange }
          delayDuration={ config.app.isPw ? 10_000 : openDelay }
        >
          <RadixTooltip.Trigger
            ref={ open ? triggerRef : undefined }
            asChild
            onClick={ isMobile ? handleTriggerClick : undefined }
            { ...triggerProps }
          >
            { children }
          </RadixTooltip.Trigger>
          <RadixTooltip.Portal container={ portalled ? (portalRef?.current ?? undefined) : undefined }>
            <RadixTooltip.Content
              ref={ ref }
              side={ side }
              align={ align }
              sideOffset={ sideOffset }
              onClick={ interactive ? handleContentClick : undefined }
              className={ cn(
                'z-[9999] overflow-hidden rounded-lg px-3 py-2 text-sm',
                'animate-in fade-in-0 zoom-in-95',
                isPopover && 'bg-[var(--color-popover-bg)] text-[var(--color-text-primary)]',
                isPopover && 'shadow-[var(--shadow-popover)] border border-[var(--color-border-divider)] max-w-sm',
                !isPopover && 'bg-[var(--color-tooltip-bg)] text-[var(--color-tooltip-fg)] max-w-xs',
                contentProps?.className,
              ) }
              { ...(selected ? { 'data-selected': true } : {}) }
              { ...contentProps }
            >
              { showArrow && (
                <RadixTooltip.Arrow
                  className={ cn(
                    isPopover ? 'fill-[var(--color-popover-bg)]' : 'fill-[var(--color-tooltip-bg)]',
                  ) }
                />
              ) }
              { content }
            </RadixTooltip.Content>
          </RadixTooltip.Portal>
        </RadixTooltip.Root>
      </RadixTooltip.Provider>
    );
  },
);
