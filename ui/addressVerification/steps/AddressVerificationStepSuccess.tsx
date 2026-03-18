import React from 'react';

import { Alert } from 'toolkit/chakra/alert';
import { Button } from 'toolkit/chakra/button';

interface Props {
  onShowListClick: () => void;
  onAddTokenInfoClick: () => void;
  isToken?: boolean;
  address: string;
}

const AddressVerificationStepSuccess = ({ onAddTokenInfoClick, onShowListClick, isToken, address }: Props) => {
  return (
    <div>
      <Alert status="success" descriptionProps={{ className: 'whitespace-pre-wrap break-words' }} className="mb-3 inline-block">
        <span>The address ownership for </span>
        <span fontWeight={ 700 }>{ address }</span>
        <span> is verified.</span>
      </Alert>
      <p>You may now submit the “Add token information” request</p>
      <div className="flex" alignItems="center" mt={ 8 } columnGap={ 5 } flexWrap="wrap" rowGap={ 5 }>
        <Button variant={ isToken ? 'outline' : 'solid' } onClick={ onShowListClick }>
          View my verified addresses
        </Button>
        { isToken && (
          <Button onClick={ onAddTokenInfoClick }>
            Add token information
          </Button>
        ) }
      </div>
    </div>
  );
};

export default React.memo(AddressVerificationStepSuccess);
