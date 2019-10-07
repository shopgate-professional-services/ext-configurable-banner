import React from 'react';
import PropTypes from 'prop-types';
import Link from '@shopgate/pwa-common/components/Link';
import styles from './style';

/**
 * Banner component
 * @return {JSX}
 */
const Banner = ({
  content: contentConfig,
  link,
}) => {
  let content = null;
  const {
    imageOnlyUrl,
    h3,
    h2,
    textColor,
    cssBackground,
  } = contentConfig;

  if (imageOnlyUrl) {
    content = (<img src={imageOnlyUrl} alt="" />);
  } else if (h3 || h2) {
    content = (
      <div className={styles.wrapper(cssBackground, textColor)}>
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

Banner.propTypes = {
  content: PropTypes.shape(),
  link: PropTypes.string,
};

Banner.defaultProps = {
  content: {},
  link: null,
};

export default Banner;
