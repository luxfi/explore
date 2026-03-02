import React from 'react';

import type { FileTree } from './types';

import { AccordionItem, AccordionItemContent, AccordionItemTrigger, AccordionRoot } from '@luxfi/ui/accordion';
import IconSvg from 'ui/shared/IconSvg';

import CodeEditorFileIcon from './CodeEditorFileIcon';
import CodeEditorMainFileIndicator from './CodeEditorMainFileIndicator';
import useThemeColors from './utils/useThemeColors';

interface Props {
  tree: FileTree;
  level?: number;
  isCollapsed?: boolean;
  onItemClick: (event: React.MouseEvent) => void;
  selectedFile: string;
  mainFile?: string;
}

const CodeEditorFileTree = ({ tree, level = 0, onItemClick, isCollapsed, selectedFile, mainFile }: Props) => {
  const [ value, setValue ] = React.useState<Array<string>>(isCollapsed ? [] : tree.map((item) => item.name));

  const handleValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setValue(value);
  }, []);

  const themeColors = useThemeColors();

  return (
    <AccordionRoot multiple value={ value } onValueChange={ handleValueChange } noAnimation>
      {
        tree.map((leaf, index) => {
          const leafName = <span className="overflow-hidden text-ellipsis whitespace-nowrap">{ leaf.name }</span>;
          const isExpanded = value.includes(leaf.name);

          if ('children' in leaf) {
            return (
              <AccordionItem
                key={ index }
                value={ leaf.name }
                className="border-b-0 cursor-pointer leading-[22px]"
              >
                <AccordionItemTrigger
                  className="pr-[8px] py-0 text-[13px] leading-[22px] h-[22px] transition-none"
                  style={{
                    paddingLeft: `${ 8 + 8 * level }px`,
                    backgroundColor: undefined,
                  }}
                  noIndicator
                >
                  <div
                    className="codicon codicon-tree-item-expanded size-4 mr-[2px]"
                    style={{ transform: 'rotate(-90deg)' }}
                  />
                  <IconSvg
                    name={ isExpanded ? 'monaco/folder-open' : 'monaco/folder' }
                    className="size-4 mr-1"
                  />
                  { leafName }
                </AccordionItemTrigger>
                <AccordionItemContent className="p-0">
                  <CodeEditorFileTree
                    tree={ leaf.children }
                    level={ level + 1 }
                    onItemClick={ onItemClick }
                    isCollapsed={ isCollapsed }
                    selectedFile={ selectedFile }
                    mainFile={ mainFile }
                  />
                </AccordionItemContent>
              </AccordionItem>
            );
          }

          return (
            <AccordionItem
              key={ index }
              value={ leaf.name }
              className="border-b-0 cursor-pointer leading-[22px] flex relative items-center overflow-hidden"
              style={{
                paddingLeft: `${ 26 + (level * 8) }px`,
                paddingRight: '8px',
                backgroundColor: selectedFile === leaf.file_path ? themeColors['list.inactiveSelectionBackground'] : 'transparent',
              }}
              onClick={ onItemClick }
              data-file-path={ leaf.file_path }
            >
              { mainFile === leaf.file_path && (
                <CodeEditorMainFileIndicator
                  className="absolute"
                  style={{
                    top: `${ (22 - 12) / 2 }px`,
                    left: `${ (26 - 12 - 2) + (level * 8) }px`,
                  }}
                />
              ) }
              <CodeEditorFileIcon fileName={ leaf.name } className="mr-1"/>
              { leafName }
            </AccordionItem>
          );
        })
      }
    </AccordionRoot>
  );
};

export default React.memo(CodeEditorFileTree);
