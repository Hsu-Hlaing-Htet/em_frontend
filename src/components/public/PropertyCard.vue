<template>
    <article
        class="group h-full overflow-hidden rounded-lg border border-[#d6b8c1]/60 bg-rw-surface transition-all duration-300 hover:-translate-y-1 hover:border-[#552032]/35"
    >
        <div class="relative h-64 overflow-hidden md:h-72">
            <img
                :src="property.featured_image || 'https://images.unsplash.com/photo-1560185007-cde436f6a4d0'"
                :alt="property.property_name"
                class="h-full w-full object-cover transition duration-500 group-hover:scale-105 group-hover:brightness-90"
            >

            <div class="absolute inset-0 flex items-end bg-gradient-to-t from-[#552032]/85 via-[#552032]/20 to-transparent p-5 opacity-0 transition duration-300 group-hover:opacity-100">
                <div class="text-sm uppercase tracking-[0.16em] text-white">
                    {{ property.property_name }}
                </div>
            </div>

            <button
                type="button"
                aria-label="Previous image"
                class="absolute left-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-rw-surface/15 text-white opacity-0 backdrop-blur-sm transition duration-300 hover:bg-white hover:text-[#552032] group-hover:opacity-100"
            >
                <i class="fas fa-chevron-left text-sm" />
            </button>

            <button
                type="button"
                aria-label="Next image"
                class="absolute right-4 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-rw-surface/15 text-white opacity-0 backdrop-blur-sm transition duration-300 hover:bg-white hover:text-[#552032] group-hover:opacity-100"
            >
                <i class="fas fa-chevron-right text-sm" />
            </button>

            <div class="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2 opacity-0 transition duration-300 group-hover:opacity-100">
                <span class="h-2 w-6 rounded-full bg-rw-surface" />
                <span class="h-2 w-2 rounded-full bg-rw-surface/60" />
                <span class="h-2 w-2 rounded-full bg-rw-surface/60" />
            </div>

            <span
                class="absolute left-4 top-4 rounded-full border border-white/70 bg-rw-surface/95 px-3 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[#552032] shadow-sm"
            >
                {{ offerLabel }}
            </span>
        </div>

        <div class="p-5">
            <h3 class="m-0 line-clamp-2 text-xl leading-snug text-[#552032]">
                {{ property.property_name }}
            </h3>

            <p class="mt-3 mb-4 text-lg leading-none text-[#552032]">
                {{ displayPrice }}
            </p>

            <div class="property-meta grid grid-cols-2 gap-3 py-4 text-sm text-rw-muted">
                <span class="inline-flex items-center gap-2">
                    <i class="fas fa-hashtag w-4 text-[#d6b8c1]" />
                    {{ property.property_code }}
                </span>

                <span class="inline-flex items-center gap-2">
                    <i class="fas fa-location-dot w-4 text-[#d6b8c1]" />
                    {{ property.township }}
                </span>

                <span class="inline-flex items-center gap-2">
                    <i class="fas fa-bed w-4 text-[#d6b8c1]" />
                    {{ property.bedrooms ?? '-' }} beds
                </span>

                <span class="inline-flex items-center gap-2">
                    <i class="fas fa-ruler-combined w-4 text-[#d6b8c1]" />
                    {{ property.area_sqft ?? '-' }} sqft
                </span>
            </div>

            <div class="mt-5 flex items-center justify-between gap-3">
                <button
                    type="button"
                    class="inline-flex items-center gap-2 rounded-t-xl rounded-bl-xl border border-[#552032] bg-[#552032] px-6 py-2.5 text-sm uppercase text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:text-[#552032] hover:shadow-[0_12px_28px_rgba(85,32,50,0.16)] focus:bg-white focus:text-[#552032] focus:outline-none focus:ring-2 focus:ring-[#d6b8c1]"
                >
                    Details
                    <i class="fas fa-arrow-right text-xs" />
                </button>
            </div>
        </div>
    </article>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    property: {
        type: Object,
        required: true,
    },
});

const emit = defineEmits(['compare']);

const offerLabel = computed(() =>
    props.property.purpose === 'rent'
        ? 'FOR RENT'
        : 'FOR SALE'
);

const displayPrice = computed(() => {

    const value =
        props.property.purpose === 'sale'
            ? props.property.sale_price
            : props.property.monthly_rent;

    if (!value) {
        return 'Contact for price';
    }

    const formatted =
        new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
        }).format(Number(value));

    return props.property.purpose === 'rent'
        ? `${formatted} / month`
        : formatted;
});

function compare() {

    emit('compare', props.property);
}
</script>
