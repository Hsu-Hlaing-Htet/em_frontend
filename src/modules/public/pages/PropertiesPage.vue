<script setup>
import { onMounted, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { getPublicProperties } from '@/modules/public/service';
import PropertyCard from '@/modules/public/components/PropertyCard.vue';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const items = ref([]);
const total = ref(0);
const page = ref(Number(route.query.page || 1));

const filters = reactive({
    q: route.query.q || '',
    purpose: route.query.purpose || null,
    property_type: route.query.property_type || null,
    township: route.query.township || '',
    property_id: route.query.property_id || '',
    bedrooms: route.query.bedrooms ? Number(route.query.bedrooms) : null,
    budget_min: route.query.budget_min ? Number(route.query.budget_min) : null,
    budget_max: route.query.budget_max ? Number(route.query.budget_max) : null,
});

const purposeOptions = [
    { label: 'All', value: null },
    { label: 'Sale', value: 'sale' },
    { label: 'Rent', value: 'rent' },
];

const typeOptions = [
    { label: 'All', value: null },
    { label: 'Apartment', value: 'apartment' },
    { label: 'Condo', value: 'condo' },
    { label: 'House', value: 'house' },
];

const bedroomOptions = [
    { label: 'Any', value: null },
    { label: '1+', value: 1 },
    { label: '2+', value: 2 },
    { label: '3+', value: 3 },
    { label: '4+', value: 4 },
];

async function load() {
    loading.value = true;

    try {
        const { data } = await getPublicProperties({
            ...filters,
            page: page.value,
        });

        items.value = data.data;
        total.value = data.total;
    } finally {
        loading.value = false;
    }
}

function applyFilters() {
    page.value = 1;
    router.replace({
        query: {
            ...filters,
            page: page.value,
        },
    });

    load();
}

watch(
    () => route.query.page,
    (next) => {
        const nextPage = Number(next || 1);
        if (nextPage !== page.value) {
            page.value = nextPage;
            load();
        }
    }
);

onMounted(load);
</script>

<template>
    <section class="section">
        <div class="container">
            <p class="title" style="font-size: 0.75rem">Property Listings</p>
            <h1 style="margin-top: 0.2rem">Browse Residential Properties</h1>

            <div class="card" style="padding: 1rem; margin: 1rem 0 1.3rem">
                <div class="layout-columns">
                    <div class="col-2">
                        <label class="muted">Property ID</label>
                        <PvInputText v-model="filters.property_id" placeholder="RR-S-0001" style="width: 100%" />
                    </div>
                    <div class="col-2">
                        <label class="muted">Search</label>
                        <PvInputText v-model="filters.q" placeholder="Code, name, address" style="width: 100%" />
                    </div>
                    <div class="col-2">
                        <label class="muted">Purpose</label>
                        <PvDropdown v-model="filters.purpose" :options="purposeOptions" option-label="label" option-value="value" style="width: 100%" />
                    </div>
                    <div class="col-2">
                        <label class="muted">Type</label>
                        <PvDropdown v-model="filters.property_type" :options="typeOptions" option-label="label" option-value="value" style="width: 100%" />
                    </div>
                    <div class="col-2">
                        <label class="muted">Township</label>
                        <PvInputText v-model="filters.township" style="width: 100%" />
                    </div>
                    <div class="col-2">
                        <label class="muted">Bedrooms</label>
                        <PvDropdown v-model="filters.bedrooms" :options="bedroomOptions" option-label="label" option-value="value" style="width: 100%" />
                    </div>
                    <div class="col-1">
                        <label class="muted">Budget Min</label>
                        <PvInputNumber v-model="filters.budget_min" mode="currency" currency="USD" locale="en-US" style="width: 100%" />
                    </div>
                    <div class="col-1">
                        <label class="muted">Budget Max</label>
                        <PvInputNumber v-model="filters.budget_max" mode="currency" currency="USD" locale="en-US" style="width: 100%" />
                    </div>
                </div>
                <div style="margin-top: 0.8rem; display: flex; gap: 0.5rem">
                    <PvButton label="Apply" @click="applyFilters" />
                    <PvButton
                        label="Reset"
                        outlined
                        severity="secondary"
                        @click="Object.assign(filters, { property_id: '', q: '', purpose: null, property_type: null, township: '', bedrooms: null, budget_min: null, budget_max: null }); applyFilters()"
                    />
                </div>
            </div>

            <div class="layout-columns">
                <div v-for="property in items" :key="property.id" class="col-4">
                    <PropertyCard :property="property" />
                </div>
            </div>

            <div style="margin-top: 1rem; display: flex; justify-content: space-between; align-items: center">
                <p class="muted">Total {{ total }} properties</p>
                <div style="display: flex; gap: 0.5rem">
                    <PvButton :disabled="page <= 1" label="Prev" outlined severity="secondary" @click="router.replace({ query: { ...route.query, page: page - 1 } })" />
                    <PvButton label="Next" outlined severity="secondary" @click="router.replace({ query: { ...route.query, page: page + 1 } })" />
                </div>
            </div>
        </div>
    </section>
</template>
