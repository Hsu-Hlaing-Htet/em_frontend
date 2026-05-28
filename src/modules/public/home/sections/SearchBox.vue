<script setup>
import PropertyCard from '@/modules/public/components/PropertyCard.vue';
import ProgressSpinner from 'primevue/progressspinner';
import { useSearchBox } from './useSearchBox';

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
</script>

<template>

    <!-- SEARCH BOX -->

    <section class="search-box reveal is-visible">

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

                <div class="search-actions">
                    <button
                        label="Search"
                         class="inline-block py-2 px-6 rounded-l-xl rounded-t-xl bg-[#552032]
                                hover:bg-white hover:text-[#552032] hover:border hover:border-[#552032]
                                hover:shadow-lg hover:-translate-y-1
                                focus:text-[#552032] focus:bg-gray-200
                                text-gray-50
                                transition-all duration-300"
                        @click="searchProperties"
                    >Search</button>
                    

                      <button
                        label="Search"
                         class="inline-block py-2 px-6 rounded-l-xl rounded-t-xl hover:bg-[#552032]
                                bg-white text-[#552032] border border-[#552032]
                                hover:shadow-lg hover:-translate-y-1
                                focus:text-[#552032] focus:bg-gray-200
                                hover:text-gray-50
                                transition-all duration-300"
                        @click="clearSearch"
                    >Clear</button>


                </div>

            </div>

        </div>


    <!-- RESULT SECTION -->

        <div class="container py-5">

            <div class="section-heading-row py-4">

                     <p>
                        {{ allResults.length }} FOUND
                     </p>

            </div>

            <div class="layout-columns">

                <div
                    v-for="property in properties"
                    :key="property.id"
                    class="col-4"
                >

                    <PropertyCard
                        :property="property"
                        @compare="onCompare"
                    />

                </div>

            </div>

            <div
                v-if="!properties.length && !loading"
                class="empty-results"
            >

                <h3>No Properties Found</h3>

                <p>
                    Try changing your search filters.
                </p>

            </div>

            <div
                v-if="hasMoreResults"
                class="
                    flex
                    justify-end
                    mt-8
                    mb-3
                "
            >
                <button 
                    class="inline-block py-2 px-6 
                                bg-white text-[#552032] 
                                hover:-translate-y-1
                                focus:text-[#552032] 
                                transition-all duration-300"
                    @click="loadMoreProperties"
                >View More</button>

            </div>

            <div
                v-if="loading"
                class="loading-overlay"
            >

                <ProgressSpinner />

            </div>

        </div>

    </section>

</template>