import React, { useRef, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { ScrollHeader } from '@shopgate/engage/components';
import { css } from 'glamor';
import connect from './connector';
import Banner from './Banner';

/**
 * Banners component
 * @return {JSX.Element}
 */
const Banners = ({ banners }) => {
  const bannerRef = useRef(null);
  const [bannerHeight, setBannerHeight] = useState(0);

  // Set the height of the banner to adjust the ScrollHeader animation
  useLayoutEffect(() => {
    if (bannerRef.current) {
      setBannerHeight(bannerRef.current.offsetHeight);
    }
  }, []);

  if (!banners.length) {
    return null;
  }

  /**
   * Define styles for ScrollHeader
   * This is within the component to have the height from the banner ref available
   */

  const root = css({
    overflow: 'hidden',
  });

  const scrolledIn = css({
    '&&': {
      transform: 'translateY(0%)',
      marginBottom: 0,
    },
  });

  const scrolledOut = css({
    '&&': {
      transform: 'translateY(-250%)',
      marginBottom: -bannerHeight,
    },
  });

  const transition = css({
    transition: 'transform 0.2s ease,transform 0.2s, margin-bottom 0.2s ease',
  });

  const background = css({
    backgroundColor: 'red',
  });

  return (
    <div>
      {banners.map((banner, index) => {
        const hideOnScroll = banner.position === 'topmost' && banner.hideOnScroll;

        if (!hideOnScroll) {
          // eslint-disable-next-line react/no-array-index-key
          return <Banner key={index} {...banner} />;
        }
        return (
          // eslint-disable-next-line react/no-array-index-key
          <div key={index} className={css({ overflow: 'hidden' })}>
            <ScrollHeader
              hideOnScroll
              classes={{
                scrolledIn: hideOnScroll ? scrolledIn : '',
                scrolledOut: hideOnScroll ? scrolledOut : '',
                transition: hideOnScroll ? transition : '',
                root: hideOnScroll ? root : background,
              }}
            >
              <div ref={bannerRef}>
                <Banner {...banner} />
              </div>
            </ScrollHeader>
          </div>
        );
      })}
    </div>
  );
};

Banners.propTypes = {
  banners: PropTypes.arrayOf(PropTypes.shape()),
};

Banners.defaultProps = {
  banners: [],
};

export default connect(Banners);
