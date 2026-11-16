/**
 * Returns the background color a banner gives itself. Text banners let `wrapperStyles` win over
 * `cssBackground`, wrapped images the other way round, like the banner component renders them.
 * @param {Object} banner The banner configuration.
 * @param {Object} [banner.content] The content of the banner.
 * @param {Object} [banner.wrapperStyles] The styles of the banner wrapper.
 * @returns {string|null}
 */
export const getBannerBackground = ({ content = {}, wrapperStyles = {} } = {}) => {
  const { background, backgroundColor } = wrapperStyles || {};
  const ownBackground = background || backgroundColor || null;
  const { cssBackground } = content || {};

  if (content && content.imageWrappedUrl) {
    return cssBackground || ownBackground;
  }

  return ownBackground || cssBackground || null;
};

/**
 * Checks whether a CSS background is a plain color. Images and gradients would be cropped
 * differently in the status bar area and in the banner.
 * @param {string|null} background The CSS background value.
 * @returns {boolean}
 */
export const isPlainColor = background => !!background
  && !/(url|gradient|image-set|image)\(/i.test(background);

/**
 * Checks whether a banner has a background color of its own and no background image anywhere.
 * The banner may set its background in `cssBackground` and in `wrapperStyles`; when one of them
 * shows an image, the banner shows an image as well.
 * @param {Object} banner The banner configuration.
 * @param {Object} [banner.content] The content of the banner.
 * @param {Object} [banner.wrapperStyles] The styles of the banner wrapper.
 * @returns {boolean}
 */
export const hasPlainBackgroundColor = ({ content = {}, wrapperStyles = {} } = {}) => {
  const { background, backgroundColor, backgroundImage } = wrapperStyles || {};
  const { cssBackground } = content || {};

  if (backgroundImage && backgroundImage !== 'none') {
    return false;
  }

  const backgrounds = [cssBackground, background, backgroundColor].filter(Boolean);
  return backgrounds.length > 0 && backgrounds.every(isPlainColor);
};
