import React from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';

import AddButton from 'toolkit/components/buttons/AddButton';
import RemoveButton from 'toolkit/components/buttons/RemoveButton';
import { FormFieldAddress } from 'toolkit/components/forms/fields/FormFieldAddress';

const LIMIT = 20;

const PublicTagsSubmitFieldAddresses = () => {
  const { control, formState } = useFormContext<FormFields>();
  const { fields, insert, remove } = useFieldArray<FormFields, 'addresses'>({
    name: 'addresses',
    control,
  });

  const isDisabled = formState.isSubmitting;

  const handleAddFieldClick = React.useCallback((event: React.MouseEvent) => {
    const index = Number(event.currentTarget.getAttribute('data-index'));
    if (!Object.is(index, NaN)) {
      insert(index + 1, { hash: '' });
    }
  }, [ insert ]);

  const handleRemoveFieldClick = React.useCallback((event: React.MouseEvent) => {
    const index = Number(event.currentTarget.getAttribute('data-index'));
    if (!Object.is(index, NaN)) {
      remove(index);
    }
  }, [ remove ]);

  return (
    <>
      { fields.map((field, index) => {
        return (
          <React.Fragment key={ field.id }>
            <div className="col-span-1 lg:col-span-2">
              <FormFieldAddress<FormFields>
                name={ `addresses.${ index }.hash` }
                required
                placeholder="Smart contract / Address (0x...)"
              />
            </div>
            <div className="flex items-center gap-x-3 justify-end lg:justify-start">
              { fields.length < LIMIT && index === fields.length - 1 && (
                <AddButton
                  data-index={ index }
                  onClick={ handleAddFieldClick }
                  disabled={ isDisabled }
                />
              ) }
              { fields.length > 1 && (
                <RemoveButton
                  data-index={ index }
                  onClick={ handleRemoveFieldClick }
                  disabled={ isDisabled }
                />
              ) }
            </div>
          </React.Fragment>
        );
      }) }
    </>
  );
};

export default React.memo(PublicTagsSubmitFieldAddresses);
