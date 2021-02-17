import { connect } from 'react-redux';
import { getBannersForCurrentPage } from './selectors';

/**
 * @param {Object} state state
 * @param {Object} props props
 * @returns {Object}
 */
const mapStateToProps = (state, props) => ({
  banners: getBannersForCurrentPage(state, props),
});

export default connect(mapStateToProps);
