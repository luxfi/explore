import React from 'react';

import { cn } from 'lib/utils/cn';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';

import useThemeColors from './utils/useThemeColors';

interface Props {
  className?: string;
}

const CodeEditorLoading = ({ className }: Props) => {
  const themeColors = useThemeColors();

  return (
    <div
      className={ cn('flex items-center justify-center overflow-hidden w-full h-full', className) }
      style={{ backgroundColor: themeColors['editor.background'] }}
    >
      <ContentLoader/>
    </div>
  );
};

export default React.memo(CodeEditorLoading);
