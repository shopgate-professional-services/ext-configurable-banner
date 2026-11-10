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
