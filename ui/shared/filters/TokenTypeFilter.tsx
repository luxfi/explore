import React from 'react';

import type { NFTTokenType, TokenType } from 'types/api/token';
import type { ClusterChainConfig } from 'types/multichain';

import { getTokenTypes } from 'lib/token/tokenTypes';
import { Button } from '@luxfi/ui/button';
import { Checkbox, CheckboxGroup } from '@luxfi/ui/checkbox';

type Props<T extends TokenType | NFTTokenType> = {
  onChange: (nextValue: Array<T>) => void;
  defaultValue?: Array<T>;
  nftOnly: T extends NFTTokenType ? true : false;
  chainConfig?: Array<ClusterChainConfig['app_config']> | ClusterChainConfig['app_config'];
};
const TokenTypeFilter = <T extends TokenType | NFTTokenType>({ nftOnly, onChange, defaultValue, chainConfig }: Props<T>) => {
  const [ value, setValue ] = React.useState<Array<string>>(defaultValue ?? []);

  const handleReset = React.useCallback(() => {
    if (value.length === 0) {
      return;
    }
    setValue([]);
    onChange([]);
  }, [ onChange, setValue, value.length ]);

  const handleChange = React.useCallback((nextValue: Array<string>) => {
    setValue(nextValue as Array<T>);
    onChange(nextValue as Array<T>);
  }, [ onChange, setValue ]);

  const tokenTypes = React.useMemo(() => {
    return getTokenTypes(nftOnly, chainConfig);
  }, [ chainConfig, nftOnly ]);

  return (
    <>
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-[var(--color-text-secondary)]">Type</span>
        <Button
          variant="link"
          onClick={ handleReset }
          disabled={ value.length === 0 }
          className="text-sm"
        >
          Reset
        </Button>
      </div>
      <fieldset>
        <CheckboxGroup defaultValue={ defaultValue } onValueChange={ handleChange } value={ value } name="token_type">
          <div>
            { Object.keys(tokenTypes).map((id) => (
              <Checkbox key={ id } value={ id }>
                { tokenTypes[id as keyof typeof tokenTypes] }
              </Checkbox>
            )) }
          </div>
        </CheckboxGroup>
      </fieldset>
    </>
  );
};

export default TokenTypeFilter;
