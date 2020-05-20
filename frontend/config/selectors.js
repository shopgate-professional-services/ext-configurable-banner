import { createSelector } from 'reselect';

/**
 * @param {Object} state .
 * @return {Object}
 */
export const getConfigState = (state) => {
  if (!state.extensions['@shopgate-project/configurable-banner/config']) {
    return {};
  }
  return state.extensions['@shopgate-project/configurable-banner/config'];
};

/**
 * @returns {Object}
 */
export const getConfig = createSelector(
  getConfigState,
  ({ config }) => config
);
