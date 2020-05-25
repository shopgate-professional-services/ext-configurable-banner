import { persistedReducers } from '@shopgate/engage/core';
import {
  BANNER_REQUEST_CONFIG,
  BANNER_RECEIVE_CONFIG,
  BANNER_ERROR_CONFIG,
} from './constants';
import { configTTL } from '../config';

persistedReducers.set('extensions.@shopgate-project/configurable-banner/config');

/**
 * @param {Object} [state={}] The current state.
 * @param {Object} action The action object.
 * @return {Object} The new state.
 */
export default (state = {}, action) => {
  switch (action.type) {
    case BANNER_REQUEST_CONFIG:
      return {
        ...state,
        isFetching: true,
      };
    case BANNER_ERROR_CONFIG:
      return {
        ...state,
        isFetching: false,
      };
    case BANNER_RECEIVE_CONFIG:
      return {
        ...state,
        config: action.config,
        isFetching: false,
        expires: Date.now() + (configTTL * 1000),
      };
    default:
      return state;
  }
};
