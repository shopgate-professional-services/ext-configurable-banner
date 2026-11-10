import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { css } from 'glamor';
import { useTheme } from '@shopgate/engage/core';
import { Swiper, Link } from '@shopgate/engage/components';
import styles from './style';
import connect from './connector';

/**
 * @param {Object} wrapperStyles wrapperStyles
 * @param {Object} contentConfig contentConfig
 * @param {string} link link
 * @param {string} headerClass Class that keeps the banner clear of the status bar
 * @returns {JSX.Element}
 */
const buildSlideContent = (wrapperStyles, contentConfig, link, headerClass = '') => {
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
      <div className={`${css(
        wrapperStyles,
        { ...cssBackground ? { backgroundColor: cssBackground } : {} }
      )} ${headerClass}`}
      >
        {imageWrappedUrl && (<img src={imageWrappedUrl} alt={altText || ''} />)}
      </div>
    );
  } else if (h3 || h2) {
    content = (
      <div className={`${css(styles.wrapper(cssBackground, textColor), wrapperStyles)} ${headerClass}`}>
        {h2 && (<h2 className={styles.h2} dangerouslySetInnerHTML={{ __html: h2 }} />)}
        {h3 && (<h3 className={styles.h3} dangerouslySetInnerHTML={{ __html: h3 }} />)}
      </div>
    );
  }

  if (!content) {
    return null;
  }

  if (link) {
    return (
      <Link href={link} aria-label={altText} tabIndex={0}>
        {content}
      </Link>
    );
  }

  return content;
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
  const headerClass = belowStatusBar ? styles.belowStatusBar : '';
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
  return buildSlideContent(wrapperStyles, contentConfig, link, headerClass);
};

Banner.propTypes = {
  fetchProductsById: PropTypes.func.isRequired,
  belowStatusBar: PropTypes.bool,
  content: PropTypes.shape(),
  link: PropTypes.string,
  sliderSettings: PropTypes.shape(),
  slides: PropTypes.arrayOf(PropTypes.shape()),
  wrapperStyles: PropTypes.shape(),
};

Banner.defaultProps = {
  belowStatusBar: false,
  content: {},
  link: null,
  wrapperStyles: {},
  slides: null,
  sliderSettings: null,
};

export default connect(Banner);
