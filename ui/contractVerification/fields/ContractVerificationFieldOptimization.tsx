import React from 'react';

import type { FormFields } from '../types';

import { FormFieldCheckbox } from 'toolkit/components/forms/fields/FormFieldCheckbox';
import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

const ContractVerificationFieldOptimization = () => {
  const [ isEnabled, setIsEnabled ] = React.useState(true);

  const handleCheckboxChange = React.useCallback(() => {
    setIsEnabled(prev => !prev);
  }, []);

  return (
    <ContractVerificationFormRow>
      <div columnGap={ 5 } h={{ base: 'auto', lg: '32px' }}>
        <FormFieldCheckbox<FormFields, 'is_optimization_enabled'>
          name="is_optimization_enabled"
          label="Optimization enabled"
          onChange={ handleCheckboxChange }
          className="shrink-0"
        />
        { isEnabled && (
          <FormFieldText<FormFields, 'optimization_runs'>
            name="optimization_runs"
            required
            placeholder="Optimization runs"
            inputProps={{
              type: 'number',
            }}
            className="min-w-[100px] max-w-[200px] shrink text-sm"
          />
        ) }
      </div>
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldOptimization);
