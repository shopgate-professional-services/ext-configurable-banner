import { connect } from 'react-redux';
import { getBannersForCurrentPage } from './selectors';

/**
 * @param {Object} state state
 * @returns {Object}
 */
const mapStateToProps = state => ({
  banners: getBannersForCurrentPage(state),
});

export default connect(mapStateToProps);
