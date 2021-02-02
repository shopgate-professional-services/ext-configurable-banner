import { createSelector } from 'reselect';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { getConfig } from '../../config/selectors';
import { BANNER_POSITION_TOP } from '../../constants';

export const getBannersForCurrentPage = createSelector(
  getCurrentRoute,
  getConfig,
  (_, { position }) => position || BANNER_POSITION_TOP,
  (route, banners, requestedPosition) => {
    if (!banners || !banners.length) {
      return [];
    }

    return banners.filter(({ routePattern, ids, position = BANNER_POSITION_TOP }) => {
      if (route.pattern !== routePattern && routePattern !== '*') {
        return false;
      }

      if (Array.isArray(ids) && ids.length) {
        return Object.values(route.params).some(param => ids.includes(hex2bin(param)));
      }

      if (requestedPosition !== position) {
        return false;
      }

      return true;
    });
  }
);
