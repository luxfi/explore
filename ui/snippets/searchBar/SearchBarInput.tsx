import React from 'react';
import type { ChangeEvent, FormEvent, FocusEvent } from 'react';

import config from 'configs/app';
import useIsMobile from 'lib/hooks/useIsMobile';
import { useColorModeValue } from 'toolkit/chakra/color-mode';
import { Input } from 'toolkit/chakra/input';
import { InputGroup } from 'toolkit/chakra/input-group';
import { ClearButton } from 'toolkit/components/buttons/ClearButton';
import IconSvg from 'ui/shared/IconSvg';

const nameServicesFeature = config.features.nameServices;

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

  const getPlaceholder = () => {
    const clusterText = nameServicesFeature.isEnabled && nameServicesFeature.clusters.isEnabled ? ' / cluster ' : '';
    return `Search by address / txn hash / block / token${ clusterText }/... `;
  };

  const startElement = (
    <IconSvg
      name="search"
      boxSize={ 5 }
      mx={ 2 }
    />
  );

  const endElement = (
    <>
      <ClearButton onClick={ onClear } visible={ Boolean(value?.length) } className="mx-2"/>
      { !isMobile && (
        <div
          className="flex items-center justify-center size-5 mr-2 rounded-sm border border-solid"
          style={{ borderColor: 'var(--color-input-element)' }}
        >
          /
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
        endElement={ endElement }
      >
        <Input
          size={ isHeroBanner ? 'md' : 'sm' }
          placeholder={ getPlaceholder() }
          value={ value }
          onChange={ handleChange }
          onFocus={ onFocus }
          tabIndex={ readOnly ? -1 : 0 }
          className="border-2 border-solid border-[var(--color-input-border)] bg-[var(--color-input-bg)]"
          enterKeyHint="search"
        />
      </InputGroup>
    </form>
  );
};

export default React.memo(React.forwardRef(SearchBarInput));
