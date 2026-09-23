<script setup>
defineProps({
    locations: {
        type: Array,
        required: true,
    },
});
</script>

<template>
    <section class="rw-section reveal">
        <div class="container">
            <div class="rw-section-head">
                <div>
                    <p class="rw-kicker">Explore Yangon</p>
                    <h2>Find a neighborhood that fits your life</h2>
                </div>
            </div>

            <div class="rw-locations reveal-stagger is-visible">
                <router-link
                    v-for="location in locations"
                    :key="location.name"
                    :to="{ path: '/properties', query: { township: location.name } }"
                    class="rw-location-card"
                    data-rw-parallax-measure
                >
                    <img
                        :src="location.image"
                        :alt="location.name"
                        loading="lazy"
                        data-rw-parallax="medium"
                        data-rw-max-y="28"
                        data-rw-base-scale="1.035"
                    >
                    <div class="rw-location-card__overlay">
                        <h3>{{ location.name }}</h3>
                        <p v-if="location.count != null">
                            {{ location.count }} {{ location.count === 1 ? 'property' : 'properties' }}
                        </p>
                        <span class="rw-location-card__cta">
                            Explore properties
                            <i class="fas fa-arrow-right" />
                        </span>
                    </div>
                </router-link>
            </div>
        </div>
    </section>
</template>

<style scoped>
.rw-locations {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1rem;
}

.rw-location-card {
    position: relative;
    display: block;
    overflow: hidden;
    min-height: 260px;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.rw-location-card img {
    width: 100%;
    height: 118%;
    object-fit: cover;
    transition: transform 0.55s ease;
}

.rw-location-card:hover img:not([data-rw-parallax]) {
    transform: scale(1.035);
}

.rw-location-card__overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1.25rem;
    background: linear-gradient(180deg, transparent 28%, rgba(13, 13, 15, 0.9) 100%);
    transition: background 0.45s ease;
}

.rw-location-card:hover .rw-location-card__overlay {
    background: linear-gradient(180deg, transparent 20%, rgba(13, 13, 15, 0.8) 100%);
}

.rw-location-card h3 {
    margin: 0;
    font-size: 1.7rem;
    font-weight: 500;
}

.rw-location-card p {
    margin: 0.3rem 0 0;
    color: #a9adb5;
    font-size: 0.8rem;
}

.rw-location-card__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.7rem;
    color: #f5f2ee;
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}

.rw-location-card__cta i {
    transition: transform 0.35s ease;
    font-size: 0.62rem;
}

.rw-location-card:hover .rw-location-card__cta i {
    transform: translateX(4px);
}

@media (max-width: 1024px) {
    .rw-locations {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 640px) {
    .rw-locations {
        display: flex;
        gap: 0.85rem;
        overflow-x: auto;
        padding-bottom: 0.35rem;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
    }

    .rw-location-card {
        flex: 0 0 78%;
        scroll-snap-align: start;
        min-height: 240px;
    }
}

@media (prefers-reduced-motion: reduce) {
    .rw-location-card img,
    .rw-location-card__cta i {
        transition: none;
    }

    .rw-location-card:hover img {
        transform: none;
    }
}
</style>
