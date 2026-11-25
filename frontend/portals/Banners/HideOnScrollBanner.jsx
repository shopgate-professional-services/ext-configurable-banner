import React, { useState, useLayoutEffect, useEffect } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@shopgate/engage/styles';
import Banner from './Banner';

const useStyles = makeStyles()({
  overflowWrapper: {
    overflow: 'hidden',
  },
  hideOnScroll: {
    transition: 'transform 0.2s ease',
    transform: 'translateY(0%)',
  },
  scrolledOut: {
    transform: 'translateY(-100%)',
  },
});

/**
 * Measures the height a banner frees when it hides. The status bar spacer of a banner that
 * reaches into the status bar stays, so its height doesn't count.
 * @param {HTMLElement} element The banner wrapper.
 * @returns {number}
 */
const getCollapseHeight = (element) => {
  const spacer = element.querySelector('[data-configurable-banner-status-bar-spacer]');
  return Math.max(0, element.offsetHeight - (spacer ? spacer.offsetHeight : 0));
};

/**
 * A topmost banner with hideOnScroll. Each banner measures its own height, so banners of
 * different heights free exactly their own space.
 * @param {Object} props The component props.
 * @returns {JSX.Element}
 */
const HideOnScrollBanner = ({
  banner, belowStatusBar, hidden, index, onCollapseHeight,
}) => {
  const { classes, cx } = useStyles();
  const [element, setElement] = useState(null);
  const [collapseHeight, setCollapseHeight] = useState(0);

  useLayoutEffect(() => {
    if (!element) {
      return undefined;
    }

    setCollapseHeight(getCollapseHeight(element));

    if (typeof ResizeObserver !== 'function') {
      return undefined;
    }

    const observer = new ResizeObserver(() => setCollapseHeight(getCollapseHeight(element)));
    observer.observe(element);
    return () => observer.disconnect();
  }, [element]);

  useLayoutEffect(() => {
    onCollapseHeight(index, collapseHeight);
  }, [collapseHeight, index, onCollapseHeight]);

  useEffect(() => () => onCollapseHeight(index, 0), [index, onCollapseHeight]);

  return (
    <div className={classes.overflowWrapper}>
      <div
        ref={setElement}
        className={cx(classes.hideOnScroll, hidden && classes.scrolledOut)}
        aria-hidden={hidden || undefined}
      >
        <Banner {...banner} belowStatusBar={belowStatusBar} />
      </div>
    </div>
  );
};

HideOnScrollBanner.propTypes = {
  banner: PropTypes.shape().isRequired,
  hidden: PropTypes.bool.isRequired,
  index: PropTypes.number.isRequired,
  onCollapseHeight: PropTypes.func.isRequired,
  belowStatusBar: PropTypes.bool,
};

HideOnScrollBanner.defaultProps = {
  belowStatusBar: false,
};

export default HideOnScrollBanner;
