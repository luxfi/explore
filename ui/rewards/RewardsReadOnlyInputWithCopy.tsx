import React from 'react';

import { cn } from 'lib/utils/cn';
import { Field } from '@luxfi/ui/field';
import { Input } from '@luxfi/ui/input';
import { InputGroup } from '@luxfi/ui/input-group';
import { Skeleton } from '@luxfi/ui/skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';

type Props = {
  label: string;
  value: string;
  className?: string;
  isLoading?: boolean;
};

const RewardsReadOnlyInputWithCopy = ({ label, value, className, isLoading }: Props) => {
  return (
    <Skeleton loading={ isLoading } className={ cn(className) }>
      <Field label={ label } floating size="lg" readOnly>
        <InputGroup endElement={ <CopyToClipboard text={ value }/> } endElementProps={{ className: 'px-3' }}>
          <Input value={ value } className="font-medium"/>
        </InputGroup>
      </Field>
    </Skeleton>
  );
};

export default RewardsReadOnlyInputWithCopy;
