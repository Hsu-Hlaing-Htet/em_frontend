<script setup>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { formatCurrency } from '@/utils/formatter';

const props = defineProps({
    property: {
        type: Object,
        required: true,
    },
});

const router = useRouter();

const locationLabel = computed(() => {
    const parts = [props.property.township, props.property.city].filter(Boolean);
    if (parts.length) {
        return parts.join(', ');
    }

    return props.property.address || 'Rosewood Royale';
});

const priceLabel = computed(() => {
    if (props.property.purpose === 'rent') {
        const rent = props.property.monthly_rent ?? props.property.rent_price;
        if (!rent) {
            return 'Contact for price';
        }

        return `${formatCurrency(Number(rent))}/month`;
    }

    if (!props.property.sale_price) {
        return 'Contact for price';
    }

    return formatCurrency(Number(props.property.sale_price));
});

const imageUrl = computed(() => props.property.featured_image || null);

function viewDetails() {
    if (!props.property.id) {
        return;
    }

    router.push({
        name: 'property-detail',
        params: { id: String(props.property.id) },
        query: props.property.purpose ? { purpose: props.property.purpose } : undefined,
    });
}

function contactAgent() {
    router.push({ name: 'contact' });
}
</script>

<template>
    <article class="chat-property-card">
        <div class="chat-property-card__media">
            <img
                v-if="imageUrl"
                :src="imageUrl"
                :alt="property.property_name || 'Rosewood property'"
                class="chat-property-card__image"
            >
            <div
                v-else
                class="chat-property-card__image chat-property-card__image--placeholder"
                aria-hidden="true"
            />
            <span class="chat-property-card__badge">
                {{ property.purpose === 'rent' ? 'For Rent' : 'For Sale' }}
            </span>
        </div>

        <div class="chat-property-card__body">
            <h4 class="chat-property-card__title">
                {{ property.property_name }}
            </h4>

            <p class="chat-property-card__meta">
                <i class="fas fa-location-dot" aria-hidden="true" />
                {{ locationLabel }}
            </p>

            <ul class="chat-property-card__facts">
                <li v-if="property.area_sqft">
                    <i class="fas fa-ruler-combined" aria-hidden="true" />
                    {{ Number(property.area_sqft).toLocaleString('en-US') }} sqft
                </li>
                <li v-if="property.floor_number != null && property.floor_number !== ''">
                    <i class="fas fa-stairs" aria-hidden="true" />
                    Floor {{ property.floor_number }}
                </li>
                <li>
                    <i class="fas fa-coins" aria-hidden="true" />
                    {{ priceLabel }}
                </li>
            </ul>

            <div class="chat-property-card__actions">
                <button
                    type="button"
                    class="chat-property-card__btn chat-property-card__btn--primary"
                    @click="viewDetails"
                >
                    View Details
                </button>
                <button
                    type="button"
                    class="chat-property-card__btn chat-property-card__btn--ghost"
                    @click="contactAgent"
                >
                    Contact Agent
                </button>
            </div>
        </div>
    </article>
</template>

<style scoped>
.chat-property-card {
    overflow: hidden;
    border: 1px solid var(--rw-border);
    border-radius: 0.85rem;
    background: var(--rw-surface, #fff);
    box-shadow: 0 10px 28px rgba(85, 32, 50, 0.08);
}

.chat-property-card__media {
    position: relative;
    height: 8.5rem;
    overflow: hidden;
    background: color-mix(in srgb, var(--rw-brand) 12%, white);
}

.chat-property-card__image {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.chat-property-card__image--placeholder {
    background: linear-gradient(
        135deg,
        color-mix(in srgb, var(--rw-brand) 18%, white),
        color-mix(in srgb, var(--rw-brand-light, #d6b8c1) 35%, white)
    );
}

.chat-property-card__badge {
    position: absolute;
    top: 0.65rem;
    left: 0.65rem;
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 999px;
    background: rgba(255, 255, 255, 0.94);
    padding: 0.2rem 0.55rem;
    color: var(--rw-primary-deep, #552032);
    font-size: 0.62rem;
    font-weight: 700;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}

.chat-property-card__body {
    padding: 0.85rem 0.9rem 1rem;
}

.chat-property-card__title {
    margin: 0;
    color: var(--rw-primary-deep, #552032);
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.35;
}

.chat-property-card__meta {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    margin: 0.45rem 0 0;
    color: var(--rw-muted, #7a6a70);
    font-size: 0.78rem;
}

.chat-property-card__facts {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.4rem 0.55rem;
    margin: 0.75rem 0 0;
    padding: 0;
    list-style: none;
    color: var(--rw-muted, #7a6a70);
    font-size: 0.74rem;
}

.chat-property-card__facts li {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
}

.chat-property-card__facts i {
    width: 0.85rem;
    color: var(--rw-brand-light, #d6b8c1);
}

.chat-property-card__actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.45rem;
    margin-top: 0.85rem;
}

.chat-property-card__btn {
    min-height: 2.35rem;
    border-radius: 0.65rem;
    padding: 0.45rem 0.55rem;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    transition: transform 200ms ease, opacity 200ms ease, background 200ms ease;
}

.chat-property-card__btn:hover {
    transform: translateY(-1px);
}

.chat-property-card__btn--primary {
    border: 1px solid var(--rw-primary-deep, #552032);
    background: var(--rw-primary-deep, #552032);
    color: #fff;
}

.chat-property-card__btn--ghost {
    border: 1px solid var(--rw-border);
    background: transparent;
    color: var(--rw-primary-deep, #552032);
}
</style>
