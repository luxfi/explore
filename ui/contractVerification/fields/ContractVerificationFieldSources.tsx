import React from 'react';
import type { ControllerRenderProps, FieldPathValue, ValidateResult } from 'react-hook-form';
import { Controller, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import { Button } from 'toolkit/chakra/button';
import { FormFieldError } from 'toolkit/components/forms/components/FormFieldError';
import { DragAndDropArea } from 'toolkit/components/forms/inputs/file/DragAndDropArea';
import { FileInput } from 'toolkit/components/forms/inputs/file/FileInput';
import { FileSnippet } from 'toolkit/components/forms/inputs/file/FileSnippet';
import { Mb } from 'toolkit/utils/consts';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

type FileTypes = '.sol' | '.yul' | '.json' | '.vy';

interface Props {
  name?: 'sources' | 'interfaces';
  fileTypes: Array<FileTypes>;
  fullFilePath?: boolean;
  multiple?: boolean;
  required?: boolean;
  title: string;
  hint: string | React.ReactNode;
}

const ContractVerificationFieldSources = ({ fileTypes, multiple, required, title, hint, name = 'sources', fullFilePath }: Props) => {
  const { setValue, getValues, control, formState, clearErrors } = useFormContext<FormFields>();

  const error = (() => {
    if (name === 'sources' && 'sources' in formState.errors) {
      return formState.errors.sources;
    }

    if (name === 'interfaces' && 'interfaces' in formState.errors) {
      return formState.errors.interfaces;
    }
  })();
  const commonError = !error?.type?.startsWith('file_') ? error : undefined;
  const fileError = error?.type?.startsWith('file_') ? error : undefined;

  const handleFileRemove = React.useCallback((index?: number) => {
    if (index === undefined) {
      return;
    }

    const value = getValues(name).slice();
    value.splice(index, 1);
    setValue(name, value);
    clearErrors(name);

  }, [ getValues, name, setValue, clearErrors ]);

  const renderUploadButton = React.useCallback(() => {
    return (
      <div className="flex gap-3">
        <span className="font-medium">{ title }</span>
        <Button size="sm" variant="outline">
          Drop file{ multiple ? 's' : '' } or click here
        </Button>
      </div>
    );
  }, [ multiple, title ]);

  const renderFiles = React.useCallback((files: Array<File>) => {
    const errorList = fileError?.message?.split(';');

    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 w-full">
        { files.map((file, index) => (
          <div key={ file.name + file.lastModified + index }>
            <FileSnippet
              file={ file }
              className="max-w-none"
              onRemove={ handleFileRemove }
              index={ index }
              isDisabled={ formState.isSubmitting }
              error={ errorList?.[index] }
            />
          </div>
        )) }
      </div>
    );
  }, [ formState.isSubmitting, handleFileRemove, fileError ]);

  const renderControl = React.useCallback(({ field }: { field: ControllerRenderProps<FormFields, typeof name> }) => {
    const hasValue = field.value && field.value.length > 0;

    const errorElement = (() => {
      if (commonError?.type === 'required') {
        return <FormFieldError message="Field is required"/>;
      }

      if (commonError?.message) {
        return <FormFieldError message={ commonError.message }/>;
      }

      return null;
    })();

    return (
      <>
        <FileInput<FormFields, typeof name> accept={ fileTypes.join(',') } multiple={ multiple } field={ field }>
          { ({ onChange }) => (
            <div className="flex flex-col items-start gap-y-2 w-full">
              <DragAndDropArea
                onDrop={ onChange }
                fullFilePath={ fullFilePath }
                className="p-3 lg:p-6"
                isDisabled={ formState.isSubmitting }
                isInvalid={ Boolean(error) }
              >
                { hasValue ? renderFiles(field.value) : renderUploadButton() }
              </DragAndDropArea>
            </div>
          ) }
        </FileInput>
        { errorElement }
      </>
    );
  }, [ fileTypes, multiple, commonError?.type, commonError?.message, fullFilePath, formState.isSubmitting, error, renderFiles, renderUploadButton ]);

  const validateFileType = React.useCallback(async(value: FieldPathValue<FormFields, typeof name>): Promise<ValidateResult> => {
    if (Array.isArray(value)) {
      const errorText = `Wrong file type. Allowed files types are ${ fileTypes.join(',') }.`;
      const errors = value.map(({ name }) => fileTypes.some((ext) => name.endsWith(ext)) ? '' : errorText);
      if (errors.some((item) => item !== '')) {
        return errors.join(';');
      }
    }
    return true;
  }, [ fileTypes ]);

  const validateFileSize = React.useCallback(async(value: FieldPathValue<FormFields, typeof name>): Promise<ValidateResult> => {
    if (Array.isArray(value)) {
      const FILE_SIZE_LIMIT = 20 * Mb;
      const errors = value.map(({ size }) => size > FILE_SIZE_LIMIT ? 'File is too big. Maximum size is 20 Mb.' : '');
      if (errors.some((item) => item !== '')) {
        return errors.join(';');
      }
    }
    return true;
  }, []);

  const validateQuantity = React.useCallback(async(value: FieldPathValue<FormFields, typeof name>): Promise<ValidateResult> => {
    if (!multiple && Array.isArray(value) && value.length > 1) {
      return 'You can upload only one file';
    }

    return true;
  }, [ multiple ]);

  const rules = React.useMemo(() => ({
    required,
    validate: {
      file_type: validateFileType,
      file_size: validateFileSize,
      quantity: validateQuantity,
    },
  }), [ validateFileSize, validateFileType, validateQuantity, required ]);

  return (
    <ContractVerificationFormRow>
      <Controller
        name={ name }
        control={ control }
        render={ renderControl }
        rules={ rules }
      />
      { hint ? <span>{ hint }</span> : null }
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldSources);
