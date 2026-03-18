import { debounce } from 'es-toolkit';
import React from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import { Heading } from 'toolkit/chakra/heading';
import { Skeleton } from 'toolkit/chakra/skeleton';
import { Tooltip } from 'toolkit/chakra/tooltip';
import { useDisclosure } from 'toolkit/hooks/useDisclosure';
import TextAd from 'ui/shared/ad/TextAd';

type Props = {
  title: string;
  className?: string;
  beforeTitle?: React.ReactNode;
  afterTitle?: React.ReactNode;
  contentAfter?: React.ReactNode;
  secondRow?: React.ReactNode;
  isLoading?: boolean;
  withTextAd?: boolean;
};

const TEXT_MAX_LINES = 1;

const PageTitle = ({ title, contentAfter, withTextAd, className, isLoading = false, afterTitle, beforeTitle, secondRow }: Props) => {
  const tooltip = useDisclosure();
  const isMobile = useIsMobile();
  const [ isTextTruncated, setIsTextTruncated ] = React.useState(false);

  const headingRef = React.useRef<HTMLHeadingElement>(null);
  const textRef = React.useRef<HTMLSpanElement>(null);

  const updatedTruncateState = React.useCallback(() => {
    if (!headingRef.current || !textRef.current) {
      return;
    }

    const headingRect = headingRef.current.getBoundingClientRect();
    const textRect = textRef.current.getBoundingClientRect();
    if ((TEXT_MAX_LINES + 1) * headingRect.height <= textRect.height) {
      setIsTextTruncated(true);
    } else {
      setIsTextTruncated(false);
    }
  }, []);

  React.useEffect(() => {
    if (!isLoading) {
      updatedTruncateState();
    }
  }, [ isLoading, updatedTruncateState ]);

  React.useEffect(() => {
    const handleResize = debounce(updatedTruncateState, 1000);
    window.addEventListener('resize', handleResize);

    return function cleanup() {
      window.removeEventListener('resize', handleResize);
    };
  }, [ updatedTruncateState ]);

  const handleTooltipOpenChange = React.useCallback((details: { open: boolean }) => {
    if (details.open) {
      tooltip.onOpen();
    } else {
      tooltip.onClose();
    }
  }, [ tooltip ]);

  return (
    <div className="flex flex-col gap-y-3 mb-6" className={ className }>
      <div className="flex items-center flex-row flex-wrap gap-x-3 gap-y-3"
      >
        <div className="flex items-center" h={{ base: 'auto', lg: isLoading ? 10 : 'auto' }} maxW="100%">
          { beforeTitle }
          <Skeleton
            loading={ isLoading }
            className="overflow-hidden"
          >
            <Tooltip
              content={ title }
              open={ tooltip.open }
              onOpenChange={ handleTooltipOpenChange }
              contentProps={{ className: 'max-w-[calc(100vw-32px)] lg:max-w-[500px]' }}
              disabled={ !isTextTruncated }
            >
              <Heading
                ref={ headingRef }
                level="1"
                className="whitespace-normal break-all overflow-hidden text-ellipsis"
                style={{
                  WebkitLineClamp: TEXT_MAX_LINES,
                  WebkitBoxOrient: 'vertical',
                  display: '-webkit-box',
                }}
                onMouseEnter={ tooltip.onOpen }
                onMouseLeave={ tooltip.onClose }
                onClick={ isMobile ? tooltip.onToggle : undefined }
              >
                <span ref={ textRef }>
                  { title }
                </span>
              </Heading>
            </Tooltip>
          </Skeleton>
          { afterTitle }
        </div>
        { contentAfter }
        { withTextAd && <TextAd order={{ base: -1, lg: 100 }} mb={{ base: 6, lg: 0 }} ml="auto" w={{ base: '100%', lg: 'auto' }}/> }
      </div>
      { secondRow && (
        <Skeleton loading={ isLoading } alignItems="center" display="flex" className="min-h-10 overflow-hidden empty:hidden">
          { secondRow }
        </Skeleton>
      ) }
    </div>
  );
};

export default PageTitle;
