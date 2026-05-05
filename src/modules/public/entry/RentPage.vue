<script setup>
import { onMounted, ref } from 'vue';
import { getPublicProperties } from '@/modules/public/publicService';
import PropertyCard from '@/modules/public/components/PropertyCard.vue';

const properties = ref([]);

onMounted(async () => {
    const { data } = await getPublicProperties({ purpose: 'rent' });
    properties.value = data.data;
});
</script>

<template>
    <section class="rr-section">
        <div class="rr-container">
            <p class="rr-title" style="font-size: 0.75rem">Rent Properties</p>
            <h1>Available Rentals</h1>
            <div class="rr-layout-columns" style="margin-top: 1rem">
                <div v-for="property in properties" :key="property.id" class="rr-col-4">
                    <PropertyCard :property="property" />
                </div>
            </div>
        </div>
    </section>
</template>
