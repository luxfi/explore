import React from 'react';

import { Alert } from '@luxfi/ui/alert';
import { Button } from '@luxfi/ui/button';

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
        <span className="font-bold">{ address }</span>
        <span> is verified.</span>
      </Alert>
      <p>You may now submit the “Add token information” request</p>
      <div className="flex items-center flex-wrap gap-x-5 gap-y-5 mt-8">
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
