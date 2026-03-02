import { debounce } from 'es-toolkit';
import React, { useRef, useEffect, useState, useCallback } from 'react';

const CUT_HEIGHT = 144;

const AccountPageDescription = ({ children, allowCut = true }: { children: React.ReactNode; allowCut?: boolean }) => {
  const ref = useRef<HTMLParagraphElement>(null);

  const [ needCut, setNeedCut ] = useState(false);
  const [ expanded, setExpanded ] = useState(false);

  const calculateCut = useCallback(() => {
    const textHeight = ref.current?.offsetHeight;
    if (!needCut && textHeight && textHeight > CUT_HEIGHT) {
      setNeedCut(true);
    } else if (needCut && textHeight && textHeight < CUT_HEIGHT) {
      setNeedCut(false);
    }
  }, [ needCut ]);

  useEffect(() => {
    if (!allowCut) {
      return;
    }

    calculateCut();
    const resizeHandler = debounce(calculateCut, 300);
    window.addEventListener('resize', resizeHandler);
    return function cleanup() {
      window.removeEventListener('resize', resizeHandler);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  const expand = useCallback(() => {
    setExpanded(true);
  }, []);

  return (
    <div className="relative mb-6 lg:mb-8">
      <div
        ref={ ref }
        className="overflow-hidden"
        style={{
          maxHeight: needCut && !expanded ? `${ CUT_HEIGHT }px` : 'auto',
          ...(needCut && !expanded ? { WebkitLineClamp: '6', WebkitBoxOrient: 'vertical', display: '-webkit-box' } as React.CSSProperties : {}),
        }}
      >
        { children }
      </div>
      { needCut && !expanded && (
        <div
          className="absolute -bottom-4 left-0 w-full h-[63px] cursor-pointer"
          style={{
            background: 'var(--color-light, linear-gradient(360deg, rgba(255, 255, 255, 0.8) 38.1%, rgba(255, 255, 255, 0) 166.67%))',
          }}
          onClick={ expand }
        />
      ) }
    </div>
  );
};

export default AccountPageDescription;
