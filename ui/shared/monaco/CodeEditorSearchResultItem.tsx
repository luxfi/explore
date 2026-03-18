import React from 'react';

import type { SearchResult } from './types';
import type { ArrayElement } from 'types/utils';

import useThemeColors from './utils/useThemeColors';

interface Props extends ArrayElement<SearchResult['matches']> {
  filePath: string;
  onClick: (event: React.MouseEvent) => void;
}

const calculateStartPosition = (lineContent: string, startColumn: number) => {

  let start = 0;

  for (let index = 0; index < startColumn; index++) {
    const element = lineContent[index];

    if (element === ' ') {
      start = index + 1;
      continue;
    }
  }

  return start ? start - 1 : 0;
};

const CodeEditorSearchResultItem = ({ lineContent, filePath, onClick, startLineNumber, startColumn, endColumn }: Props) => {
  const start = calculateStartPosition(lineContent, startColumn);
  const themeColors = useThemeColors();

  return (
    <div       pr="8px"
      pl="36px" className="text-[13px] leading-[22px]" className="whitespace-nowrap text-ellipsis cursor-pointer" className="overflow-hidden"
      data-file-path={ filePath }
      data-line-number={ startLineNumber }
      onClick={ onClick } style={{ transitionDuration: '0' }}
    >
      <span>{ lineContent.slice(start, startColumn - 1) }</span>
      <span style={{ backgroundColor: themeColors['custom.findMatchHighlightBackground'] }}>
        { lineContent.slice(startColumn - 1, endColumn - 1) }
      </span>
      <span>{ lineContent.slice(endColumn - 1) }</span>
    </div>
  );
};

export default React.memo(CodeEditorSearchResultItem);
