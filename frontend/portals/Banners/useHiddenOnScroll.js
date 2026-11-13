import {
  createContext, useContext, useEffect, useRef, useState,
} from 'react';
import { ViewContext } from '@shopgate/engage/components';

// Scroll position from which a banner with hideOnScroll hides.
export const HIDE_OFFSET = 100;

const FallbackContext = createContext(null);

/**
 * Reads the scroll position and the maximum scroll position of the window or a scroll container.
 * @param {Window|HTMLElement} target The scrolled target.
 * @returns {{ scrollTop: number, maxScrollTop: number }}
 */
const getScrollState = (target) => {
  if (target === window) {
    const { documentElement } = document;
    return {
      scrollTop: window.scrollY || window.pageYOffset || 0,
      maxScrollTop: documentElement.scrollHeight - window.innerHeight,
    };
  }

  return {
    scrollTop: target.scrollTop,
    maxScrollTop: target.scrollHeight - target.clientHeight,
  };
};

/**
 * Tells whether a banner with hideOnScroll is hidden. The banner hides once the page is scrolled
 * down to HIDE_OFFSET and shows again only at the very top. The state follows the scroll position
 * itself, so it does not depend on scroll speed or on single scroll events.
 * The view's scroll target is the window inside the app and a container in the browser, the same
 * one the PWA uses for the view.
 * A banner only hides while the page stays scrolled after it freed its space. Otherwise the
 * shorter page would move the scroll position back to the top and show the banner again.
 * @param {boolean} active Whether hideOnScroll is used at all.
 * @param {boolean} listening Whether to follow the scroll position (false for hidden routes).
 * @param {number} collapseHeight The height the banner frees when it hides.
 * @returns {boolean}
 */
const useHiddenOnScroll = (active, listening, collapseHeight) => {
  const { contentRef } = useContext(ViewContext || FallbackContext) || {};
  const target = (contentRef && contentRef.current) || window;
  const [hidden, setHidden] = useState(false);
  const collapseRef = useRef(collapseHeight);
  collapseRef.current = collapseHeight;

  useEffect(() => {
    if (!active || !listening) {
      return undefined;
    }

    let frame = null;

    /** Updates the state from the current scroll position. */
    const update = () => {
      const { scrollTop, maxScrollTop } = getScrollState(target);
      const collapse = collapseRef.current;

      setHidden((current) => {
        if (current) {
          return scrollTop > 0;
        }

        return scrollTop >= HIDE_OFFSET
          && scrollTop > collapse
          && maxScrollTop - collapse >= 1;
      });
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
