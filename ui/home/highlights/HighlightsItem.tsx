import { Text, VStack, HStack } from '@chakra-ui/react';
import React from 'react';

import type { HighlightsBannerConfig } from 'types/homepage';

import config from 'configs/app';
import { cn } from 'lib/utils/cn';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Heading } from 'toolkit/chakra/heading';
import { Image } from 'toolkit/chakra/image';
import { Link } from 'toolkit/chakra/link';
import { Skeleton } from 'toolkit/chakra/skeleton';

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
      <HStack overflow="hidden" w="100%" gap={ 3 }>
        <VStack
          alignItems="flex-start"
          gap={ 3 }
          w={ totalNum === 2 ? '294px' : '193px' }
          flexShrink={ 0 }
        >
          <Heading
            level="3"
            style={{ color: titleColor }}
          >
            { data.title }
          </Heading>
          <Text
            textStyle="sm"
            color={{
              _light: data.description_color?.[0] || '#718096',
              _dark: data.description_color?.[1] || data.description_color?.[0] || '#AEB1B6',
            }}
          >
            { data.description }
          </Text>
        </VStack>
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
      </HStack>
    </Container>
  );
};

export default React.memo(HighlightsItem);
