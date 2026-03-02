import React from 'react';

import { SECOND } from 'toolkit/utils/consts';

import BlockCountdownTimerItem from './BlockCountdownTimerItem';
import splitSecondsInPeriods from './splitSecondsInPeriods';

interface Props {
  value: number;
  onFinish: () => void;
}

const BlockCountdownTimer = ({ value: initialValue, onFinish }: Props) => {

  const [ value, setValue ] = React.useState(initialValue);

  React.useEffect(() => {
    const intervalId = window.setInterval(() => {
      setValue((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        onFinish();
        return 0;
      });
    }, SECOND);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [ initialValue, onFinish ]);

  const periods = splitSecondsInPeriods(value);

  return (
    <div
      className="mt-6 lg:mt-8 p-3 lg:p-4 rounded bg-[var(--color-bg-base)]"
    >
      <BlockCountdownTimerItem label="Days" value={ periods.days }/>
      <BlockCountdownTimerItem label="Hours" value={ periods.hours }/>
      <BlockCountdownTimerItem label="Minutes" value={ periods.minutes }/>
      <BlockCountdownTimerItem label="Seconds" value={ periods.seconds }/>
    </div>
  );
};

export default React.memo(BlockCountdownTimer);
