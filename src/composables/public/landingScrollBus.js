/**
 * Shared landing-page scroll parallax bus.
 * One passive scroll listener + one RAF for all registered targets.
 */

const INTENSITY = Object.freeze({
    // Hero / Coming Soon / large architectural panels
    strong: { maxY: 38, baseScale: 1.045, scaleAmp: 0.02 },
    // Rent/Sale gateways, Explore Yangon imagery
    medium: { maxY: 18, baseScale: 1.03, scaleAmp: 0.012 },
    // Inventory / supporting imagery
    light: { maxY: 9, baseScale: 1.015, scaleAmp: 0.008 },
});

const targets = new Map();

let raf = 0;
let listening = false;
let motionQuery = null;
let coarseQuery = null;
let reducedMotion = false;
let isCoarse = false;

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function readPrefs() {
    reducedMotion = motionQuery?.matches ?? false;
    isCoarse = coarseQuery?.matches ?? false;
}

function onMotionChange() {
    readPrefs();
    if (reducedMotion) {
        cancelAnimationFrame(raf);
        raf = 0;
        targets.forEach((target) => {
            if (target.el) {
                target.el.style.transform = `translate3d(0, 0, 0) scale(${target.baseScale})`;
            }
        });
        return;
    }
    scheduleUpdate();
}

function ensurePrefs() {
    if (typeof window === 'undefined') return;
    if (!motionQuery) {
        motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        coarseQuery = window.matchMedia('(pointer: coarse)');
        motionQuery.addEventListener('change', onMotionChange);
        coarseQuery.addEventListener('change', onMotionChange);
        readPrefs();
    }
}

function updateTargets() {
    raf = 0;
    if (typeof window === 'undefined' || reducedMotion || !targets.size) return;
    if (document.hidden) return;

    const viewH = window.innerHeight || 1;

    targets.forEach((target) => {
        const el = target.el;
        if (!el || !el.isConnected) return;

        const measure = target.measureEl?.isConnected ? target.measureEl : el;
        const rect = measure.getBoundingClientRect();

        // Skip far off-screen targets.
        if (rect.bottom < -120 || rect.top > viewH + 120) return;

        const progress = (viewH / 2 - (rect.top + rect.height / 2)) / (viewH * 0.5);
        const t = clamp(progress, -1, 1);
        const maxY = target.maxY * (isCoarse || viewH < 900 ? 0.42 : 1);
        const y = t * -maxY;
        const scale = target.baseScale + Math.abs(t) * target.scaleAmp;

        el.style.transform = `translate3d(0, ${y.toFixed(2)}px, 0) scale(${scale.toFixed(4)})`;
    });
}

function scheduleUpdate() {
    if (typeof window === 'undefined' || reducedMotion || !targets.size || document.hidden) return;
    if (raf) return;
    raf = requestAnimationFrame(updateTargets);
}

function onScrollOrResize() {
    scheduleUpdate();
}

function onVisibility() {
    if (!document.hidden) scheduleUpdate();
}

function startListening() {
    if (listening || typeof window === 'undefined') return;
    ensurePrefs();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);
    listening = true;
    scheduleUpdate();
}

function stopListening() {
    if (!listening || typeof window === 'undefined') return;
    window.removeEventListener('scroll', onScrollOrResize);
    window.removeEventListener('resize', onScrollOrResize);
    document.removeEventListener('visibilitychange', onVisibility);
    cancelAnimationFrame(raf);
    raf = 0;
    listening = false;
}

/**
 * @param {string|symbol} id
 * @param {{
 *   el: HTMLElement,
 *   measureEl?: HTMLElement|null,
 *   intensity?: 'strong'|'medium'|'light',
 *   maxY?: number,
 *   baseScale?: number,
 *   scaleAmp?: number,
 * }} options
 */
export function registerParallaxTarget(id, options) {
    if (typeof window === 'undefined' || !options?.el) return;

    ensurePrefs();
    const preset = INTENSITY[options.intensity] || INTENSITY.medium;

    targets.set(id, {
        el: options.el,
        measureEl: options.measureEl || options.el.parentElement || options.el,
        maxY: options.maxY ?? preset.maxY,
        baseScale: options.baseScale ?? preset.baseScale,
        scaleAmp: options.scaleAmp ?? preset.scaleAmp,
    });

    options.el.style.willChange = 'transform';
    options.el.style.transform = `translate3d(0, 0, 0) scale(${options.baseScale ?? preset.baseScale})`;

    startListening();
    scheduleUpdate();
}

export function unregisterParallaxTarget(id) {
    const target = targets.get(id);
    if (target?.el) {
        target.el.style.willChange = '';
        target.el.style.transform = '';
    }
    targets.delete(id);
    if (!targets.size) stopListening();
}

export function refreshParallaxTargets() {
    scheduleUpdate();
}

export function prefersReducedMotion() {
    ensurePrefs();
    return reducedMotion;
}

export function landingParallaxIntensity(name) {
    return INTENSITY[name] || INTENSITY.medium;
}
