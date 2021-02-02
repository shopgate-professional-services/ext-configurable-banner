import React from 'react';
import Banners from './index';
import { BANNER_POSITION_BOTTOM } from '../../constants';

/**
 * Banners component
 * @return {JSX}
 */
const BannersBottom = () => (
  <Banners position={BANNER_POSITION_BOTTOM} />
);

export default BannersBottom;
