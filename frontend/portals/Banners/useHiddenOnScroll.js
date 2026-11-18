import { useContext, useEffect, useState } from 'react';
import { ViewContext } from '@shopgate/engage/components';

// Scroll position from which a banner with hideOnScroll hides. Above it the banner shows.
export const HIDE_OFFSET = 100;

/**
 * Reads the scroll position of the window or a scroll container.
 * @param {Window|HTMLElement} target The scrolled target.
 * @returns {number}
 */
const getScrollTop = (target) => {
  if (target === window) {
    return window.scrollY || window.pageYOffset || 0;
  }

  return target.scrollTop;
};

/**
 * Tells whether a banner with hideOnScroll is hidden. The banner hides once the page is scrolled
 * down to HIDE_OFFSET and shows again as soon as the page is scrolled back above it. Scrolling up
 * with momentum, the banner is back before the page reaches the top, so nothing changes while iOS
 * bounces there and the space reserved for the banner never shows empty. The state follows the
 * scroll position itself, so it does not depend on scroll speed or on single scroll events.
 * The view's scroll target is the one the PWA uses for the view: a container inside the app and
 * the window on the website.
 * Hiding doesn't change the scroll height, the content keeps the space of the banner reserved.
 * @param {boolean} active Whether hideOnScroll is used at all.
 * @param {boolean} listening Whether to follow the scroll position (false for hidden routes).
 * @returns {boolean}
 */
const useHiddenOnScroll = (active, listening) => {
  const { contentRef } = useContext(ViewContext) || {};
  const target = (contentRef && contentRef.current) || window;
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!active || !listening) {
      return undefined;
    }

    let frame = null;

    /** Updates the state from the current scroll position. */
    const update = () => {
      const scrollTop = getScrollTop(target);
      setHidden(scrollTop >= HIDE_OFFSET);
    };

    /** Reads the scroll position once per frame. */
    const handleScroll = () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
      frame = requestAnimationFrame(() => {
        frame = null;
        update();
      });
    };

    update();

    const options = { passive: true };
    target.addEventListener('scroll', handleScroll, options);

    return () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
      target.removeEventListener('scroll', handleScroll, options);
    };
  }, [active, listening, target]);

  return active && hidden;
};

export default useHiddenOnScroll;
