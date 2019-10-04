import React from 'react';
import PropTypes from 'prop-types';
import connect from './connector';
import Banner from './Banner';

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
};

Banners.defaultProps = {
  banners: [],
};

export default connect(Banners);
