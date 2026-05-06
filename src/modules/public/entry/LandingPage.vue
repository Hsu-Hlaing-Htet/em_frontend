<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { getFeaturedProperties, getPropertyStats, getPublicProperties } from '@/modules/public/service';
import PropertyCard from '@/modules/public/components/PropertyCard.vue';

const router = useRouter();
const toast = useToast();
const loading = ref(false);

const featured = reactive({
    sale: [],
    rent: [],
    houses: [],
    condos: [],
});

const stats = reactive({
    total_properties: 0,
    total_clients: 0,
    years_of_service: 0,
    available: 0,
    occupied: 0,
});

const latestListings = ref([]);

const search = reactive({
    offer_type: null,
    property_type: null,
    township: '',
    price_range: null,
    bedrooms: null,
    property_id: '',
});

const offerTypeOptions = [
    { label: 'Any', value: null },
    { label: 'For Sale', value: 'sale' },
    { label: 'For Rent', value: 'rent' },
];

const propertyTypeOptions = [
    { label: 'Any', value: null },
    { label: 'Apartment', value: 'apartment' },
    { label: 'Condo', value: 'condo' },
    { label: 'House', value: 'house' },
];

const priceRangeOptions = [
    { label: 'Any', value: null },
    { label: 'Under $1,000', value: { min: null, max: 1000 } },
    { label: '$1,000 - $2,000', value: { min: 1000, max: 2000 } },
    { label: '$2,000 - $5,000', value: { min: 2000, max: 5000 } },
    { label: '$5,000+', value: { min: 5000, max: null } },
];

const bedroomOptions = [
    { label: 'Any', value: null },
    { label: '1+', value: 1 },
    { label: '2+', value: 2 },
    { label: '3+', value: 3 },
    { label: '4+', value: 4 },
];

const serviceTiles = [
    {
        title: 'Rent Service',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    },
    {
        title: 'Sales Service',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa',
    },
    {
        title: 'Visa Service',
        image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85',
    },
    {
        title: 'Property Management',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    },
    {
        title: 'Concierge Services',
        image: 'https://images.unsplash.com/photo-1521783593447-5702b9bfd267',
    },
];

const propertyTypes = [
    { title: 'Condo', image: 'https://images.unsplash.com/photo-1494526585095-c41746248156' },
    { title: 'House', image: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be' },
    { title: 'Commercial', image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174' },
    { title: 'Penthouse', image: 'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd' },
    { title: 'Apartment', image: 'https://images.unsplash.com/photo-1484154218962-a197022b5858' },
    { title: 'Serviced Apartment', image: 'https://images.unsplash.com/photo-1460317442991-0ec209397118' },
];

const latestCommercialSpace = computed(() => [
    {
        title: 'Downtown Office Suite',
        price: '$4,500 / month',
        location: 'Central Business District',
        image: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72',
    },
    {
        title: 'Retail Corner Unit',
        price: '$3,200 / month',
        location: 'Riverside Avenue',
        image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8',
    },
    {
        title: 'Showroom Space',
        price: '$5,100 / month',
        location: 'Golden Valley Road',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab',
    },
]);

const latestHouses = computed(() => {
    if (featured.houses.length) {
        return featured.houses.slice(0, 3).map((property) => ({
            title: property.property_name,
            price: property.sale_price ? `$${Number(property.sale_price).toLocaleString()}` : '$--',
            location: property.township,
            image: property.featured_image,
        }));
    }

    return [
        {
            title: 'Garden Villa Residence',
            price: '$230,000',
            location: 'Hlaing Township',
            image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
        },
        {
            title: 'Lakeview Family House',
            price: '$180,000',
            location: 'Bahan Township',
            image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
        },
        {
            title: 'City Edge House',
            price: '$210,000',
            location: 'Sanchaung Township',
            image: 'https://images.unsplash.com/photo-1576941089067-2de3c901e126',
        },
    ];
});

const latestPenthouses = computed(() => [
    {
        title: 'Skyline Penthouse One',
        price: '$6,800 / month',
        location: 'Yankin',
        image: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511',
    },
    {
        title: 'Prestige Rooftop Suite',
        price: '$7,250 / month',
        location: 'Bahan',
        image: 'https://images.unsplash.com/photo-1616594039964-3aa6bdbf2483',
    },
    {
        title: 'Royal City Penthouse',
        price: '$8,100 / month',
        location: 'Kamayut',
        image: 'https://images.unsplash.com/photo-1613545325278-f24b0cae1224',
    },
]);

let revealObserver = null;

function setupRevealObserver() {
    revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        },
        { threshold: 0.12 }
    );

    document.querySelectorAll('.rr-reveal').forEach((element) => {
        revealObserver.observe(element);
    });
}

function destroyRevealObserver() {
    if (revealObserver) {
        revealObserver.disconnect();
        revealObserver = null;
    }
}

async function load() {
    loading.value = true;

    try {
        const [featuredRes, statsRes, latestRes] = await Promise.all([
            getFeaturedProperties(),
            getPropertyStats(),
            getPublicProperties({ page: 1 }),
        ]);

        Object.assign(featured, featuredRes.data);
        Object.assign(stats, statsRes.data);
        latestListings.value = latestRes.data.data || [];
    } catch (error) {
        toast.add({
            severity: 'warn',
            summary: 'Data Load Issue',
            detail: error.response?.data?.message || 'Unable to load homepage data.',
            life: 3000,
        });
    } finally {
        loading.value = false;
    }
}

function searchProperties() {
    const min = search.price_range?.min ?? undefined;
    const max = search.price_range?.max ?? undefined;

    router.push({
        path: '/properties',
        query: {
            purpose: search.offer_type || undefined,
            property_type: search.property_type || undefined,
            township: search.township || undefined,
            budget_min: min,
            budget_max: max,
            bedrooms: search.bedrooms || undefined,
            property_id: search.property_id || undefined,
            q: search.property_id || undefined,
        },
    });
}

function clearSearch() {
    search.offer_type = null;
    search.property_type = null;
    search.township = '';
    search.price_range = null;
    search.bedrooms = null;
    search.property_id = '';
}

function onCompare(property) {
    toast.add({
        severity: 'info',
        summary: 'Compare',
        detail: `${property.property_name} added to compare list (demo).`,
        life: 2000,
    });
}

onMounted(async () => {
    await load();
    await nextTick();
    setupRevealObserver();
});

onBeforeUnmount(() => {
    destroyRevealObserver();
});
</script>

<template>
    <section class="rr-hero">
        <div class="rr-hero-overlay">
            <div class="rr-container rr-hero-content">
                <p class="rr-hero-kicker">Luxury Real Estate · Rosewood Royale</p>
                <h1>Find Your Next Home, Office, or Investment Space.</h1>
                <p>
                    Elegant residential and commercial listings with trusted support across buying,
                    renting, and estate management.
                </p>
                <div class="rr-hero-actions">
                    <PvButton label="Browse Properties" class="rr-btn rr-btn-primary" @click="router.push('/properties')" />
                    <PvButton label="Book Viewing" class="rr-btn rr-btn-secondary" @click="router.push('/booking')" />
                </div>
            </div>
        </div>
    </section>

    <section class="rr-search-floating rr-reveal is-visible">
        <div class="rr-container">
            <div class="rr-search-card">
                <div class="rr-layout-columns" style="align-items: end">
                    <div class="rr-col-2">
                        <label>Offer Type</label>
                        <PvDropdown v-model="search.offer_type" :options="offerTypeOptions" option-label="label" option-value="value" style="width: 100%" />
                    </div>
                    <div class="rr-col-2">
                        <label>Property Type</label>
                        <PvDropdown v-model="search.property_type" :options="propertyTypeOptions" option-label="label" option-value="value" style="width: 100%" />
                    </div>
                    <div class="rr-col-2">
                        <label>Township</label>
                        <PvInputText v-model="search.township" style="width: 100%" />
                    </div>
                    <div class="rr-col-2">
                        <label>Price Range</label>
                        <PvDropdown v-model="search.price_range" :options="priceRangeOptions" option-label="label" option-value="value" style="width: 100%" />
                    </div>
                    <div class="rr-col-2">
                        <label>Bedrooms</label>
                        <PvDropdown v-model="search.bedrooms" :options="bedroomOptions" option-label="label" option-value="value" style="width: 100%" />
                    </div>
                    <div class="rr-col-2">
                        <label>Property ID</label>
                        <PvInputText v-model="search.property_id" placeholder="RR-S-0001" style="width: 100%" />
                    </div>
                </div>

                <div class="rr-search-actions">
                    <PvButton label="Search" class="rr-btn rr-btn-primary" @click="searchProperties" />
                    <PvButton label="Clear" class="rr-btn rr-btn-secondary" @click="clearSearch" />
                </div>
            </div>
        </div>
    </section>

    <section class="rr-section rr-reveal">
        <div class="rr-container rr-layout-columns">
            <div class="rr-col-3 rr-stat-card">
                <p>Total Properties</p>
                <h3>{{ stats.total_properties }}</h3>
            </div>
            <div class="rr-col-3 rr-stat-card">
                <p>Total Clients</p>
                <h3>{{ stats.total_clients }}</h3>
            </div>
            <div class="rr-col-3 rr-stat-card">
                <p>Available Listings</p>
                <h3>{{ stats.available }}</h3>
            </div>
            <div class="rr-col-3 rr-stat-card">
                <p>Years of Service</p>
                <h3>{{ stats.years_of_service }}</h3>
            </div>
        </div>
    </section>

    <section class="rr-section rr-reveal">
        <div class="rr-container">
            <div class="rr-section-heading-row">
                <h2>Featured Properties</h2>
                <router-link to="/properties">View all listings</router-link>
            </div>

            <h3 class="rr-subheading">For Sale</h3>
            <div class="rr-layout-columns" style="margin-top: 1rem">
                <div v-for="property in featured.sale.slice(0, 3)" :key="`sale-${property.id}`" class="rr-col-4">
                    <PropertyCard :property="property" @compare="onCompare" />
                </div>
            </div>

            <h3 class="rr-subheading" style="margin-top: 2.2rem">For Rent</h3>
            <div class="rr-layout-columns" style="margin-top: 1rem">
                <div v-for="property in featured.rent.slice(0, 3)" :key="`rent-${property.id}`" class="rr-col-4">
                    <PropertyCard :property="property" @compare="onCompare" />
                </div>
            </div>
        </div>
    </section>

    <section id="services" class="rr-section rr-reveal">
        <div class="rr-container">
            <h2>Property Services</h2>
            <div class="rr-layout-columns" style="margin-top: 1rem">
                <article v-for="service in serviceTiles" :key="service.title" class="rr-col-4 rr-service-tile">
                    <img :src="service.image" :alt="service.title">
                    <div class="rr-service-overlay">
                        <h3>{{ service.title }}</h3>
                    </div>
                </article>
            </div>
        </div>
    </section>

    <section class="rr-section rr-reveal">
        <div class="rr-container">
            <h2>Property Types</h2>
            <div class="rr-layout-columns" style="margin-top: 1rem">
                <article v-for="item in propertyTypes" :key="item.title" class="rr-col-4 rr-type-card">
                    <img :src="item.image" :alt="item.title">
                    <div class="rr-type-overlay">
                        <h3>{{ item.title }}</h3>
                    </div>
                </article>
            </div>
        </div>
    </section>

    <section id="commercial-space" class="rr-section rr-reveal">
        <div class="rr-container">
            <h2>Latest Commercial Space</h2>
            <div class="rr-layout-columns" style="margin-top: 1rem">
                <article v-for="item in latestCommercialSpace" :key="item.title" class="rr-col-4 rr-mini-listing-card">
                    <img :src="item.image" :alt="item.title">
                    <div class="rr-mini-listing-content">
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.location }}</p>
                        <strong>{{ item.price }}</strong>
                    </div>
                </article>
            </div>

            <h2 style="margin-top: 2.5rem">Latest Houses</h2>
            <div class="rr-layout-columns" style="margin-top: 1rem">
                <article v-for="item in latestHouses" :key="item.title" class="rr-col-4 rr-mini-listing-card">
                    <img :src="item.image" :alt="item.title">
                    <div class="rr-mini-listing-content">
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.location }}</p>
                        <strong>{{ item.price }}</strong>
                    </div>
                </article>
            </div>

            <h2 style="margin-top: 2.5rem">Latest Penthouses</h2>
            <div class="rr-layout-columns" style="margin-top: 1rem">
                <article v-for="item in latestPenthouses" :key="item.title" class="rr-col-4 rr-mini-listing-card">
                    <img :src="item.image" :alt="item.title">
                    <div class="rr-mini-listing-content">
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.location }}</p>
                        <strong>{{ item.price }}</strong>
                    </div>
                </article>
            </div>
        </div>
    </section>

    <div v-if="loading" class="rr-loading-overlay">
        <PvProgressSpinner />
    </div>
</template>
