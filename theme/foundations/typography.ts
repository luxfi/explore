import { theme } from '@chakra-ui/react';

import config from 'configs/app';

export const BODY_TYPEFACE = config.UI.fonts.body?.name ?? 'Inter';
export const HEADING_TYPEFACE = config.UI.fonts.heading?.name ?? 'Poppins';

const drukWide = localFont({
  src: [
    {
      path: './fonts/Druk-Wide-Bold.ttf',
      weight: '700',
      style: 'normal'
    },
    {
      path: './fonts/Druk-Wide-Medium.ttf',
      weight: '500',
      style: 'normal',
    },
    h4: {
      fontSize: 'md',
      fontWeight: '500',
      lineHeight: '24px',
      fontFamily: 'heading',
    },
  },
};

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })


const fonts = {
  heading: `${drukWide.style.fontFamily}, ${ theme.fonts.heading }`,
  body: `${inter.style.fontFamily}, ${ theme.fonts.body }`,
}

export {
  fonts as default,
  drukWide,
  inter
}
