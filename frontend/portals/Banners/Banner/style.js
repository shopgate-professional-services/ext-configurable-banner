import { css } from 'glamor';

/**
 * @param {string} background Value for the background property
 * @param {string} color Value for the color property
 * @return {StyleAttribute}
 */
const wrapper = (background, color) => css({
  background,
  color,
  padding: '20px 30px 10px',
  letterSpacing: '-0.01em',
});

const h3 = css({
  fontSize: 13,
  lineHeight: '16px',
});

const h2 = css({
  fontSize: 24,
  lineHeight: '29px',
  marginTop: 0,
});

const verticalSlide = css({
  height: 'auto !important',
}).toString();

export default {
  wrapper,
  h2,
  h3,
  verticalSlide,
};
