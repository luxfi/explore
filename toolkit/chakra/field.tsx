import * as LabelPrimitive from '@radix-ui/react-label';
import * as React from 'react';

import { cn } from 'lib/utils/cn';

import getComponentDisplayName from '../utils/getComponentDisplayName';
import { space } from '../utils/htmlEntities';
import type { InputProps } from './input';
import type { InputGroupProps } from './input-group';

export interface FieldProps {
  readonly label?: React.ReactNode;
  readonly helperText?: React.ReactNode;
  readonly errorText?: React.ReactNode;
  readonly optionalText?: React.ReactNode;
  readonly children: React.ReactElement<InputProps> | React.ReactElement<InputGroupProps>;
  readonly size?: 'sm' | 'md' | 'lg' | '2xl';
  readonly required?: boolean;
  readonly disabled?: boolean;
  readonly readOnly?: boolean;
  readonly invalid?: boolean;
  readonly floating?: boolean;
  readonly bgColor?: string | Record<string, string>;
  readonly id?: string;
  readonly className?: string;
  readonly style?: React.CSSProperties;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  function Field(props, ref) {
    const {
      label,
      children,
      helperText,
      errorText,
      optionalText,
      size,
      required,
      disabled,
      readOnly,
      invalid,
      floating,
      bgColor: _bgColor,
      id,
      className,
      style,
    } = props;

    // A floating field cannot be without a label.
    if (floating && label) {
      const injectedProps = {
        className: 'peer',
        placeholder: ' ',
        size,
        floating,
        disabled,
        readOnly,
      };

      const labelElement = (
        <LabelPrimitive.Root
          className={ cn(
            'absolute left-3 top-1/2 -translate-y-1/2',
            'text-[var(--color-input-placeholder,theme(colors.gray.400))]',
            'pointer-events-none select-none',
            'origin-top-left transition-all duration-150',
            'peer-focus:top-1 peer-focus:translate-y-0 peer-focus:scale-75',
            'peer-[:not(:placeholder-shown)]:top-1 peer-[:not(:placeholder-shown)]:translate-y-0 peer-[:not(:placeholder-shown)]:scale-75',
          ) }
          htmlFor={ id }
        >
          { label }
          { required ? (
            <span className="ml-0.5 text-[var(--color-fg-error,theme(colors.red.500))]" aria-hidden="true">*</span>
          ) : optionalText ? (
            <span className="ml-1 text-[var(--color-text-secondary,theme(colors.gray.400))] text-sm">{ optionalText }</span>
          ) : null }
          { errorText && (
            <span className="ml-0.5 text-[var(--color-fg-error,theme(colors.red.500))] text-sm">
              -{ space }{ errorText }
            </span>
          ) }
        </LabelPrimitive.Root>
      );

      const helperTextElement = helperText ? (
        <p className="mt-1.5 text-xs text-[var(--color-text-secondary,theme(colors.gray.400))]">
          { helperText }
        </p>
      ) : null;

      const child = React.Children.only<React.ReactElement<InputProps | InputGroupProps>>(children);
      const isInputGroup = getComponentDisplayName(child.type) === 'InputGroup';

      if (isInputGroup) {
        const inputElement = React.cloneElement(
          React.Children.only<React.ReactElement<InputProps>>(child.props.children as React.ReactElement<InputProps>),
          injectedProps,
        );

        const groupInputElement = React.cloneElement(child,
          {},
          inputElement,
          labelElement,
        );

        return (
          <div
            ref={ ref }
            id={ id }
            className={ cn('relative w-full', className) }
            style={ style }
            data-disabled={ disabled || undefined }
            data-readonly={ readOnly || undefined }
            data-invalid={ invalid || undefined }
          >
            { groupInputElement }
            { helperTextElement }
          </div>
        );
      }

      const inputElement = React.cloneElement(child, injectedProps);

      return (
        <div
          ref={ ref }
          id={ id }
          className={ cn('relative w-full', className) }
          style={ style }
          data-disabled={ disabled || undefined }
          data-readonly={ readOnly || undefined }
          data-invalid={ invalid || undefined }
        >
          { inputElement }
          { labelElement }
          { helperTextElement }
        </div>
      );
    }

    // Non-floating: standard field layout
    const injectedProps = {
      size,
    };
    const child = React.Children.only<React.ReactElement<InputProps | InputGroupProps>>(children);
    const clonedChild = React.cloneElement(child, injectedProps);

    return (
      <div
        ref={ ref }
        id={ id }
        className={ cn('flex flex-col gap-1', className) }
        style={ style }
        data-disabled={ disabled || undefined }
        data-readonly={ readOnly || undefined }
        data-invalid={ invalid || undefined }
      >
        { label && (
          <LabelPrimitive.Root
            className={ cn(
              'text-sm font-medium text-[var(--color-field-label,theme(colors.gray.700))]',
              'dark:text-[var(--color-field-label,theme(colors.gray.300))]',
              disabled && 'opacity-40',
            ) }
            htmlFor={ id }
          >
            { label }
            { required ? (
              <span className="ml-0.5 text-[var(--color-fg-error,theme(colors.red.500))]" aria-hidden="true">*</span>
            ) : optionalText ? (
              <span className="ml-1 text-[var(--color-text-secondary,theme(colors.gray.400))] text-sm font-normal">{ optionalText }</span>
            ) : null }
          </LabelPrimitive.Root>
        ) }
        { clonedChild }
        { helperText && (
          <p className="text-xs text-[var(--color-text-secondary,theme(colors.gray.400))]">
            { helperText }
          </p>
        ) }
        { errorText && (
          <p className="text-xs text-[var(--color-fg-error,theme(colors.red.500))]">
            { errorText }
          </p>
        ) }
      </div>
    );
  },
);
