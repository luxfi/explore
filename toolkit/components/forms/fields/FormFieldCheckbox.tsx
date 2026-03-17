import React from 'react';
import { useController, useFormContext, type FieldValues, type Path } from 'react-hook-form';

import type { FormFieldPropsBase } from './types';

import { Checkbox } from '../../../chakra/checkbox';
import type { CheckboxProps } from '../../../chakra/checkbox';

export interface FormFieldCheckboxProps<
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
> extends Pick<FormFieldPropsBase<FormFields, Name>, 'rules' | 'name' | 'onChange' | 'controllerProps'> {
  label: string;
  readOnly?: boolean;
  checked?: boolean | 'indeterminate';
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
}

const FormFieldCheckboxContent = <
  FormFields extends FieldValues,
  Name extends Path<FormFields> = Path<FormFields>,
>({
  name,
  label,
  rules,
  onChange,
  readOnly,
  controllerProps,
  ...rest
}: FormFieldCheckboxProps<FormFields, Name>) => {
  const { control } = useFormContext<FormFields>();
  const { field, formState } = useController<FormFields, typeof name>({
    control,
    name,
    rules,
    ...controllerProps,
  });

  const isDisabled = formState.isSubmitting;

  const handleChange: typeof field.onChange = React.useCallback(({ checked }: { checked: boolean }) => {
    field.onChange(checked);
    onChange?.();
  }, [ field, onChange ]);

  return (
    <Checkbox
      ref={ field.ref }
      checked={ field.value }
      onCheckedChange={ handleChange }
      size="md"
      disabled={ isDisabled }
      { ...rest }
    >
      { label }
    </Checkbox>
  );
};

export const FormFieldCheckbox = React.memo(FormFieldCheckboxContent) as typeof FormFieldCheckboxContent;
