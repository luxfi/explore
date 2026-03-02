import React from 'react';

import dayjs from 'lib/date/dayjs';

interface Props {
  date: string | undefined;
}

const NameDomainExpiryStatus = ({ date }: Props) => {
  if (!date) {
    return null;
  }

  const hasExpired = dayjs(date).isBefore(dayjs());

  if (hasExpired) {
    return <span className="text-red-600">Expired</span>;
  }

  const diff = dayjs(date).diff(dayjs(), 'day');
  if (diff < 30) {
    return <span className="text-red-600">{ diff } days left</span>;
  }

  return <span className="text-[var(--color-text-secondary)]">Expires { dayjs(date).fromNow() }</span>;
};

export default React.memo(NameDomainExpiryStatus);
