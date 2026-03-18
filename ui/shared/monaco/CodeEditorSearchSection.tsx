import React from 'react';

import type { SearchResult } from './types';

import { AccordionItem, AccordionItemContent, AccordionItemTrigger } from 'toolkit/chakra/accordion';

import CodeEditorFileIcon from './CodeEditorFileIcon';
import CodeEditorSearchResultItem from './CodeEditorSearchResultItem';
import getFileName from './utils/getFileName';
import useThemeColors from './utils/useThemeColors';

interface Props {
  data: SearchResult;
  onItemClick: (filePath: string, lineNumber: number) => void;
}

const CodeEditorSearchSection = ({ data, onItemClick }: Props) => {
  const fileName = getFileName(data.file_path);

  const handleFileLineClick = React.useCallback((event: React.MouseEvent) => {
    const lineNumber = Number((event.currentTarget as HTMLDivElement).getAttribute('data-line-number'));
    if (!Object.is(lineNumber, NaN)) {
      onItemClick(data.file_path, Number(lineNumber));
    }
  }, [ data.file_path, onItemClick ]);

  const themeColors = useThemeColors();

  return (
    <AccordionItem value={ data.file_path } className="border-b-0">
      <AccordionItemTrigger
        className="py-0 px-2 text-[13px] transition-none leading-[22px] items-center"
        noIndicator
      >
        <div           className="codicon codicon-tree-item-expanded width-[20px] height-[22px] shrink-0" style={{ transform: 'rotate(-90deg)' }}
          // transform={ isExpanded ? 'rotate(0deg)' : 'rotate(-90deg)' }
          py="3px"
        />
        <CodeEditorFileIcon mr="4px" fileName={ fileName }/>
        <div           mr="8px" className="whitespace-nowrap text-ellipsis text-left" className="overflow-hidden"
        >
          { fileName }
        </div>
        <div           className="monaco-count-badge shrink-0"
          ml="auto" style={{ backgroundColor: themeColors['badge.background']  }}
        >
          { data.matches.length }
        </div>
      </AccordionItemTrigger>
      <AccordionItemContent className="p-0">
        { data.matches.map((match) => (
          <CodeEditorSearchResultItem
            key={ data.file_path + '_' + match.startLineNumber + '_' + match.startColumn }
            filePath={ data.file_path }
            onClick={ handleFileLineClick }
            { ...match }
          />
        ),
        ) }
      </AccordionItemContent>
    </AccordionItem>
  );
};

export default React.memo(CodeEditorSearchSection);
