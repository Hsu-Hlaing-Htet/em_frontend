<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';
import PropertyCard from '@/components/public/PropertyCard.vue';
import PropertyCardSkeleton from '@/components/public/PropertyCardSkeleton.vue';
import PropertySearch from '@/components/public/PropertySearch.vue';
import ExploreLocations from './sections/ExploreLocations.vue';
import TestimonialsSection from './sections/TestimonialsSection.vue';
import {
    getFeaturedProperties,
    getPropertyStats,
    getPublicProperties,
} from '@/modules/public/service';
import { useAnimatedCounter } from '@/composables/public/useAnimatedCounter';
import { useAssistantChat } from '@/composables/shared/useAssistantChat';

const router = useRouter();
const { requestOpenAssistant } = useAssistantChat();

const loading = ref(true);
const saleProperties = ref([]);
const rentProperties = ref([]);
const inventory = ref([]);
const stats = ref({
    total: 0,
    available: 0,
    for_sale: 0,
});

const searchModel = ref({
    purpose: 'all',
    search: '',
    price_min: '',
    price_max: '',
});

const heroImage = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2000';

const LOCATION_DEFS = [
    {
        name: 'Bahan',
        image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200',
    },
    {
        name: 'Kamayut',
        image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200',
    },
    {
        name: 'Sanchaung',
        image: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200',
    },
    {
        name: 'Hlaing',
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200',
    },
];

const handpicked = computed(() => {
    const mixed = [...saleProperties.value.slice(0, 2), ...rentProperties.value.slice(0, 1)];
    return mixed.slice(0, 3);
});

const locations = computed(() =>
    LOCATION_DEFS.map((location) => {
        const count = inventory.value.filter((property) =>
            String(property.township || '')
                .toLowerCase()
                .includes(location.name.toLowerCase())
            || String(property.address || '')
                .toLowerCase()
                .includes(location.name.toLowerCase())
        ).length;

        return {
            ...location,
            count: inventory.value.length ? count : null,
        };
    })
);

const totalSource = computed(() => stats.value.total || (saleProperties.value.length + rentProperties.value.length));
const availableSource = computed(() => stats.value.available || rentProperties.value.length);
const forSaleSource = computed(() => stats.value.for_sale || saleProperties.value.length);

const totalCounter = useAnimatedCounter(totalSource, { suffix: '' });
const availableCounter = useAnimatedCounter(availableSource, { suffix: '' });
const forSaleCounter = useAnimatedCounter(forSaleSource, { suffix: '' });

const services = [
    {
        number: '01',
        title: 'Property Management',
        copy: 'Careful stewardship of residences with clarity, calm systems, and lasting standards.',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200',
    },
    {
        number: '02',
        title: 'Private Support',
        copy: 'Discreet concierge guidance for moves, handovers, and everyday elevated living.',
        image: 'https://images.unsplash.com/photo-1521783593447-5702b9bfd267?q=80&w=1200',
    },
    {
        number: '03',
        title: 'Relocation Support',
        copy: 'Thoughtful help settling into Yangon — from shortlists to final keys.',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200',
    },
];

function unwrapList(response) {
    const body = response?.data;
    return Array.isArray(body?.data) ? body.data : [];
}

function dedupeByPurposeId(list) {
    const seen = new Set();
    return list.filter((item) => {
        const key = `${item.purpose}-${item.id}`;
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

async function load() {
    loading.value = true;
    try {
        const [latestSaleRes, statsRes, rentRes, saleRes, rentWide, saleWide] = await Promise.all([
            getFeaturedProperties(),
            getPropertyStats(),
            getPublicProperties({ purpose: 'rent', per_page: 6 }),
            getPublicProperties({ purpose: 'sale', per_page: 6 }),
            getPublicProperties({ purpose: 'rent', per_page: 48 }),
            getPublicProperties({ purpose: 'sale', per_page: 48 }),
        ]);

        const latestSale = unwrapList(latestSaleRes);
        saleProperties.value = latestSale.length ? latestSale : unwrapList(saleRes);
        rentProperties.value = unwrapList(rentRes);
        inventory.value = dedupeByPurposeId([
            ...unwrapList(rentWide),
            ...unwrapList(saleWide),
        ]);

        const payload = statsRes?.data?.data ?? {};
        const saleTotal = Number(saleRes?.data?.meta?.total ?? saleWide?.data?.meta?.total ?? saleProperties.value.length);
        const rentTotal = Number(rentRes?.data?.meta?.total ?? rentWide?.data?.meta?.total ?? rentProperties.value.length);

        stats.value = {
            total: Number(payload.total ?? (saleTotal + rentTotal)),
            available: Number(payload.available ?? rentTotal),
            for_sale: saleTotal,
        };
    } catch {
        saleProperties.value = [];
        rentProperties.value = [];
        inventory.value = [];
    } finally {
        loading.value = false;
    }
}

function onSearch(filters) {
    const purpose = filters.purpose === 'all' ? undefined : filters.purpose;
    router.push({
        path: purpose === 'rent' ? '/rent' : purpose === 'sale' ? '/buy' : '/properties',
        query: {
            purpose,
            q: filters.search || undefined,
            price_min: filters.price_min || undefined,
            price_max: filters.price_max || undefined,
        },
    });
}

function watchStory() {
    document.getElementById('belong')?.scrollIntoView({ behavior: 'smooth' });
}

onMounted(async () => {
    await load();
    await nextTick();
    const cards = document.querySelectorAll('.landing-stat');
    cards.forEach((card, index) => {
        const counter = [totalCounter, availableCounter, forSaleCounter][index];
        counter?.observeElement?.(card);
    });
});
</script>

<template>
    <div>
        <section class="rw-page-hero rw-page-hero--tall">
            <div class="rw-page-hero__media" aria-hidden="true">
                <img :src="heroImage" alt="">
            </div>
            <div class="rw-page-hero__overlay" />
            <div class="container rw-page-hero__content rw-hero-copy">
                <p class="rw-kicker">Rosewood Royale</p>
                <h1>A Higher Way of Living</h1>
                <p class="rw-lede">
                    Cinematic residences, quiet confidence, and guidance that feels personal —
                    for people who choose homes as carefully as they choose everything else.
                </p>
                <div class="rw-cta-row">
                    <router-link to="/properties" class="rw-btn rw-btn-primary">
                        Explore Properties
                        <i class="fas fa-arrow-right" />
                    </router-link>
                    <button type="button" class="rw-btn rw-btn-ghost" @click="watchStory">
                        <i class="fas fa-play" />
                        Watch Our Story
                    </button>
                </div>
            </div>
        </section>

        <section class="rw-section rw-section--tight" style="margin-top: -2.5rem; position: relative; z-index: 3">
            <div class="container">
                <PropertySearch
                    :model-value="searchModel"
                    @search="onSearch"
                />
            </div>
        </section>

        <section class="rw-section rw-section--tight reveal">
            <div class="container">
                <div class="rw-category-pair">
                    <router-link to="/rent" class="rw-category-card">
                        <img
                            src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200"
                            alt="For Rent"
                        >
                        <div class="rw-category-card__overlay">
                            <span>Residences</span>
                            <strong>For Rent</strong>
                            <span class="rw-category-card__arrow">
                                Explore
                                <i class="fas fa-arrow-right" />
                            </span>
                        </div>
                    </router-link>
                    <router-link to="/buy" class="rw-category-card">
                        <img
                            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200"
                            alt="For Sale"
                        >
                        <div class="rw-category-card__overlay">
                            <span>Residences</span>
                            <strong>For Sale</strong>
                            <span class="rw-category-card__arrow">
                                Explore
                                <i class="fas fa-arrow-right" />
                            </span>
                        </div>
                    </router-link>
                </div>
            </div>
        </section>

        <section class="rw-section reveal">
            <div class="container">
                <div class="rw-section-head">
                    <div>
                        <p class="rw-kicker">Residences</p>
                        <h2>Selected from Live Inventory</h2>
                    </div>
                    <router-link to="/properties" class="rw-link-arrow">
                        View all <i class="fas fa-arrow-right" />
                    </router-link>
                </div>

                <div v-if="loading" class="rw-property-grid">
                    <PropertyCardSkeleton v-for="n in 3" :key="`hp-sk-${n}`" />
                </div>
                <div v-else class="rw-property-grid reveal-stagger">
                    <PropertyCard
                        v-for="property in handpicked"
                        :key="`hp-${property.purpose}-${property.id}`"
                        :property="property"
                    />
                </div>
            </div>
        </section>

        <ExploreLocations :locations="locations" />

        <section id="belong" class="rw-section rw-section--alt reveal">
            <div class="container rw-belong">
                <div>
                    <p class="rw-kicker">Brand</p>
                    <h2>A Place to Belong</h2>
                    <p class="rw-lede">
                        Rosewood Royale is more than inventory. It is a quieter standard for living —
                        spaces chosen with care, and relationships built with integrity.
                    </p>
                </div>
                <div class="rw-belong__image">
                    <img
                        src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1400"
                        alt="Rosewood interior"
                    >
                </div>
            </div>

            <div class="container" style="margin-top: 2.25rem">
                <div class="rw-stats-row">
                    <article class="landing-stat">
                        <h3>{{ totalCounter.formattedValue() }}</h3>
                        <p>Properties Listed</p>
                    </article>
                    <article class="landing-stat">
                        <h3>{{ availableCounter.formattedValue() }}</h3>
                        <p>Available Units</p>
                    </article>
                    <article class="landing-stat">
                        <h3>{{ forSaleCounter.formattedValue() }}</h3>
                        <p>For Sale</p>
                    </article>
                </div>
            </div>
        </section>

        <TestimonialsSection />

        <section class="rw-section reveal">
            <div class="container">
                <div class="rw-section-head">
                    <div>
                        <p class="rw-kicker">Services</p>
                        <h2>Beyond Real Estate</h2>
                    </div>
                    <router-link to="/services" class="rw-link-arrow">
                        All Services <i class="fas fa-arrow-right" />
                    </router-link>
                </div>

                <div class="rw-service-preview reveal-stagger">
                    <article
                        v-for="service in services"
                        :key="service.number"
                        class="rw-service-preview__card"
                    >
                        <p class="rw-service-preview__number">{{ service.number }}</p>
                        <h3>{{ service.title }}</h3>
                        <p>{{ service.copy }}</p>
                        <div class="rw-service-preview__media">
                            <img :src="service.image" :alt="service.title" loading="lazy">
                        </div>
                    </article>
                </div>
            </div>
        </section>

        <section class="rw-section rw-section--alt reveal">
            <div class="container rw-closing">
                <p class="rw-closing__eyebrow">Rosewood Royale</p>
                <h2>Let Us Help You Find What’s Next</h2>
                <p class="rw-lede">
                    Speak with our team, or ask the Rosewood AI Concierge — both use the same live property data.
                </p>
                <div class="rw-cta-row">
                    <router-link to="/contact" class="rw-btn rw-btn-primary">
                        Contact Us
                        <i class="fas fa-arrow-right" />
                    </router-link>
                    <button type="button" class="rw-btn rw-btn-ghost" aria-label="Ask Rosewood AI Concierge" @click="requestOpenAssistant">
                        ASK
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.rw-hero-copy > * {
    animation: rw-hero-copy 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.rw-hero-copy > *:nth-child(1) { animation-delay: 80ms; }
.rw-hero-copy > *:nth-child(2) { animation-delay: 160ms; }
.rw-hero-copy > *:nth-child(3) { animation-delay: 240ms; }
.rw-hero-copy > *:nth-child(4) { animation-delay: 320ms; }

@keyframes rw-hero-copy {
    from {
        opacity: 0;
        transform: translateY(18px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.rw-belong {
    display: grid;
    grid-template-columns: 1.05fr 0.95fr;
    gap: 2rem;
    align-items: center;
}

.rw-belong__image {
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    min-height: 300px;
}

.rw-belong__image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    min-height: 300px;
}

.rw-service-preview {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1rem;
}

.rw-service-preview__card {
    display: flex;
    flex-direction: column;
    padding: 1.15rem 1.1rem 1rem;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #17181b;
    transition: transform 0.4s ease, border-color 0.4s ease;
}

.rw-service-preview__card:hover {
    transform: translateY(-3px);
    border-color: rgba(255, 255, 255, 0.16);
}

.rw-service-preview__media {
    overflow: hidden;
    border-radius: 8px;
    height: 110px;
    margin-top: auto;
    padding-top: 1rem;
}

.rw-service-preview__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s ease;
}

.rw-service-preview__card:hover .rw-service-preview__media img {
    transform: scale(1.035);
}

.rw-service-preview__number {
    margin: 0;
    color: #8f2338;
    letter-spacing: 0.16em;
    font-size: 0.7rem;
    font-weight: 500;
}

.rw-service-preview__card h3 {
    margin: 0.4rem 0;
    font-size: 1.45rem;
}

.rw-service-preview__card > p:not(.rw-service-preview__number) {
    margin: 0 0 0.75rem;
    color: #a9adb5;
    line-height: 1.65;
    font-size: 0.92rem;
}

.rw-closing {
    text-align: center;
    max-width: 640px;
    margin-inline: auto;
    padding: 1rem 0;
}

.rw-closing__eyebrow {
    margin: 0 0 0.75rem;
    font-family: var(--rw-font-serif, 'Cormorant Garamond', serif);
    font-size: 1.1rem;
    color: #a9adb5;
}

.rw-closing h2 {
    font-size: clamp(2rem, 3.4vw, 2.85rem);
}

.rw-closing .rw-cta-row {
    justify-content: center;
}

@media (max-width: 900px) {
    .rw-belong,
    .rw-service-preview {
        grid-template-columns: 1fr;
    }
}

@media (prefers-reduced-motion: reduce) {
    .rw-hero-copy > *,
    .rw-service-preview__card,
    .rw-service-preview__media img {
        animation: none !important;
        transition: none !important;
        transform: none !important;
        opacity: 1 !important;
    }
}
</style>
