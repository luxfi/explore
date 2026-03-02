import React from 'react';

import useIsInitialLoading from 'lib/hooks/useIsInitialLoading';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';

interface Props {
  value: string | undefined;
  isLoading: boolean;
  type: 'transaction' | 'transfer';
}

const ListCounterText = ({ isLoading, value, type }: Props) => {
  const isInitialLoading = useIsInitialLoading(isLoading);

  if (value === undefined || value === '0') {
    return null;
  }

  const valueNum = Number(value);
  const text = `A total of ${ valueNum.toLocaleString() } ${ valueNum === 1 ? type : `${ type }s` } found`;

  return (
    <TruncatedText
      text={ text }
      loading={ isInitialLoading }
      className="text-base lg:text-sm text-[var(--color-text-secondary)] ml-0 lg:ml-4 mr-0 lg:mr-8 mb-4 lg:mb-0"
    />
  );
};

export default React.memo(ListCounterText);
