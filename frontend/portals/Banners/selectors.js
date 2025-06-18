import { createSelector } from 'reselect';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { PAGE_PATTERN } from '@shopgate/pwa-common/constants/RoutePaths';
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

      if (requestedPosition !== position) {
        return false;
      }

      if (Array.isArray(ids) && ids.length) {
        // do not apply hex2bin for page routes, as their params are not hex-encoded
        const isPageRoute = route.pattern === PAGE_PATTERN;

        return Object.values(route.params).some((param) => {
          const value = isPageRoute ? param : hex2bin(param);
          return ids.includes(value);
        });
      }

      return true;
    });
  }
);
