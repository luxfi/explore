import { defaultsDeep } from 'es-toolkit/compat';

import config from 'configs/app';

// Lux monochrome theme — pure black/white/grey, no color accents
const DEFAULT_THEME_COLORS = {
  bg: {
    primary: {
      _light: { value: '#FFFFFF' },
      _dark: { value: '#000000' }, // pure black
    },
  },
  text: {
    primary: {
      _light: { value: '{colors.blackAlpha.800}' },
      _dark: { value: '{colors.whiteAlpha.800}' },
    },
    secondary: {
      _light: { value: '{colors.gray.500}' },
      _dark: { value: '{colors.gray.400}' },
    },
  },
  hover: {
    _light: { value: '{colors.gray.600}' },
    _dark: { value: '{colors.whiteAlpha.700}' },
  },
  selected: {
    control: {
      text: {
        _light: { value: '{colors.gray.900}' },
        _dark: { value: '{colors.gray.50}' },
      },
      bg: {
        _light: { value: '{colors.gray.100}' },
        _dark: { value: '{colors.whiteAlpha.100}' },
      },
    },
    option: {
      bg: {
        _light: { value: '{colors.gray.700}' },
        _dark: { value: '{colors.whiteAlpha.300}' },
      },
    },
  },
  icon: {
    primary: {
      _light: { value: '{colors.gray.500}' },
      _dark: { value: '{colors.gray.400}' },
    },
    secondary: {
      _light: { value: '{colors.gray.400}' },
      _dark: { value: '{colors.gray.500}' },
    },
  },
  button: {
    primary: {
      _light: { value: '{colors.gray.900}' },
      _dark: { value: '{colors.whiteAlpha.900}' },
      text: {
        _light: { value: '{colors.white}' },
        _dark: { value: '{colors.black}' },
      },
    },
  },
  link: {
    primary: {
      _light: { value: '{colors.gray.700}' },
      _dark: { value: '{colors.whiteAlpha.700}' },
    },
  },
  graph: {
    line: {
      _light: { value: '{colors.gray.500}' },
      _dark: { value: '{colors.whiteAlpha.600}' },
    },
    gradient: {
      start: {
        _light: { value: 'rgba(163, 163, 163, 0.3)' }, // neutral gray.400 with opacity
        _dark: { value: 'rgba(255, 255, 255, 0.15)' },
      },
      stop: {
        _light: { value: 'rgba(163, 163, 163, 0)' },
        _dark: { value: 'rgba(255, 255, 255, 0)' },
      },
    },
  },
  navigation: {
    bg: {
      selected: {
        _light: { value: '{colors.gray.100}' },
        _dark: { value: '{colors.whiteAlpha.100}' },
      },
    },
    text: {
      selected: {
        _light: { value: '{colors.gray.900}' },
        _dark: { value: '{colors.gray.50}' },
      },
    },
  },
  stats: {
    bg: {
      _light: { value: '{colors.gray.50}' },
      _dark: { value: '{colors.whiteAlpha.50}' },
    },
  },
  topbar: {
    bg: {
      _light: { value: '{colors.gray.50}' },
      _dark: { value: '{colors.whiteAlpha.50}' },
    },
  },
  tabs: {
    text: {
      primary: {
        _light: { value: '{colors.gray.900}' },
        _dark: { value: '{colors.whiteAlpha.800}' },
      },
    },
  },
};

const colors = {
  // BASE COLORS
  green: {
    '50': { value: '#F0FFF4' },
    '100': { value: '#C6F6D5' },
    '200': { value: '#9AE6B4' },
    '300': { value: '#68D391' },
    '400': { value: '#48BB78' },
    '500': { value: '#38A169' },
    '600': { value: '#25855A' },
    '700': { value: '#276749' },
    '800': { value: '#22543D' },
    '900': { value: '#1C4532' },
  },
  // Blue palette neutralized to gray (monochrome branding)
  blue: {
    '50': { value: '#FAFAFA' },
    '100': { value: '#F5F5F5' },
    '200': { value: '#E5E5E5' },
    '300': { value: '#D4D4D4' },
    '400': { value: '#A3A3A3' },
    '500': { value: '#737373' },
    '600': { value: '#525252' },
    '700': { value: '#404040' },
    '800': { value: '#262626' },
    '900': { value: '#171717' },
  },
  red: {
    '50': { value: '#FFF5F5' },
    '100': { value: '#FED7D7' },
    '200': { value: '#FEB2B2' },
    '300': { value: '#FC8181' },
    '400': { value: '#F56565' },
    '500': { value: '#E53E3E' },
    '600': { value: '#C53030' },
    '700': { value: '#9B2C2C' },
    '800': { value: '#822727' },
    '900': { value: '#63171B' },
  },
  // The warm ramps are kept as KEYS so a NEXT_PUBLIC_COLOR_THEME_OVERRIDES that
  // still spells `{colors.orange.500}` resolves instead of crashing — but every
  // rung is the neutral ladder now. Lux is monochrome; there is no orange.
  // What these held: orange 50..900 #FFFAF0 #FEEBCB #FBD38D #F6AD55 #ED8936
  // #DD6B20 #C05621 #9C4221 #7B341E #652B19; yellow 50..900 #FFFFF0 #FEFCBF
  // #FAF089 #F6E05E #ECC94B #D69E2E #B7791F #975A16 #744210 #5F370E.
  orange: {
    '50': { value: '#FAFAFA' },
    '100': { value: '#F5F5F5' },
    '200': { value: '#E5E5E5' },
    '300': { value: '#D4D4D4' },
    '400': { value: '#A3A3A3' },
    '500': { value: '#737373' },
    '600': { value: '#525252' },
    '700': { value: '#404040' },
    '800': { value: '#262626' },
    '900': { value: '#171717' },
  },
  yellow: {
    '50': { value: '#FAFAFA' },
    '100': { value: '#F5F5F5' },
    '200': { value: '#E5E5E5' },
    '300': { value: '#D4D4D4' },
    '400': { value: '#A3A3A3' },
    '500': { value: '#737373' },
    '600': { value: '#525252' },
    '700': { value: '#404040' },
    '800': { value: '#262626' },
    '900': { value: '#171717' },
  },
  // True neutral grays (no blue tint)
  gray: {
    '50': { value: '#FAFAFA' },
    '100': { value: '#F5F5F5' },
    '200': { value: '#E5E5E5' },
    '300': { value: '#D4D4D4' },
    '400': { value: '#A3A3A3' },
    '500': { value: '#737373' },
    '600': { value: '#525252' },
    '700': { value: '#404040' },
    '800': { value: '#262626' },
    '900': { value: '#171717' },
  },
  // Teal/cyan neutralized to gray (monochrome branding)
  teal: {
    '50': { value: '#FAFAFA' },
    '100': { value: '#F5F5F5' },
    '200': { value: '#E5E5E5' },
    '300': { value: '#D4D4D4' },
    '400': { value: '#A3A3A3' },
    '500': { value: '#737373' },
    '600': { value: '#525252' },
    '700': { value: '#404040' },
    '800': { value: '#262626' },
    '900': { value: '#171717' },
  },
  cyan: {
    '50': { value: '#FAFAFA' },
    '100': { value: '#F5F5F5' },
    '200': { value: '#E5E5E5' },
    '300': { value: '#D4D4D4' },
    '400': { value: '#A3A3A3' },
    '500': { value: '#737373' },
    '600': { value: '#525252' },
    '700': { value: '#404040' },
    '800': { value: '#262626' },
    '900': { value: '#171717' },
  },
  purple: {
    '50': { value: '#FAF5FF' },
    '100': { value: '#E9D8FD' },
    '200': { value: '#D6BCFA' },
    '300': { value: '#B794F4' },
    '400': { value: '#9F7AEA' },
    '500': { value: '#805AD5' },
    '600': { value: '#6B46C1' },
    '700': { value: '#553C9A' },
    '800': { value: '#44337A' },
    '900': { value: '#322659' },
  },
  pink: {
    '50': { value: '#FFF5F7' },
    '100': { value: '#FED7E2' },
    '200': { value: '#FBB6CE' },
    '300': { value: '#F687B3' },
    '400': { value: '#ED64A6' },
    '500': { value: '#D53F8C' },
    '600': { value: '#B83280' },
    '700': { value: '#97266D' },
    '800': { value: '#702459' },
    '900': { value: '#521B41' },
  },
  black: { value: '#000000' },
  white: { value: '#ffffff' },
  whiteAlpha: {
    '50': { value: 'RGBA(255, 255, 255, 0.04)' },
    '100': { value: 'RGBA(255, 255, 255, 0.06)' },
    '200': { value: 'RGBA(255, 255, 255, 0.08)' },
    '300': { value: 'RGBA(255, 255, 255, 0.16)' },
    '400': { value: 'RGBA(255, 255, 255, 0.24)' },
    '500': { value: 'RGBA(255, 255, 255, 0.36)' },
    '600': { value: 'RGBA(255, 255, 255, 0.48)' },
    '700': { value: 'RGBA(255, 255, 255, 0.64)' },
    '800': { value: 'RGBA(255, 255, 255, 0.80)' },
    '900': { value: 'RGBA(255, 255, 255, 0.92)' },
  },
  blackAlpha: {
    '50': { value: 'RGBA(16, 17, 18, 0.04)' },
    '100': { value: 'RGBA(16, 17, 18, 0.06)' },
    '200': { value: 'RGBA(16, 17, 18, 0.08)' },
    '300': { value: 'RGBA(16, 17, 18, 0.16)' },
    '400': { value: 'RGBA(16, 17, 18, 0.24)' },
    '500': { value: 'RGBA(16, 17, 18, 0.36)' },
    '600': { value: 'RGBA(16, 17, 18, 0.48)' },
    '700': { value: 'RGBA(16, 17, 18, 0.64)' },
    '800': { value: 'RGBA(16, 17, 18, 0.80)' },
    '900': { value: 'RGBA(16, 17, 18, 0.92)' },
  },

  // BRAND COLORS
  github: { value: '#171923' },
  telegram: { value: '#2775CA' },
  linkedin: { value: '#1564BA' },
  discord: { value: '#9747FF' },
  slack: { value: '#1BA27A' },
  twitter: { value: '#000000' },
  opensea: { value: '#2081E2' },
  facebook: { value: '#4460A0' },
  medium: { value: '#231F20' },
  reddit: { value: '#FF4500' },
  celo: { value: '#FCFF52' },
  clusters: { value: '#DE6061' },

  // THEME COLORS
  theme: defaultsDeep(config.UI.colorTheme.overrides, DEFAULT_THEME_COLORS),
};

export default colors;
