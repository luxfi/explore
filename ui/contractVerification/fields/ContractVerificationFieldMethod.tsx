import React from 'react';

import type { FormFields } from '../types';
import type { SmartContractVerificationMethod, SmartContractVerificationConfig } from 'types/client/contract';

import { Heading } from 'toolkit/chakra/heading';
import { Link } from 'toolkit/chakra/link';
import { createListCollection } from 'toolkit/chakra/select';
import type { SelectOption } from 'toolkit/chakra/select';
import { FormFieldSelect } from 'toolkit/components/forms/fields/FormFieldSelect';
import { Hint } from 'toolkit/components/Hint/Hint';
import { nbsp } from 'toolkit/utils/htmlEntities';

import { METHOD_LABELS } from '../utils';

interface Props {
  methods: SmartContractVerificationConfig['verification_options'];
}

const ContractVerificationFieldMethod = ({ methods }: Props) => {
  const collection = React.useMemo(() => createListCollection<SelectOption>({
    items: methods.map((method) => ({
      value: method,
      label: METHOD_LABELS[method],
    })),
  }), [ methods ]);

  const renderPopoverListItem = React.useCallback((method: SmartContractVerificationMethod) => {
    switch (method) {
      case 'flattened-code':
        return <li key={ method }>Verification through a single file.</li>;
      case 'multi-part':
        return <li key={ method }>Verification of multi-part Solidity files.</li>;
      case 'sourcify':
        return <li key={ method }>Verification through <Link href="https://sourcify.dev/" external noIcon className="dark">Sourcify</Link>.</li>;
      case 'standard-input':
        return (
          <li key={ method }>
            <span>Verification using </span>
            <Link
              href="https://docs.soliditylang.org/en/latest/using-the-compiler.html#input-description"
              external noIcon
              className="dark"
            >
              Standard input JSON
            </Link>
            <span> file.</span>
          </li>
        );
      case 'vyper-code':
        return <li key={ method }>Verification of Vyper contract.</li>;
      case 'vyper-multi-part':
        return <li key={ method }>Verification of multi-part Vyper files.</li>;
      case 'vyper-standard-input':
        return (
          <li key={ method }>
            <span>Verification of Vyper contract using </span>
            <Link
              href="https://docs.vyperlang.org/en/stable/compiling-a-contract.html#compiler-input-and-output-json-description"
              external noIcon
              className="dark"
            >
              Standard input JSON
            </Link>
            <span> file.</span>
          </li>
        );
      case 'solidity-hardhat':
        return <li key={ method }>Verification through Hardhat plugin.</li>;
      case 'solidity-foundry':
        return <li key={ method }>Verification through Foundry.</li>;
      case 'stylus-github-repository':
        return <li key={ method }>Verification of Stylus contract via GitHub repository.</li>;
    }
  }, []);

  const tooltipContent = (
    <div>
      <span>Currently, this explorer supports { methods.length } methods:</span>
      <ol className="pl-5 list-decimal">
        { methods.map(renderPopoverListItem) }
      </ol>
    </div>
  );

  return (
    <>
      <Heading level="2" className="mt-10 lg:mt-6 lg:col-[1/3]">
        Currently, this explorer supports { methods.length }{ nbsp }contract verification methods
        <Hint
          label={ tooltipContent }
          tooltipProps={{ interactive: true, contentProps: { className: 'text-left' } }}
          className="ml-1"
        />
      </Heading>
      <FormFieldSelect<FormFields, 'method'>
        name="method"
        placeholder="Verification method (compiler type)"
        collection={ collection }
        required
        readOnly={ collection.items.length === 1 }
      />
    </>
  );
};

export default React.memo(ContractVerificationFieldMethod);
