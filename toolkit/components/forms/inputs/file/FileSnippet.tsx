import React from 'react';

import JsonFileIcon from 'icons/files/json.svg';
import PlaceholderFileIcon from 'icons/files/placeholder.svg';
import SolFileIcon from 'icons/files/sol.svg';
import YulFileIcon from 'icons/files/yul.svg';

import { CloseButton } from '../../../../chakra/close-button';
import { Hint } from '../../../../components/Hint/Hint';

const FILE_ICONS: Record<string, React.ReactNode> = {
  '.json': <JsonFileIcon/>,
  '.sol': <SolFileIcon/>,
  '.yul': <YulFileIcon/>,
};

function getFileExtension(fileName: string) {
  const chunks = fileName.split('.');
  if (chunks.length === 1) {
    return '';
  }

  return '.' + chunks[chunks.length - 1];
}

interface Props {
  file: File;
  className?: string;
  index?: number;
  onRemove?: (index?: number) => void;
  isDisabled?: boolean;
  error?: string;
}

export const FileSnippet = ({ file, className, index, onRemove, isDisabled, error }: Props) => {
  const handleRemove = React.useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    onRemove?.(index);
  }, [ index, onRemove ]);

  const fileExtension = getFileExtension(file.name);
  const fileIcon = FILE_ICONS[fileExtension] || <PlaceholderFileIcon/>;

  return (
    <div
      className={ [ 'flex max-w-[300px] overflow-hidden items-center text-left gap-x-2', className ].filter(Boolean).join(' ') }
    >
      <div className={ [ 'w-12 h-12 shrink-0', error ? 'text-[var(--chakra-colors-text-error)]' : '' ].filter(Boolean).join(' ') }>
        { fileIcon }
      </div>
      <div className="max-w-[calc(100%-58px-24px)]">
        <div className="flex items-center">
          <span
            className={ [
              'font-semibold overflow-hidden text-ellipsis whitespace-nowrap',
              error ? 'text-[var(--chakra-colors-text-error)]' : '',
            ].filter(Boolean).join(' ') }
          >
            { file.name }
          </span>
          { Boolean(error) && <Hint label={ error } ml={ 1 } color="var(--color-text-error)"/> }
          <CloseButton
            aria-label="Remove"
            className="ml-2"
            onClick={ handleRemove }
            disabled={ isDisabled }
          />
        </div>
        <span className="text-[var(--chakra-colors-text-secondary)] text-sm mt-1 block">
          { file.size.toLocaleString(undefined, { notation: 'compact', maximumFractionDigits: 2, unit: 'byte', unitDisplay: 'narrow', style: 'unit' }) }
        </span>
      </div>
    </div>
  );
};
