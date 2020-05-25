import { appDidStart$ } from '@shopgate/engage/core';
import { fetchConfig } from './actions';
import { receiveConfig } from './action-creators';
import { banners } from '../config';

/**
 * Subscriptions
 * @param {Function} subscribe subscribe
 */
export default (subscribe) => {
  subscribe(appDidStart$, async ({ dispatch }) => {
    if (banners) {
      dispatch(receiveConfig(banners));
    } else {
      dispatch(fetchConfig());
    }
  });
};
