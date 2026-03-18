import React from 'react';

import type { ColorThemeId } from 'types/settings';

import * as cookies from 'lib/cookies';
import { COLOR_THEMES, getDefaultColorTheme, getThemeHexWithOverrides } from 'lib/settings/colorTheme';
import type { ColorMode } from 'toolkit/chakra/color-mode';
import { useColorMode } from 'toolkit/chakra/color-mode';

import SettingsSample from './SettingsSample';

interface Props {
  onSelect?: () => void;
}

const SettingsColorTheme = ({ onSelect }: Props) => {
  const { setColorMode } = useColorMode();

  const [ activeThemeId, setActiveThemeId ] = React.useState<ColorThemeId>();

  const setTheme = React.useCallback((themeId: ColorThemeId) => {
    const nextTheme = COLOR_THEMES.find((theme) => theme.id === themeId);
    const varValue = getThemeHexWithOverrides(themeId);

    if (!nextTheme || !varValue) {
      return;
    }

    setColorMode(nextTheme.colorMode);

    const varName = nextTheme.colorMode === 'light' ? '--chakra-colors-white' : '--chakra-colors-black';
    const varNameBg = nextTheme.colorMode === 'light' ? '--chakra-colors-theme-bg-primary-_light' : '--chakra-colors-theme-bg-primary-_dark';
    window.document.documentElement.style.setProperty(varName, varValue);
    window.document.documentElement.style.setProperty(varNameBg, varValue);

    cookies.set(cookies.NAMES.COLOR_MODE, nextTheme.colorMode);
    cookies.set(cookies.NAMES.COLOR_THEME, themeId);
    window.localStorage.setItem(cookies.NAMES.COLOR_MODE, nextTheme.colorMode);
  }, [ setColorMode ]);

  React.useEffect(() => {
    const cookieColorMode = cookies.get(cookies.NAMES.COLOR_MODE) as ColorMode | undefined;
    const cookieColorTheme = cookies.get(cookies.NAMES.COLOR_THEME) as ColorThemeId | undefined;

    const nextColorMode = (() => {
      if (!cookieColorMode) {
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }

      return cookieColorMode;
    })();

    const nextColorTheme = cookieColorTheme || getDefaultColorTheme(nextColorMode);

    setTheme(nextColorTheme);
    setActiveThemeId(nextColorTheme);
  // should run only on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ ]);

  const handleSelect = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
    event.stopPropagation();

    const themeId = event.currentTarget.getAttribute('data-value') as ColorThemeId | null;

    if (!themeId) {
      return;
    }

    setTheme(themeId);
    setActiveThemeId(themeId);
    onSelect?.();
  }, [ setTheme, onSelect ]);

  const activeTheme = COLOR_THEMES.find((theme) => theme.id === activeThemeId);

  return (
    <div>
      <div className="font-semibold">Color theme</div>
      <div className="text-[var(--color-text-secondary)] mt-1 mb-2">{ activeTheme?.label }</div>
      <div className="flex">
        { COLOR_THEMES.map((theme) => {
          return (
            <SettingsSample
              key={ theme.label }
              label={ theme.label }
              value={ theme.id }
              bg={ theme.sampleBg }
              isActive={ theme.id === activeThemeId }
              onClick={ handleSelect }
            />
          );
        }) }
      </div>
    </div>
  );
};

export default React.memo(SettingsColorTheme);
