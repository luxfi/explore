import React from 'react';

import { alt } from 'toolkit/utils/htmlEntities';
import useThemeColors from 'ui/shared/monaco/utils/useThemeColors';

import CodeEditorFileIcon from './CodeEditorFileIcon';
import CodeEditorMainFileIndicator from './CodeEditorMainFileIndicator';
import getFilePathParts from './utils/getFilePathParts';

interface Props {
  isActive?: boolean;
  isMainFile?: boolean;
  path: string;
  onClick: (path: string) => void;
  onClose: (path: string) => void;
  isCloseDisabled: boolean;
  tabsPathChunks: Array<Array<string>>;
}

const CodeEditorTab = ({ isActive, isMainFile, path, onClick, onClose, isCloseDisabled, tabsPathChunks }: Props) => {
  const [ fileName, folderName ] = getFilePathParts(path, tabsPathChunks);
  const themeColors = useThemeColors();

  const handleClick = React.useCallback(() => {
    onClick(path);
  }, [ onClick, path ]);

  const handleClose = React.useCallback((event: React.MouseEvent) => {
    event.stopPropagation();
    !isCloseDisabled && onClose(path);
  }, [ isCloseDisabled, onClose, path ]);

  return (
    <div
      className="flex items-center cursor-pointer font-normal select-none text-[13px] leading-[34px] border-b border-r pl-[10px] pr-1"
      style={{
        backgroundColor: isActive ? themeColors['tab.activeBackground'] : themeColors['tab.inactiveBackground'],
        color: isActive ? themeColors['tab.activeForeground'] : themeColors['tab.inactiveForeground'],
        borderRightColor: themeColors['tab.border'],
        borderBottomColor: isActive ? 'transparent' : themeColors['tab.border'],
      }}
      onClick={ handleClick }
    >
      <CodeEditorFileIcon className="mr-1" fileName={ fileName }/>
      <span>{ fileName }</span>
      { folderName && <span className="text-[11px] opacity-80 ml-1">{ folderName[0] === '.' ? '' : '...' }{ folderName }</span> }
      { isMainFile && <CodeEditorMainFileIndicator className="ml-2"/> }
      <div
        className="codicon codicon-close rounded-sm size-5 ml-1 p-[2px]"
        title={ `Close ${ isActive ? `(${ alt }W)` : '' }` }
        aria-label="Close"
        onClick={ handleClose }
        style={{
          opacity: isCloseDisabled ? 0.3 : 1,
          visibility: isActive ? 'visible' : undefined,
          color: themeColors['icon.foreground'],
        }}
      />
    </div>
  );
};

export default React.memo(CodeEditorTab);
