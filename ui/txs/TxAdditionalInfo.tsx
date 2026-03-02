import React from 'react';

import type { Transaction } from 'types/api/transaction';

import { DialogContent, DialogHeader, DialogRoot, DialogTrigger, DialogBody } from '@luxfi/ui/dialog';
import { Heading } from '@luxfi/ui/heading';
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from '@luxfi/ui/popover';
import AdditionalInfoButton from 'ui/shared/AdditionalInfoButton';

import TxAdditionalInfoContainer from './TxAdditionalInfoContainer';
import TxAdditionalInfoContent from './TxAdditionalInfoContent';

type Props =
  ({
    hash: string;
    tx?: undefined;
  } |
  {
    hash?: undefined;
    tx: Transaction;
  }) & {
    isMobile?: boolean;
    isLoading?: boolean;
    className?: string;
  };

const TxAdditionalInfo = ({ hash, tx, isMobile, isLoading, className }: Props) => {
  const content = hash !== undefined ? <TxAdditionalInfoContainer hash={ hash }/> : <TxAdditionalInfoContent tx={ tx }/>;

  if (isMobile) {
    return (
      <DialogRoot size="full">
        <DialogTrigger asChild>
          <AdditionalInfoButton loading={ isLoading } className={ className }/>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            Additional info
          </DialogHeader>
          <DialogBody>
            { content }
          </DialogBody>
        </DialogContent>
      </DialogRoot>
    );
  }
  return (
    <PopoverRoot positioning={{ placement: 'right-start' }}>
      <PopoverTrigger>
        <AdditionalInfoButton loading={ isLoading } className={ className }/>
      </PopoverTrigger>
      <PopoverContent className="w-[330px]">
        <PopoverBody>
          <Heading level="3" className="mb-4">Additional info </Heading>
          { content }
        </PopoverBody>
      </PopoverContent>
    </PopoverRoot>
  );
};

export default React.memo(TxAdditionalInfo);
