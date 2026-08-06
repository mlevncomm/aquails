import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { focusMainContent, scrollToHashTarget, scrollToPageTop } from '@/lib/scroll';

/**
 * App-level: scroll / focus on every route / query / hash change.
 */
export function ScrollToTop() {
  const { pathname, search, hash } = useLocation();

  useEffect(() => {
    // In-page hash anchor (not HashRouter path)
    if (hash && !hash.startsWith('#/')) {
      scrollToHashTarget(hash);
      return;
    }

    scrollToPageTop();
    focusMainContent();
  }, [pathname, search, hash]);

  return null;
}

/**
 * Page-level: scroll to top when list/page state changes (pagination, filters).
 * Skips the first mount so initial paint does not double-scroll with route ScrollToTop.
 */
export function useScrollToTopOnChange(deps: unknown[], enabled = true) {
  const isFirst = useRef(true);

  useEffect(() => {
    if (!enabled) return;
    if (isFirst.current) {
      isFirst.current = false;
      return;
    }
    scrollToPageTop();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentional dependency array from caller
  }, deps);
}
