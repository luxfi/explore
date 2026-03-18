import { throttle } from 'es-toolkit';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import React from 'react';

import type { File, Monaco } from './types';

import { TabsContent, TabsList, TabsRoot, TabsTrigger } from 'toolkit/chakra/tabs';
import { shift, cmd } from 'toolkit/utils/htmlEntities';

import CodeEditorFileExplorer from './CodeEditorFileExplorer';
import CodeEditorSearch from './CodeEditorSearch';
import useThemeColors from './utils/useThemeColors';

interface Props {
  monaco: Monaco | undefined;
  editor: monaco.editor.IStandaloneCodeEditor | undefined;
  data: Array<File>;
  onFileSelect: (index: number, lineNumber?: number) => void;
  selectedFile: string;
  mainFile?: string;
}

export const CONTAINER_WIDTH = 250;

const CodeEditorSideBar = ({ onFileSelect, data, monaco, editor, selectedFile, mainFile }: Props) => {

  const [ isStuck, setIsStuck ] = React.useState(false);
  const [ isDrawerOpen, setIsDrawerOpen ] = React.useState(false);
  const [ activeTab, setActiveTab ] = React.useState('explorer');
  const [ searchValue, setSearchValue ] = React.useState('');
  const [ actionBarRenderer, setActionBarRenderer ] = React.useState<() => React.JSX.Element>();

  const themeColors = useThemeColors();

  const tabClassName = 'font-heading uppercase text-[11px] leading-[35px] font-medium px-0 tracking-[0.3px]';
  const tabStyle = (value: string): React.CSSProperties => ({
    color: activeTab === value ? themeColors['tab.activeForeground'] : themeColors['tab.inactiveForeground'],
  });

  const handleScrollThrottled = React.useRef(throttle((event: React.SyntheticEvent) => {
    setIsStuck((event.target as HTMLDivElement).scrollTop > 0);
  }, 100));

  const handleFileSelect = React.useCallback((index: number, lineNumber?: number) => {
    isDrawerOpen && setIsDrawerOpen(false);
    onFileSelect(index, lineNumber);
  }, [ isDrawerOpen, onFileSelect, setIsDrawerOpen ]);

  const handleSideBarButtonClick = React.useCallback(() => {
    setIsDrawerOpen((prev) => !prev);
  }, []);

  const handleTabChange = React.useCallback(({ value }: { value: string }) => {
    setActiveTab(value);
  }, []);

  React.useEffect(() => {
    if (editor && monaco) {
      editor.addAction({
        id: 'file-explorer',
        label: 'Show File Explorer',
        keybindings: [
          monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyE,
        ],
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.5,
        run: function() {
          setActiveTab('explorer');
        },
      });

      editor.addAction({
        id: 'search-in-files',
        label: 'Show Search in Files',
        keybindings: [
          monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
        ],
        contextMenuGroupId: 'navigation',
        contextMenuOrder: 1.6,
        run: function(editor) {
          setActiveTab('search');
          const selection = editor.getSelection();
          const selectedValue = selection ? editor.getModel()?.getValueInRange(selection) : '';
          setSearchValue(selectedValue || '');
        },
      });
    }
  }, [ editor, monaco ]);

  return (
    <>
      <div
        className="shrink-0 text-[13px] z-[2] absolute lg:relative overflow-y-scroll rounded-br-md rounded-tr-md h-full"
        style={{
          width: `${ CONTAINER_WIDTH }px`,
          backgroundColor: themeColors['sideBar.background'],
          transitionProperty: 'right',
          transitionDuration: '200ms',
          transitionTimingFunction: 'ease-in-out',
          right: isDrawerOpen ? '0' : `-${ CONTAINER_WIDTH }px`,
          paddingBottom: '22px',
          boxShadow: isDrawerOpen ? 'var(--shadow-md)' : 'none',
        }}
        onScroll={ handleScrollThrottled.current }
      >
        <TabsRoot unmountOnExit={ false } variant="unstyled" size="free" value={ activeTab } onValueChange={ handleTabChange }>
          <TabsList
            className={ `gap-x-3 sticky top-0 left-0 z-[1] px-2 h-[35px] items-center rounded-tr-md ${ isStuck ? 'shadow-md' : 'shadow-none' }` }
            style={{ backgroundColor: themeColors['sideBar.background'] }}
          >
            <TabsTrigger value="explorer" className={ tabClassName } style={ tabStyle('explorer') } title={ `File explorer (${ shift + cmd }E)` }>Explorer</TabsTrigger>
            <TabsTrigger value="search" className={ tabClassName } style={ tabStyle('search') } title={ `Search in files (${ shift + cmd }F)` }>Search</TabsTrigger>
            { actionBarRenderer?.() }
          </TabsList>
          <TabsContent value="explorer" className="p-0">
            <CodeEditorFileExplorer
              data={ data }
              onFileSelect={ handleFileSelect }
              selectedFile={ selectedFile }
              mainFile={ mainFile }
              isActive={ activeTab === 'explorer' }
              setActionBarRenderer={ setActionBarRenderer }
            />
          </TabsContent>
          <TabsContent value="search" className="p-0">
            <CodeEditorSearch
              data={ data }
              onFileSelect={ handleFileSelect }
              monaco={ monaco }
              isInputStuck={ isStuck }
              isActive={ activeTab === 'search' }
              setActionBarRenderer={ setActionBarRenderer }
              defaultValue={ searchValue }
            />
          </TabsContent>
        </TabsRoot>
      </div>
      <div
        className="absolute rounded-tl rounded-bl z-[1] shadow-md block lg:hidden size-6 p-1 cursor-pointer"
        style={{
          right: isDrawerOpen ? `${ CONTAINER_WIDTH - 1 }px` : '0',
          top: 'calc(50% - 12px)',
          backgroundColor: themeColors['sideBar.background'],
          transitionProperty: 'right',
          transitionDuration: '200ms',
          transitionTimingFunction: 'ease-in-out',
        }}
        onClick={ handleSideBarButtonClick }
        title={ isDrawerOpen ? 'Open sidebar' : 'Close sidebar' }
        aria-label={ isDrawerOpen ? 'Open sidebar' : 'Close sidebar' }
      >
        <div
          className="codicon codicon-tree-item-expanded size-4"
          style={{ transform: isDrawerOpen ? 'rotate(-90deg)' : 'rotate(+90deg)' }}
        />
      </div>
    </>
  );
};

export default React.memo(CodeEditorSideBar);
