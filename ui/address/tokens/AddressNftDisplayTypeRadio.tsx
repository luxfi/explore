import React from 'react';

import type { ButtonGroupRadioProps } from 'toolkit/chakra/button';
import { Button, ButtonGroupRadio } from 'toolkit/chakra/button';
import IconSvg from 'ui/shared/IconSvg';

import type { TNftDisplayType } from './useAddressNftQuery';

interface Props extends Omit<ButtonGroupRadioProps, 'children'> {
  value: TNftDisplayType;
}

const AddressNftDisplayTypeRadio = ({ value, onChange, ...rest }: Props) => {
  return (
    <ButtonGroupRadio
      defaultValue={ value }
      onChange={ onChange }
      equalWidth
      { ...rest }
    >
      <Button value="collection" size="sm" className="px-3">
        <IconSvg name="collection" className="w-5 h-5"/>
        <span className="hidden lg:inline">By collection</span>
      </Button>
      <Button value="list" size="sm" className="px-3">
        <IconSvg name="apps" className="w-5 h-5"/>
        <span className="hidden lg:inline">List</span>
      </Button>
    </ButtonGroupRadio>
  );
};

export default React.memo(AddressNftDisplayTypeRadio);
