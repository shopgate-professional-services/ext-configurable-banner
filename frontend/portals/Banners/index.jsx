import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import Banner from './Banner';

export const BANNER_POSITION_TOP = 'top';
export const BANNER_POSITION_BOTTOM = 'bottom';

/**
 * Banners component
 * @return {JSX}
 */
const Banners = ({ banners }) => {
  if (!banners.length) {
    return null;
  }

  return (
    <div>
      {banners.map((banner, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Banner {...banner} key={index} />
      ))}
    </div>
  );
};

Banners.propTypes = {
  banners: PropTypes.arrayOf(PropTypes.shape()),
  position: PropTypes.oneOf([BANNER_POSITION_BOTTOM, BANNER_POSITION_TOP]),
};

Banners.defaultProps = {
  banners: [],
  position: BANNER_POSITION_TOP,
};

export default connect(Banners);
