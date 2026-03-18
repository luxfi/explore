import React from 'react';

import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';

import useThemeColors from './utils/useThemeColors';

interface Props {
  className?: string;
}

const CodeEditorLoading = ({ className }: Props) => {
  const themeColors = useThemeColors();

  return (
    <div className="flex items-center justify-center overflow-hidden w-full h-full" style={{ backgroundColor: themeColors['editor.background']  }} className={ className }>
      <ContentLoader/>
    </div>
  );
};

export default React.memo(CodeEditorLoading);
