<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import { CINEMATIC_EDITORIAL, HERO_BUILDING } from './three/cinematicViews';

const props = defineProps({
    poster: { type: String, default: '' },
});

const section = ref(null);
const mediaEl = ref(null);
const contentEl = ref(null);
const animate = ref(false);
const revealed = ref(true);
const imageSrc = ref(HERO_BUILDING.localPoster);
const imageFailed = ref(false);
const reducedMotion = ref(false);

let disposed = false;
let raf = 0;
let ticking = false;
let inView = false;
let observer = null;
let motionQuery = null;
let coarseQuery = null;
let isCoarse = false;
let isNarrow = false;

// Current / target transforms for lightweight lerp smoothing
let mediaY = 0;
let mediaScale = 1.06;
let mediaYTarget = 0;
let mediaScaleTarget = 1.06;
let textY = 0;
let textYTarget = 0;

const LERP = 0.14;

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function resolveNextSrc(current) {
    if (current === HERO_BUILDING.localPoster) return HERO_BUILDING.localPosterJpg;
    if (current === HERO_BUILDING.localPosterJpg) return HERO_BUILDING.src;
    if (current === HERO_BUILDING.src && props.poster) return props.poster;
    return null;
}

function onImageError() {
    const next = resolveNextSrc(imageSrc.value);
    if (next) {
        imageSrc.value = next;
        return;
    }
    imageFailed.value = true;
}

function readPrefs() {
    reducedMotion.value = motionQuery?.matches ?? false;
    isCoarse = coarseQuery?.matches ?? false;
    isNarrow = window.innerWidth < 768;
}

function ranges() {
    if (isCoarse || isNarrow) {
        return {
            mediaEnter: 20,
            mediaExit: -20,
            textEnter: 8,
            textExit: -12,
            scaleMin: 1.04,
            scaleMax: 1.055,
        };
    }
    return {
        mediaEnter: 60,
        mediaExit: -60,
        textEnter: 25,
        textExit: -35,
        scaleMin: 1.05,
        scaleMax: 1.08,
    };
}

/**
 * Section progress through the viewport:
 *  t = -1 → section center at bottom (entering)
 *  t =  0 → section center at viewport middle
 *  t = +1 → section center at top (leaving)
 */
function computeTargets() {
    const el = section.value;
    if (!el || reducedMotion.value) {
        mediaYTarget = 0;
        textYTarget = 0;
        mediaScaleTarget = 1.05;
        return;
    }

    const rect = el.getBoundingClientRect();
    const viewH = window.innerHeight || 1;
    const progress = (viewH / 2 - (rect.top + rect.height / 2)) / (viewH * 0.55);
    const t = clamp(progress, -1, 1);
    const r = ranges();

    // Linear map t:-1→1 to enter→exit
    mediaYTarget = r.mediaEnter + ((t + 1) / 2) * (r.mediaExit - r.mediaEnter);
    textYTarget = r.textEnter + ((t + 1) / 2) * (r.textExit - r.textEnter);
    mediaScaleTarget = r.scaleMin + Math.abs(t) * (r.scaleMax - r.scaleMin);
}

function applyTransforms() {
    if (mediaEl.value) {
        mediaEl.value.style.transform =
            `translate3d(0, ${mediaY.toFixed(2)}px, 0) scale(${mediaScale.toFixed(4)})`;
    }
    if (contentEl.value) {
        contentEl.value.style.transform = `translate3d(0, ${textY.toFixed(2)}px, 0)`;
    }
}

function resetTransforms() {
    mediaY = 0;
    mediaYTarget = 0;
    textY = 0;
    textYTarget = 0;
    mediaScale = 1.05;
    mediaScaleTarget = 1.05;
    if (mediaEl.value) {
        mediaEl.value.style.transform = 'translate3d(0, 0, 0) scale(1.05)';
        mediaEl.value.style.willChange = 'auto';
    }
    if (contentEl.value) {
        contentEl.value.style.transform = 'translate3d(0, 0, 0)';
        contentEl.value.style.willChange = 'auto';
    }
}

function tick() {
    raf = 0;
    ticking = false;
    if (disposed || reducedMotion.value || document.hidden) return;

    computeTargets();

    mediaY += (mediaYTarget - mediaY) * LERP;
    textY += (textYTarget - textY) * LERP;
    mediaScale += (mediaScaleTarget - mediaScale) * LERP;

    applyTransforms();

    // Keep interpolating until settled; scroll events restart the chain.
    if (
        Math.abs(mediaYTarget - mediaY) > 0.08
        || Math.abs(textYTarget - textY) > 0.08
        || Math.abs(mediaScaleTarget - mediaScale) > 0.0004
    ) {
        scheduleTick();
    }
}

function scheduleTick() {
    if (disposed || reducedMotion.value || ticking || document.hidden) return;
    ticking = true;
    raf = requestAnimationFrame(tick);
}

function onScrollOrResize() {
    if (disposed || reducedMotion.value) return;
    isNarrow = window.innerWidth < 768;
    if (!inView) {
        // Still update targets when near viewport edges so entry is smooth.
        const el = section.value;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const viewH = window.innerHeight || 1;
        if (rect.bottom < -160 || rect.top > viewH + 160) return;
    }
    scheduleTick();
}

function onVisibility() {
    if (document.hidden) {
        cancelAnimationFrame(raf);
        raf = 0;
        ticking = false;
        return;
    }
    if (inView && !reducedMotion.value) scheduleTick();
}

function onMotionChange() {
    readPrefs();
    if (reducedMotion.value) {
        cancelAnimationFrame(raf);
        raf = 0;
        ticking = false;
        resetTransforms();
        animate.value = false;
        revealed.value = true;
        return;
    }
    if (mediaEl.value) mediaEl.value.style.willChange = 'transform';
    if (contentEl.value) contentEl.value.style.willChange = 'transform';
    if (inView) scheduleTick();
}

onMounted(async () => {
    imageSrc.value = HERO_BUILDING.localPoster;

    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    coarseQuery = window.matchMedia('(pointer: coarse)');
    motionQuery.addEventListener('change', onMotionChange);
    coarseQuery.addEventListener('change', onMotionChange);
    readPrefs();

    await nextTick();

    if (reducedMotion.value || !section.value) {
        animate.value = false;
        revealed.value = true;
        resetTransforms();
        return;
    }

    if (mediaEl.value) mediaEl.value.style.willChange = 'transform';
    if (contentEl.value) contentEl.value.style.willChange = 'transform';

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    document.addEventListener('visibilitychange', onVisibility);

    observer = new IntersectionObserver(
        ([entry]) => {
            inView = entry.isIntersecting;
            if (entry.isIntersecting) {
                revealed.value = true;
                scheduleTick();
            } else if (!reducedMotion.value) {
                // One more settle frame when leaving
                scheduleTick();
            }
        },
        { threshold: [0, 0.05, 0.15], rootMargin: '120px 0px' },
    );
    observer.observe(section.value);

    const rect = section.value.getBoundingClientRect();
    const viewH = window.innerHeight || 1;
    const alreadyInView = rect.bottom > 0 && rect.top < viewH;

    if (alreadyInView) {
        animate.value = false;
        revealed.value = true;
        inView = true;
        scheduleTick();
    } else {
        animate.value = true;
        revealed.value = false;
    }

    computeTargets();
    mediaY = mediaYTarget;
    textY = textYTarget;
    mediaScale = mediaScaleTarget;
    applyTransforms();
});

onBeforeUnmount(() => {
    disposed = true;
    cancelAnimationFrame(raf);
    raf = 0;
    ticking = false;
    observer?.disconnect();
    observer = null;
    window.removeEventListener('scroll', onScrollOrResize);
    window.removeEventListener('resize', onScrollOrResize);
    document.removeEventListener('visibilitychange', onVisibility);
    motionQuery?.removeEventListener('change', onMotionChange);
    coarseQuery?.removeEventListener('change', onMotionChange);
    resetTransforms();
});
</script>

<template>
    <!-- Same structural pattern as Home `.rw-page-hero`: media → overlay → left content -->
    <section
        ref="section"
        class="rw-section rosewood-coming"
        :class="{
            'is-animate': animate,
            'is-revealed': revealed,
            'is-reduced': reducedMotion,
        }"
        aria-labelledby="rosewood-3d-title"
    >
        <div
            ref="mediaEl"
            class="rosewood-coming__media"
            aria-hidden="true"
        >
            <img
                v-if="!imageFailed"
                :src="imageSrc"
                alt=""
                decoding="async"
                fetchpriority="low"
                @error="onImageError"
            >
            <div v-else class="rosewood-coming__fallback" />
        </div>

        <div class="rosewood-coming__overlay" aria-hidden="true" />

        <div
            ref="contentEl"
            class="container rosewood-coming__content"
        >
            <p class="rw-kicker rosewood-coming__item rosewood-coming__item--1">Coming Soon</p>
            <h2 id="rosewood-3d-title" class="rosewood-coming__item rosewood-coming__item--2">
                A New Rosewood Residence Is Taking Shape
            </h2>
            <p class="rw-lede rosewood-coming__item rosewood-coming__item--3">
                An early architectural preview of a future Rosewood Royale residence designed around refined modern living.
            </p>
            <ul class="rosewood-coming__editorial rosewood-coming__item rosewood-coming__item--4" aria-label="Design themes">
                <li v-for="label in CINEMATIC_EDITORIAL" :key="label">{{ label }}</li>
            </ul>
            <p class="rosewood-coming__note rosewood-coming__item rosewood-coming__item--5">
                3D architectural visualization. Final design and details may vary.
            </p>
        </div>
    </section>
</template>

<style scoped>
.rosewood-coming {
    position: relative;
    display: grid;
    place-items: center start;
    overflow: hidden;
    min-height: clamp(680px, 78vh, 800px);
    background: var(--rw-bg-secondary);
}

/* Oversized full-bleed layer — room for ±60px travel without gaps */
.rosewood-coming__media {
    position: absolute;
    inset: -14% 0;
    z-index: 0;
    pointer-events: none;
    will-change: transform;
    transform: translate3d(0, 0, 0) scale(1.06);
}

.rosewood-coming__media img,
.rosewood-coming__fallback {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: cover;
    /* Building primarily on the right */
    object-position: 72% 42%;
    filter: brightness(0.9) contrast(1.04) saturate(0.94);
}

.rosewood-coming__fallback {
    background:
        radial-gradient(ellipse 55% 50% at 70% 45%, rgba(72, 60, 48, 0.4), transparent 70%),
        linear-gradient(165deg, #1a1c22, #0e1014);
}

.rosewood-coming__overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background:
        linear-gradient(
            90deg,
            rgba(13, 13, 15, 0.9) 0%,
            rgba(13, 13, 15, 0.72) 28%,
            rgba(13, 13, 15, 0.28) 55%,
            rgba(13, 13, 15, 0.08) 78%,
            rgba(13, 13, 15, 0.05) 100%
        ),
        linear-gradient(
            180deg,
            rgba(13, 13, 15, 0.28) 0%,
            transparent 28%,
            transparent 62%,
            rgba(13, 13, 15, 0.55) 100%
        );
}

.rosewood-coming__content {
    position: relative;
    z-index: 2;
    max-width: 680px;
    padding: clamp(3.5rem, 8vh, 5.5rem) 0;
    text-align: left;
    will-change: transform;
    transform: translate3d(0, 0, 0);
}

.rosewood-coming__content h2 {
    margin: 0;
    max-width: 16em;
    font-size: clamp(2.35rem, 4.5vw, 3.6rem);
    font-weight: 500;
    line-height: 1.08;
    letter-spacing: -0.02em;
    color: var(--rw-ivory);
}

.rosewood-coming__content .rw-lede {
    max-width: 30rem;
    color: rgba(232, 226, 218, 0.9);
}

.rosewood-coming__editorial {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem 1.15rem;
    margin: 1.4rem 0 0;
    padding: 0;
    list-style: none;
    max-width: 30rem;
}

.rosewood-coming__editorial li {
    position: relative;
    padding-left: 0.8rem;
    font-size: 0.55rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: rgba(196, 110, 122, 0.95);
}

.rosewood-coming__editorial li::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0.48em;
    width: 0.32rem;
    height: 1px;
    background: rgba(168, 72, 86, 0.75);
}

.rosewood-coming__note {
    max-width: 30rem;
    margin: 1.35rem 0 0;
    font-size: 0.68rem;
    line-height: 1.6;
    color: rgba(169, 173, 181, 0.85);
}

/* Entrance: opacity only — continuous parallax owns transforms on wrappers */
.rosewood-coming__item {
    opacity: 1;
}

.rosewood-coming.is-animate .rosewood-coming__item {
    opacity: 0;
    transition: opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1);
}
.rosewood-coming.is-animate .rosewood-coming__item--1 { transition-delay: 0.06s; }
.rosewood-coming.is-animate .rosewood-coming__item--2 { transition-delay: 0.14s; }
.rosewood-coming.is-animate .rosewood-coming__item--3 { transition-delay: 0.24s; }
.rosewood-coming.is-animate .rosewood-coming__item--4 { transition-delay: 0.34s; }
.rosewood-coming.is-animate .rosewood-coming__item--5 { transition-delay: 0.42s; }

.rosewood-coming.is-animate.is-revealed .rosewood-coming__item {
    opacity: 1;
}

.rosewood-coming.is-reduced .rosewood-coming__item {
    opacity: 1;
    transition: none;
}

.rosewood-coming.is-reduced .rosewood-coming__media,
.rosewood-coming.is-reduced .rosewood-coming__content {
    will-change: auto;
    transform: none !important;
}

@media (max-width: 900px) {
    .rosewood-coming {
        min-height: clamp(560px, 72vh, 700px);
        place-items: end start;
    }

    .rosewood-coming__media {
        inset: -12% 0;
    }

    .rosewood-coming__content {
        max-width: none;
        padding: 3rem 0 2.75rem;
    }

    .rosewood-coming__content h2 {
        max-width: none;
        font-size: clamp(2.1rem, 7vw, 2.8rem);
    }

    .rosewood-coming__media img,
    .rosewood-coming__fallback {
        object-position: 58% 38%;
    }

    .rosewood-coming__overlay {
        background:
            linear-gradient(
                180deg,
                rgba(13, 13, 15, 0.35) 0%,
                rgba(13, 13, 15, 0.28) 40%,
                rgba(13, 13, 15, 0.82) 72%,
                rgba(13, 13, 15, 0.94) 100%
            ),
            linear-gradient(
                90deg,
                rgba(13, 13, 15, 0.55) 0%,
                transparent 55%
            );
    }
}

@media (max-width: 540px) {
    .rosewood-coming {
        min-height: 520px;
    }

    .rosewood-coming__editorial {
        gap: 0.4rem 0.9rem;
    }
}

@media (prefers-reduced-motion: reduce) {
    .rosewood-coming__item {
        opacity: 1 !important;
        transition: none !important;
    }

    .rosewood-coming__media,
    .rosewood-coming__content {
        will-change: auto;
        transform: none !important;
    }
}
</style>
