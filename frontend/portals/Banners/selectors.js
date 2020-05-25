import { createSelector } from 'reselect';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { getConfig } from '../../config/selectors';

export const getBannersForCurrentPage = createSelector(
  getCurrentRoute,
  getConfig,
  (route, banners) => {
    if (!banners || !banners.length) {
      return [];
    }

    return banners.filter(({ routePattern, ids }) => {
      if (route.pattern !== routePattern) {
        return false;
      }

      if (Array.isArray(ids) && ids.length) {
        return Object.values(route.params).some(param => ids.includes(hex2bin(param)));
      }

      return true;
    });
  }
);
