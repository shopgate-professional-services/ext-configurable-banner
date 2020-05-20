import {
  BANNER_REQUEST_CONFIG,
  BANNER_RECEIVE_CONFIG,
  BANNER_ERROR_CONFIG,
} from './constants';

/**
 * @return {Object}
 */
export const requestConfig = () => ({
  type: BANNER_REQUEST_CONFIG,
});

/**
 * @param {Object[]} config .
 * @return {Object}
 */
export const receiveConfig = config => ({
  type: BANNER_RECEIVE_CONFIG,
  config,
});

/**
 * @param {Error} error .
 * @return {Object}
 */
export const errorConfig = error => ({
  type: BANNER_ERROR_CONFIG,
  error,
});
