import React from 'react';

interface Props {
  onClick: () => void;
  label: string;
  isDisabled?: boolean;
  isCollapsed?: boolean;
}

const CoderEditorCollapseButton = ({ onClick, label, isDisabled, isCollapsed }: Props) => {
  return (
    <div
      className={ `ml-auto self-center ${ isCollapsed ? 'codicon codicon-search-expand-results before:content-["\\eb95"]' : 'codicon codicon-collapse-all before:content-["\\eac5"]' } size-5 p-[2px] rounded-sm cursor-pointer` }
      style={{ opacity: isDisabled ? 0.6 : 1 }}
      onClick={ onClick }
      title={ label }
      aria-label={ label }
    />
  );
};

export default React.memo(CoderEditorCollapseButton);
