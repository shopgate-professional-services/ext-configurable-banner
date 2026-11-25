import React, {
  useState, useLayoutEffect, useCallback, useRef, useContext,
} from 'react';
import PropTypes from 'prop-types';
import { useRoute } from '@shopgate/engage/core';
import { ViewContext } from '@shopgate/engage/components';
import { useViewScroll } from '@shopgate/engage/core/hooks';
import { makeStyles } from '@shopgate/engage/styles';
import connect from './connector';
import Banner from './Banner';
import HideOnScrollBanner from './HideOnScrollBanner';
import { BANNER_POSITION_TOPMOST } from '../../constants';
import { getBannerBackground, hasPlainBackgroundColor } from './helpers';
import {
  FLOATING_HEADER_SPACE,
  HEADER_SHIFT_DURATION_PROP,
  HIDDEN_ATTRIBUTE,
  RESERVED_SPACE_PROP,
  SEARCH_BAR_HEIGHT_PROP,
  TOP_BACKGROUND_PROP,
} from './style';

const useStyles = makeStyles()({
  topmostContainer: {
    marginTop: 'calc(-1 * var(--safe-area-inset-top, 0px))',
  },
  topContainer: {
    '#AppHeader[data-overlay] ~ #AppContent &': {
      paddingTop: FLOATING_HEADER_SPACE,
      backgroundImage: `linear-gradient(var(${TOP_BACKGROUND_PROP}), var(${TOP_BACKGROUND_PROP}))`,
      backgroundSize: `100% ${FLOATING_HEADER_SPACE}`,
      backgroundRepeat: 'no-repeat',
    },
  },
});

/**
 * Keeps the largest height the floating search bar had while the page was visible. The PWA sets
 * the visible height only, which drops to 0 while the bar hides on scroll. Following it would
 * move the page content up and down while scrolling.
 * @param {boolean} active Whether to track the height.
 * @returns {number}
 */
const useFloatingSearchBarHeight = (active) => {
  const [height, setHeight] = useState(0);

  useLayoutEffect(() => {
    if (!active) {
      return undefined;
    }

    const root = document.documentElement;
    /** Reads the current height of the floating search bar. */
    const update = () => {
      const value = parseFloat(root.style.getPropertyValue('--sg-search-bar-floating-height')) || 0;
      setHeight(current => Math.max(current, value));
    };

    update();

    if (typeof MutationObserver !== 'function') {
      return undefined;
    }

    const observer = new MutationObserver(update);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ['style'],
    });
    return () => observer.disconnect();
  }, [active]);

  return height;
};

/**
 * Lets the content of the visible route lie under the topmost banners with hideOnScroll, and
 * slides the header up by their height while they are hidden (see style.js).
 * @param {boolean} active Whether the banners of the visible route hide on scroll.
 * @param {number} height The height the banners free when they hide.
 * @param {boolean} hidden Whether the banners are hidden.
 */
const useHeaderShift = (active, height, hidden) => {
  const appliedHeight = useRef(null);

  useLayoutEffect(() => {
    if (!active) {
      appliedHeight.current = null;
      return undefined;
    }

    // Only hiding and showing slides the header. A new height (measuring, resizing) applies at
    // once, the same as the banner does without hideOnScroll.
    const animate = appliedHeight.current === height;
    appliedHeight.current = height;

    const root = document.documentElement;
    root.style.setProperty(RESERVED_SPACE_PROP, `${height}px`);
    root.style.setProperty(HEADER_SHIFT_DURATION_PROP, animate ? '0.2s' : '0s');
    root.toggleAttribute(HIDDEN_ATTRIBUTE, hidden);

    return () => {
      root.style.removeProperty(RESERVED_SPACE_PROP);
      root.style.removeProperty(HEADER_SHIFT_DURATION_PROP);
      root.removeAttribute(HIDDEN_ATTRIBUTE);
    };
  }, [active, height, hidden]);
};

/**
 * Reserves the space of the banners at the top of the scroll container of their own view. When
 * the banners turn inactive, the space goes one frame later and stays when the view unmounts
 * (see style.js).
 * @param {boolean} active Whether the banners of the view hide on scroll.
 * @param {number} height The height the banners free when they hide.
 */
const useViewReservedSpace = (active, height) => {
  const { contentRef } = useContext(ViewContext);
  const content = contentRef && contentRef.current;
  const activeRef = useRef(active);

  useLayoutEffect(() => {
    activeRef.current = active;

    if (!active || !content || content === window) {
      return undefined;
    }

    content.style.setProperty(RESERVED_SPACE_PROP, `${height}px`);

    return () => {
      requestAnimationFrame(() => {
        if (!activeRef.current) {
          content.style.removeProperty(RESERVED_SPACE_PROP);
        }
      });
    };
  }, [active, content, height]);
};

/**
 * Tells whether a banner hides on scroll.
 * @param {Object} banner The banner configuration.
 * @returns {boolean}
 */
const isHideOnScroll = banner => banner.position === BANNER_POSITION_TOPMOST
  && !!banner.hideOnScroll;

/**
 * Tells whether a banner is a single box with a plain background color: a text banner or a
 * wrapped image without background image. Images only, sliders and product sliders are not.
 * @param {Object} banner The banner configuration.
 * @returns {boolean}
 */
const hasPlainColorBox = (banner) => {
  const content = banner.content || {};
  return !(banner.slides && banner.slides.length)
    && !(banner.productSliderIds && banner.productSliderIds.length)
    && !content.imageOnlyUrl
    && !!(content.imageWrappedUrl || content.h2 || content.h3)
    && hasPlainBackgroundColor(banner);
};

/**
 * Banners component
 * @return {JSX.Element}
 */
const Banners = ({ banners, position }) => {
  const { classes } = useStyles();
  const { visible = true } = useRoute() || {};
  const [collapseHeights, setCollapseHeights] = useState({});
  const searchBarHeight = useFloatingSearchBarHeight(!position && visible && banners.length > 0);

  const handleCollapseHeight = useCallback((index, height) => {
    setCollapseHeights(current => (
      current[index] === height ? current : {
        ...current,
        [index]: height,
      }
    ));
  }, []);

  // The page loses the space of all banners with hideOnScroll together when they hide.
  const collapseHeight = Object.values(collapseHeights).reduce((sum, height) => sum + height, 0);

  const hasHideOnScroll = banners.some(isHideOnScroll);
  // No `visible` here: the hook pauses while the route is hidden and keeps `scrolled`, so the
  // header is in place on return.
  const { scrolled: hidden } = useViewScroll({ enabled: hasHideOnScroll });
  useHeaderShift(hasHideOnScroll && visible, collapseHeight, hidden);
  useViewReservedSpace(hasHideOnScroll, collapseHeight);

  if (!banners.length) {
    return null;
  }

  // The first topmost banner reaches into the status bar only with fillStatusBar, and only text
  // banners and wrapped images with a plain background color can. The status bar part stays
  // reserved while a banner with hideOnScroll is hidden, so the header keeps its place.
  const firstHasPlainColor = hasPlainColorBox(banners[0]);
  const reachesStatusBar = position === BANNER_POSITION_TOPMOST
    && banners[0].fillStatusBar === true
    && firstHasPlainColor;

  let containerProps = {};

  if (reachesStatusBar) {
    containerProps = { className: classes.topmostContainer };
  } else if (!position) {
    // Under the floating header, the color of the first banner fills the space behind the header
    // and the search bar, so the header doesn't stand on the page background.
    containerProps = {
      className: classes.topContainer,
      style: {
        [SEARCH_BAR_HEIGHT_PROP]: `${searchBarHeight}px`,
        ...(firstHasPlainColor && {
          [TOP_BACKGROUND_PROP]: getBannerBackground(banners[0]),
        }),
      },
    };
  }

  return (
    <div {...containerProps}>
      {banners.map((banner, index) => {
        const belowStatusBar = reachesStatusBar && index === 0;

        if (!isHideOnScroll(banner)) {
          return (
            <Banner
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              {...banner}
              belowStatusBar={belowStatusBar}
            />
          );
        }

        return (
          <HideOnScrollBanner
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            banner={banner}
            belowStatusBar={belowStatusBar}
            hidden={hidden}
            index={index}
            onCollapseHeight={handleCollapseHeight}
          />
        );
      })}
    </div>
  );
};

Banners.propTypes = {
  banners: PropTypes.arrayOf(PropTypes.shape()),
  position: PropTypes.string,
};

Banners.defaultProps = {
  banners: [],
  position: null,
};

export default connect(Banners);
