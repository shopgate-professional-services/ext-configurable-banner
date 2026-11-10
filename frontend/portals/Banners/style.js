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

export const topmostContainer = css({
  marginTop: 'calc(-1 * var(--safe-area-inset-top, 0px))',
}).toString();

export const SEARCH_BAR_HEIGHT_PROP = '--configurable-banner-search-bar-height';

export const topContainer = css({
  '#AppHeader[data-overlay] ~ #AppContent &': {
    paddingTop: `calc(var(--app-bar-height, 0px) + var(${SEARCH_BAR_HEIGHT_PROP}, 0px))`,
  },
}).toString();
