import { injectGlobal } from '@shopgate/engage/styles';

// Height of the topmost banners with hideOnScroll, the content reserves it at its top. It is set
// in two places: on html for the visible route (content margin and header shift), and on the
// scroll container of the banners' own view for its ::before. The latter goes one frame after the
// banners turn inactive and stays when the view unmounts: leaving a route empties its banners
// before the view saves its scroll position on unmount, and removing the space before that makes
// scroll anchoring (Android) shift the saved position.
export const RESERVED_SPACE_PROP = '--configurable-banner-reserved-space';
// Duration of the header shift, 0s while the height of the banners changes.
export const HEADER_SHIFT_DURATION_PROP = '--configurable-banner-header-shift-duration';
// Set on the document element while the topmost banners with hideOnScroll are hidden.
export const HIDDEN_ATTRIBUTE = 'data-configurable-banner-hidden';

export const SEARCH_BAR_HEIGHT_PROP = '--configurable-banner-search-bar-height';
export const TOP_BACKGROUND_PROP = '--configurable-banner-top-background';

// Hiding the banners changes no layout. The header keeps its height and slides up by the height
// of the banners with a transform, the same way the search bar of the PWA hides. Animating the
// header height and the content margin instead made iOS lay out the page on every frame, so the
// header stuttered. The view content always lies under the banners and reserves their space at
// its top, so it stays in place. Not with a floating header, which already lies over the content.
// The extension owns transform and transition of #AppHeader.
const BELOW_FIXED_HEADER = '#AppHeader:not([data-overlay]) ~ #AppContent';

injectGlobal({
  '#AppHeader': {
    transition: `transform var(${HEADER_SHIFT_DURATION_PROP}, 0s) ease`,
  },
  [`html[${HIDDEN_ATTRIBUTE}] #AppHeader`]: {
    transform: `translateY(calc(-1 * var(${RESERVED_SPACE_PROP}, 0px)))`,
  },
  [BELOW_FIXED_HEADER]: {
    marginTop: `calc(-1 * var(${RESERVED_SPACE_PROP}, 0px))`,
  },
  [`${BELOW_FIXED_HEADER} .engage__view__content__scrollable-content::before`]: {
    content: '""',
    display: 'block',
    flexShrink: 0,
    height: `var(${RESERVED_SPACE_PROP}, 0px)`,
  },
});

export const FLOATING_HEADER_SPACE = `calc(var(--app-bar-height, 0px) + var(${SEARCH_BAR_HEIGHT_PROP}, 0px))`;
