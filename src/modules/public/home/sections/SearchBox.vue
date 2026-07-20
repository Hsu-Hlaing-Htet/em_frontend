<script setup>
import { computed } from 'vue';
import PropertyCard from '@/components/public/PropertyCard.vue';
import PropertyCardSkeleton from '@/components/public/PropertyCardSkeleton.vue';
import ProgressSpinner from 'primevue/progressspinner';
import { useSearchBox } from '@/composables/public/useSearchBox';

const {
    search,
    allResults,
    properties,
    loading,
    hasMoreResults,
    offerTypeOptions,
    propertyTypeOptions,
    priceRangeOptions,
    bedroomOptions,
    searchProperties,
    loadMoreProperties,
    clearSearch,
    onCompare,
} = useSearchBox();

const activeFilters = computed(() => {
    const filters = [];

    if (search.offer_type) {
        filters.push({ key: 'offer_type', label: search.offer_type === 'sale' ? 'For Sale' : 'For Rent' });
    }

    if (search.property_type) {
        filters.push({ key: 'property_type', label: search.property_type });
    }

    if (search.township) {
        filters.push({ key: 'township', label: search.township });
    }

    if (search.price_range) {
        filters.push({ key: 'price_range', label: 'Price filtered' });
    }

    if (search.bedrooms) {
        filters.push({ key: 'bedrooms', label: `${search.bedrooms}+ beds` });
    }

    if (search.property_id) {
        filters.push({ key: 'property_id', label: search.property_id });
    }

    return filters;
});
</script>

<template>
    <section class="search-box reveal">
        <div class="container">
            <div class="search-card">
                <div class="layout-columns">
                    <div class="col-2 md:col-4 lg:col-2">
                        <label>Offer Type</label>
                        <Dropdown
                            v-model="search.offer_type"
                            :options="offerTypeOptions"
                            option-label="label"
                            option-value="value"
                            style="width: 100%"
                        />
                    </div>

                    <div class="col-2 md:col-4 lg:col-2">
                        <label>Property Type</label>
                        <Dropdown
                            v-model="search.property_type"
                            :options="propertyTypeOptions"
                            option-label="label"
                            option-value="value"
                            style="width: 100%"
                        />
                    </div>

                    <div class="col-2 md:col-4 lg:col-2">
                        <label>Township</label>
                        <InputText
                            v-model="search.township"
                            style="width: 100%"
                        />
                    </div>

                    <div class="col-2 md:col-4 lg:col-2">
                        <label>Price Range</label>
                        <Dropdown
                            v-model="search.price_range"
                            :options="priceRangeOptions"
                            option-label="label"
                            option-value="value"
                            style="width: 100%"
                        />
                    </div>

                    <div class="col-2 md:col-4 lg:col-2">
                        <label>Bedrooms</label>
                        <Dropdown
                            v-model="search.bedrooms"
                            :options="bedroomOptions"
                            option-label="label"
                            option-value="value"
                            style="width: 100%"
                        />
                    </div>

                    <div class="col-2 md:col-4 lg:col-2">
                        <label>Property ID</label>
                        <InputText
                            v-model="search.property_id"
                            placeholder="RR-S-0001"
                            style="width: 100%"
                        />
                    </div>
                </div>

                <div
                    v-if="activeFilters.length"
                    class="mt-3 flex flex-wrap gap-2"
                >
                    <span
                        v-for="filter in activeFilters"
                        :key="filter.key"
                        class="search-filter-chip"
                    >
                        {{ filter.label }}
                    </span>
                </div>

                <div class="search-actions">
                    <button
                        class="inline-block py-2 px-6 rounded-l-xl rounded-t-xl bg-[var(--rw-primary-deep)]
                                hover:bg-rw-surface hover:text-[var(--rw-primary-deep)] hover:border hover:border-[var(--rw-primary-deep)]
                                hover:shadow-lg hover:-translate-y-1
                                focus:text-[var(--rw-primary-deep)] focus:bg-[var(--rw-surface)]
                                text-white
                                transition-all duration-300 active:scale-95"
                        @click="searchProperties"
                    >
                        Search
                    </button>

                    <button
                        class="inline-block py-2 px-6 rounded-l-xl rounded-t-xl hover:bg-[var(--rw-primary-deep)]
                                bg-rw-surface text-[var(--rw-primary-deep)] border border-[var(--rw-primary-deep)]
                                hover:shadow-lg hover:-translate-y-1
                                focus:text-[var(--rw-primary-deep)] focus:bg-[var(--rw-surface)]
                                hover:text-white
                                transition-all duration-300 active:scale-95"
                        @click="clearSearch"
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>

        <div class="container py-5">
            <div class="section-heading-row py-4">
                <p>{{ allResults.length }} FOUND</p>
            </div>

            <div
                v-if="loading"
                class="layout-columns"
            >
                <div
                    v-for="row in 3"
                    :key="`search-skeleton-${row}`"
                    class="col-4"
                >
                  
                </div>
            </div>

            <div
                v-else
                class="layout-columns"
            >
                <TransitionGroup name="search-result">
                    <div
                        v-for="(property, index) in properties"
                        :key="property.id"
                        class="col-4 search-result-item"
                        :style="{ animationDelay: `${index * 0.06}s` }"
                    >
                        <PropertyCard
                            :property="property"
                            @compare="onCompare"
                        />
                    </div>
                </TransitionGroup>
            </div>

            <div
                v-if="!properties.length && !loading"
                class="empty-results"
            >
                <h3>No Properties Found</h3>
                <p>Try changing your search filters.</p>
            </div>

            <div
                v-if="hasMoreResults"
                class="flex justify-end mt-8 mb-3"
            >
                <button
                    class="inline-block py-2 px-6
                                bg-rw-surface text-[var(--rw-primary-deep)]
                                hover:-translate-y-1
                                focus:text-[var(--rw-primary-deep)]
                                transition-all duration-300 active:scale-95"
                    @click="loadMoreProperties"
                >
                    View More
                </button>
            </div>
        </div>
    </section>
</template>

<style scoped>
.search-result-enter-active,
.search-result-leave-active {
    transition: opacity 0.35s ease, transform 0.35s ease;
}

.search-result-enter-from,
.search-result-leave-to {
    opacity: 0;
    transform: translateY(12px);
}
</style>
