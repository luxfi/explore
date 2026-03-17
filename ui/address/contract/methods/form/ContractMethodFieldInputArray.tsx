import React from 'react';
import { useFormContext } from 'react-hook-form';

import type { ContractAbiItemInput } from '../types';

import ArrayButton from 'ui/shared/forms/ArrayButton';

import type { Props as AccordionProps } from './ContractMethodFieldAccordion';
import ContractMethodFieldAccordion from './ContractMethodFieldAccordion';
import ContractMethodFieldInput from './ContractMethodFieldInput';
import ContractMethodFieldInputTuple from './ContractMethodFieldInputTuple';
import ContractMethodFieldLabel from './ContractMethodFieldLabel';
import { getFieldLabel, matchArray, transformDataForArrayItem } from './utils';

interface Props extends Pick<AccordionProps, 'onAddClick' | 'onRemoveClick' | 'index'> {
  data: ContractAbiItemInput;
  level: number;
  basePath: string;
  isDisabled: boolean;
  isArrayElement?: boolean;
  size?: number;
}

const ContractMethodFieldInputArray = ({
  data,
  level,
  basePath,
  onAddClick,
  onRemoveClick,
  index: parentIndex,
  isDisabled,
  isArrayElement,
}: Props) => {
  const { formState: { errors } } = useFormContext();
  const fieldsWithErrors = Object.keys(errors);
  const isInvalid = fieldsWithErrors.some((field) => field.startsWith(basePath));

  const arrayMatch = matchArray(data.type);
  const hasFixedSize = arrayMatch !== null && arrayMatch.size !== Infinity;

  const [ registeredIndices, setRegisteredIndices ] = React.useState(hasFixedSize ? Array(arrayMatch.size).fill(0).map((_, i) => i) : [ 0 ]);

  const handleAddButtonClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setRegisteredIndices((prev) => [ ...prev, prev[prev.length - 1] + 1 ]);
  }, []);

  const handleRemoveButtonClick = React.useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    const itemIndex = event.currentTarget.getAttribute('data-index');
    if (itemIndex) {
      setRegisteredIndices((prev) => prev.filter((index) => index !== Number(itemIndex)));
    }
  }, [ ]);

  if (arrayMatch?.isNested) {
    return (
      <>
        {
          registeredIndices.map((registeredIndex, index) => {
            const itemData = transformDataForArrayItem(data, index);
            const itemBasePath = `${ basePath }:${ registeredIndex }`;
            const itemIsInvalid = fieldsWithErrors.some((field) => field.startsWith(itemBasePath));

            return (
              <ContractMethodFieldAccordion
                key={ registeredIndex }
                level={ level + 1 }
                label={ getFieldLabel(itemData) }
                isInvalid={ itemIsInvalid }
                onAddClick={ !hasFixedSize && index === registeredIndices.length - 1 ? handleAddButtonClick : undefined }
                onRemoveClick={ !hasFixedSize && registeredIndices.length > 1 ? handleRemoveButtonClick : undefined }
                index={ registeredIndex }
              >
                <ContractMethodFieldInputArray
                  key={ registeredIndex }
                  data={ itemData }
                  basePath={ itemBasePath }
                  level={ level + 1 }
                  isDisabled={ isDisabled }
                  isArrayElement
                />
              </ContractMethodFieldAccordion>
            );
          })
        }
      </>
    );
  }

  const isTupleArray = arrayMatch?.itemType.includes('tuple');

  if (isTupleArray) {
    const content = (
      <>
        { registeredIndices.map((registeredIndex, index) => {
          const itemData = transformDataForArrayItem(data, index);

          return (
            <ContractMethodFieldInputTuple
              key={ registeredIndex }
              data={ itemData }
              basePath={ `${ basePath }:${ registeredIndex }` }
              level={ level + 1 }
              onAddClick={ !hasFixedSize && index === registeredIndices.length - 1 ? handleAddButtonClick : undefined }
              onRemoveClick={ !hasFixedSize && registeredIndices.length > 1 ? handleRemoveButtonClick : undefined }
              index={ registeredIndex }
              isDisabled={ isDisabled }
              isOptional={ registeredIndices.length === 1 }
            />
          );
        }) }
      </>
    );

    if (isArrayElement) {
      return content;
    }

    return (
      <ContractMethodFieldAccordion
        level={ level }
        label={ getFieldLabel(data) }
        onAddClick={ onAddClick }
        onRemoveClick={ onRemoveClick }
        index={ parentIndex }
        isInvalid={ isInvalid }
      >
        { content }
      </ContractMethodFieldAccordion>
    );
  }

  // primitive value array
  return (
    <div className="flex flex-col md:flex-row items-start gap-x-3 px-1.5">
      { !isArrayElement && <ContractMethodFieldLabel data={ data } level={ level } isOptional={ registeredIndices.length === 1 }/> }
      <div className="flex flex-col gap-y-1 w-full">
        { registeredIndices.map((registeredIndex, index) => {
          const itemData = transformDataForArrayItem(data, index);

          return (
            <div key={ registeredIndex } className="flex items-start gap-x-2">
              <ContractMethodFieldInput
                data={ itemData }
                hideLabel
                path={ `${ basePath }:${ index }` }
                level={ level }
                className="px-0"
                isDisabled={ isDisabled }
                isOptional={ registeredIndices.length === 1 }
              />
              { !hasFixedSize && registeredIndices.length > 1 &&
                <ArrayButton index={ registeredIndex } onClick={ handleRemoveButtonClick } type="remove" className="my-1.5"/> }
              { !hasFixedSize && index === registeredIndices.length - 1 &&
                <ArrayButton index={ registeredIndex } onClick={ handleAddButtonClick } type="add" className="my-1.5"/> }
            </div>
          );
        }) }
      </div>
    </div>
  );
};

export default React.memo(ContractMethodFieldInputArray);
