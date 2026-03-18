import { capitalize } from 'es-toolkit';
import React from 'react';

import hexToAddress from 'lib/hexToAddress';
import hexToUtf8 from 'lib/hexToUtf8';
import { createListCollection, SelectContent, SelectControl, SelectItem, SelectRoot, SelectValueText } from 'toolkit/chakra/select';
import { Skeleton } from 'toolkit/chakra/skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import AddressEntity from 'ui/shared/entities/address/AddressEntity';
import HashStringShortenDynamic from 'ui/shared/HashStringShortenDynamic';

import LogIndex from './LogIndex';

interface Props {
  hex: string;
  index: number;
  isLoading?: boolean;
}

type DataType = 'hex' | 'text' | 'address' | 'number';

const VALUE_CONVERTERS: Record<DataType, (hex: string) => string> = {
  hex: (hex) => hex,
  text: hexToUtf8,
  address: hexToAddress,
  number: (hex) => BigInt(hex).toString(),
};
const OPTIONS: Array<DataType> = [ 'hex', 'address', 'text', 'number' ];

const collection = createListCollection({
  items: OPTIONS.map((option) => ({
    value: option,
    label: capitalize(option),
  })),
});

const LogTopic = ({ hex, index, isLoading }: Props) => {
  const [ selectedDataType, setSelectedDataType ] = React.useState<DataType>('hex');

  const handleSelectChange = React.useCallback((details: { value: Array<string> }) => {
    setSelectedDataType(details.value[0] as DataType);
  }, []);

  const value = VALUE_CONVERTERS[selectedDataType.toLowerCase() as Lowercase<DataType>](hex);

  const content = (() => {
    switch (selectedDataType) {
      case 'hex':
      case 'number':
      case 'text': {
        return (
          <>
            <Skeleton loading={ isLoading } className="overflow-hidden whitespace-nowrap">
              <HashStringShortenDynamic hash={ value }/>
            </Skeleton>
            <CopyToClipboard text={ value } isLoading={ isLoading }/>
          </>
        );
      }

      case 'address': {
        return (
          <AddressEntity
            address={{ hash: value, name: '' }}
            isLoading={ isLoading }
          />
        );
      }
    }
  })();

  return (
    <div className="flex items-center overflow-hidden px-0 lg:px-3 max-w-full">
      <LogIndex
        isLoading={ isLoading }
        className="text-xs mr-3 min-w-6 h-6"
      >
        { index }
      </LogIndex>
      { index !== 0 && (
        <SelectRoot
          collection={ collection }
          variant="outline"
          value={ [ selectedDataType ] }
          onValueChange={ handleSelectChange }
          className="mr-3 shrink-0 w-fit"
        >
          <SelectControl className="w-[105px]" loading={ isLoading }>
            <SelectValueText placeholder="Data type"/>
          </SelectControl>
          <SelectContent>
            { collection.items.map((item) => (
              <SelectItem item={ item } key={ item.value }>
                { item.label }
              </SelectItem>
            )) }
          </SelectContent>
        </SelectRoot>
      ) }
      { content }
    </div>
  );
};

export default React.memo(LogTopic);
