import React from 'react';

import { stripLeadingSlash } from 'toolkit/utils/url';
import useThemeColors from 'ui/shared/monaco/utils/useThemeColors';

interface Props {
  path: string;
}

const CodeEditorBreadcrumbs = ({ path }: Props) => {
  const chunks = stripLeadingSlash(path).split('/');
  const themeColors = useThemeColors();

  return (
    <div className="flex items-center flex-wrap text-[13px] leading-[22px]" style={{ color: themeColors['breadcrumbs.foreground']  }} style={{ backgroundColor: themeColors['editor.background']  }}
      pl="16px"
      pr="8px"
    >
      { chunks.map((chunk, index) => {
        return (
          <React.Fragment key={ index }>
            { index !== 0 && (
              <div                 className="codicon codicon-breadcrumb-separator"
                boxSize="16px"
                _before={{
                  content: '"\\eab6"',
                }}/>
            ) }
            <div>{ chunk }</div>
          </React.Fragment>
        );
      }) }
    </div>
  );
};

export default React.memo(CodeEditorBreadcrumbs);
