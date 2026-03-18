import { debounce } from 'es-toolkit';
import * as React from 'react';

import { cn } from 'lib/utils/cn';

import getComponentDisplayName from '../utils/getComponentDisplayName';
import type { InputProps } from './input';

export interface InputElementProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly placement?: 'start' | 'end';
}

export interface InputGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  readonly startElementProps?: InputElementProps;
  readonly endElementProps?: InputElementProps;
  readonly startElement?: React.ReactNode;
  readonly endElement?: React.ReactNode;
  readonly children: React.ReactElement<InputElementProps>;
  readonly startOffset?: string | number;
  readonly endOffset?: string | number;
}

export const InputGroup = React.forwardRef<HTMLDivElement, InputGroupProps>(
  function InputGroup(props, ref) {
    const {
      startElement,
      startElementProps,
      endElement,
      endElementProps,
      children,
      startOffset,
      endOffset,
      className,
      ...rest
    } = props;

    const startElementRef = React.useRef<HTMLDivElement>(null);
    const endElementRef = React.useRef<HTMLDivElement>(null);
    const groupRef = React.useRef<HTMLDivElement>(null);

    const [ inlinePaddings, setInlinePaddings ] = React.useState<{ start?: number; end?: number }>();

    const calculateInlinePaddings = React.useCallback(() => {
      const startWidth = startElementRef.current?.getBoundingClientRect().width ?? 0;
      const endWidth = endElementRef.current?.getBoundingClientRect().width ?? 0;

      setInlinePaddings({
        start: startWidth,
        end: endWidth,
      });
    }, []);

    React.useEffect(() => {
      if (!groupRef.current) return;

      let timeoutId: ReturnType<typeof setTimeout>;

      const intersectionObserver = new IntersectionObserver(
        (entries) => {
          const entry = entries[0];
          if (entry && entry.isIntersecting) {
            // Small delay to ensure rendering is complete
            timeoutId = setTimeout(calculateInlinePaddings, 50);
          }
        },
        { threshold: 0.01 },
      );

      intersectionObserver.observe(groupRef.current);

      return () => {
        intersectionObserver.disconnect();
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
      };
    }, [ calculateInlinePaddings ]);

    React.useEffect(() => {
      calculateInlinePaddings();

      const resizeHandler = debounce(calculateInlinePaddings, 300);
      const resizeObserver = new ResizeObserver(resizeHandler);

      if (groupRef.current) {
        resizeObserver.observe(groupRef.current);
      }

      return function cleanup() {
        resizeObserver.disconnect();
      };
    }, [ calculateInlinePaddings ]);

    // Combine refs for the wrapper div
    const combinedRef = React.useCallback((node: HTMLDivElement) => {
      groupRef.current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        ref.current = node;
      }
    }, [ ref ]);

    const { className: startClassName, ...startRest } = startElementProps ?? {};
    const { className: endClassName, ...endRest } = endElementProps ?? {};

    return (
      <div
        ref={ combinedRef }
        className={ cn('relative flex w-full items-center', className) }
        { ...rest }
      >
        { startElement && (
          <div
            ref={ startElementRef }
            className={ cn(
              'pointer-events-none absolute inset-y-0 left-0 z-[1] flex items-center text-[var(--color-icon-secondary)]',
              startClassName,
            ) }
            { ...startRest }
          >
            { startElement }
          </div>
        ) }
        { React.Children.map(children, (child: React.ReactElement<InputProps>) => {
          if (getComponentDisplayName(child.type) !== 'FieldInput') {
            return child;
          }
          return React.cloneElement(child, {
            ...(startElement && { ps: startOffset ?? (inlinePaddings?.start ? `${ inlinePaddings.start }px` : undefined) }),
            ...(endElement && { pe: endOffset ?? (inlinePaddings?.end ? `${ inlinePaddings.end }px` : undefined) }),
            // hide input value and placeholder for the first render
            value: inlinePaddings ? child.props.value : undefined,
            placeholder: inlinePaddings ? child.props.placeholder : undefined,
          });
        }) }
        { endElement && (
          <div
            ref={ endElementRef }
            className={ cn(
              'pointer-events-none absolute inset-y-0 right-0 z-[1] flex items-center text-[var(--color-icon-secondary)]',
              endClassName,
            ) }
            { ...endRest }
          >
            { endElement }
          </div>
        ) }
      </div>
    );
  },
);

InputGroup.displayName = 'InputGroup';
