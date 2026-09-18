<script setup>
import { computed, ref, watch } from 'vue';

const props = defineProps({
    featuredImage: {
        type: String,
        default: null,
    },
    galleryImages: {
        type: Array,
        default: () => [],
    },
    alt: {
        type: String,
        default: 'Property gallery',
    },
});

const index = ref(0);
const lightboxOpen = ref(false);

const images = computed(() => {
    const list = [
        props.featuredImage,
        ...(Array.isArray(props.galleryImages) ? props.galleryImages : []),
    ].filter(Boolean);

    return [...new Set(list)];
});

const current = computed(() => images.value[index.value] || null);
const counter = computed(() =>
    images.value.length ? `${index.value + 1} / ${images.value.length}` : '0 / 0'
);

watch(images, () => {
    index.value = 0;
});

function prev() {
    if (images.value.length <= 1) return;
    index.value = (index.value - 1 + images.value.length) % images.value.length;
}

function next() {
    if (images.value.length <= 1) return;
    index.value = (index.value + 1) % images.value.length;
}

function select(i) {
    index.value = i;
}

function openLightbox() {
    if (current.value) {
        lightboxOpen.value = true;
    }
}
</script>

<template>
    <section class="rw-gallery">
        <div class="rw-gallery__layout">
            <div class="rw-gallery__stage">
                <Transition name="rw-gallery-fade" mode="out-in">
                    <img
                        v-if="current"
                        :key="current"
                        :src="current"
                        :alt="alt"
                        class="rw-gallery__image"
                        @click="openLightbox"
                    >
                    <div
                        v-else
                        key="empty"
                        class="rw-gallery__empty"
                    >
                        Image coming soon
                    </div>
                </Transition>

                <button
                    v-if="images.length > 1"
                    type="button"
                    class="rw-gallery__nav is-prev"
                    aria-label="Previous image"
                    @click="prev"
                >
                    <i class="fas fa-chevron-left" />
                </button>
                <button
                    v-if="images.length > 1"
                    type="button"
                    class="rw-gallery__nav is-next"
                    aria-label="Next image"
                    @click="next"
                >
                    <i class="fas fa-chevron-right" />
                </button>

                <div class="rw-gallery__counter">{{ counter }}</div>
                <button
                    v-if="current"
                    type="button"
                    class="rw-gallery__expand"
                    aria-label="Open fullscreen"
                    @click="openLightbox"
                >
                    <i class="fas fa-expand" />
                </button>
            </div>

            <div
                v-if="images.length > 1"
                class="rw-gallery__thumbs"
            >
                <button
                    v-for="(image, i) in images.slice(0, 6)"
                    :key="`${image}-${i}`"
                    type="button"
                    class="rw-gallery__thumb"
                    :class="{ 'is-active': i === index }"
                    @click="select(i)"
                >
                    <img :src="image" :alt="`${alt} ${i + 1}`">
                </button>
            </div>
        </div>

        <Teleport to="body">
            <div
                v-if="lightboxOpen"
                class="rw-lightbox"
                @click.self="lightboxOpen = false"
            >
                <button
                    type="button"
                    class="rw-lightbox__close"
                    aria-label="Close"
                    @click="lightboxOpen = false"
                >
                    <i class="fas fa-xmark" />
                </button>
                <img :src="current" :alt="alt">
            </div>
        </Teleport>
    </section>
</template>

<style scoped>
.rw-gallery__layout {
    display: grid;
    grid-template-columns: minmax(0, 1.55fr) minmax(180px, 0.55fr);
    gap: 0.75rem;
    align-items: stretch;
}

.rw-gallery__stage {
    position: relative;
    min-height: 420px;
    height: min(62vh, 560px);
    overflow: hidden;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #121315;
}

.rw-gallery__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    cursor: zoom-in;
}

.rw-gallery__empty {
    display: grid;
    place-items: center;
    height: 100%;
    color: #777b82;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-size: 0.75rem;
}

.rw-gallery__nav,
.rw-gallery__expand,
.rw-lightbox__close {
    position: absolute;
    display: grid;
    place-items: center;
    width: 40px;
    height: 40px;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.16);
    background: rgba(20, 20, 22, 0.72);
    color: #f5f2ee;
    backdrop-filter: blur(10px);
    cursor: pointer;
}

.rw-gallery__nav.is-prev { left: 1rem; top: 50%; transform: translateY(-50%); }
.rw-gallery__nav.is-next { right: 1rem; top: 50%; transform: translateY(-50%); }
.rw-gallery__expand { right: 1rem; bottom: 1rem; }

.rw-gallery__counter {
    position: absolute;
    left: 1rem;
    bottom: 1rem;
    padding: 0.35rem 0.7rem;
    border-radius: 999px;
    border: 1px solid rgba(255, 255, 255, 0.14);
    background: rgba(20, 20, 22, 0.72);
    color: #f5f2ee;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
}

.rw-gallery__thumbs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.65rem;
    align-content: start;
}

.rw-gallery__thumb {
    aspect-ratio: 1;
    padding: 0;
    border-radius: 8px;
    border: 1px solid transparent;
    overflow: hidden;
    background: #17181b;
    cursor: pointer;
    transition: border-color 0.3s ease;
}

.rw-gallery__thumb.is-active {
    border-color: #8f2338;
}

.rw-gallery__thumb img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.rw-lightbox {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: grid;
    place-items: center;
    padding: 2rem;
    background: rgba(0, 0, 0, 0.88);
}

.rw-lightbox img {
    max-width: min(1100px, 100%);
    max-height: 90vh;
    object-fit: contain;
}

.rw-lightbox__close {
    top: 1.25rem;
    right: 1.25rem;
}

.rw-gallery-fade-enter-active,
.rw-gallery-fade-leave-active {
    transition: opacity 0.4s ease;
}

.rw-gallery-fade-enter-from,
.rw-gallery-fade-leave-to {
    opacity: 0;
}

@media (max-width: 900px) {
    .rw-gallery__layout {
        grid-template-columns: 1fr;
    }

    .rw-gallery__thumbs {
        grid-template-columns: repeat(4, 1fr);
    }

    .rw-gallery__stage {
        min-height: 280px;
        height: 48vh;
    }
}

@media (prefers-reduced-motion: reduce) {
    .rw-gallery-fade-enter-active,
    .rw-gallery-fade-leave-active {
        transition: none;
    }
}
</style>
