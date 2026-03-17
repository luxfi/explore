import * as React from 'react';

import { cn } from 'lib/utils/cn';

export interface PinInputProps {
  readonly rootRef?: React.Ref<HTMLDivElement>;
  readonly count?: number;
  readonly inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  readonly attached?: boolean;
  readonly placeholder?: string;
  readonly value?: Array<string>;
  readonly onValueChange?: (details: { value: Array<string> }) => void;
  readonly onValueComplete?: (details: { value: Array<string> }) => void;
  readonly disabled?: boolean;
  readonly invalid?: boolean;
  readonly otp?: boolean;
  readonly name?: string;
  readonly bgColor?: string;
  readonly className?: string;
}

const INPUT_BASE = [
  'w-10 h-10',
  'text-center text-sm font-medium',
  'border-2 rounded-md',
  'outline-none appearance-none',
  'bg-[var(--color-input-bg)] text-[var(--color-input-fg)]',
  'border-[var(--color-input-border)]',
  'placeholder:text-[var(--color-input-placeholder)]',
  'hover:border-[var(--color-input-border-hover)]',
  'focus:border-[var(--color-input-border-focus)] focus:shadow-md',
  'disabled:opacity-40',
].join(' ');

const INPUT_FILLED = 'border-[var(--color-input-border)]';
const INPUT_INVALID = 'border-[var(--color-border-error)] hover:border-[var(--color-border-error)]';

export const PinInput = React.forwardRef<HTMLInputElement, PinInputProps>(
  function PinInput(props, ref) {
    const {
      count = 6,
      inputProps,
      rootRef,
      attached,
      placeholder = ' ',
      value: controlledValue,
      onValueChange,
      onValueComplete,
      disabled,
      invalid,
      otp,
      name,
      bgColor,
      className,
    } = props;

    const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

    const values = React.useMemo(
      () => controlledValue ?? Array.from<string>({ length: count }).fill(''),
      [ controlledValue, count ],
    );

    const updateValue = React.useCallback((index: number, char: string): void => {
      const next = [ ...values ];
      next[index] = char;
      onValueChange?.({ value: next });

      if (next.every((v) => v.length > 0)) {
        onValueComplete?.({ value: next });
      }
    }, [ values, onValueChange, onValueComplete ]);

    const focusInput = React.useCallback((index: number): void => {
      const clamped = Math.max(0, Math.min(index, count - 1));
      inputRefs.current[clamped]?.focus();
    }, [ count ]);

    const handleInput = React.useCallback((index: number, e: React.FormEvent<HTMLInputElement>): void => {
      const target = e.currentTarget;
      const char = target.value.slice(-1);
      updateValue(index, char);

      if (char && index < count - 1) {
        focusInput(index + 1);
      }
    }, [ count, updateValue, focusInput ]);

    const handleKeyDown = React.useCallback((index: number, e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Backspace') {
        if (values[index]) {
          updateValue(index, '');
        } else if (index > 0) {
          updateValue(index - 1, '');
          focusInput(index - 1);
        }
        e.preventDefault();
      } else if (e.key === 'ArrowLeft' && index > 0) {
        focusInput(index - 1);
        e.preventDefault();
      } else if (e.key === 'ArrowRight' && index < count - 1) {
        focusInput(index + 1);
        e.preventDefault();
      }
    }, [ count, values, updateValue, focusInput ]);

    const handlePaste = React.useCallback((e: React.ClipboardEvent<HTMLInputElement>): void => {
      e.preventDefault();
      const pasted = e.clipboardData.getData('text/plain').trim();
      if (!pasted) {
        return;
      }
      const chars = pasted.slice(0, count).split('');
      const next = [ ...values ];
      chars.forEach((char, i) => {
        next[i] = char;
      });
      onValueChange?.({ value: next });

      if (next.every((v) => v.length > 0)) {
        onValueComplete?.({ value: next });
      }

      focusInput(Math.min(chars.length, count - 1));
    }, [ count, values, onValueChange, onValueComplete, focusInput ]);

    const handleFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement>): void => {
      e.currentTarget.select();
    }, []);

    const handleNoop = React.useCallback((): void => { /* noop */ }, []);

    const setInputRef = React.useCallback((index: number) => (el: HTMLInputElement | null): void => {
      inputRefs.current[index] = el;
    }, []);

    const onInputAtIndex = React.useCallback((index: number) => (e: React.FormEvent<HTMLInputElement>): void => {
      handleInput(index, e);
    }, [ handleInput ]);

    const onKeyDownAtIndex = React.useCallback((index: number) => (e: React.KeyboardEvent<HTMLInputElement>): void => {
      handleKeyDown(index, e);
    }, [ handleKeyDown ]);

    const bgStyle = bgColor ? { backgroundColor: `var(--color-${ bgColor.replace(/\./g, '-') })` } : undefined;

    return (
      <div ref={ rootRef } className={ cn('inline-flex items-center', attached ? 'gap-0' : 'gap-2', className) }>
        { /* Hidden input for form submission */ }
        <input
          ref={ ref }
          type="hidden"
          name={ name }
          value={ values.join('') }
          { ...inputProps }
        />
        { Array.from({ length: count }).map((_, index) => (
          <input
            key={ index }
            ref={ setInputRef(index) }
            type="text"
            inputMode="numeric"
            autoComplete={ otp ? 'one-time-code' : 'off' }
            pattern="[0-9]*"
            maxLength={ 1 }
            placeholder={ placeholder }
            disabled={ disabled }
            aria-invalid={ invalid || undefined }
            value={ values[index] || '' }
            className={ cn(
              INPUT_BASE,
              values[index] && INPUT_FILLED,
              invalid && INPUT_INVALID,
              attached && index > 0 && '-ml-0.5',
            ) }
            style={ bgStyle }
            onInput={ onInputAtIndex(index) }
            onKeyDown={ onKeyDownAtIndex(index) }
            onPaste={ handlePaste }
            onFocus={ handleFocus }
            onChange={ handleNoop }
          />
        )) }
      </div>
    );
  },
);
