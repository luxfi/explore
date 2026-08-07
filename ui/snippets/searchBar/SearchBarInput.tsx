import { Input } from '@luxfi/ui/input';
import { InputGroup } from '@luxfi/ui/input-group';
import React from 'react';
import type { ChangeEvent, FormEvent, FocusEvent } from 'react';

import useIsMobile from 'lib/hooks/useIsMobile';
import { ClearButton } from 'toolkit/components/buttons/ClearButton';
import IconSvg from 'ui/shared/IconSvg';
import { useAssistantShortcut } from 'ui/snippets/searchBar/SearchBarAssistant';

interface Props extends Omit<React.HTMLAttributes<HTMLFormElement>, 'onChange'> {
  onChange?: (value: string) => void;
  onSubmit?: (event: FormEvent<HTMLFormElement>) => void;
  onBlur?: (event: FocusEvent<HTMLFormElement>) => void;
  onFocus?: () => void;
  onHide?: () => void;
  onClear?: () => void;
  onFormClick?: (event: React.MouseEvent<HTMLFormElement>) => void;
  isHeroBanner?: boolean;
  isSuggestOpen?: boolean;
  value?: string;
  readOnly?: boolean;
  mb?: number;
  w?: string;
  backgroundColor?: string;
  borderRadius?: string;
  position?: string;
  zIndex?: string;
}

const SearchBarInput = (
  { onChange, onSubmit, isHeroBanner, isSuggestOpen, onFocus, onBlur, onHide, onClear, onFormClick, value, readOnly, ...rest }: Props,
  ref: React.ForwardedRef<HTMLFormElement>,
) => {
  const innerRef = React.useRef<HTMLFormElement>(null);
  React.useImperativeHandle(ref, () => innerRef.current as HTMLFormElement, []);
  const isMobile = useIsMobile();
  const shortcut = useAssistantShortcut();

  const handleChange = React.useCallback((event: ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.value);
  }, [ onChange ]);

  const handleKeyPress = React.useCallback((event: KeyboardEvent) => {
    if (isMobile) {
      return;
    }

    switch (event.key) {
      case '/': {
        if ([ 'INPUT', 'TEXTAREA' ].includes((event.target as HTMLElement).tagName)) {
          break;
        }

        if (!isSuggestOpen) {
          event.preventDefault();
          innerRef.current?.querySelector('input')?.focus();
          onFocus?.();
        }
        break;
      }
      case 'Escape': {
        if (isSuggestOpen) {
          innerRef.current?.querySelector('input')?.blur();
          onHide?.();
        }
        break;
      }
    }
  }, [ isMobile, isSuggestOpen, onFocus, onHide ]);

  React.useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [ handleKeyPress ]);

  const startElement = <IconSvg name="search" className="w-5 h-5"/>;

  const endElement = (
    <>
      <ClearButton onClick={ onClear } visible={ Boolean(value?.length) } className="mx-2"/>
      { !isMobile && shortcut && (
        <div
          className={
            'flex items-center justify-center h-5 px-1.5 mr-2 rounded-sm whitespace-nowrap' +
            ' border border-solid border-[var(--color-icon-secondary)]' +
            ' text-[var(--color-icon-secondary)] text-xs font-medium'
          }
        >
          { shortcut }
        </div>
      ) }
    </>
  );

  return (
    <form
      ref={ innerRef }
      noValidate
      onSubmit={ onSubmit }
      onBlur={ onBlur }
      onClick={ onFormClick }
      className="w-full rounded-base relative"
      style={{
        backgroundColor: 'var(--color-bg-primary)',
        zIndex: isSuggestOpen ? 'var(--zIndex-modal)' : 'auto',
      }}
      { ...rest }
    >
      <InputGroup
        startElement={ startElement }
        startElementProps={{ className: 'px-2' }}
        endElement={ endElement }
      >
        <Input
          size={ isHeroBanner ? 'md' : 'sm' }
          placeholder="Search or ask anything"
          value={ value }
          onChange={ handleChange }
          onFocus={ onFocus }
          tabIndex={ readOnly ? -1 : 0 }
          className="border border-solid border-[var(--color-input-border)] bg-[var(--color-input-bg)] rounded-lg"
          enterKeyHint="search"
        />
      </InputGroup>
    </form>
  );
};

export default React.memo(React.forwardRef(SearchBarInput));
