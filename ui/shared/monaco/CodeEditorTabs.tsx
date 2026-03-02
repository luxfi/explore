import React from 'react';

import CodeEditorTab from './CodeEditorTab';
import useThemeColors from './utils/useThemeColors';

interface Props {
  tabs: Array<string>;
  activeTab: string;
  mainFile?: string;
  onTabSelect: (tab: string) => void;
  onTabClose: (tab: string) => void;
}

const CodeEditorTabs = ({ tabs, activeTab, mainFile, onTabSelect, onTabClose }: Props) => {
  const themeColors = useThemeColors();

  const tabsPathChunks = React.useMemo(() => {
    return tabs.map((tab) => tab.split('/'));
  }, [ tabs ]);

  return (
    <div className="flex flex-wrap overflow-hidden rounded-tl-md" style={{ backgroundColor: themeColors['sideBar.background']  }}
    >
      { tabs.map((tab) => (
        <CodeEditorTab
          key={ tab }
          path={ tab }
          isActive={ activeTab === tab }
          isMainFile={ mainFile === tab }
          onClick={ onTabSelect }
          onClose={ onTabClose }
          isCloseDisabled={ tabs.length === 1 }
          tabsPathChunks={ tabsPathChunks }
        />
      )) }
    </div>
  );
};

export default React.memo(CodeEditorTabs);
