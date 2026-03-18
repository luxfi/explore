import React from 'react';

import { cn } from 'lib/utils/cn';
import { Button } from 'toolkit/chakra/button';
import { IconButton } from 'toolkit/chakra/icon-button';
import { Input } from 'toolkit/chakra/input';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from 'toolkit/chakra/popover';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import { times } from 'toolkit/utils/htmlEntities';
import IconSvg from 'ui/shared/IconSvg';

interface Props {
  onClick: (power: number) => void;
  isDisabled?: boolean;
  initialValue: number;
  onChange: (power: number) => void;
}

const ContractMethodMultiplyButton = ({ onClick, isDisabled, initialValue, onChange }: Props) => {
  const [ selectedOption, setSelectedOption ] = React.useState<number | undefined>(initialValue);
  const [ customValue, setCustomValue ] = React.useState<number>();
  const { open, onOpenChange } = useDisclosure();

  const handleOptionClick = React.useCallback((event: React.MouseEvent) => {
    const id = Number((event.currentTarget as HTMLDivElement).getAttribute('data-id'));
    if (!Object.is(id, NaN)) {
      setSelectedOption((prev) => prev === id ? undefined : id);
      setCustomValue(undefined);
      onOpenChange({ open: false });
      onChange(id);
    }
  }, [ onOpenChange, onChange ]);

  const handleInputChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    setCustomValue(value);
    setSelectedOption(undefined);
    onChange(value);
  }, [ onChange ]);

  const value = selectedOption || customValue;

  const handleButtonClick = React.useCallback(() => {
    value && onClick(value);
  }, [ onClick, value ]);

  return (
    <>
      { Boolean(value) && (
        <Button
          className="px-1 text-base font-medium ml-1 inline-flex rounded-r-none"
          size="xs"
          variant="subtle"
          onClick={ handleButtonClick }
          disabled={ isDisabled }
        >
          { times }
          <span>10</span>
          <span className="text-xs leading-4 align-super">{ value }</span>
        </Button>
      ) }
      <PopoverRoot open={ open } onOpenChange={ onOpenChange } positioning={{ placement: 'bottom-end' }}>
        <PopoverTrigger>
          <IconButton
            variant="icon_secondary"
            className={ cn(
              'cursor-pointer size-6 p-0 rounded-l-none border-l border-[var(--color-border-divider)]',
            ) }
            disabled={ isDisabled }
          >
            <IconSvg
              name="arrows/east-mini"
              className={ cn(
                'size-6 transition-transform duration-150 ease-in-out',
                open ? 'rotate-90' : '-rotate-90',
              ) }
            />
          </IconButton>
        </PopoverTrigger>
        <PopoverContent className="w-[110px]">
          <PopoverBody className="text-base py-2">
            <ul>
              { [ 8, 12, 16, 18, 20 ].map((id) => (
                <li
                  key={ id }
                  className="py-2 flex justify-between items-center cursor-pointer"
                  data-id={ id }
                  onClick={ handleOptionClick }
                >
                  <span>10*{ id }</span>
                  { selectedOption === id && <IconSvg name="check" className="w-6 h-6"/> }
                </li>
              )) }
              <li className="py-2 flex justify-between items-center">
                <span>10*</span>
                <Input
                  type="number"
                  min={ 0 }
                  max={ 100 }
                  className="ml-3"
                  size="sm"
                  onChange={ handleInputChange }
                  value={ customValue || '' }
                />
              </li>
            </ul>
          </PopoverBody>
        </PopoverContent>
      </PopoverRoot>
    </>
  );
};

export default React.memo(ContractMethodMultiplyButton);
