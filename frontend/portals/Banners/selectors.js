import { createSelector } from 'reselect';
import { getCurrentRoute } from '@shopgate/pwa-common/selectors/router';
import { hex2bin } from '@shopgate/pwa-common/helpers/data';
import { banners } from '../../config';

export const getBannersForCurrentPage = createSelector(
  getCurrentRoute,
  route => banners.filter(({ routePattern, ids }) => {
    if (route.pattern !== routePattern) {
      return false;
    }

    if (Array.isArray(ids) && ids.length) {
      return Object.values(route.params).some(param => ids.includes(hex2bin(param)));
    }

    return true;
  })
);
