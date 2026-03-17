import * as RadixSwitch from '@radix-ui/react-switch';
// chakra() HOC removed — pure Radix + Tailwind
import * as React from 'react';

import { cn } from 'lib/utils/cn';

const NOOP = () => { /* noop */ };

// ─── Size mappings ────────────────────────────────────────────────────
const SIZE_CLASSES = {
  sm: {
    root: 'h-4 w-7',
    thumb: 'h-3 w-3 data-[state=checked]:translate-x-3',
    label: 'text-xs',
  },
  md: {
    root: 'h-5 w-9',
    thumb: 'h-4 w-4 data-[state=checked]:translate-x-4',
    label: 'text-sm',
  },
  lg: {
    root: 'h-6 w-11',
    thumb: 'h-5 w-5 data-[state=checked]:translate-x-5',
    label: 'text-base',
  },
} as const;

// ─── Props ────────────────────────────────────────────────────────────
export interface SwitchProps extends Omit<React.ComponentPropsWithoutRef<'label'>, 'onChange' | 'dir'> {
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  labelProps?: React.ComponentPropsWithoutRef<'span'>;
  rootRef?: React.Ref<HTMLLabelElement>;
  trackLabel?: { on: React.ReactNode; off: React.ReactNode };
  thumbLabel?: { on: React.ReactNode; off: React.ReactNode };
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: ((details: { checked: boolean }) => void) | ((checked: boolean) => void);
  onChange?: React.FormEventHandler<HTMLLabelElement>;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  direction?: 'ltr' | 'rtl';
}

const SwitchBase = React.forwardRef<HTMLInputElement, SwitchProps>(
  function Switch(props, ref) {
    const {
      inputProps,
      children,
      rootRef,
      labelProps,
      trackLabel,
      thumbLabel,
      checked: checkedProp,
      defaultChecked,
      onCheckedChange,
      onChange,
      disabled = false,
      size = 'md',
      direction,
      className,
      ...rest
    } = props;

    const [ internalChecked, setInternalChecked ] = React.useState(defaultChecked ?? false);

    const isControlled = checkedProp !== undefined;
    const checkedState = isControlled ? checkedProp : internalChecked;

    const handleCheckedChange = React.useCallback(
      (nextChecked: boolean) => {
        if (!isControlled) {
          setInternalChecked(nextChecked);
        }

        if (onCheckedChange) {
          // Support both Chakra-style ({ checked }) and Radix-style (checked) signatures.
          // We call with a single object arg; if the consumer ignores it, that's fine.
          (onCheckedChange as (details: { checked: boolean }) => void)({ checked: nextChecked });
        }
      },
      [ isControlled, onCheckedChange ],
    );

    const sizeClasses = SIZE_CLASSES[size];
    const isRtl = direction === 'rtl';

    return (
      <label
        ref={ rootRef }
        className={ cn(
          'inline-flex items-center cursor-pointer select-none gap-2',
          isRtl && 'flex-row-reverse',
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        ) }
        onChange={ onChange }
        data-disabled={ disabled || undefined }
        { ...rest }
      >
        <RadixSwitch.Root
          checked={ checkedState }
          onCheckedChange={ handleCheckedChange }
          disabled={ disabled }
          className={ cn(
            'relative inline-flex shrink-0 items-center rounded-full',
            'bg-gray-300 dark:bg-gray-600',
            'data-[state=checked]:bg-blue-500',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
            'transition-colors duration-200',
            sizeClasses.root,
          ) }
        >
          { trackLabel && (
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white pointer-events-none">
              { checkedState ? trackLabel.on : trackLabel.off }
            </span>
          ) }
          <RadixSwitch.Thumb
            className={ cn(
              'block rounded-full bg-white shadow-sm',
              'transition-transform duration-200',
              'translate-x-0.5',
              sizeClasses.thumb,
            ) }
          >
            { thumbLabel && (
              <span className="flex items-center justify-center h-full w-full text-[8px]">
                { checkedState ? thumbLabel.on : thumbLabel.off }
              </span>
            ) }
          </RadixSwitch.Thumb>
        </RadixSwitch.Root>
        { /* Hidden native input for form compat and ref forwarding */ }
        <input
          ref={ ref }
          type="checkbox"
          className="sr-only"
          checked={ checkedState }
          disabled={ disabled }
          tabIndex={ -1 }
          aria-hidden
          onChange={ NOOP }
          { ...inputProps }
        />
        { children != null && (
          <span
            { ...labelProps }
            className={ cn(sizeClasses.label, labelProps?.className) }
          >
            { children }
          </span>
        ) }
      </label>
    );
  },
);

export const Switch = SwitchBase;
