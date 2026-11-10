import { css } from 'glamor';

export const scrolledIn = css({
  '&&': {
    transform: 'translateY(0%)',
    marginBottom: 0,
  },
}).toString();

export const scrolledOut = css({
  '&&': {
    transform: 'translateY(-250%)',
  },
});

export const scrollHeaderStyle = css({
  transition: 'transform 0.2s ease,transform 0.2s, margin-bottom 0.2s ease',
});

export const overflowWrapper = css({
  overflow: 'hidden',
});

// The first banner above the header moves into the area of the status bar, so the status bar
// takes the color of the banner instead of the color of the header.
export const topmostContainer = css({
  marginTop: 'calc(-1 * var(--safe-area-inset-top, 0px))',
}).toString();

// On pages with a floating header the banners at the top start below the header.
export const topContainer = css({
  '#AppHeader[data-overlay] ~ #AppContent &': {
    paddingTop: 'calc(var(--app-bar-height, 0px) + var(--sg-search-bar-floating-height, 0px))',
  },
}).toString();
