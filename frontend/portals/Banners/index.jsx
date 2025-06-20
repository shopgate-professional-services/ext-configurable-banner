import React, { useRef, useState, useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { ScrollHeader } from '@shopgate/engage/components';
import { css } from 'glamor';
import connect from './connector';
import Banner from './Banner';
import {
  scrolledIn,
  scrolledOut,
  scrollHeaderStyle,
  overflowWrapper,
} from './style';

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
          <div key={index} className={overflowWrapper}>
            <ScrollHeader
              ref={bannerRef}
              hideOnScroll
              className={classNames(scrollHeaderStyle)}
              classes={{
                scrolledIn,
                scrolledOut: classNames(scrolledOut, css({
                  '&&': {
                    marginBottom: -bannerHeight,
                  },
                })),
              }}
            >
              <Banner {...banner} />
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
