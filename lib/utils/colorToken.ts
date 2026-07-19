// Resolve a legacy Chakra dot-notation color token (e.g. "text.secondary",
// "green.600") to the CSS custom property the theme actually defines, so it
// renders as a real color instead of an invalid `color: text.secondary` that
// the browser drops (which made values inherit white-on-white).
//
// Anything already valid CSS is passed through untouched: var(...), #hex,
// rgb(...)/hsl(...), a named color, or any bare word with no dot.
export function resolveColorToken(color?: string): string | undefined {
  if (!color) {
    return undefined;
  }
  if (!color.includes('.')) {
    return color;
  }
  return `var(--color-${ color.replace(/\./g, '-') })`;
}
