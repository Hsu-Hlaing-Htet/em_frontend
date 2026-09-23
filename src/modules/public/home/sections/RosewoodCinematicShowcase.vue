<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { HERO_BUILDING } from './three/cinematicViews';

const props = defineProps({
    active: Boolean,
    rotating: Boolean,
    paused: Boolean,
    src: { type: String, default: '' },
});

const emit = defineEmits(['ready', 'error']);

const host = ref(null);
const imageSrc = ref(props.src || HERO_BUILDING.localPoster);
const reduced = ref(false);
const isCoarse = ref(false);

const camera = ref({
    x: 0,
    y: 0,
    scale: 1.05,
    tilt: 0,
    haze: 0,
});

let disposed = false;
let raf = 0;
let motionQuery = null;
let coarseQuery = null;
let emittedReady = false;
let phase = 0;
let previousTime = 0;

let pointerTarget = { x: 0, y: 0 };
let dragOrbit = 0;
let dragVelocity = 0;
let dragging = false;
let lastPointerX = 0;
let lastPointerT = 0;

const LERP = 0.055;
const IDLE_SPEED = 0.48;
const FRICTION = 0.95;
const DRAG_GAIN = 0.0022;

const parallaxMax = computed(() => (isCoarse.value ? 10 : 22));

const buildingStyle = computed(() => {
    const { x, y, scale, tilt } = camera.value;
    return {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotateY(${tilt}deg)`,
    };
});

const depthStyle = computed(() => {
    const { x, y, scale } = camera.value;
    return {
        transform: `translate3d(${x * -0.42}px, ${y * -0.28}px, 0) scale(${scale * 1.14})`,
    };
});

const hazeStyle = computed(() => {
    const { x, haze } = camera.value;
    return {
        transform: `translate3d(${x * 0.25}px, 0, 0)`,
        opacity: 0.28 + haze * 0.2,
    };
});

const glowStyle = computed(() => {
    const { x, y } = camera.value;
    return {
        transform: `translate3d(${x * -0.55}px, ${y * 0.35}px, 0)`,
    };
});

function resolveHeroSrc() {
    return props.src || HERO_BUILDING.localPoster;
}

function onImageError() {
    const current = imageSrc.value;
    if (current === HERO_BUILDING.localPoster) {
        imageSrc.value = HERO_BUILDING.localPosterJpg;
        return;
    }
    if (current === HERO_BUILDING.localPosterJpg) {
        imageSrc.value = HERO_BUILDING.src;
        return;
    }
    if (!emittedReady) emit('error');
}

function onImageLoad() {
    if (emittedReady || disposed) return;
    emittedReady = true;
    emit('ready');
}

function onPointerDown(event) {
    if (reduced.value || event.button > 0) return;
    dragging = true;
    dragVelocity = 0;
    lastPointerX = event.clientX;
    lastPointerT = performance.now();
    host.value?.setPointerCapture?.(event.pointerId);
}

function onPointerMove(event) {
    const el = host.value;
    if (!el || reduced.value) return;
    const rect = el.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const nx = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((event.clientY - rect.top) / rect.height) * 2 - 1;
    pointerTarget = {
        x: Math.max(-1, Math.min(1, nx)),
        y: Math.max(-1, Math.min(1, ny)),
    };

    if (!dragging) return;
    const now = performance.now();
    const dx = event.clientX - lastPointerX;
    const dt = Math.max(16, now - lastPointerT);
    lastPointerX = event.clientX;
    lastPointerT = now;
    dragOrbit += dx * DRAG_GAIN * 55;
    dragVelocity = (dx / dt) * 1000 * DRAG_GAIN * 40;
}

function onPointerUp(event) {
    if (!dragging) return;
    dragging = false;
    try {
        host.value?.releasePointerCapture?.(event.pointerId);
    } catch {
        /* ignore */
    }
}

function onPointerLeave() {
    if (!dragging) pointerTarget = { x: 0, y: 0 };
}

function tick(time) {
    raf = 0;
    if (disposed || !props.active || document.hidden) {
        previousTime = 0;
        return;
    }

    const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 1 / 60;
    previousTime = time;

    const allowIdle = props.rotating && !props.paused && !reduced.value && !dragging;
    if (allowIdle) phase += delta * IDLE_SPEED;

    const px = parallaxMax.value;
    // Noticeable within ~2–3s, still calm.
    const idleX = allowIdle ? Math.sin(phase * 0.55) * (isCoarse.value ? 8 : 16) : 0;
    const idleY = allowIdle ? Math.cos(phase * 0.38) * (isCoarse.value ? 4 : 9) : 0;
    const idleScale = allowIdle
        ? 1.045 + Math.sin(phase * 0.42) * 0.022
        : 1.04;
    const idleTilt = allowIdle ? Math.sin(phase * 0.33) * (isCoarse.value ? 0.6 : 1.8) : 0;
    const idleHaze = allowIdle ? (Math.sin(phase * 0.28) + 1) * 0.5 : 0.35;

    if (!dragging && Math.abs(dragVelocity) > 0.002) {
        dragOrbit += dragVelocity * delta;
        dragVelocity *= Math.pow(FRICTION, delta * 60);
        if (Math.abs(dragVelocity) < 0.002) dragVelocity = 0;
    }
    if (!dragging) {
        dragOrbit += (0 - dragOrbit) * (1 - Math.exp(-delta * 0.4));
    }
    dragOrbit = Math.max(-22, Math.min(22, dragOrbit));

    const targetX = idleX + pointerTarget.x * px + dragOrbit;
    const targetY = idleY + pointerTarget.y * (px * 0.6);
    const targetScale = idleScale + Math.abs(pointerTarget.x) * 0.018;
    const targetTilt = idleTilt + pointerTarget.x * 1.6 + dragOrbit * 0.1;
    const targetHaze = idleHaze;

    const t = 1 - Math.exp(-LERP * 60 * delta);
    const c = camera.value;
    camera.value = {
        x: c.x + (targetX - c.x) * t,
        y: c.y + (targetY - c.y) * t,
        scale: c.scale + (targetScale - c.scale) * t,
        tilt: c.tilt + (targetTilt - c.tilt) * t,
        haze: c.haze + (targetHaze - c.haze) * t,
    };

    raf = requestAnimationFrame(tick);
}

function updateLoop() {
    cancelAnimationFrame(raf);
    raf = 0;
    previousTime = 0;
    if (!disposed && props.active && !document.hidden) {
        raf = requestAnimationFrame(tick);
    }
}

function onMotionChange() {
    reduced.value = motionQuery.matches;
    if (reduced.value) {
        pointerTarget = { x: 0, y: 0 };
        dragOrbit = 0;
        dragVelocity = 0;
        camera.value = { x: 0, y: 0, scale: 1.04, tilt: 0, haze: 0.35 };
    }
}

function onCoarseChange() {
    isCoarse.value = coarseQuery.matches;
}

watch(() => props.active, updateLoop);

onMounted(() => {
    imageSrc.value = resolveHeroSrc();
    motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    coarseQuery = window.matchMedia('(pointer: coarse)');
    onMotionChange();
    onCoarseChange();
    motionQuery.addEventListener('change', onMotionChange);
    coarseQuery.addEventListener('change', onCoarseChange);
    document.addEventListener('visibilitychange', updateLoop);
    updateLoop();
});

onBeforeUnmount(() => {
    disposed = true;
    cancelAnimationFrame(raf);
    document.removeEventListener('visibilitychange', updateLoop);
    motionQuery?.removeEventListener('change', onMotionChange);
    coarseQuery?.removeEventListener('change', onCoarseChange);
});
</script>

<template>
    <div
        ref="host"
        class="rosewood-cine"
        :class="{ 'is-reduced': reduced }"
        role="img"
        aria-label="Cinematic architectural preview of a future Rosewood residence"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
        @pointerleave="onPointerLeave"
    >
        <div class="rosewood-cine__sky" aria-hidden="true" />
        <div class="rosewood-cine__lights" :style="hazeStyle" aria-hidden="true" />

        <div class="rosewood-cine__depth" :style="depthStyle" aria-hidden="true">
            <img :src="imageSrc" alt="" decoding="async">
        </div>

        <div class="rosewood-cine__glow" :style="glowStyle" aria-hidden="true" />

        <div class="rosewood-cine__stage" :style="buildingStyle">
            <img
                class="rosewood-cine__building"
                :src="imageSrc"
                alt=""
                decoding="async"
                draggable="false"
                @load="onImageLoad"
                @error="onImageError"
            >
        </div>

        <div class="rosewood-cine__ground" aria-hidden="true" />
        <div class="rosewood-cine__veil" aria-hidden="true" />
    </div>
</template>

<style scoped>
.rosewood-cine {
    position: absolute;
    inset: 0;
    overflow: hidden;
    touch-action: pan-y;
    cursor: grab;
    background: transparent;
    perspective: 1400px;
    user-select: none;
}
.rosewood-cine:active { cursor: grabbing; }
.rosewood-cine.is-reduced { cursor: default; }

.rosewood-cine__sky {
    position: absolute;
    inset: 0;
    z-index: 0;
    background:
        radial-gradient(ellipse 80% 50% at 60% 20%, rgba(42, 48, 68, 0.35), transparent 65%),
        radial-gradient(ellipse 60% 45% at 58% 72%, rgba(70, 52, 36, 0.22), transparent 70%);
}

.rosewood-cine__lights {
    position: absolute;
    inset: 0;
    z-index: 1;
    pointer-events: none;
    background-image:
        radial-gradient(1.5px 1.5px at 18% 64%, rgba(255, 220, 170, 0.28), transparent),
        radial-gradient(1px 1px at 34% 72%, rgba(255, 210, 160, 0.2), transparent),
        radial-gradient(1.5px 1.5px at 76% 60%, rgba(255, 225, 180, 0.26), transparent),
        radial-gradient(1px 1px at 88% 68%, rgba(255, 200, 150, 0.18), transparent);
    will-change: transform, opacity;
}

.rosewood-cine__depth {
    position: absolute;
    inset: -20%;
    z-index: 2;
    pointer-events: none;
    will-change: transform;
}
.rosewood-cine__depth img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 40%;
    filter: blur(28px) brightness(0.32) saturate(0.65);
    opacity: 0.85;
}

.rosewood-cine__glow {
    position: absolute;
    left: 12%;
    right: 4%;
    bottom: 4%;
    height: 40%;
    z-index: 3;
    pointer-events: none;
    background: radial-gradient(ellipse at center, rgba(200, 150, 95, 0.2), transparent 70%);
    filter: blur(22px);
    will-change: transform;
}

.rosewood-cine__stage {
    position: absolute;
    inset: -10% -8% -6% -4%;
    z-index: 4;
    transform-style: preserve-3d;
    will-change: transform;
}
.rosewood-cine__building {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: 58% 42%;
    display: block;
    filter: brightness(0.82) contrast(1.08) saturate(0.9);
    pointer-events: none;
}

.rosewood-cine__ground {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 32%;
    z-index: 5;
    pointer-events: none;
    background: linear-gradient(180deg, transparent 0%, rgba(18, 19, 21, 0.35) 40%, rgba(18, 19, 21, 0.92) 100%);
}

.rosewood-cine__veil {
    position: absolute;
    inset: 0;
    z-index: 6;
    pointer-events: none;
    background:
        linear-gradient(180deg, rgba(18, 19, 21, 0.45) 0%, transparent 18%, transparent 70%, rgba(18, 19, 21, 0.55) 100%);
}

@media (max-width: 900px) {
    .rosewood-cine__building { object-position: center 38%; }
}
@media (prefers-reduced-motion: reduce) {
    .rosewood-cine__stage,
    .rosewood-cine__depth,
    .rosewood-cine__glow,
    .rosewood-cine__lights {
        will-change: auto;
    }
}
</style>
