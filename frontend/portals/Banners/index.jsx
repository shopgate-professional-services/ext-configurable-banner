import React, {
  useState, useLayoutEffect, useCallback, useRef,
} from 'react';
import PropTypes from 'prop-types';
import { useRoute } from '@shopgate/engage/core';
import connect from './connector';
import Banner from './Banner';
import HideOnScrollBanner from './HideOnScrollBanner';
import useHiddenOnScroll from './useHiddenOnScroll';
import { BANNER_POSITION_TOPMOST } from '../../constants';
import { getBannerBackground, hasPlainBackgroundColor } from './helpers';
import {
  topContainer,
  topmostContainer,
  CONTENT_SHIFT_DURATION_PROP,
  CONTENT_SHIFT_PROP,
  RESERVED_SPACE_PROP,
  SEARCH_BAR_HEIGHT_PROP,
  TOP_BACKGROUND_PROP,
} from './style';

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
 * Lets the view content lie under the topmost banners with hideOnScroll and reserve their space
 * at its top, so hiding them doesn't move the scroll container of the view (see style.js).
 * @param {boolean} active Whether the banners of the visible route hide on scroll.
 * @param {number} height The height the banners free when they hide.
 * @param {boolean} hidden Whether the banners are hidden.
 */
const useReservedContentSpace = (active, height, hidden) => {
  const appliedHeight = useRef(null);

  useLayoutEffect(() => {
    if (!active) {
      appliedHeight.current = null;
      return undefined;
    }

    // Only hiding and showing moves the content along with the banners. A new height
    // (measuring, resizing) applies at once, the same as the banner does without hideOnScroll.
    const animate = appliedHeight.current === height;
    appliedHeight.current = height;

    const { style } = document.documentElement;
    style.setProperty(RESERVED_SPACE_PROP, `${height}px`);
    style.setProperty(CONTENT_SHIFT_PROP, `${hidden ? 0 : height}px`);
    style.setProperty(CONTENT_SHIFT_DURATION_PROP, animate ? '0.2s' : '0s');

    return () => {
      style.removeProperty(RESERVED_SPACE_PROP);
      style.removeProperty(CONTENT_SHIFT_PROP);
      style.removeProperty(CONTENT_SHIFT_DURATION_PROP);
    };
  }, [active, height, hidden]);
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
  const hidden = useHiddenOnScroll(hasHideOnScroll, visible);
  useReservedContentSpace(hasHideOnScroll && visible, collapseHeight, hidden);

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
    containerProps = { className: topmostContainer };
  } else if (!position) {
    // Under the floating header, the color of the first banner fills the space behind the header
    // and the search bar, so the header doesn't stand on the page background.
    containerProps = {
      className: topContainer,
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
