import { menuAnatomy as parts } from '@chakra-ui/anatomy';
import {
  createMultiStyleConfigHelpers,
  cssVar,
  defineStyle,
} from '@chakra-ui/styled-system';

import luxColors from 'theme/foundations/lux-colors';

const { defineMultiStyleConfig, definePartsStyle } =
  createMultiStyleConfigHelpers(parts.keys);

const $bg = cssVar('menu-bg');
const $shadow = cssVar('menu-shadow');

const baseStyleList = defineStyle({
  [$bg.variable]: '#fff',
  [$shadow.variable]: 'shadows.2xl',
  _dark: {
    [$bg.variable]: luxColors.colors.muted, //'colors.gray.900',
    [$shadow.variable]: 'shadows.dark-lg',
  },
  borderWidth: '0',
  bg: $bg.reference,
  boxShadow: $shadow.reference,
});

const baseStyleItem = defineStyle({
  _focus: {
    [$bg.variable]: 'transparent',
    _dark: {
      [$bg.variable]: 'transparent',
    },
  },
  _hover: {
    [$bg.variable]: 'colors.blue.50',
    _dark: {
      [$bg.variable]: 'colors.whiteAlpha.100',
    },
  },
  bg: luxColors.colors.level1,
});

const baseStyle = definePartsStyle({
  list: baseStyleList,
  item: baseStyleItem,
});

const Menu = defineMultiStyleConfig({
  baseStyle,
});

export default Menu;
