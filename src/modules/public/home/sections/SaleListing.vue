<script setup>
import PropertyCard from '@/components/public/PropertyCard.vue';
import PropertyCardSkeleton from '@/components/public/PropertyCardSkeleton.vue';
import Carousel from 'primevue/carousel';
import { useSaleListing } from '@/composables/public/useSaleListing';

const {
    saleProperties,
    loading,
    onCompare,
    responsiveOptions,
} = useSaleListing();
</script>

<template>
    <section class="reveal">
        <div class="container">
            <div class="section-heading-row">
                <h2>Featured Sale Properties</h2>

                <router-link
                    to="/buy"
                    class="view-all-link"
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
                    :key="`sale-skeleton-${row}`"
                    class="col-4"
                >
                    <PropertyCardSkeleton />
                </div>
            </div>

            <Carousel
                v-else
                :value="saleProperties"
                :num-visible="3"
                :num-scroll="1"
                :responsive-options="responsiveOptions"
                :autoplay-interval="4500"
                circular
                class="featured-carousel"
            >
                <template #item="{ data }">
                    <div class="px-3 py-4">
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
