<script setup>

import PropertyCard from '@/modules/public/components/PropertyCard.vue';

import Carousel from 'primevue/carousel';

import { useSaleListing } from './useSaleListing';
import router from '../../../../routes';    

const {
    saleProperties,
    routerLink, 
    loading,
    onCompare,
    responsiveOptions,
} = useSaleListing();
</script>

<template>

<section class="reveal is-visible">

    <div class="container">

        <div class="section-heading-row">

    <h2>
        Featured Sale Properties
    </h2>

      <router-link
                to="/sale-properties"
                class="view-all-link"
            >

                View All Listings

                <i class="pi pi-arrow-right" />

            </router-link>

</div>

        <Carousel
            :value="saleProperties"
            :numVisible="3"
            :numScroll="1"
            :responsiveOptions="responsiveOptions"
            circular
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
