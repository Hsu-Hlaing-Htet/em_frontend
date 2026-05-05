<script setup>
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { getPublicProperty } from '@/modules/public/publicService';

const route = useRoute();
const property = ref(null);
const loading = ref(false);

async function load() {
    loading.value = true;

    try {
        const { data } = await getPublicProperty(route.params.id);
        property.value = data;
    } finally {
        loading.value = false;
    }
}

onMounted(load);
</script>

<template>
    <section class="rr-section">
        <div class="rr-container" v-if="property">
            <div class="rr-layout-columns">
                <div class="rr-col-8 rr-card" style="overflow: hidden">
                    <img :src="property.featured_image" :alt="property.property_name" style="width: 100%; height: 430px; object-fit: cover">
                </div>
                <div class="rr-col-4 rr-card" style="padding: 1rem">
                    <p class="rr-title" style="font-size: 0.72rem">{{ property.property_code }}</p>
                    <h1 style="margin: 0.2rem 0">{{ property.property_name }}</h1>
                    <p class="rr-muted">{{ property.township }} · {{ property.property_type }} · {{ property.purpose }}</p>
                    <hr class="rr-divider">
                    <p><strong>Status:</strong> {{ property.status }}</p>
                    <p><strong>Bedrooms:</strong> {{ property.bedrooms ?? '-' }}</p>
                    <p><strong>Bathrooms:</strong> {{ property.bathrooms ?? '-' }}</p>
                    <p><strong>Area:</strong> {{ property.area_sqft ?? '-' }} sqft</p>
                    <p><strong>Sale Price:</strong> {{ property.sale_price ?? '-' }}</p>
                    <p><strong>Monthly Rent:</strong> {{ property.monthly_rent ?? '-' }}</p>
                    <p><strong>Maintenance Fee:</strong> {{ property.maintenance_fee ?? '-' }}</p>
                    <router-link to="/booking">
                        <PvButton label="Request Viewing / Booking" style="width: 100%; margin-top: 0.8rem" />
                    </router-link>
                </div>
            </div>

            <div class="rr-card" style="padding: 1rem; margin-top: 1rem">
                <h2 class="rr-title" style="font-size: 0.75rem">Description</h2>
                <p class="rr-muted">{{ property.description || 'No description provided.' }}</p>
                <p class="rr-muted"><strong>Address:</strong> {{ property.address }}</p>
            </div>
        </div>

        <div v-if="loading" style="display: grid; place-items: center"><PvProgressSpinner /></div>
    </section>
</template>
