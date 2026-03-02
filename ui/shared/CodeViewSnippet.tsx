import React from 'react';

import { Skeleton } from '@luxfi/ui/skeleton';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import CodeEditor from 'ui/shared/monaco/CodeEditor';

interface Props {
  data: string;
  copyData?: string;
  language: string;
  title?: string;
  className?: string;
  rightSlot?: React.ReactNode;
  isLoading?: boolean;
}

const CodeViewSnippet = ({ data, copyData, language, title, className, rightSlot, isLoading }: Props) => {

  const editorData = React.useMemo(() => {
    return [ { file_path: 'index', source_code: data } ];
  }, [ data ]);

  return (
    <section className={ className } title={ title }>
      { (title || rightSlot) && (
        <div className={ `flex items-center mb-3 ${ title ? 'justify-between' : 'justify-end' }` }>
          { title && <Skeleton loading={ isLoading } fontWeight={ 500 }>{ title }</Skeleton> }
          { rightSlot }
          <CopyToClipboard text={ copyData ?? data } isLoading={ isLoading }/>
        </div>
      ) }
      { isLoading ? <Skeleton loading height="500px" w="100%"/> : <CodeEditor data={ editorData } language={ language }/> }
    </section>
  );
};

export default React.memo(CodeViewSnippet);
