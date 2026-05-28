<script setup>
import PropertyCard from '@/modules/public/components/PropertyCard.vue';
import FloatingChat from '@/components/FloatingChat.vue';
import { useSale } from './useSale';

const {
    properties,
    heroProperty,
    heroImages,
    activeHeroImageIndex,
    activeHeroImage,
    heroPrice,
    showHelpQuestion,
    nextHeroImage,
    previousHeroImage,
    selectHeroImage,
    formatArea,
} = useSale();
</script>

<template>
    <template v-if="heroProperty">
        <section class="relative min-h-[720px] overflow-hidden bg-[#552032] md:min-h-[calc(100vh-118px)]">
            <Transition name="sale-hero-fade">
                <img
                    :key="activeHeroImage"
                    :src="activeHeroImage"
                    :alt="heroProperty.property_name"
                    class="absolute inset-0 h-full w-full object-cover"
                >
            </Transition>
            <div class="absolute inset-0 bg-[#552032]/35" />

            <div class="container relative z-10 flex min-h-[720px] items-center py-10 md:min-h-[calc(100vh-118px)]">
                <article class="w-full max-w-xl bg-white shadow-[0_28px_80px_rgba(85,32,50,0.24)]">
                    <div class="p-7 md:p-10">
                        <div class="mb-7 flex flex-wrap gap-3">
                            <span class="bg-[#552032] px-4 py-2 text-xs uppercase tracking-[0.08em] text-white">
                                New Offer
                            </span>
                            <span class="border-2 border-[#d6b8c1] px-4 py-2 text-xs uppercase tracking-[0.08em] text-[#552032]">
                                For Sale
                            </span>
                        </div>

                        <h1 class="m-0 text-xl font-semibold leading-tight text-gray-900 md:text-2xl">
                            {{ heroProperty.property_name }}
                        </h1>

                        <p class="mt-3 mb-7 text-lg text-[#552032] md:text-xl">
                            {{ heroPrice }}
                        </p>

                        <p class="mb-7 text-base leading-8 text-gray-600 md:text-md">
                            {{ heroProperty.description || 'A premium ownership opportunity is available in Yangon with refined interiors, strong location value, and generous living space.' }}
                        </p>

                        <div v-if="heroImages.length" class="flex gap-3">
                            <button
                                v-for="(image, index) in heroImages"
                                :key="image"
                                type="button"
                                class="h-16 w-20 overflow-hidden border-2 transition duration-300 md:h-20 md:w-24"
                                :class="index === activeHeroImageIndex ? 'border-[#552032]' : 'border-[#d6b8c1]'"
                                @click="selectHeroImage(index)"
                            >
                                <img
                                    :src="image"
                                    :alt="heroProperty.property_name"
                                    class="h-full w-full object-cover"
                                >
                            </button>
                        </div>
                    </div>

                    <div class="border-t border-gray-200 px-7 py-6 md:px-10">
                        <p class="m-0 flex items-center gap-3 text-lg text-gray-900">
                            <i class="fas fa-location-dot text-[#552032]" />
                            {{ heroProperty.township }}, Yangon
                        </p>

                        <div class="mt-5 flex flex-wrap gap-x-10 gap-y-4 text-md text-gray-800">
                            <span class="inline-flex items-center gap-3">
                                <i class="fas fa-bed text-[#552032]" />
                                {{ heroProperty.bedrooms ?? '-' }}
                            </span>
                            <span class="inline-flex items-center gap-3">
                                <i class="fas fa-bath text-[#552032]" />
                                {{ heroProperty.bathrooms ?? '-' }}
                            </span>
                            <span class="inline-flex items-center gap-3">
                                <i class="fas fa-ruler-combined text-[#552032]" />
                                {{ formatArea(heroProperty.area_sqft) }} ft²
                            </span>
                        </div>
                    </div>

                    <router-link
                        :to="`/properties/${heroProperty.id}`"
                        class="flex items-center border-1 border-[#552032] justify-center gap-3 px-6 py-5 text-lg font-bold text-white transition duration-300 hover:bg-white hover:text-[#552032]"
                    >
                        <i class="fas fa-house text-[#552032]" />
                        View Full Info
                    </router-link>
                </article>
            </div>

            <button
                type="button"
                aria-label="Previous property"
                class="absolute left-0 top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center bg-white text-2xl text-[#552032] shadow-lg transition duration-300 hover:bg-[#552032] hover:text-white md:grid"
                @click="previousHeroImage"
            >
                <i class="fas fa-chevron-left" />
            </button>

            <button
                type="button"
                aria-label="Next property"
                class="absolute right-0 top-1/2 hidden h-14 w-14 -translate-y-1/2 place-items-center bg-white text-2xl text-[#552032] shadow-lg transition duration-300 hover:bg-[#552032] hover:text-white md:grid"
                @click="nextHeroImage"
            >
                <i class="fas fa-chevron-right" />
            </button>

            <div
                v-if="heroImages.length > 1"
                class="absolute bottom-8 left-1/2 hidden -translate-x-1/2 gap-2 md:flex"
            >
                <button
                    v-for="(image, index) in heroImages"
                    :key="image"
                    type="button"
                    :aria-label="`Show property image ${index + 1}`"
                    :aria-current="index === activeHeroImageIndex"
                    class="h-4 w-4 rounded-full border-2 border-white transition duration-300"
                    :class="index === activeHeroImageIndex ? 'bg-white' : 'bg-transparent hover:bg-white/60'"
                    @click="selectHeroImage(index)"
                />
            </div>
        </section>

        <FloatingChat
            :visible="showHelpQuestion"
            context-label="Sales concierge"
            question="Have a question about this home?"
        />

        <section class="section bg-white reveal">
            <div class="container">
                <div class="flex flex-col gap-3 border-b border-[#d6b8c1]/70 pb-5 md:flex-row md:items-end md:justify-between">
                    <div>
                        <p class="title text-xs">Available Homes</p>
                        <h2 class="mt-2 mb-0 text-xl font-semibold text-[#552032] md:text-3xl">
                            Browse premium homes for sale
                        </h2>
                    </div>

                    <p class="m-0 text-sm uppercase text-gray-500">
                        {{ properties.length }} listings
                    </p>
                </div>

                <div class="layout-columns mt-8 gap-y-8">
                    <div v-for="property in properties" :key="property.id" class="col-4">
                        <PropertyCard :property="property" />
                    </div>
                </div>
            </div>
        </section>
    </template>

    <section v-else class="section bg-white">
        <div class="container">
            <p class="title text-xs">Available Homes</p>
            <h1 class="mt-3 mb-0 text-xl font-semibold text-[#552032] md:text-2xl">
                Homes for Sale in Yangon
            </h1>
        </div>
    </section>
</template>

<style scoped>
.sale-hero-fade-enter-active,
.sale-hero-fade-leave-active {
    transition: opacity 700ms ease, transform 700ms ease;
}

.sale-hero-fade-enter-from,
.sale-hero-fade-leave-to {
    opacity: 0;
    transform: scale(1.02);
}

</style>
