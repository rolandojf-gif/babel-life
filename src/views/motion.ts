/** Missing preference support is treated conservatively: content stays immediate. */
export function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? true;
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
