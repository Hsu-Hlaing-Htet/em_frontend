<script setup>
import { computed } from 'vue';

const props = defineProps({
    property: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['compare']);

const offerLabel = computed(() => (props.property.purpose === 'rent' ? 'For Rent' : 'For Sale'));

const displayPrice = computed(() => {
    const value = props.property.purpose === 'sale' ? props.property.sale_price : props.property.monthly_rent;

    if (!value) {
        return 'Contact for price';
    }

    const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
    }).format(Number(value));

    return props.property.purpose === 'rent' ? `${formatted} / month` : formatted;
});

function compare() {
    emit('compare', props.property);
}
</script>

<template>
    <article class="rr-property-card">
        <div class="rr-property-media">
            <img
                :src="property.featured_image || 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0'"
                :alt="property.property_name"
                class="rr-property-image"
            >
            <span class="rr-offer-badge" :class="property.purpose === 'rent' ? 'is-rent' : 'is-sale'">
                {{ offerLabel }}
            </span>
        </div>

        <div class="rr-property-content">
            <h3>{{ property.property_name }}</h3>
            <p class="rr-property-price">{{ displayPrice }}</p>

            <div class="rr-property-meta">
                <span><i class="pi pi-hashtag" /> {{ property.property_code }}</span>
                <span><i class="pi pi-map-marker" /> {{ property.township }}</span>
                <span><i class="pi pi-home" /> {{ property.bedrooms ?? '-' }} beds</span>
                <span><i class="pi pi-chart-line" /> {{ property.area_sqft ?? '-' }} sqft</span>
            </div>

            <div class="rr-property-actions">
                <PvButton label="Compare" class="rr-btn rr-btn-secondary" @click="compare" />
                <router-link :to="`/properties/${property.id}`">
                    <PvButton label="Details" class="rr-btn rr-btn-primary" />
                </router-link>
            </div>
        </div>
    </article>
</template>
