import React from 'react';

import { route } from 'nextjs-routes';

import config from 'configs/app';
import { Image } from '@luxfi/ui/image';
import { Link as LinkToolkit } from 'toolkit/chakra/link';
import { Skeleton } from '@luxfi/ui/skeleton';
import { Tooltip } from '@luxfi/ui/tooltip';
import * as EntityBase from 'ui/shared/entities/base/components';
import IconSvg from 'ui/shared/IconSvg';

import { distributeEntityProps, getIconProps } from '../base/utils';

const nameServicesFeature = config.features.nameServices;
const clustersFeature = nameServicesFeature.isEnabled && nameServicesFeature.clusters.isEnabled ? nameServicesFeature.clusters : undefined;

type LinkProps = EntityBase.LinkBaseProps & Pick<EntityProps, 'clusterName'>;

const Link = ((props: LinkProps) => {
  const defaultHref = route({ pathname: '/name-services/clusters/[name]', query: { name: encodeURIComponent(props.clusterName) } });

  return (
    <EntityBase.Link
      { ...props }
      href={ props.href ?? defaultHref }
    >
      { props.children }
    </EntityBase.Link>
  );
});

type IconProps = EntityBase.IconBaseProps & Pick<EntityProps, 'clusterName'>;

const Icon = (props: IconProps) => {
  if (props.noIcon) {
    return null;
  }

  const styles = getIconProps(props, Boolean(props.shield));

  if (props.isLoading) {
    return <Skeleton loading boxSize={ styles.boxSize } borderRadius="base" mr={ 2 }/>;
  }

  const fallbackElement = (
    <div
      className="inline-flex items-center justify-center rounded mr-2 shrink-0 bg-[var(--color-clusters)]"
      style={{ width: styles.boxSize, height: styles.boxSize }}
    >
      <IconSvg
        name="clusters"
        className="w-full h-full text-white"
        style={{ filter: 'brightness(0) invert(1)' }}
      />
    </div>
  );

  const profileImageElement = (
    <Image
      width={ styles.boxSize }
      height={ styles.boxSize }
      borderRadius="base"
      mr={ 2 }
      flexShrink={ 0 }
      src={ `${ clustersFeature?.cdnUrl || '' }/profile-image/${ props.clusterName }` }
      alt={ `${ props.clusterName } profile` }
      fallback={ fallbackElement }
    />
  );

  const tooltipContent = (
    <>
      <div className="flex items-center text-base">
        <div className="inline-flex items-center justify-center rounded-sm mr-2 size-5 bg-[var(--color-clusters)]">

          <IconSvg name="clusters" className="w-4 h-4 text-white" style={{ filter: 'brightness(0) invert(1)' }}/>
        </div>
        <div>
          <span>Clusters</span>
          <span style={{ color: 'var(--color-text-secondary)', whiteSpace: 'pre' }}> - Universal name service</span>
        </div>
      </div>
      <span>
        Clusters provides unified naming across multiple blockchains including EVM, Solana, Bitcoin, and more.
        Manage all your wallet addresses under one human-readable name.
      </span>
      <LinkToolkit
        href="https://clusters.xyz"
        className="inline-flex items-center"
        external
      >
        <IconSvg name="link" className="w-5 h-5 text-[var(--color-text-secondary)] mr-2"/>
        <span>Learn more about Clusters</span>
      </LinkToolkit>
    </>
  );

  return (
    <Tooltip
      content={ tooltipContent }
      variant="popover"
      positioning={{
        placement: 'bottom-start',
      }}
      contentProps={{
        className: 'max-w-[calc(100vw-8px)] lg:max-w-[440px] min-w-[250px] w-fit flex flex-col gap-3 items-start',
      }}
      interactive
    >
      { profileImageElement }
    </Tooltip>
  );
};

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'clusterName'>;

const Content = ((props: ContentProps) => {
  const shouldShowTrailingSlash = !props.clusterName.includes('/');
  const displayName = shouldShowTrailingSlash ? `${ props.clusterName }/` : props.clusterName;

  return (
    <EntityBase.Content
      { ...props }
      text={ displayName }
      truncation="tail"
    />
  );
});

type CopyProps = Omit<EntityBase.CopyBaseProps, 'text'> & Pick<EntityProps, 'clusterName'>;

const Copy = (props: CopyProps) => {
  return (
    <EntityBase.Copy
      { ...props }
      text={ props.clusterName }
    />
  );
};

const Container = EntityBase.Container;

export interface EntityProps extends EntityBase.EntityBaseProps {
  clusterName: string;
}

const ClustersEntity = (props: EntityProps) => {
  const partsProps = distributeEntityProps(props);
  const content = <Content { ...partsProps.content }/>;

  return (
    <Container { ...partsProps.container }>
      <Icon { ...partsProps.icon }/>
      { props.noLink ? content : <Link { ...partsProps.link }>{ content }</Link> }
      <Copy { ...partsProps.copy }/>
    </Container>
  );
};

export default React.memo(ClustersEntity);

export {
  Container,
  Link,
  Icon,
  Content,
  Copy,
};
