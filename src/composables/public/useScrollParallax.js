import { onBeforeUnmount, onMounted, watch } from 'vue';
import {
    prefersReducedMotion,
    refreshParallaxTargets,
    registerParallaxTarget,
    unregisterParallaxTarget,
} from './landingScrollBus';

let autoId = 0;

/**
 * Bind a single element ref to the shared landing parallax bus.
 *
 * @param {import('vue').Ref<HTMLElement|null>} targetRef
 * @param {{
 *   intensity?: 'strong'|'medium'|'light',
 *   measureRef?: import('vue').Ref<HTMLElement|null>,
 *   enabled?: import('vue').Ref<boolean>|boolean,
 *   maxY?: number,
 *   baseScale?: number,
 *   scaleAmp?: number,
 * }} [options]
 */
export function useScrollParallax(targetRef, options = {}) {
    const id = `parallax-${++autoId}`;
    let registered = false;

    function sync() {
        unregisterParallaxTarget(id);
        registered = false;

        const enabled = options.enabled === undefined
            ? true
            : (typeof options.enabled === 'object' ? options.enabled.value : options.enabled);

        if (!enabled || prefersReducedMotion()) return;
        if (!targetRef.value) return;

        registerParallaxTarget(id, {
            el: targetRef.value,
            measureEl: options.measureRef?.value || targetRef.value.closest('[data-rw-parallax-measure]') || targetRef.value.parentElement,
            intensity: options.intensity || 'medium',
            maxY: options.maxY,
            baseScale: options.baseScale,
            scaleAmp: options.scaleAmp,
        });
        registered = true;
        refreshParallaxTargets();
    }

    onMounted(sync);

    if (options.measureRef) {
        watch(options.measureRef, sync);
    }
    watch(targetRef, sync);
    if (typeof options.enabled === 'object' && options.enabled) {
        watch(options.enabled, sync);
    }

    onBeforeUnmount(() => {
        if (registered) unregisterParallaxTarget(id);
        registered = false;
    });

    return { refresh: sync };
}

/**
 * Scan a root for `[data-rw-parallax]` layers and register them.
 * Call `rescan()` after async DOM updates (e.g. inventory cards).
 *
 * @param {import('vue').Ref<HTMLElement|null>} rootRef
 */
export function useLandingParallaxRoot(rootRef) {
    const ids = [];

    function clear() {
        while (ids.length) {
            unregisterParallaxTarget(ids.pop());
        }
    }

    function rescan() {
        clear();
        if (prefersReducedMotion()) return;
        const root = rootRef.value;
        if (!root) return;

        root.querySelectorAll('[data-rw-parallax]').forEach((el, index) => {
            const intensity = el.getAttribute('data-rw-parallax') || 'medium';
            const id = `root-parallax-${index}-${intensity}`;
            ids.push(id);

            const maxYAttr = el.getAttribute('data-rw-max-y');
            const baseScaleAttr = el.getAttribute('data-rw-base-scale');
            const maxY = maxYAttr != null && maxYAttr !== '' ? Number(maxYAttr) : undefined;
            const baseScale = baseScaleAttr != null && baseScaleAttr !== ''
                ? Number(baseScaleAttr)
                : undefined;

            registerParallaxTarget(id, {
                el,
                measureEl: el.closest('[data-rw-parallax-measure]') || el.parentElement,
                intensity,
                ...(Number.isFinite(maxY) ? { maxY } : {}),
                ...(Number.isFinite(baseScale) ? { baseScale } : {}),
            });
        });
        refreshParallaxTargets();
    }

    onMounted(rescan);
    onBeforeUnmount(clear);

    return { rescan, clear };
}
