import {
  createContext, useContext, useEffect, useState,
} from 'react';
import { ViewContext } from '@shopgate/engage/components';

// Scroll position from which a banner with hideOnScroll hides.
export const HIDE_OFFSET = 100;

const FallbackContext = createContext(null);

/**
 * Reads the scroll position of the window or of a scroll container.
 * @param {Window|HTMLElement} target The scrolled target.
 * @returns {number}
 */
const getScrollTop = target => (target === window
  ? (window.scrollY || window.pageYOffset || 0)
  : target.scrollTop);

/**
 * Tells whether a banner with hideOnScroll is hidden. The banner hides once the page is scrolled
 * down to HIDE_OFFSET and shows again only at the very top. The state follows the scroll position
 * itself, so it does not depend on scroll speed or on single scroll events.
 * The PWA scrolls the window inside the app and a container in the view in the browser, so both
 * are watched.
 * @param {boolean} active Whether hideOnScroll is used at all.
 * @param {boolean} listening Whether to follow the scroll position (false for hidden routes).
 * @returns {boolean}
 */
const useHiddenOnScroll = (active, listening) => {
  const { contentRef } = useContext(ViewContext || FallbackContext) || {};
  const element = contentRef ? contentRef.current : null;
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (!active || !listening) {
      return undefined;
    }

    let frame = null;

    /**
     * Updates the state from a scroll position.
     * @param {number} scrollTop The scroll position.
     */
    const update = (scrollTop) => {
      setHidden(current => (current ? scrollTop > 0 : scrollTop >= HIDE_OFFSET));
    };

    /**
     * Reads the scroll position once per frame.
     * @param {Event} event The scroll event.
     */
    const handleScroll = (event) => {
      const target = event.currentTarget;
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
      frame = requestAnimationFrame(() => {
        frame = null;
        update(getScrollTop(target));
      });
    };

    update(Math.max(getScrollTop(window), element ? element.scrollTop : 0));

    const options = { passive: true };
    window.addEventListener('scroll', handleScroll, options);
    if (element) {
      element.addEventListener('scroll', handleScroll, options);
    }

    return () => {
      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
      window.removeEventListener('scroll', handleScroll, options);
      if (element) {
        element.removeEventListener('scroll', handleScroll, options);
      }
    };
  }, [active, listening, element]);

  return active && hidden;
};

export default useHiddenOnScroll;
