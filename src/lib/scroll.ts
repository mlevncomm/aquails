/**
 * Site-wide scroll standard (Aquails)
 * See docs/ux-standards.md
 */

export type ScrollToTopOptions = {
  behavior?: ScrollBehavior;
};

function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function scrollToPageTop(options: ScrollToTopOptions = {}) {
  const behavior = options.behavior ?? 'auto';

  window.scrollTo({ top: 0, left: 0, behavior });

  const scrollRoot = document.scrollingElement ?? document.documentElement;
  if (scrollRoot) scrollRoot.scrollTop = 0;

  document.querySelectorAll<HTMLElement>('[data-scroll-container]').forEach((el) => {
    el.scrollTop = 0;
  });
}

/** Scroll to in-page hash target (#section). HashRouter route hashes use #/path — those are ignored. */
export function scrollToHashTarget(hash: string) {
  if (!hash || hash === '#' || hash.startsWith('#/')) return;

  const id = decodeURIComponent(hash.replace(/^#/, ''));
  if (!id) return;

  const el =
    document.getElementById(id)
    ?? document.querySelector<HTMLElement>(`[name="${CSS.escape(id)}"]`);

  if (!el) return;

  const behavior: ScrollBehavior = prefersReducedMotion() ? 'auto' : 'smooth';
  requestAnimationFrame(() => {
    el.scrollIntoView({ behavior, block: 'start' });
  });
}

export function focusMainContent() {
  const main = document.getElementById('main-content');
  if (main instanceof HTMLElement) {
    main.focus({ preventScroll: true });
  }
}
