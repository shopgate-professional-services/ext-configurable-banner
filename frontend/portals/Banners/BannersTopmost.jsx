import React from 'react';
import Banners from './index';
import { BANNER_POSITION_TOPMOST } from '../../constants';

/**
 * Banners component
 * @return {JSX.Element}
 */
const BannersTopmost = () => (
  <Banners position={BANNER_POSITION_TOPMOST} />
);

export default BannersTopmost;
