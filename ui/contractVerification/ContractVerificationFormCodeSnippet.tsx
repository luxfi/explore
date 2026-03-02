import React from 'react';

interface Props {
  code: string;
}

const ContractVerificationFormCodeSnippet = ({ code }: Props) => {
  return (
    <code className="whitespace-pre-wrap break-all p-2 rounded">
      { code }
    </code>
  );
};

export default React.memo(ContractVerificationFormCodeSnippet);
