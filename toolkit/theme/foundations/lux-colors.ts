export default {
  colors: {
    // Pure black background
    level: { value: 'hsl(0 0% 0%)' },
    level0: { value: 'hsl(0 0% 0%)' },
    level1: { value: 'hsl(0 0% 5%)' },
    level2: { value: 'hsl(0 0% 10%)' },
    level3: { value: 'hsl(0 0% 15%)' },

    // Grey shades for muted elements
    muted: { value: 'hsl(0 0% 60%)' },
    muted1: { value: 'hsl(0 0% 60%)' },
    muted2: { value: 'hsl(0 0% 45%)' },
    muted3: { value: 'hsl(0 0% 30%)' },
    muted4: { value: 'hsl(0 0% 20%)' },

    // Pure black background, white accent and foreground
    background: { value: 'hsl(0 0% 0%)' },
    accent: { value: 'hsl(0 0% 100%)' },
    foreground: { value: 'hsl(0 0% 100%)' },

    // Primary: white background, black text (for buttons)
    primary: {
      main: { value: 'hsl(0 0% 100%)' },
      hover: { value: 'hsl(0 0% 90%)' },
      fg: { value: 'hsl(0 0% 0%)' },
    },

    // Secondary: desaturated greys
    secondary: {
      main: { value: 'hsl(0 0% 30%)' },
      hover: { value: 'hsl(0 0% 40%)' },
      fg: { value: 'hsl(0 0% 100%)' },
      '1': { value: 'hsl(0 0% 40%)' },
      '2': { value: 'hsl(0 0% 50%)' },
      '3': { value: 'hsl(0 0% 60%)' },
    },

    // Navigation: grey to white on hover
    nav: {
      main: { value: 'hsl(0 0% 60%)' },
      hover: { value: 'hsl(0 0% 100%)' },
      current: { value: 'hsl(0 0% 100%)' },
    },
  },
};
