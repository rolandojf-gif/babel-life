/** Missing preference support is treated conservatively: content stays immediate. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? true;
}

/** Phone widths, matching the wall's single-column breakpoint. */
const MOBILE_HERO_QUERY = '(max-width: 39.999em)';

/** Drift starts after this much page scroll, inside the requested 40–80px band. */
export const MOBILE_HERO_DRIFT_START = 64;

/** Scroll distance over which the drift eases to its maximum. */
export const MOBILE_HERO_DRIFT_SPAN = 240;

/**
 * How far the mobile hero index should travel, from 0 at rest to 1 at full drift.
 * Full drift is 1.75rem in CSS — 28px at the default root size, inside 20–35px.
 * Progress finishes over the span, or at the hero's bottom if that comes first,
 * and then holds. Further scrolling does not keep moving the index.
 */
export function mobileHeroIndexDrift(scrollY: number, heroBottom: number, enabled: boolean): number {
  if (!enabled || heroBottom <= MOBILE_HERO_DRIFT_START) return 0;
  if (scrollY <= MOBILE_HERO_DRIFT_START) return 0;
  const end = Math.min(MOBILE_HERO_DRIFT_START + MOBILE_HERO_DRIFT_SPAN, heroBottom);
  if (end <= MOBILE_HERO_DRIFT_START) return 0;
  if (scrollY >= end) return 1;
  return (scrollY - MOBILE_HERO_DRIFT_START) / (end - MOBILE_HERO_DRIFT_START);
}

const driftApplied = new WeakMap<HTMLElement, string>();

/** Write the drift progress onto the wall's library index, or clear it. */
export function syncMobileHeroIndexDrift(): void {
  const index = document.querySelector('.library-index');
  if (!(index instanceof HTMLElement)) return;

  const mobile = window.matchMedia?.(MOBILE_HERO_QUERY).matches ?? false;
  const hero = index.closest('.masthead');
  let progress = 0;
  if (!prefersReducedMotion() && mobile && hero instanceof HTMLElement) {
    const rect = hero.getBoundingClientRect();
    const heroBottom = rect.top + window.scrollY + rect.height;
    progress = mobileHeroIndexDrift(window.scrollY, heroBottom, true);
  }

  const next = progress === 0 ? '' : progress.toFixed(4);
  if (driftApplied.get(index) === next) return;
  driftApplied.set(index, next);
  if (next === '') index.style.removeProperty('--index-drift');
  else index.style.setProperty('--index-drift', next);
}

let driftListening = false;

/**
 * A short, scroll-linked shift of the library index while a phone is still
 * inside the wall masthead. Desktop and tablet are left alone. Reduced motion
 * never writes a displacement.
 */
export function initMobileHeroIndexDrift(): void {
  if (driftListening) return;
  driftListening = true;

  let frame = 0;
  const schedule = (): void => {
    if (frame !== 0) return;
    frame = window.requestAnimationFrame(() => {
      frame = 0;
      syncMobileHeroIndexDrift();
    });
  };

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  window.matchMedia?.('(prefers-reduced-motion: reduce)')?.addEventListener?.('change', schedule);
  window.matchMedia?.(MOBILE_HERO_QUERY)?.addEventListener?.('change', schedule);
  syncMobileHeroIndexDrift();
}

/**
 * A short dissolve between views. History and focus remain owned by the shell.
 * A skipped transition still invokes its callback, so stale callbacks must never
 * commit a previous route after a newer navigation has arrived.
 */
export function createViewTransition(main: HTMLElement): (update: () => void, animate: boolean) => void {
  let revision = 0;
  let active: ViewTransition | undefined;

  return (update, animate): void => {
    const current = ++revision;
    active?.skipTransition();
    active = undefined;
    main.removeAttribute('data-view-transition');

    if (!animate || prefersReducedMotion() || !document.startViewTransition || document.hidden) {
      update();
      return;
    }

    let committed = false;
    const commit = (): void => {
      if (current !== revision || committed) return;
      committed = true;
      update();
    };

    main.setAttribute('data-view-transition', '');
    try {
      const transition = document.startViewTransition(commit);
      active = transition;
      // Snapshot failures (e.g. a hidden tab) are cosmetic, never navigation failures.
      void transition.ready.catch(() => {});
      const finish = (): void => {
        if (current !== revision) return;
        commit();
        active = undefined;
        // Keep entrance animations suppressed on the committed view. The next
        // render chooses its own motion path before replacing any content.
      };
      void transition.finished.then(finish, finish);
    } catch {
      main.removeAttribute('data-view-transition');
      commit();
    }
  };
}
