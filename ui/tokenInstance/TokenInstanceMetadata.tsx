import React from 'react';

import type { TokenInstance } from 'types/api/token';

import { Alert } from 'toolkit/chakra/alert';
import type { SelectOption } from 'toolkit/chakra/select';
import { createListCollection, Select } from 'toolkit/chakra/select';
import { ContentLoader } from 'toolkit/components/loaders/ContentLoader';
import CopyToClipboard from 'ui/shared/CopyToClipboard';
import RawDataSnippet from 'ui/shared/RawDataSnippet';

import { useMetadataUpdateContext } from './contexts/metadataUpdate';
import MetadataAccordion from './metadata/MetadataAccordion';

const OPTIONS = [
  { label: 'Table', value: 'Table' as const },
  { label: 'JSON', value: 'JSON' as const },
];

const collection = createListCollection<SelectOption>({ items: OPTIONS });

type Format = (typeof OPTIONS)[number]['value'];

interface Props {
  data: TokenInstance['metadata'] | undefined;
  isPlaceholderData?: boolean;
}

const TokenInstanceMetadata = ({ data, isPlaceholderData }: Props) => {
  const [ format, setFormat ] = React.useState<Array<Format>>([ 'Table' ]);

  const { status: refetchStatus } = useMetadataUpdateContext() || {};

  const handleValueChange = React.useCallback(({ value }: { value: Array<string> }) => {
    setFormat(value as Array<Format>);
  }, []);

  if (isPlaceholderData || refetchStatus === 'WAITING_FOR_RESPONSE') {
    return <ContentLoader/>;
  }

  if (!data) {
    return <div>There is no metadata for this NFT</div>;
  }

  const content = format[0] === 'Table' ?
    <MetadataAccordion data={ data }/> :
    <RawDataSnippet data={ JSON.stringify(data, undefined, 4) } showCopy={ false }/>;

  return (
    <div>
      { refetchStatus === 'ERROR' && (
        <Alert status="warning" className="mb-6 block lg:flex" title="Oops!">
          <span>We { `couldn't` } refresh metadata. Please try again now or later.</span>
        </Alert>
      ) }
      <div>
        <span>Metadata</span>
        <Select
          collection={ collection }
          placeholder="Select type"
          value={ format }
          onValueChange={ handleValueChange }
          className="ml-5 w-[100px]"
        />
        { format[0] === 'JSON' && <CopyToClipboard text={ JSON.stringify(data) } className="ml-auto"/> }
      </div>
      { content }
    </div>
  );
};

export default React.memo(TokenInstanceMetadata);
