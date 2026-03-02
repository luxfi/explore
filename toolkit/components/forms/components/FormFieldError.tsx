import React from 'react';

interface Props {
  message: string;
  className?: string;
}

export const FormFieldError = ({ message, className }: Props) => {
  return (
    <div className={ [ 'text-[var(--color-text-error)] text-sm mt-2 break-words', className ].filter(Boolean).join(' ') }>
      { message }
    </div>
  );
};
