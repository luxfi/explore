import React from 'react';

interface LuxLogoProps {
  width?: number;
  height?: number;
  className?: string;
  variant?: 'icon' | 'wordmark' | 'full';
}

export const LuxLogo: React.FC<LuxLogoProps> = ({ 
  width = 50, 
  height = 50, 
  className = '',
  variant = 'icon'
}) => {
  // LUX triangle icon (downward-pointing black triangle)
  const renderIcon = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 50 50" 
      width={width} 
      height={height}
      className={className}
    >
      <polygon 
        points="25,46.65 50,3.35 0,3.35" 
        fill="currentColor"
      />
    </svg>
  );

  // LUX wordmark in Inter font
  const renderWordmark = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 100 30" 
      width={width * 2} 
      height={height * 0.6}
      className={className}
    >
      <text 
        x="0" 
        y="23" 
        fontFamily="Inter, sans-serif" 
        fontSize="28" 
        fontWeight="700"
        letterSpacing="-0.02em"
        fill="currentColor"
      >
        LUX
      </text>
    </svg>
  );

  // Full logo with icon and wordmark
  const renderFull = () => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      viewBox="0 0 150 50" 
      width={width * 3} 
      height={height}
      className={className}
    >
      {/* Triangle icon */}
      <polygon 
        points="25,46.65 50,3.35 0,3.35" 
        fill="currentColor"
      />
      {/* Wordmark */}
      <text 
        x="60" 
        y="35" 
        fontFamily="Inter, sans-serif" 
        fontSize="32" 
        fontWeight="700"
        letterSpacing="-0.02em"
        fill="currentColor"
      >
        LUX
      </text>
    </svg>
  );

  switch (variant) {
    case 'wordmark':
      return renderWordmark();
    case 'full':
      return renderFull();
    case 'icon':
    default:
      return renderIcon();
  }
};

// Emoji version
export const LuxEmoji = () => '▼';

// Export variants for easy use
export const LuxIcon = (props: Omit<LuxLogoProps, 'variant'>) => (
  <LuxLogo {...props} variant="icon" />
);

export const LuxWordmark = (props: Omit<LuxLogoProps, 'variant'>) => (
  <LuxLogo {...props} variant="wordmark" />
);

export const LuxFullLogo = (props: Omit<LuxLogoProps, 'variant'>) => (
  <LuxLogo {...props} variant="full" />
);