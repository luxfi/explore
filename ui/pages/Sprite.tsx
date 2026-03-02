import { useQuery } from '@tanstack/react-query';
import React from 'react';

import useFetch from 'lib/hooks/useFetch';
import { EmptyState } from '@luxfi/ui/empty-state';
import { Tooltip } from '@luxfi/ui/tooltip';
import { FilterInput } from 'toolkit/components/filters/FilterInput';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import { useClipboard } from 'toolkit/hooks/useClipboard';
import DataFetchAlert from 'ui/shared/DataFetchAlert';
import type { IconName } from 'ui/shared/IconSvg';
import IconSvg from 'ui/shared/IconSvg';
import PageTitle from 'ui/shared/Page/PageTitle';

const formatFileSize = (fileSizeInBytes: number) => `${ (fileSizeInBytes / 1_024).toFixed(2) } Kb`;

interface IconInfo {
  name: string;
  file_size: number;
}

const Item = ({ name, file_size: fileSize, className }: IconInfo & { className?: string }) => {
  const { hasCopied, copy } = useClipboard(name, 1000);
  const [ copied, setCopied ] = React.useState(false);

  React.useEffect(() => {
    if (hasCopied) {
      setCopied(true);
    } else {
      setCopied(false);
    }
  }, [ hasCopied ]);

  return (
    <div className="flex flex-col items-center text-center whitespace-pre-wrap break-words cursor-pointer max-w-[100px]" onClick={ copy }>
      <IconSvg name={ name.replace('.svg', '') as IconName } className={ `w-[100px] h-[100px] rounded ${ className ?? '' }`.trim() }/>
      <Tooltip content={ copied ? 'Copied' : 'Copy to clipboard' } open={ copied }>
        <div className="mt-2 font-medium">{ name }</div>
      </Tooltip>
      <div className="text-[var(--color-text-secondary)]">{ formatFileSize(fileSize) }</div>
    </div>
  );
};

const Sprite = () => {
  const [ searchTerm, setSearchTerm ] = React.useState('');

  const fetch = useFetch();
  const { data, isFetching, isError } = useQuery({
    queryKey: [ 'sprite' ],
    queryFn: () => {
      return fetch<Array<IconInfo>, unknown>('/icons/registry.json');
    },
  });

  const content = (() => {
    if (isFetching) {
      return <ContentLoader/>;
    }

    if (isError || !data || !Array.isArray(data)) {
      return <DataFetchAlert/>;
    }

    const items = data
      .filter((icon) => icon.name.includes(searchTerm))
      .sort((a, b) => a.name.localeCompare(b.name));

    if (items.length === 0) {
      return <EmptyState description="No icons found"/>;
    }

    return (
      <div className="flex justify-start flex-wrap text-sm gap-x-5 gap-y-5">
        { items.map((item) => <Item key={ item.name } { ...item } className="bg-black/10 dark:bg-white/10"/>) }
      </div>
    );
  })();

  const total = React.useMemo(() => {
    if (!data || !Array.isArray(data)) {
      return;
    }
    return data.reduce((result, item) => {
      result.num++;
      result.fileSize += item.file_size;
      return result;
    }, { num: 0, fileSize: 0 });
  }, [ data ]);

  const searchInput = <FilterInput placeholder="Search by name..." onChange={ setSearchTerm } loading={ isFetching } className="min-w-full lg:min-w-[300px]"/>;
  const totalEl = total ? <div className="ml-auto">Items: { total.num } / Size: { formatFileSize(total.fileSize) }</div> : null;

  const contentAfter = (
    <>
      { totalEl }
      { searchInput }
    </>
  );

  return (
    <div>
      <PageTitle title="SVG sprite 🥤" contentAfter={ contentAfter }/>
      { content }
    </div>
  );
};

export default React.memo(Sprite);
