import React from 'react';

import type { TokenInstance } from 'types/api/token';
import type { MetadataAttributes } from 'types/client/token';

import parseMetadata from 'lib/token/parseMetadata';
import { Link } from 'toolkit/next/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import { TruncatedText } from 'toolkit/components/truncation/TruncatedText';
import * as DetailedInfo from 'ui/shared/DetailedInfo/DetailedInfo';

import { useMetadataUpdateContext } from '../contexts/metadataUpdate';

interface Props {
  data?: TokenInstance;
  isLoading?: boolean;
}

interface ItemProps {
  data: MetadataAttributes;
  isLoading?: boolean;
}

const Item = ({ data, isLoading }: ItemProps) => {
  const value = (() => {
    if (data.value_type === 'URL') {
      return (
        <Link
          external
          className="whitespace-nowrap inline-flex items-center w-full overflow-hidden text-sm"
          href={ data.value }
          loading={ isLoading }
        >
          <TruncatedText text={ data.value } className="w-[calc(100%-16px)]" loading={ isLoading }/>
        </Link>
      );
    }

    return <TruncatedText text={ data.value } className="text-sm w-full" loading={ isLoading }/>;
  })();

  return (
    <div
    >
      <TruncatedText
        text={ data.trait_type }
        className="text-xs w-full text-[var(--color-text-secondary)] font-medium mb-1"
        loading={ isLoading }
      />
      { value }
    </div>
  );
};

const TokenInstanceMetadataInfo = ({ data, isLoading: isLoadingProp }: Props) => {
  const { status: refetchStatus } = useMetadataUpdateContext() || {};

  const metadata = React.useMemo(() => parseMetadata(data?.metadata), [ data ]);

  const hasMetadata = metadata && Boolean((metadata.name || metadata.description || metadata.attributes));
  if (!hasMetadata) {
    return null;
  }

  const isLoading = isLoadingProp || refetchStatus === 'WAITING_FOR_RESPONSE';

  return (
    <>
      <DetailedInfo.ItemDivider/>
      { metadata?.name && (
        <>
          <DetailedInfo.ItemLabel
            hint="NFT name"
            isLoading={ isLoading }
          >
            Name
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue
          >
            <Skeleton loading={ isLoading }>
              { metadata.name }
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }
      { metadata?.description && (
        <>
          <DetailedInfo.ItemLabel
            hint="NFT description"
            isLoading={ isLoading }
          >
            Description
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue
          >
            <Skeleton loading={ isLoading }>
              { metadata.description }
            </Skeleton>
          </DetailedInfo.ItemValue>
        </>
      ) }
      { metadata?.attributes && metadata.attributes.length > 0 && (
        <>
          <DetailedInfo.ItemLabel
            hint="NFT attributes"
            isLoading={ isLoading }
          >
            Attributes
          </DetailedInfo.ItemLabel>
          <DetailedInfo.ItemValue>
            <div>
              { metadata.attributes
                .filter((attribute) => attribute.value)
                .map((attribute, index) => <Item key={ index } data={ attribute } isLoading={ isLoading }/>) }
            </div>
          </DetailedInfo.ItemValue>
        </>
      ) }
    </>
  );
};

export default React.memo(TokenInstanceMetadataInfo);
