import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { useTheme } from '@shopgate/engage/core';
import { Swiper, Link } from '@shopgate/engage/components';
import styles from './style';
import connect from './connector';
import { getBannerBackground } from '../helpers';

/**
 * @param {Object} wrapperStyles wrapperStyles
 * @param {Object} contentConfig contentConfig
 * @param {string} link link
 * @param {boolean} belowStatusBar Whether the banner reaches into the status bar area
 * @returns {JSX.Element}
 */
const buildSlideContent = (wrapperStyles, contentConfig, link, belowStatusBar = false) => {
  let content = null;
  const {
    imageOnlyUrl,
    imageWrappedUrl,
    h3,
    h2,
    textColor,
    cssBackground,
    altText,
  } = contentConfig;

  if (imageOnlyUrl) {
    content = (<img src={imageOnlyUrl} className={css(wrapperStyles)} alt={altText || ''} />);
  } else if (imageWrappedUrl) {
    content = (
      <div className={css(
        wrapperStyles,
        { ...cssBackground ? { backgroundColor: cssBackground } : {} }
      )}
      >
        {imageWrappedUrl && (<img src={imageWrappedUrl} alt={altText || ''} />)}
      </div>
    );
  } else if (h3 || h2) {
    content = (
      <div className={css(styles.wrapper(cssBackground, textColor), wrapperStyles)}>
        {/* The headlines may contain markup that the merchant configured. */}
        {/* eslint-disable-next-line react/no-danger */}
        {h2 && (<h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: h2 }} />)}
        {/* eslint-disable-next-line react/no-danger */}
        {h3 && (<h3 className={styles.h3} dangerouslySetInnerHTML={{ __html: h3 }} />)}
      </div>
    );
  }

  if (!content) {
    return null;
  }

  if (link) {
    content = (
      <Link href={link} aria-label={altText} tabIndex={0}>
        {content}
      </Link>
    );
  }

  if (!belowStatusBar) {
    return content;
  }

  // The spacer sits above the content, so the layout of the banner itself stays untouched.
  return (
    <div
      className={css({
        background: getBannerBackground({
          content: contentConfig,
          wrapperStyles,
        }),
      }).toString()}
    >
      <div className={styles.statusBarSpacer} />
      {content}
    </div>
  );
};

/**
 * Banner component
 * @return {JSX.Element}
 */
const Banner = ({
  content: contentConfig,
  wrapperStyles,
  link,
  slides,
  sliderSettings,
  productSliderIds,
  fetchProductsById,
  belowStatusBar,
}) => {
  const { ProductSlider } = useTheme();

  useEffect(() => {
    if (!(productSliderIds && productSliderIds.length)) {
      return;
    }

    fetchProductsById(productSliderIds);
  }, [fetchProductsById, productSliderIds]);

  // Show ProductSlider as Banner
  if (productSliderIds && productSliderIds.length) {
    return (
      <ProductSlider className={css(wrapperStyles).toString()} productIds={productSliderIds} />
    );
  }
  // Show slider as banner
  if (slides && slides.length) {
    return (
      <Swiper
        {...sliderSettings}
      >
        {slides.map((slide, index) => (
          // eslint-disable-next-line react/no-array-index-key
          <Swiper.Item key={index}>
            {buildSlideContent(slide.wrapperStyles, slide.content, slide.link)}
          </Swiper.Item>
        ))}
      </Swiper>
    );
  }

  // Show banner as simple box
  return buildSlideContent(wrapperStyles, contentConfig, link, belowStatusBar);
};

Banner.propTypes = {
  fetchProductsById: PropTypes.func.isRequired,
  belowStatusBar: PropTypes.bool,
  content: PropTypes.shape(),
  link: PropTypes.string,
  productSliderIds: PropTypes.arrayOf(PropTypes.string),
  sliderSettings: PropTypes.shape(),
  slides: PropTypes.arrayOf(PropTypes.shape()),
  wrapperStyles: PropTypes.shape(),
};

Banner.defaultProps = {
  belowStatusBar: false,
  content: {},
  link: null,
  productSliderIds: null,
  wrapperStyles: {},
  slides: null,
  sliderSettings: null,
};

export default connect(Banner);
