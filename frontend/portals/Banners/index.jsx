import React, { useState, useLayoutEffect, useCallback } from 'react';
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

  const hidden = useHiddenOnScroll(banners.some(isHideOnScroll), visible, collapseHeight);

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
