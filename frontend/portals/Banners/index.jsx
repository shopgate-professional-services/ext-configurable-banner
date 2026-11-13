import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { useRoute } from '@shopgate/engage/core';
import { css } from 'glamor';
import connect from './connector';
import Banner from './Banner';
import useHiddenOnScroll from './useHiddenOnScroll';
import { BANNER_POSITION_TOPMOST } from '../../constants';
import { getBannerBackground, isPlainColor } from './helpers';
import {
  scrolledIn,
  scrolledOut,
  scrollHeaderStyle,
  overflowWrapper,
  topContainer,
  topmostContainer,
  SEARCH_BAR_HEIGHT_PROP,
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
 * Banners component
 * @return {JSX.Element}
 */
const Banners = ({ banners, position }) => {
  const { visible = true } = useRoute() || {};
  const [bannerElement, setBannerElement] = useState(null);
  const [bannerHeight, setBannerHeight] = useState(0);
  const searchBarHeight = useFloatingSearchBarHeight(!position && visible && banners.length > 0);
  // Set the height of the banner to adjust the hide animation
  useLayoutEffect(() => {
    if (!bannerElement) {
      return undefined;
    }

    setBannerHeight(bannerElement.offsetHeight);

    if (typeof ResizeObserver !== 'function') {
      return undefined;
    }

    const observer = new ResizeObserver(() => setBannerHeight(bannerElement.offsetHeight));
    observer.observe(bannerElement);
    return () => observer.disconnect();
  }, [bannerElement]);

  const hidden = useHiddenOnScroll(
    banners.some(banner => banner.position === BANNER_POSITION_TOPMOST && banner.hideOnScroll),
    visible,
    bannerHeight
  );

  if (!banners.length) {
    return null;
  }

  // Only a banner with a plain background color of its own colors the status bar. An image, a
  // slider, a product slider or a banner with a background image starts below it. The status bar
  // part stays reserved while a banner with hideOnScroll is hidden, so the header keeps its place.
  const firstContent = banners[0].content || {};
  const reachesStatusBar = position === BANNER_POSITION_TOPMOST
    && !(banners[0].slides && banners[0].slides.length)
    && !(banners[0].productSliderIds && banners[0].productSliderIds.length)
    && !firstContent.imageOnlyUrl
    && !!(firstContent.imageWrappedUrl || firstContent.h2 || firstContent.h3)
    && isPlainColor(getBannerBackground(banners[0]));

  let containerProps = {};

  if (reachesStatusBar) {
    containerProps = { className: topmostContainer };
  } else if (!position) {
    containerProps = {
      className: topContainer,
      style: { [SEARCH_BAR_HEIGHT_PROP]: `${searchBarHeight}px` },
    };
  }

  return (
    <div {...containerProps}>
      {banners.map((banner, index) => {
        const hideOnScroll = banner.position === BANNER_POSITION_TOPMOST && banner.hideOnScroll;
        const belowStatusBar = reachesStatusBar && index === 0;

        if (!hideOnScroll) {
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
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className={overflowWrapper}>
            <div
              ref={setBannerElement}
              className={[
                scrollHeaderStyle.toString(),
                hidden ? scrolledOut.toString() : scrolledIn,
                hidden ? css({
                  '&&': {
                    marginBottom: belowStatusBar
                      ? `calc(${-bannerHeight}px + var(--safe-area-inset-top, 0px))`
                      : -bannerHeight,
                  },
                }).toString() : '',
              ].join(' ').trim()}
              aria-hidden={hidden || undefined}
            >
              <Banner {...banner} belowStatusBar={belowStatusBar} />
            </div>
          </div>
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
