import React from 'react';

import type * as bens from '@luxfi/bens-types';

import { route } from 'nextjs-routes';

import { Image } from 'toolkit/chakra/image';
import { Link as LinkToolkit } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import * as EntityBase from 'ui/shared/entities/base/components';
import IconSvg from 'ui/shared/IconSvg';

import { distributeEntityProps, getIconProps } from '../base/utils';

type LinkProps = EntityBase.LinkBaseProps & Pick<EntityProps, 'domain' | 'protocol'>;

const Link = ((props: LinkProps) => {
  const defaultHref = route({
    pathname: '/name-services/domains/[name]',
    query: { name: props.domain, protocol_id: props.protocol?.id },
  });

  return (
    <EntityBase.Link
      { ...props }
      href={ props.href ?? defaultHref }
    >
      { props.children }
    </EntityBase.Link>
  );
});

type IconProps = Pick<EntityProps, 'protocol'> & EntityBase.IconBaseProps;

const Icon = (props: IconProps) => {
  const icon = <EntityBase.Icon { ...props } name={ 'name' in props ? props.name : 'ENS' }/>;

  if (props.protocol) {
    const styles = getIconProps(props);

    if (props.isLoading) {
      return <Skeleton loading boxSize={ styles.boxSize } borderRadius="sm" mr={ 2 }/>;
    }

    const content = (
      <>
        <div className="flex items-center text-base">
          <Image
            src={ props.protocol.icon_url }
            boxSize={ 5 }
            borderRadius="sm"
            mr={ 2 }
            alt={ `${ props.protocol.title } protocol icon` }
            fallback={ icon }
          />
          <div>
            <span>{ props.protocol.short_name }</span>
            <span style={{ color: 'var(--color-text-secondary)', whiteSpace: 'pre' }}> { props.protocol.tld_list.map((tld) => `.${ tld }`).join((' ')) }</span>
          </div>
        </div>
        <span>{ props.protocol.description }</span>
        { props.protocol.docs_url && (
          <LinkToolkit
            href={ props.protocol.docs_url }
            className="inline-flex items-center"
            external
          >
            <IconSvg name="docs" className="w-5 h-5 text-[var(--color-icon-primary)] mr-2"/>
            <span>Documentation</span>
          </LinkToolkit>
        ) }
      </>
    );

    return (
      <Tooltip
        content={ content }
        variant="popover"
        positioning={{
          placement: 'bottom-start',
        }}
        contentProps={{
          className: 'max-w-screen lg:max-w-[440px] min-w-[250px] w-fit flex flex-col gap-3 items-start',
        }}
        interactive
      >
        <Image
          { ...styles }
          src={ props.protocol.icon_url }
          borderRadius="sm"
          flexShrink={ 0 }
          alt={ `${ props.protocol.title } protocol icon` }
          fallback={ icon }
        />
      </Tooltip>
    );
  }

  return icon;
};

type ContentProps = Omit<EntityBase.ContentBaseProps, 'text'> & Pick<EntityProps, 'domain'>;

const Content = ((props: ContentProps) => {
  return (
    <EntityBase.Content
      { ...props }
      text={ props.domain }
      truncation="tail"
    />
  );
});

type CopyProps = Omit<EntityBase.CopyBaseProps, 'text'> & Pick<EntityProps, 'domain'>;

const Copy = (props: CopyProps) => {
  return (
    <EntityBase.Copy
      { ...props }
      text={ props.domain }
    />
  );
};

const Container = EntityBase.Container;

export interface EntityProps extends EntityBase.EntityBaseProps {
  domain: string;
  protocol?: bens.ProtocolInfo | null;
}

const EnsEntity = (props: EntityProps) => {
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

export default React.memo(EnsEntity);

export {
  Container,
  Link,
  Icon,
  Content,
  Copy,
};
