import React from 'react';

import { Switch } from '@luxfi/ui/switch';
import { Hint } from 'toolkit/components/Hint/Hint';

interface Props {
  id: string;
  onChange: (isChecked: boolean) => void;
  initialValue?: boolean;
  isDisabled?: boolean;
  className?: string;
}

const UserOpCallDataSwitch = ({ className, initialValue, isDisabled, onChange, id }: Props) => {
  const [ isChecked, setIsChecked ] = React.useState(initialValue ?? false);

  const handleChange = React.useCallback(() => {
    setIsChecked((prevValue) => {
      const nextValue = !prevValue;
      onChange(nextValue);
      return nextValue;
    });
  }, [ onChange ]);

  return (
    <div className="flex ml-auto">
      <Switch
        className={ className }
        id={ id }
        checked={ isChecked }
        disabled={ isDisabled }
        onCheckedChange={ handleChange }
        direction="rtl"
        labelProps={{ className: 'font-semibold text-sm' }}
      >
        <span>Show external call data</span>
        <span>External call data</span>
      </Switch>
      <Hint label="Inner call data is a predicted decoded call from this user operation"/>
    </div>
  );
};

export default React.memo(UserOpCallDataSwitch);
