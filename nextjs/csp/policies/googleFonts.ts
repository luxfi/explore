import type CspDev from 'csp-dev';

export function googleFonts(): CspDev.DirectiveDescriptor {

  return {
    'connect-src': [
      'fonts.gstatic.com',
    ],
    'style-src': [
      'fonts.googleapis.com',
    ],
    'font-src': [
      'fonts.gstatic.com',
      'fonts.googleapis.com',
    ],
  };
}
