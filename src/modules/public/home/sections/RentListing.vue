<script setup>
import Carousel from 'primevue/carousel';
import PropertyCard from '@/components/public/PropertyCard.vue';
import PropertyCardSkeleton from '@/components/public/PropertyCardSkeleton.vue';
import { useRentListing } from '@/composables/public/useRentListing';

const {
    rentProperties,
    loading,
    onCompare,
    responsiveOptions,
} = useRentListing();
</script>

<template>
    <section class="reveal">
        <div class="container">
            <div class="section-heading-row">
                <h2>Featured Rental Properties</h2>

                <router-link
                    to="/rent"
                    class="inline-block py-2 px-6
                                bg-rw-surface text-[var(--rw-primary-deep)]
                                hover:-translate-y-1
                                focus:text-[var(--rw-primary-deep)]
                                transition-all duration-300"
                >
                    View All Listings
                    <i class="pi pi-arrow-right" />
                </router-link>
            </div>

            <div
                v-if="loading"
                class="layout-columns"
            >
                <div
                    v-for="row in 3"
                    :key="`rent-skeleton-${row}`"
                    class="col-4"
                >
                    <PropertyCardSkeleton />
                </div>
            </div>

            <Carousel
                v-else
                :value="rentProperties"
                :num-visible="3"
                :num-scroll="1"
                :responsive-options="responsiveOptions"
                :autoplay-interval="4800"
                circular
                class="featured-carousel"
            >
                <template #item="{ data }">
                    <div class="px-3 py-10">
                        <PropertyCard
                            :property="data"
                            @compare="onCompare"
                        />
                    </div>
                </template>
            </Carousel>
        </div>
    </section>
</template>
