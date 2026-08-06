const RELOAD_KEY = 'aquails:chunk-reload';

function isChunkLoadError(error: unknown): boolean {
  if (!error) return false;
  const message = error instanceof Error ? error.message : String(error);
  return /Failed to fetch dynamically imported module|Importing a module script failed|Loading chunk [\d]+ failed|error loading dynamically imported module|ChunkLoadError/i.test(
    message,
  );
}

/**
 * One-shot reload when a stale deployment chunk is missing.
 * Uses sessionStorage to prevent infinite reload loops.
 */
export function installChunkLoadRecovery(): void {
  if (typeof window === 'undefined') return;

  const reloadOnce = () => {
    try {
      if (sessionStorage.getItem(RELOAD_KEY) === '1') {
        sessionStorage.removeItem(RELOAD_KEY);
        window.dispatchEvent(new CustomEvent('aquails:chunk-recovery-failed'));
        return;
      }
      sessionStorage.setItem(RELOAD_KEY, '1');
      window.location.reload();
    } catch {
      window.dispatchEvent(new CustomEvent('aquails:chunk-recovery-failed'));
    }
  };

  window.addEventListener('vite:preloadError', ((event: Event) => {
    event.preventDefault();
    reloadOnce();
  }) as EventListener);

  window.addEventListener('unhandledrejection', (event) => {
    if (isChunkLoadError(event.reason)) {
      event.preventDefault();
      reloadOnce();
    }
  });

  window.addEventListener('error', (event) => {
    if (isChunkLoadError(event.error) || isChunkLoadError(event.message)) {
      event.preventDefault();
      reloadOnce();
    }
  });

  // Clear the flag after a successful boot without chunk failure.
  window.setTimeout(() => {
    try {
      sessionStorage.removeItem(RELOAD_KEY);
    } catch {
      /* ignore */
    }
  }, 4000);
}
