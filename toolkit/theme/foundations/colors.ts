import luxColors from './lux-colors';

// Monochromatic grayscale palette
const gray = {
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
};

const colors = {
  // Use gray for all color scales
  green: gray,
  blue: gray,
  red: gray,
  orange: gray,
  yellow: gray,
  teal: gray,
  cyan: gray,
  purple: gray,
  pink: gray,
  
  // Pure black and white
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
    '50': { value: 'RGBA(0, 0, 0, 0.04)' },
    '100': { value: 'RGBA(0, 0, 0, 0.06)' },
    '200': { value: 'RGBA(0, 0, 0, 0.08)' },
    '300': { value: 'RGBA(0, 0, 0, 0.16)' },
    '400': { value: 'RGBA(0, 0, 0, 0.24)' },
    '500': { value: 'RGBA(0, 0, 0, 0.36)' },
    '600': { value: 'RGBA(0, 0, 0, 0.48)' },
    '700': { value: 'RGBA(0, 0, 0, 0.64)' },
    '800': { value: 'RGBA(0, 0, 0, 0.80)' },
    '900': { value: 'RGBA(0, 0, 0, 0.92)' },
  },
  
  // Grayscale brand colors
  github: { value: '#171717' },
  telegram: { value: '#525252' },
  linkedin: { value: '#404040' },
  discord: { value: '#737373' },
  slack: { value: '#525252' },
  twitter: { value: '#000000' },
  opensea: { value: '#404040' },
  facebook: { value: '#525252' },
  medium: { value: '#171717' },
  reddit: { value: '#737373' },
  celo: { value: '#F5F5F5' },
  
  // Include LUX specific colors
  ...luxColors.colors,
};

export default colors;