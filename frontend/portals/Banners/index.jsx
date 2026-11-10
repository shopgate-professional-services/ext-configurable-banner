import React, { useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ScrollHeader } from '@shopgate/engage/components';
import { css } from 'glamor';
import connect from './connector';
import Banner from './Banner';
import { BANNER_POSITION_TOPMOST } from '../../constants';
import {
  scrolledIn,
  scrolledOut,
  scrollHeaderStyle,
  overflowWrapper,
  topContainer,
  topmostContainer,
} from './style';

/**
 * Banners component
 * @return {JSX.Element}
 */
const Banners = ({ banners, position }) => {
  const [bannerElement, setBannerElement] = useState(null);
  const [bannerHeight, setBannerHeight] = useState(0);

  // Set the height of the banner to adjust the ScrollHeader animation
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

  if (!banners.length) {
    return null;
  }

  const isTopmost = position === BANNER_POSITION_TOPMOST;
  // Only banners with a background of their own can color the status bar. An image, a slider or a
  // product slider starts below it.
  const firstContent = banners[0].content || {};
  const reachesStatusBar = isTopmost
    && !(banners[0].slides && banners[0].slides.length)
    && !(banners[0].productSliderIds && banners[0].productSliderIds.length)
    && !firstContent.imageOnlyUrl
    && !!(firstContent.imageWrappedUrl || firstContent.h2 || firstContent.h3);
  const containerClass = !position ? topContainer : undefined;

  return (
    <div className={reachesStatusBar ? topmostContainer : containerClass}>
      {banners.map((banner, index) => {
        const hideOnScroll = banner.position === 'topmost' && banner.hideOnScroll;

        if (!hideOnScroll) {
          return (
            <Banner
              // eslint-disable-next-line react/no-array-index-key
              key={index}
              {...banner}
              belowStatusBar={reachesStatusBar && index === 0}
            />
          );
        }

        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className={overflowWrapper}>
            <ScrollHeader
              ref={setBannerElement}
              hideOnScroll
              onlyShowAtTop
              className={classNames(scrollHeaderStyle)}
              classes={{
                scrolledIn,
                scrolledOut: classNames(scrolledOut, css({
                  '&&': {
                    // The first banner above the header reaches into the status bar. That part
                    // stays reserved while the banner is hidden, so the header keeps its place.
                    marginBottom: reachesStatusBar && index === 0
                      ? `calc(${-bannerHeight}px + var(--safe-area-inset-top, 0px))`
                      : -bannerHeight,
                  },
                })),
              }}
            >
              <Banner {...banner} belowStatusBar={reachesStatusBar && index === 0} />
            </ScrollHeader>
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
