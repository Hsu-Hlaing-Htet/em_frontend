<template>
    <article class="rw-property-card">
        <router-link
            :to="detailTo"
            class="rw-property-card__media"
            :data-rw-parallax-measure="parallax ? '' : undefined"
        >
            <img
                :src="property.featured_image || placeholder"
                :alt="property.property_name || 'Rosewood Royale residence'"
                loading="lazy"
                :data-rw-parallax="parallax ? 'light' : undefined"
                :data-rw-max-y="parallax ? '10' : undefined"
                :data-rw-base-scale="parallax ? '1.02' : undefined"
            >
            <span class="rw-badge">{{ offerLabel }}</span>
        </router-link>

        <div class="rw-property-card__body">
            <h3>
                <router-link :to="detailTo">
                    {{ property.property_name || 'Rosewood Residence' }}
                </router-link>
            </h3>

            <p
                v-if="locationLabel"
                class="rw-property-card__location"
            >
                <i class="fas fa-location-dot" />
                {{ locationLabel }}
            </p>

            <p class="rw-property-card__price">{{ displayPrice }}</p>

            <div
                v-if="metaItems.length"
                class="rw-property-card__meta"
            >
                <span
                    v-for="item in metaItems"
                    :key="item.label"
                >
                    <i :class="`fas ${item.icon}`" />
                    {{ item.label }}
                </span>
            </div>

            <router-link
                :to="detailTo"
                class="rw-property-card__action"
            >
                View Property
                <i class="fas fa-arrow-right" />
            </router-link>
        </div>
    </article>
</template>

<script setup>
import { computed } from 'vue';
import { formatCurrency } from '@/utils/formatter';

const props = defineProps({
    property: {
        type: Object,
        required: true,
    },
    /** Enable light image drift on landing inventory cards only. */
    parallax: {
        type: Boolean,
        default: false,
    },
});

const placeholder = 'data:image/svg+xml,' + encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect fill="#202226" width="100%" height="100%"/><text x="50%" y="50%" fill="#777B82" font-family="sans-serif" font-size="22" text-anchor="middle" dy=".3em">Rosewood Royale</text></svg>`
);

const offerLabel = computed(() =>
    props.property.purpose === 'rent' ? 'For Rent' : 'For Sale'
);

const detailTo = computed(() => ({
    name: 'property-detail',
    params: { id: props.property.id },
    query: props.property.purpose ? { purpose: props.property.purpose } : undefined,
}));

const locationLabel = computed(() => {
    const parts = [props.property.township, props.property.city].filter(Boolean);
    if (parts.length) {
        return parts.join(', ');
    }
    return props.property.address || '';
});

const displayPrice = computed(() => {
    const value = props.property.purpose === 'sale'
        ? props.property.sale_price
        : (props.property.monthly_rent ?? props.property.rent_price);

    if (!value) {
        return 'Contact for price';
    }

    const formatted = formatCurrency(Number(value));
    return props.property.purpose === 'rent' ? `${formatted} / month` : formatted;
});

const metaItems = computed(() => {
    const items = [];

    if (props.property.area_sqft) {
        items.push({
            icon: 'fa-ruler-combined',
            label: `${props.property.area_sqft} sqft`,
        });
    }

    if (props.property.floor_number != null && props.property.floor_number !== '') {
        items.push({
            icon: 'fa-stairs',
            label: `Floor ${props.property.floor_number}`,
        });
    }

    return items;
});
</script>

<style scoped>
.rw-property-card {
    display: flex;
    flex-direction: column;
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #17181b;
    transition: transform 0.4s ease, border-color 0.4s ease;
}

.rw-property-card:hover {
    transform: translateY(-3px);
    border-color: rgba(143, 35, 56, 0.4);
}

.rw-property-card__media {
    position: relative;
    display: block;
    aspect-ratio: 4 / 3;
    overflow: hidden;
    background: #202226;
}

.rw-property-card__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
}

.rw-property-card__media img[data-rw-parallax] {
    height: 112%;
    will-change: transform;
}

.rw-property-card:hover .rw-property-card__media img:not([data-rw-parallax]) {
    transform: scale(1.035);
}

.rw-property-card__media .rw-badge {
    position: absolute;
    top: 0.75rem;
    left: 0.75rem;
}

.rw-property-card__body {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    padding: 1rem 1.05rem 1.1rem;
}

.rw-property-card__body h3 {
    margin: 0;
    font-size: clamp(1.15rem, 1.5vw, 1.35rem);
    font-weight: 500;
    line-height: 1.25;
}

.rw-property-card__body h3 a {
    color: #f5f2ee;
}

.rw-property-card__location {
    margin: 0;
    color: #a9adb5;
    font-size: 0.8rem;
}

.rw-property-card__location i {
    margin-right: 0.3rem;
    color: #8f2338;
    font-size: 0.7rem;
}

.rw-property-card__price {
    margin: 0.2rem 0 0;
    color: #f5f2ee;
    font-size: 1.02rem;
    font-weight: 500;
    letter-spacing: 0.01em;
}

.rw-property-card__meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem 0.85rem;
    padding-top: 0.35rem;
    color: #777b82;
    font-size: 0.74rem;
}

.rw-property-card__meta i {
    margin-right: 0.28rem;
    color: #a9adb5;
    font-size: 0.68rem;
}

.rw-property-card__action {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin-top: 0.5rem;
    color: #f5f2ee;
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}

.rw-property-card__action i {
    transition: transform 0.35s ease;
    font-size: 0.62rem;
}

.rw-property-card:hover .rw-property-card__action i {
    transform: translateX(4px);
}

@media (prefers-reduced-motion: reduce) {
    .rw-property-card,
    .rw-property-card__media img,
    .rw-property-card__action i {
        transition: none;
    }

    .rw-property-card:hover {
        transform: none;
    }

    .rw-property-card:hover .rw-property-card__media img {
        transform: none;
    }
}
</style>
