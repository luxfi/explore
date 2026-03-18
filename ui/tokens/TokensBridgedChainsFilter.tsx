import React from 'react';

import config from 'configs/app';
import { Button } from 'toolkit/chakra/button';
import { Checkbox, CheckboxGroup } from 'toolkit/chakra/checkbox';

const feature = config.features.bridgedTokens;

interface Props {
  onChange: (nextValue: Array<string>) => void;
  defaultValue?: Array<string>;
}

const TokensBridgedChainsFilter = ({ onChange, defaultValue }: Props) => {
  const [ value, setValue ] = React.useState<Array<string>>(defaultValue ?? []);

  const handleReset = React.useCallback(() => {
    if (value.length === 0) {
      return;
    }
    setValue([]);
    onChange([]);
  }, [ onChange, value ]);

  const handleChange = React.useCallback((nextValue: Array<string>) => {
    setValue(nextValue);
    onChange(nextValue);
  }, [ onChange ]);

  if (!feature.isEnabled) {
    return null;
  }

  return (
    <>
      <div className="flex justify-between text-sm">
        <span className="font-semibold text-[var(--color-text-secondary)]">Show bridged tokens from</span>
        <Button
          variant="link"
          onClick={ handleReset }
          disabled={ value.length === 0 }
          className="text-sm"
        >
          Reset
        </Button>
      </div>
      <CheckboxGroup defaultValue={ defaultValue } onValueChange={ handleChange } value={ value } name="bridged_token_chain">
        { feature.chains.map(({ title, id, short_title: shortTitle }) => (
          <Checkbox key={ id } value={ id } className="whitespace-pre-wrap">
            <span>{ title }</span>
            <span className="text-[var(--color-text-secondary)]"> ({ shortTitle })</span>
          </Checkbox>
        )) }
      </CheckboxGroup>
    </>
  );
};

export default React.memo(TokensBridgedChainsFilter);
