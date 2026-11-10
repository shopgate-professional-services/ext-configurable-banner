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

const statusBarSpacer = css({
  height: 'var(--safe-area-inset-top, 0px)',
}).toString();

export default {
  statusBarSpacer,
  wrapper,
  h2,
  h3,
};
