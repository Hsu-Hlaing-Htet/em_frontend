<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { buildFrameUrl } from './three/showcaseAssets';

const props = defineProps({
    active: Boolean,
    rotating: Boolean,
    paused: Boolean,
    manifest: { type: Object, required: true },
});

const emit = defineEmits(['ready', 'error']);

const host = ref(null);
const canvas = ref(null);
const frameLabel = ref(1);

let disposed = false;
let images = [];
let readyCount = 0;
let currentIndex = 0;
let velocity = 0;
let dragging = false;
let lastX = 0;
let lastTime = 0;
let raf = 0;
let previousTime = 0;
let motionQuery = null;
let emittedReady = false;

const FRAME_PX = 2.4; // pixels of drag per frame step
const IDLE_FPS = 0.35; // very slow idle rotation (frames per second)
const FRICTION = 0.94;

function frameCount() {
    return Math.max(2, Number(props.manifest.frameCount) || 0);
}

function wrapIndex(index) {
    const n = frameCount();
    return ((index % n) + n) % n;
}

function draw() {
    const el = canvas.value;
    if (!el) return;
    const ctx = el.getContext('2d');
    if (!ctx) return;

    const img = images[drawIndex()];
    const { width, height } = el;
    ctx.fillStyle = '#14161b';
    ctx.fillRect(0, 0, width, height);

    if (!img?.complete || !img.naturalWidth) return;

    const scale = Math.max(width / img.naturalWidth, height / img.naturalHeight);
    const w = img.naturalWidth * scale;
    const h = img.naturalHeight * scale;
    ctx.drawImage(img, (width - w) / 2, (height - h) / 2, w, h);
}

function setIndex(index) {
    currentIndex = wrapIndex(index);
    const rounded = Math.round(currentIndex) % frameCount();
    frameLabel.value = rounded + 1;
    draw();
}

function drawIndex() {
    const n = frameCount();
    return ((Math.round(currentIndex) % n) + n) % n;
}

function resize() {
    const el = canvas.value;
    const box = host.value;
    if (!el || !box) return;
    const rect = box.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    el.width = Math.max(1, Math.floor(rect.width * dpr));
    el.height = Math.max(1, Math.floor(rect.height * dpr));
    el.style.width = `${rect.width}px`;
    el.style.height = `${rect.height}px`;
    draw();
}

function preloadFrame(index) {
    const n = frameCount();
    const i = ((Math.round(wrapIndex(index)) % n) + n) % n;
    if (images[i]) return images[i];

    const img = new Image();
    img.decoding = 'async';
    img.src = buildFrameUrl(props.manifest, i + 1);
    img.onload = () => {
        readyCount += 1;
        if (!emittedReady && !disposed) {
            emittedReady = true;
            emit('ready');
        }
        draw();
    };
    img.onerror = () => {
        if (import.meta.env.DEV) {
            console.warn('Rosewood 360 frame failed:', img.src);
        }
    };
    images[i] = img;
    return img;
}

function preloadNeighborhood(center, radius = 4) {
    for (let offset = -radius; offset <= radius; offset += 1) {
        preloadFrame(center + offset);
    }
}

function preloadRest() {
    const n = frameCount();
    let i = 0;
    const step = () => {
        if (disposed) return;
        // Load a few per tick to avoid jank.
        for (let k = 0; k < 3 && i < n; k += 1, i += 1) {
            preloadFrame(i);
        }
        if (i < n) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
}

function onPointerDown(event) {
    if (event.button !== undefined && event.button !== 0) return;
    dragging = true;
    velocity = 0;
    lastX = event.clientX;
    lastTime = performance.now();
    host.value?.setPointerCapture?.(event.pointerId);
}

function onPointerMove(event) {
    if (!dragging) return;
    const now = performance.now();
    const dx = event.clientX - lastX;
    const dt = Math.max(16, now - lastTime);
    lastX = event.clientX;
    lastTime = now;

    const deltaFrames = -dx / FRAME_PX;
    setIndex(currentIndex + deltaFrames);
    preloadNeighborhood(Math.round(currentIndex), 5);
    velocity = (deltaFrames / dt) * 1000;
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

function tick(time) {
    raf = 0;
    if (disposed || !props.active || document.hidden) {
        previousTime = 0;
        return;
    }

    const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 1 / 60;
    previousTime = time;

    const reduced = motionQuery?.matches;
    let next = currentIndex;

    if (!dragging && !props.paused) {
        if (Math.abs(velocity) > 0.02) {
            next += velocity * delta;
            velocity *= Math.pow(FRICTION, delta * 60);
            if (Math.abs(velocity) < 0.02) velocity = 0;
        } else if (props.rotating && !reduced) {
            next += IDLE_FPS * delta;
        }
    }

    if (next !== currentIndex) {
        setIndex(next);
        preloadNeighborhood(drawIndex(), 3);
    }

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

watch(() => props.active, updateLoop);

onMounted(() => {
    try {
        if (!props.manifest?.frameCount || !props.manifest?.pattern) {
            throw new Error('Invalid 360 manifest');
        }
        images = new Array(frameCount());
        motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        resize();
        window.addEventListener('resize', resize);
        document.addEventListener('visibilitychange', updateLoop);

        preloadNeighborhood(0, 6);
        preloadRest();
        updateLoop();
    } catch (error) {
        if (import.meta.env.DEV) console.warn('Rosewood 360 viewer failed:', error);
        emit('error');
    }
});

onBeforeUnmount(() => {
    disposed = true;
    cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', updateLoop);
    images = [];
});
</script>

<template>
    <div
        ref="host"
        class="rosewood-360"
        role="img"
        :aria-label="`Architectural 360 preview, frame ${frameLabel} of ${manifest.frameCount}`"
        @pointerdown="onPointerDown"
        @pointermove="onPointerMove"
        @pointerup="onPointerUp"
        @pointercancel="onPointerUp"
    >
        <canvas ref="canvas" class="rosewood-360__canvas" />
    </div>
</template>

<style scoped>
.rosewood-360 {
    position: absolute;
    inset: 0;
    touch-action: pan-y;
    cursor: grab;
    user-select: none;
}
.rosewood-360:active { cursor: grabbing; }
.rosewood-360__canvas {
    display: block;
    width: 100%;
    height: 100%;
    pointer-events: none;
}
</style>
