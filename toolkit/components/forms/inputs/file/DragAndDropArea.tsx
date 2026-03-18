import type { DragEvent } from 'react';
import React from 'react';

import { cn } from 'lib/utils/cn';

import { getAllFileEntries, convertFileEntryToFile } from './utils';

interface Props {
  children: React.ReactNode;
  onDrop: (files: Array<File>) => void;
  className?: string;
  isDisabled?: boolean;
  isInvalid?: boolean;
  fullFilePath?: boolean;
}

export const DragAndDropArea = ({ onDrop, children, className, isDisabled, fullFilePath, isInvalid }: Props) => {
  const [ isDragOver, setIsDragOver ] = React.useState(false);

  const handleDrop = React.useCallback(async(event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();

    if (isDisabled) {
      return;
    }

    const fileEntries = await getAllFileEntries(event.dataTransfer.items);
    const files = await Promise.all(fileEntries.map((fileEntry) => convertFileEntryToFile(fileEntry, fullFilePath)));

    onDrop(files);
    setIsDragOver(false);
  }, [ isDisabled, onDrop, fullFilePath ]);

  const handleDragOver = React.useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  }, []);

  const handleDragEnter = React.useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = React.useCallback((event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleClick = React.useCallback((event: React.MouseEvent) => {
    if (isDisabled) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, [ isDisabled ]);

  return (
    <div
      className={ cn(
        'flex items-center justify-center w-full min-h-[120px] border-2 border-dashed rounded-lg cursor-pointer text-center',
        'text-[var(--chakra-colors-input-placeholder)]',
        'hover:border-[var(--chakra-colors-input-border-hover)]',
        isDragOver ? 'border-[var(--chakra-colors-input-border-hover)]' : 'border-[var(--chakra-colors-input-border)]',
        isDisabled && 'opacity-20',
        isInvalid && 'border-[var(--chakra-colors-input-border-error)] text-[var(--chakra-colors-input-placeholder-error)]',
        className,
      ) }
      { ...(isDisabled ? { 'data-disabled': true } : {}) }
      { ...(isInvalid ? { 'data-invalid': true } : {}) }
      onClick={ handleClick }
      onDrop={ handleDrop }
      onDragOver={ handleDragOver }
      onDragEnter={ handleDragEnter }
      onDragLeave={ handleDragLeave }
    >
      { children }
    </div>
  );
};
