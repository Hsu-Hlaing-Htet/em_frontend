<script setup>

import Carousel from 'primevue/carousel';

import ProgressSpinner from 'primevue/progressspinner';

import PropertyCard from '@/modules/public/components/PropertyCard.vue';

import { useRentListing } from './useRentListing';

const {

    rentProperties,
    loading,
    onCompare,
    responsiveOptions,

} = useRentListing();

</script>

<template>

<section class="reveal is-visible">

    <div class="container">

        <!-- HEADING -->

        <div class="section-heading-row">

            <h2>
                Featured Rental Properties
            </h2>

            <router-link
                to="/rent-properties"
                class="inline-block py-2 px-6 
                                bg-white text-[#552032] 
                                hover:-translate-y-1
                                focus:text-[#552032] 
                                transition-all duration-300"
            >

                View All Listings

                <i class="pi pi-arrow-right" />

            </router-link>

        </div>

        <!-- CAROUSEL -->

        <Carousel
            :value="rentProperties"
            :numVisible="3"
            :numScroll="1"
            :responsiveOptions="responsiveOptions"
            circular
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

        <!-- LOADING -->

        <div
            v-if="loading"
            class="loading-overlay"
        >

            <ProgressSpinner />

        </div>

    </div>

</section>

</template>
