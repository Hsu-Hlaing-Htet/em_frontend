<script setup>
import PropertyCard from '@/modules/public/components/PropertyCard.vue';
import { useLanding } from '@/modules/public/composables/useLanding';

const {
    router,
    loading,
    featured,
    stats,
    search,

    offerTypeOptions,
    propertyTypeOptions,
    priceRangeOptions,
    bedroomOptions,

    serviceTiles,
    propertyTypes,

    latestCommercialSpace,
    latestHouses,
    latestPenthouses,

    searchProperties,
    clearSearch,
    onCompare,
} = useLanding();
</script>

<template>
    <section class="banner">
        <div class="banner-overlay">
            <div class="container banner-content">
                <p class="banner-kicker">Luxury Real Estate · Rosewood Royale</p>
                <h1>Find Your Next Home, Office, or Investment Space.</h1>
                <p>
                    Elegant residential and commercial listings with trusted support across buying,
                    renting, and estate management.
                </p>
                <div class="banner-actions">
                    <Button label="Browse Properties" @click="router.push('/properties')" />
                    <Button label="Book Viewing" @click="router.push('/booking')" />
                </div>
            </div>
        </div>
    </section>

    <section class="search-box reveal is-visible">
        <div class="container">
            <div class="search-card">
                <div class="layout-columns">
                    <div class="col-2 md:col-4 lg:col-2">
                        <label>Offer Type</label>
                        <Dropdown v-model="search.offer_type" :options="offerTypeOptions" option-label="label" option-value="value" style="width: 100%" />
                    </div>
                    <div class="col-2 md:col-4 lg:col-2">
                        <label>Property Type</label>
                        <Dropdown v-model="search.property_type" :options="propertyTypeOptions" option-label="label" option-value="value" style="width: 100%" />
                    </div>
                    <div class="col-2 md:col-4 lg:col-2">
                        <label>Township</label>
                        <InputText v-model="search.township" style="width: 100%" />
                    </div>
                    <div class="col-2 md:col-4 lg:col-2">
                        <label>Price Range</label>
                        <Dropdown v-model="search.price_range" :options="priceRangeOptions" option-label="label" option-value="value" style="width: 100%" />
                    </div>
                    <div class="col-2 md:col-4 lg:col-2">
                        <label>Bedrooms</label>
                        <Dropdown v-model="search.bedrooms" :options="bedroomOptions" option-label="label" option-value="value" style="width: 100%" />
                    </div>
                    <div class="col-2 md:col-4 lg:col-2">
                        <label>Property ID</label>
                        <InputText v-model="search.property_id" placeholder="RR-S-0001" style="width: 100%" />
                    </div>
                </div>

                <div class="search-actions">
                    <Button label="Search" class="" @click="searchProperties" />
                    <Button label="Clear" class="btn btn-secondary" @click="clearSearch" />
                </div>
            </div>
        </div>
    </section>

    <section class="section reveal">
        <div class="container layout-columns">
            <div class="col-3 stat-card">
                <p>Total Properties</p>
                <h3>{{ stats.total_properties }}</h3>
            </div>
            <div class="col-3 stat-card">
                <p>Total Clients</p>
                <h3>{{ stats.total_clients }}</h3>
            </div>
            <div class="col-3 stat-card">
                <p>Available Listings</p>
                <h3>{{ stats.available }}</h3>
            </div>
            <div class="col-3 stat-card">
                <p>Years of Service</p>
                <h3>{{ stats.years_of_service }}</h3>
            </div>
        </div>
    </section>

    <section class="section reveal">
        <div class="container">
            <div class="section-heading-row">
                <h2>Featured Properties</h2>
                <router-link to="/properties">View all listings</router-link>
            </div>

            <h3 class="subheading">For Sale</h3>
            <div class="layout-columns" style="margin-top: 1rem">
                <div v-for="property in featured.sale.slice(0, 3)" :key="`sale-${property.id}`" class="col-4">
                    <PropertyCard :property="property" @compare="onCompare" />
                </div>
            </div>

            <h3 class="subheading" style="margin-top: 2.2rem">For Rent</h3>
            <div class="layout-columns" style="margin-top: 1rem">
                <div v-for="property in featured.rent.slice(0, 3)" :key="`rent-${property.id}`" class="col-4">
                    <PropertyCard :property="property" @compare="onCompare" />
                </div>
            </div>
        </div>
    </section>

    <section id="services" class="section reveal">
        <div class="container">
            <h2>Property Services</h2>
            <div class="layout-columns" style="margin-top: 1rem">
                <article v-for="service in serviceTiles" :key="service.title" class="col-4 service-tile">
                    <img :src="service.image" :alt="service.title">
                    <div class="service-overlay">
                        <h3>{{ service.title }}</h3>
                    </div>
                </article>
            </div>
        </div>
    </section>

    <section class="section reveal">
        <div class="container">
            <h2>Property Types</h2>
            <div class="layout-columns" style="margin-top: 1rem">
                <article v-for="item in propertyTypes" :key="item.title" class="col-4 type-card">
                    <img :src="item.image" :alt="item.title">
                    <div class="type-overlay">
                        <h3>{{ item.title }}</h3>
                    </div>
                </article>
            </div>
        </div>
    </section>

    <section id="commercial-space" class="section reveal">
        <div class="container">
            <h2>Latest Commercial Space</h2>
            <div class="layout-columns" style="margin-top: 1rem">
                <article v-for="item in latestCommercialSpace" :key="item.title" class="col-4 mini-listing-card">
                    <img :src="item.image" :alt="item.title">
                    <div class="mini-listing-content">
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.location }}</p>
                        <strong>{{ item.price }}</strong>
                    </div>
                </article>
            </div>

            <h2 style="margin-top: 2.5rem">Latest Houses</h2>
            <div class="layout-columns" style="margin-top: 1rem">
                <article v-for="item in latestHouses" :key="item.title" class="col-4 mini-listing-card">
                    <img :src="item.image" :alt="item.title">
                    <div class="mini-listing-content">
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.location }}</p>
                        <strong>{{ item.price }}</strong>
                    </div>
                </article>
            </div>

            <h2 style="margin-top: 2.5rem">Latest Penthouses</h2>
            <div class="layout-columns" style="margin-top: 1rem">
                <article v-for="item in latestPenthouses" :key="item.title" class="col-4 mini-listing-card">
                    <img :src="item.image" :alt="item.title">
                    <div class="mini-listing-content">
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.location }}</p>
                        <strong>{{ item.price }}</strong>
                    </div>
                </article>
            </div>
        </div>
    </section>

    <div v-if="loading" class="loading-overlay">
        <PvProgressSpinner />
    </div>
</template>
