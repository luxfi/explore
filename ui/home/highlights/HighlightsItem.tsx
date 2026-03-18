import React from 'react';

import type { HighlightsBannerConfig } from 'types/homepage';

import config from 'configs/app';
import { cn } from 'lib/utils/cn';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Heading } from '@luxfi/ui/heading';
import { Image } from '@luxfi/ui/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from '@luxfi/ui/skeleton';

interface ContainerProps extends Omit<Props, 'totalNum'> {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

const Container = ({ children, data, isLoading, className, style }: ContainerProps) => {
  if ('page_path' in data) {
    return (
      <Link href={ config.app.baseUrl + data.page_path } loading={ isLoading } className={ className } style={ style }>
        { children }
      </Link>
    );
  }

  if ('redirect_url' in data) {
    return (
      <Link href={ data.redirect_url } loading={ isLoading } external noIcon className={ className } style={ style }>
        { children }
      </Link>
    );
  }

  return (
    <Skeleton loading={ isLoading } className={ className } style={ style }>
      { children }
    </Skeleton>
  );
};

interface Props {
  data: HighlightsBannerConfig;
  isLoading: boolean;
  totalNum: number;
}

const HighlightsItem = ({ data, isLoading, totalNum }: Props) => {

  const imageSrc = useColorModeValue(
    data.side_img_url?.[0],
    data.side_img_url?.[1] || data.side_img_url?.[0],
  );

  const bgColor = useColorModeValue(
    data.background?.[0] || '#EFF7FF',
    data.background?.[1] || data.background?.[0] || '#2A3340',
  );

  const titleColor = useColorModeValue(
    data.title_color?.[0] || '#101112',
    data.title_color?.[1] || data.title_color?.[0] || '#F8FCFF',
  );

  const descriptionColor = useColorModeValue(
    data.description_color?.[0] || '#718096',
    data.description_color?.[1] || data.description_color?.[0] || '#AEB1B6',
  );

  const containerStyle: React.CSSProperties = {
    width: `calc((100% - ${ (totalNum - 1) * 12 }px) / ${ totalNum })`,
    ...(!isLoading ? { backgroundColor: bgColor } : {}),
  };

  return (
    <Container
      data={ data }
      isLoading={ isLoading }
      className={ cn(
        'flex items-center min-h-[153px] pl-6 overflow-hidden rounded-md',
      ) }
      style={ containerStyle }
    >
      <div className="flex overflow-hidden w-full gap-3">
        <div className={ `flex flex-col items-start gap-3 shrink-0 ${ totalNum === 2 ? 'w-[294px]' : 'w-[193px]' }` }>
          <Heading
            level="3"
            style={{ color: titleColor }}
          >
            { data.title }
          </Heading>
          <span
            className="text-sm"
            style={{ color: descriptionColor }}
          >
            { data.description }
          </span>
        </div>
        { imageSrc && !isLoading && (
          <Image
            src={ imageSrc }
            width="210px"
            height="112px"
            skeletonWidth="0px"
            objectFit="cover"
            ml="auto"
            mr={ 6 }
          />
        ) }
      </div>
    </Container>
  );
};

export default React.memo(HighlightsItem);
