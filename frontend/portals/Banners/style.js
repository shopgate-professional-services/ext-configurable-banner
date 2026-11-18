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
  '&&': {
    transition: 'transform 0.2s ease, margin-bottom 0.2s ease',
  },
});

export const overflowWrapper = css({
  overflow: 'hidden',
});

export const topmostContainer = css({
  marginTop: 'calc(-1 * var(--safe-area-inset-top, 0px))',
}).toString();

// Height of the topmost banners with hideOnScroll, the content reserves it at its top.
export const RESERVED_SPACE_PROP = '--configurable-banner-reserved-space';
// Part of the reserved space the content currently lies under the banners: the full height
// while they are shown, 0 while they are hidden.
export const CONTENT_SHIFT_PROP = '--configurable-banner-content-shift';
// Duration of the content shift, so it moves together with the banners.
export const CONTENT_SHIFT_DURATION_PROP = '--configurable-banner-content-shift-duration';

// The view content starts below the header. A banner with hideOnScroll changes the height of the
// header, which would move the scroll container of the view. iOS applies such a move in one step
// while it scrolls with momentum or bounces, so the page jumps. The content therefore lies under
// the banners and moves up by the same height the header gains, which keeps the scroll container
// in place. The scrolled content reserves the space at its top, like the PWA does it for its
// search bar. Not with a floating header, which already lies over the content.
const BELOW_FIXED_HEADER = '#AppHeader:not([data-overlay]) ~ #AppContent';

css.global(BELOW_FIXED_HEADER, {
  marginTop: `calc(-1 * var(${CONTENT_SHIFT_PROP}, 0px))`,
  transition: `margin-top var(${CONTENT_SHIFT_DURATION_PROP}, 0s) ease`,
});

css.global(`${BELOW_FIXED_HEADER} .engage__view__content__scrollable-content::before`, {
  content: '""',
  display: 'block',
  flexShrink: 0,
  height: `var(${RESERVED_SPACE_PROP}, 0px)`,
});

export const SEARCH_BAR_HEIGHT_PROP = '--configurable-banner-search-bar-height';
export const TOP_BACKGROUND_PROP = '--configurable-banner-top-background';

const floatingHeaderSpace = `calc(var(--app-bar-height, 0px) + var(${SEARCH_BAR_HEIGHT_PROP}, 0px))`;

export const topContainer = css({
  '#AppHeader[data-overlay] ~ #AppContent &': {
    paddingTop: floatingHeaderSpace,
    backgroundImage: `linear-gradient(var(${TOP_BACKGROUND_PROP}), var(${TOP_BACKGROUND_PROP}))`,
    backgroundSize: `100% ${floatingHeaderSpace}`,
    backgroundRepeat: 'no-repeat',
  },
}).toString();
