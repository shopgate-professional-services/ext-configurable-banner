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
 * @returns {JSX}
 */
const buildSlideContent = (wrapperStyles, contentConfig, link) => {
  let content = null;
  const {
    imageOnlyUrl,
    h3,
    h2,
    textColor,
    cssBackground,
  } = contentConfig;

  if (imageOnlyUrl) {
    content = (<img src={imageOnlyUrl} className={css(wrapperStyles)} alt="" />);
  } else if (h3 || h2) {
    content = (
      <div className={`${styles.wrapper(cssBackground, textColor)} ${css(wrapperStyles)}`}>
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
      <Link href={link}>
        {content}
      </Link>
    );
  }

  return content;
};

/**
 * Banner component
 * @return {JSX}
 */
const Banner = ({
  content: contentConfig,
  wrapperStyles,
  link,
  slides,
  sliderSettings,
  productSliderIds,
  fetchProductsById,
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
  return buildSlideContent(wrapperStyles, contentConfig, link);
};

Banner.propTypes = {
  fetchProductsById: PropTypes.func.isRequired,
  content: PropTypes.shape(),
  link: PropTypes.string,
  sliderSettings: PropTypes.shape(),
  slides: PropTypes.arrayOf(PropTypes.shape()),
  wrapperStyles: PropTypes.shape(),
};

Banner.defaultProps = {
  content: {},
  link: null,
  wrapperStyles: {},
  slides: null,
  sliderSettings: null,
};

export default connect(Banner);
