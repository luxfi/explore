import React from 'react';

import type { FormFields } from '../types';

import { FormFieldText } from 'toolkit/components/forms/fields/FormFieldText';

import ContractVerificationFormRow from '../ContractVerificationFormRow';

interface Props {
  hint?: string;
}

const ContractVerificationFieldName = ({ hint }: Props) => {
  return (
    <ContractVerificationFormRow>
      <FormFieldText<FormFields>
        name="name"
        required
        placeholder="Contract name"
        rules={{ maxLength: 255 }}
      />
      { hint ? <span>{ hint }</span> : (
        <>
          <span>Must match the name specified in the code. For example, in </span>
          <code className="text-[var(--color-text-secondary)]">{ `contract MyContract {..}` }</code>
          <span>. <span fontWeight={ 600 }>MyContract</span> is the contract name.</span>
        </>
      ) }
    </ContractVerificationFormRow>
  );
};

export default React.memo(ContractVerificationFieldName);
