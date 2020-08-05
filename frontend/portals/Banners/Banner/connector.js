import { connect } from 'react-redux';
import { fetchProductsById } from '@shopgate/engage/product';

/**
 * @param {Object} state state
 * @returns {Object}
 */
const mapDispatchToProps = {
  fetchProductsById,
};

export default connect(null, mapDispatchToProps);
