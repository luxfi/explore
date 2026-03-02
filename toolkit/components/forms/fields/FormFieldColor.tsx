import React from 'react';
import type { FieldValues, Path } from 'react-hook-form';
import { useController, useFormContext } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';

import { Field } from '@luxfi/ui/field';
import type { InputProps } from '@luxfi/ui/input';
import { Input } from '@luxfi/ui/input';
import { InputGroup } from '@luxfi/ui/input-group';
import { getFormFieldErrorText } from '../utils/getFormFieldErrorText';
import { colorValidator } from '../validators/color';

export interface FormFieldColorProps<
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
> extends FormFieldPropsBase<FormFields, Name> {
  sampleDefaultBgColor?: string;
}

const FormFieldColorContent = <
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
>({
  name,
  placeholder,
  rules,
  onBlur,
  group,
  inputProps,
  size = 'lg',
  disabled,
  sampleDefaultBgColor,
  controllerProps,
  ...restProps
}: FormFieldColorProps<FormFields, Name>) => {
  const { control } = useFormContext<FormFields>();
  const { field, fieldState, formState } = useController<FormFields, typeof name>({
    control,
    name,
    rules: {
      ...rules,
      required: restProps.required,
      validate: colorValidator,
      maxLength: 7,
    },
    ...controllerProps,
  });

  const [ value, setValue ] = React.useState('');

  const handleChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = (() => {
      const value = event.target.value;
      if (value) {
        if (value.length === 1 && value[0] !== '#') {
          return `#${ value }`;
        }
      }
      return value;
    })();
    setValue(nextValue);
    field.onChange(nextValue);
  }, [ field ]);

  const handleBlur = React.useCallback(() => {
    field.onBlur();
    onBlur?.();
  }, [ field, onBlur ]);

  const endElement = (
    <div
      className="w-[30px] h-[30px] rounded-full border border-gray-300 mx-[15px] shrink-0"
      style={{
        backgroundColor: field.value && colorValidator(field.value) === true ? field.value : (sampleDefaultBgColor || undefined),
      }}
    />
  );

  return (
    <Field
      label={ placeholder }
      errorText={ getFormFieldErrorText(fieldState.error) }
      invalid={ Boolean(fieldState.error) }
      disabled={ formState.isSubmitting || disabled }
      size={ size }
      floating
      { ...restProps }
    >
      <InputGroup
        { ...group }
        endElement={ endElement }
      >
        <Input
          { ...field }
          autoComplete="off"
          onBlur={ handleBlur }
          onChange={ handleChange }
          value={ value }
          { ...inputProps as InputProps }
        />
      </InputGroup>
    </Field>
  );
};

export const FormFieldColor = React.memo(FormFieldColorContent) as typeof FormFieldColorContent;
