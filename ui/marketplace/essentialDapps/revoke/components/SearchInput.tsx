import type { ChangeEvent, FormEvent } from 'react';
import { useCallback, useRef, useState } from 'react';

import { Input } from 'toolkit/chakra/input';
import { InputGroup } from 'toolkit/chakra/input-group';
import { ClearButton } from 'toolkit/components/buttons/ClearButton';
import IconSvg from 'ui/shared/IconSvg';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: (value: string) => Promise<void>;
};

export default function SearchInput({ value, onChange, onSubmit }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [ isLoading, setIsLoading ] = useState(false);

  const handleSubmit = useCallback(async(event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    await onSubmit(value);
    setIsLoading(false);
    inputRef.current?.blur();
  }, [ onSubmit, value ]);

  const handleValueChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;
    onChange(value);
  }, [ onChange ]);

  const handleFilterQueryClear = useCallback(() => {
    onChange('');
    inputRef?.current?.focus();
  }, [ onChange ]);

  const startElement = isLoading ? <div className="animate-spin rounded-full border-2 border-current border-t-transparent h-4 w-4"/> : <IconSvg className="w-5 h-5" name="search"/>;
  const endElement = <ClearButton onClick={ handleFilterQueryClear } visible={ value.length > 0 }/>;

  return (
    <form
      onSubmit={ handleSubmit }
      noValidate
      className="w-full"
    >
      <InputGroup
        startElement={ startElement }
        startElementProps={{ className: 'px-2' }}
        endElement={ endElement }
        endElementProps={{ className: 'w-8' }}
      >
        <Input
          ref={ inputRef }
          size="sm"
          value={ value }
          onChange={ handleValueChange }
          placeholder="Search accounts by address or domain..."
          className="border-2 text-ellipsis whitespace-nowrap"
        />
      </InputGroup>
    </form>
  );
}
