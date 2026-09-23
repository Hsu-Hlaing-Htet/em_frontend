<script setup>
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import { ROSEWOOD_VIDEO_MP4, ROSEWOOD_VIDEO_WEBM } from './three/showcaseAssets';

const props = defineProps({
    active: Boolean,
    rotating: Boolean,
    paused: Boolean,
    sources: {
        type: Object,
        default: () => ({ webm: true, mp4: true }),
    },
});

const emit = defineEmits(['ready', 'error']);
const video = ref(null);
let disposed = false;

async function syncPlayback() {
    const el = video.value;
    if (!el || disposed) return;
    try {
        if (props.active && props.rotating && !props.paused) {
            await el.play();
        } else {
            el.pause();
        }
    } catch {
        /* autoplay may be blocked — still show first frame */
    }
}

watch(() => [props.active, props.rotating, props.paused], syncPlayback);

onMounted(() => {
    const el = video.value;
    if (!el) {
        emit('error');
        return;
    }
    const onReady = () => {
        if (!disposed) emit('ready');
        syncPlayback();
    };
    if (el.readyState >= 2) onReady();
    else el.addEventListener('loadeddata', onReady, { once: true });
    el.addEventListener('error', () => emit('error'), { once: true });
});

onBeforeUnmount(() => {
    disposed = true;
    video.value?.pause();
});
</script>

<template>
    <video
        ref="video"
        class="rosewood-video"
        muted
        loop
        playsinline
        preload="metadata"
        aria-label="Cinematic architectural preview"
    >
        <source v-if="sources.webm" :src="ROSEWOOD_VIDEO_WEBM" type="video/webm">
        <source v-if="sources.mp4" :src="ROSEWOOD_VIDEO_MP4" type="video/mp4">
    </video>
</template>

<style scoped>
.rosewood-video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: #14161b;
}
</style>
