import React from 'react';
import { useFormContext } from 'react-hook-form';

import type { FormFields } from '../types';
import type { SmartContractVerificationConfig } from 'types/client/contract';

import config from 'configs/app';
import { Link } from 'toolkit/next/link';

import ContractVerificationFormCodeSnippet from '../ContractVerificationFormCodeSnippet';
import ContractVerificationFormRow from '../ContractVerificationFormRow';
import ContractVerificationMethod from '../ContractVerificationMethod';

const ContractVerificationSolidityHardhat = ({ config: formConfig }: { config: SmartContractVerificationConfig }) => {
  const chainNameSlug = config.chain.name?.toLowerCase().split(' ').join('-');
  const { watch } = useFormContext<FormFields>();
  const address = watch('address');

  const latestSolidityVersion = formConfig.solidity_compiler_versions.find((version) => !version.includes('nightly'))?.split('+')[0];

  const firstCodeSnippet = `const config: HardhatUserConfig = {
  solidity: "${ latestSolidityVersion || '0.8.24' }", // replace if necessary
  networks: {
    '${ chainNameSlug }': {
      url: '${ config.chain.rpcUrls[0] || (config.apis.general ? `${ config.apis.general.endpoint }${ config.apis.general.basePath ?? '' }/api/eth-rpc` : '') }'
    },
  },
  etherscan: {
    apiKey: {
      '${ chainNameSlug }': 'empty'
    },
    customChains: [
      {
        network: "${ chainNameSlug }",
        chainId: ${ config.chain.id },
        urls: {
          apiURL: "${ config.apis.general ? `${ config.apis.general.endpoint }${ config.apis.general.basePath ?? '' }/api` : '' }",
          browserURL: "${ config.app.baseUrl }"
        }
      }
    ]
  }
};`;

  const secondCodeSnippet = `npx hardhat verify \\
  --network ${ chainNameSlug } \\
  ${ address || '<address>' } \\
  [...constructorArgs]`;

  return (
    <ContractVerificationMethod title="Contract verification via Solidity Hardhat plugin">
      <ContractVerificationFormRow>
        <div className="flex flex-col gap-y-3">
          <ContractVerificationFormCodeSnippet code={ firstCodeSnippet }/>
          <ContractVerificationFormCodeSnippet code={ secondCodeSnippet }/>
        </div>
        <div className="whitespace-pre-wrap">
          <span>Full tutorial about contract verification via Hardhat is available </span>
          <Link href="https://docs.blockscout.com/devs/verification/hardhat-verification-plugin" external>
            here
          </Link>
        </div>
      </ContractVerificationFormRow>
    </ContractVerificationMethod>
  );
};

export default React.memo(ContractVerificationSolidityHardhat);
