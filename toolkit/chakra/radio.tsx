import * as RadixRadioGroup from '@radix-ui/react-radio-group';
// chakra() HOC removed — pure Radix + Tailwind
import * as React from 'react';

import { cn } from 'lib/utils/cn';

// ─── Size classes ───────────────────────────────────────────────────
const SIZE_CLASSES = {
  xs: {
    root: 'gap-1.5',
    control: 'h-3 w-3',
    indicator: 'h-1.5 w-1.5',
    label: 'text-xs',
  },
  sm: {
    root: 'gap-1.5',
    control: 'h-3.5 w-3.5',
    indicator: 'h-1.5 w-1.5',
    label: 'text-xs',
  },
  md: {
    root: 'gap-2',
    control: 'h-4 w-4',
    indicator: 'h-2 w-2',
    label: 'text-sm',
  },
  lg: {
    root: 'gap-2.5',
    control: 'h-5 w-5',
    indicator: 'h-2.5 w-2.5',
    label: 'text-base',
  },
} as const;

type RadioSize = keyof typeof SIZE_CLASSES;

// ─── Size context ───────────────────────────────────────────────────
const RadioSizeContext = React.createContext<RadioSize>('md');

// ─── RadioGroup ─────────────────────────────────────────────────────
export interface RadioGroupProps extends Omit<React.ComponentPropsWithoutRef<'div'>, 'defaultValue'> {
  name?: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  orientation?: 'horizontal' | 'vertical';
  loop?: boolean;
  defaultValue?: string;
  value?: string | null;
  onValueChange?: (details: { value: string | null }) => void;
  size?: RadioSize;
}

const RadioGroupBase = React.forwardRef<HTMLDivElement, RadioGroupProps>(
  function RadioGroup(props, ref) {
    const {
      children,
      name,
      required,
      disabled = false,
      readOnly = false,
      orientation = 'vertical',
      loop = true,
      defaultValue,
      value,
      onValueChange,
      size = 'md',
      className,
      ...rest
    } = props;

    const handleValueChange = React.useCallback(
      (nextValue: string) => {
        if (readOnly) return;
        onValueChange?.({ value: nextValue });
      },
      [ readOnly, onValueChange ],
    );

    return (
      <RadioSizeContext.Provider value={ size }>
        <RadixRadioGroup.Root
          ref={ ref }
          name={ name }
          required={ required }
          disabled={ disabled || readOnly }
          orientation={ orientation }
          loop={ loop }
          defaultValue={ defaultValue }
          value={ value ?? undefined }
          onValueChange={ handleValueChange }
          className={ cn(
            'flex',
            orientation === 'vertical' ? 'flex-col gap-3' : 'flex-row gap-6',
            className,
          ) }
          { ...rest }
        >
          { children }
        </RadixRadioGroup.Root>
      </RadioSizeContext.Provider>
    );
  },
);

export const RadioGroup = RadioGroupBase;

const NOOP = () => { /* noop */ };

// ─── Radio ──────────────────────────────────────────────────────────
export interface RadioProps extends Omit<React.ComponentPropsWithoutRef<'label'>, 'onChange'> {
  rootRef?: React.Ref<HTMLLabelElement>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  value: string;
  disabled?: boolean;
}

const RadioBase = React.forwardRef<HTMLInputElement, RadioProps>(
  function Radio(props, ref) {
    const { children, inputProps, rootRef, value, disabled, className, ...rest } = props;
    const size = React.useContext(RadioSizeContext);
    const sizeClasses = SIZE_CLASSES[size];

    return (
      <label
        ref={ rootRef }
        className={ cn(
          'inline-flex items-center cursor-pointer select-none',
          sizeClasses.root,
          disabled && 'opacity-50 cursor-not-allowed',
          className,
        ) }
        data-disabled={ disabled || undefined }
        { ...rest }
      >
        <RadixRadioGroup.Item
          value={ value }
          disabled={ disabled }
          className={ cn(
            'inline-flex items-center justify-center shrink-0 rounded-full',
            'border-2 border-current/30',
            'data-[state=checked]:border-blue-500',
            'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500',
            'transition-colors duration-150',
            sizeClasses.control,
          ) }
        >
          <RadixRadioGroup.Indicator
            className={ cn(
              'block rounded-full bg-blue-500',
              sizeClasses.indicator,
            ) }
          />
        </RadixRadioGroup.Item>
        { /* Hidden native input for form compatibility and ref forwarding */ }
        <input
          ref={ ref }
          type="radio"
          className="sr-only"
          value={ value }
          disabled={ disabled }
          tabIndex={ -1 }
          aria-hidden
          onChange={ NOOP }
          { ...inputProps }
        />
        { children != null && (
          <span className={ sizeClasses.label }>{ children }</span>
        ) }
      </label>
    );
  },
);

export const Radio = RadioBase;
