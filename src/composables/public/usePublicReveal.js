/**
 * Shared Public-site scroll reveal.
 * Progressive enhancement: content stays visible until init succeeds,
 * and in-viewport targets are marked visible BEFORE hide styles activate.
 */

const REVEAL_SELECTOR = '.reveal, .fade-on-scroll, .reveal-stagger, .reveal-stage, [data-rw-reveal]';

/**
 * @param {{
 *   rootRef?: import('vue').Ref<HTMLElement|null>,
 *   getRoot?: () => HTMLElement|null,
 * }} [options]
 */
export function usePublicReveal(options = {}) {
    let revealObserver = null;
    let mutationObserver = null;
    let ready = false;

    function resolveRoot() {
        if (options.rootRef?.value) return options.rootRef.value;
        if (typeof options.getRoot === 'function') return options.getRoot();
        if (typeof document !== 'undefined') {
            return document.querySelector('[data-public-layout]');
        }
        return null;
    }

    function markVisible(element) {
        element.classList.add('is-visible');
    }

    function isElementInViewport(element) {
        const rect = element.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.bottom > 0 && rect.top < viewportHeight * 0.9;
    }

    function prefersReducedMotion() {
        return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }

    function setReady(root, value) {
        ready = value;
        if (!root) return;
        if (value) {
            root.setAttribute('data-rw-reveal-ready', '');
        } else {
            root.removeAttribute('data-rw-reveal-ready');
        }
    }

    function collectTargets(root) {
        return Array.from(root.querySelectorAll(REVEAL_SELECTOR)).filter(
            (element) => !element.classList.contains('is-visible')
        );
    }

    function revealAll(root) {
        root.querySelectorAll(REVEAL_SELECTOR).forEach(markVisible);
    }

    function ensureObserver() {
        if (revealObserver || typeof IntersectionObserver === 'undefined') return;

        revealObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (!entry.isIntersecting) return;
                    markVisible(entry.target);
                    revealObserver.unobserve(entry.target);
                });
            },
            {
                threshold: [0.15, 0.2, 0.25],
                rootMargin: '0px 0px -6% 0px',
            }
        );
    }

    function observeRevealElements() {
        const root = resolveRoot();
        if (!root || typeof window === 'undefined') return;

        const targets = collectTargets(root);
        if (!targets.length) return;

        if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
            setReady(root, false);
            targets.forEach(markVisible);
            return;
        }

        ensureObserver();

        // Mark on-screen targets BEFORE enabling pre-reveal hide styles.
        const pending = [];
        targets.forEach((element) => {
            if (isElementInViewport(element)) {
                markVisible(element);
            } else {
                pending.push(element);
            }
        });

        setReady(root, true);

        pending.forEach((element) => {
            revealObserver.observe(element);
        });
    }

    function ensureMutationObserver() {
        if (mutationObserver || typeof MutationObserver === 'undefined') return;
        const root = resolveRoot();
        if (!root) return;

        let scheduled = false;
        mutationObserver = new MutationObserver(() => {
            if (scheduled) return;
            scheduled = true;
            requestAnimationFrame(() => {
                scheduled = false;
                observeRevealElements();
            });
        });

        mutationObserver.observe(root, {
            childList: true,
            subtree: true,
        });
    }

    function init() {
        const root = resolveRoot();
        if (!root) return;

        if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
            setReady(root, false);
            revealAll(root);
            return;
        }

        ensureMutationObserver();
        observeRevealElements();
    }

    function refresh() {
        observeRevealElements();
    }

    function destroy() {
        if (revealObserver) {
            revealObserver.disconnect();
            revealObserver = null;
        }
        if (mutationObserver) {
            mutationObserver.disconnect();
            mutationObserver = null;
        }
        const root = resolveRoot();
        if (root) {
            root.removeAttribute('data-rw-reveal-ready');
        }
        ready = false;
    }

    return {
        init,
        refresh,
        destroy,
        isReady: () => ready,
    };
}
