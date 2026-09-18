<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import PropertyCard from '@/components/public/PropertyCard.vue';
import PropertyGallery from '@/components/public/PropertyGallery.vue';
import RwEmptyState from '@/components/global/RwEmptyState.vue';
import { getPublicProperties, getPublicProperty } from '@/modules/public/service';
import { formatCurrency } from '@/utils/formatter';
import { useAssistantChat } from '@/composables/shared/useAssistantChat';

const route = useRoute();
const router = useRouter();
const { requestOpenAssistant } = useAssistantChat();

const property = ref(null);
const similar = ref([]);
const loading = ref(false);
const activeTab = ref('overview');

const hasLocation = computed(() =>
    Boolean(property.value?.address || property.value?.township || property.value?.city)
);

const tabs = computed(() => {
    const items = [{ id: 'overview', label: 'Overview' }];
    if (hasLocation.value) {
        items.push({ id: 'location', label: 'Location' });
    }
    if (similar.value.length) {
        items.push({ id: 'similar', label: 'Similar' });
    }
    return items;
});

const priceLabel = computed(() => {
    if (!property.value) return '';
    if (property.value.purpose === 'rent') {
        const rent = property.value.monthly_rent ?? property.value.rent_price;
        return rent ? `${formatCurrency(Number(rent))} / month` : 'Contact for price';
    }
    return property.value.sale_price
        ? formatCurrency(Number(property.value.sale_price))
        : 'Contact for price';
});

const locationLabel = computed(() => {
    if (!property.value) return '';
    const parts = [property.value.township, property.value.city].filter(Boolean);
    if (parts.length) return parts.join(', ');
    return property.value.address || '';
});

const mapQuery = computed(() => {
    const parts = [
        property.value?.address,
        property.value?.township,
        property.value?.city,
    ].filter(Boolean);
    return encodeURIComponent(parts.join(', '));
});

const metaItems = computed(() => {
    if (!property.value) return [];
    const items = [];

    if (property.value.area_sqft) {
        items.push({
            icon: 'fa-ruler-combined',
            label: 'Area',
            value: `${property.value.area_sqft} sqft`,
        });
    }

    if (property.value.floor_number != null && property.value.floor_number !== '') {
        items.push({
            icon: 'fa-stairs',
            label: 'Floor',
            value: String(property.value.floor_number),
        });
    }

    if (property.value.width_ft && property.value.length_ft) {
        items.push({
            icon: 'fa-vector-square',
            label: 'Dimensions',
            value: `${property.value.width_ft} × ${property.value.length_ft} ft`,
        });
    }

    if (property.value.rent_deposit_price && property.value.purpose === 'rent') {
        items.push({
            icon: 'fa-wallet',
            label: 'Deposit',
            value: formatCurrency(Number(property.value.rent_deposit_price)),
        });
    }

    return items;
});

const highlights = computed(() => {
    if (!property.value) return [];
    return [
        property.value.status ? `Status: ${property.value.status}` : null,
        property.value.township ? `Located in ${property.value.township}` : null,
        property.value.purpose === 'rent' ? 'Available for rent' : null,
        property.value.purpose === 'sale' ? 'Available for sale' : null,
    ].filter(Boolean);
});

async function load() {
    loading.value = true;
    try {
        const purpose = route.query.purpose;
        const { data } = await getPublicProperty(route.params.id, {
            ...(purpose ? { purpose } : {}),
        });
        property.value = data?.data ?? data;

        if (property.value?.purpose) {
            const listRes = await getPublicProperties({
                purpose: property.value.purpose,
                per_page: 4,
            });
            const list = Array.isArray(listRes?.data?.data) ? listRes.data.data : [];
            similar.value = list
                .filter((item) => Number(item.id) !== Number(property.value.id))
                .slice(0, 3);
        }
    } catch {
        property.value = null;
        similar.value = [];
    } finally {
        loading.value = false;
    }
}

function scrollToSection(id) {
    activeTab.value = id;
    document.getElementById(`detail-${id}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function goBack() {
    if (window.history.length > 1) {
        router.back();
        return;
    }
    router.push('/properties');
}

onMounted(load);
</script>

<template>
    <div>
        <div
            v-if="loading"
            class="rw-detail-loading"
        >
            Loading residence…
        </div>

        <template v-else-if="property">
            <div class="container rw-detail-top">
                <button type="button" class="rw-back" @click="goBack">
                    <i class="fas fa-arrow-left" />
                    Back to listings
                </button>

                <PropertyGallery
                    :featured-image="property.featured_image"
                    :gallery-images="property.gallery_images"
                    :alt="property.property_name"
                />
            </div>

            <section class="rw-section rw-section--tight">
                <div class="container rw-detail-grid">
                    <div class="reveal is-visible">
                        <div class="rw-detail-badges">
                            <span class="rw-badge">
                                {{ property.purpose === 'rent' ? 'For Rent' : 'For Sale' }}
                            </span>
                            <span
                                v-if="property.status"
                                class="rw-status"
                            >{{ property.status }}</span>
                        </div>

                        <h1 class="rw-detail-title">{{ property.property_name || 'Rosewood Residence' }}</h1>

                        <p
                            v-if="locationLabel"
                            class="rw-detail-location"
                        >
                            <i class="fas fa-location-dot" />
                            {{ locationLabel }}
                        </p>

                        <p class="rw-detail-price">{{ priceLabel }}</p>

                        <div
                            v-if="metaItems.length"
                            class="rw-detail-meta"
                            :style="{ '--meta-cols': Math.min(metaItems.length, 4) }"
                        >
                            <article
                                v-for="item in metaItems"
                                :key="item.label"
                            >
                                <i :class="`fas ${item.icon}`" />
                                <div>
                                    <span>{{ item.label }}</span>
                                    <strong>{{ item.value }}</strong>
                                </div>
                            </article>
                        </div>

                        <nav
                            v-if="tabs.length > 1"
                            class="rw-detail-tabs"
                            aria-label="Property sections"
                        >
                            <button
                                v-for="tab in tabs"
                                :key="tab.id"
                                type="button"
                                :class="{ 'is-active': activeTab === tab.id }"
                                @click="scrollToSection(tab.id)"
                            >
                                {{ tab.label }}
                            </button>
                        </nav>

                        <div id="detail-overview" class="rw-detail-block">
                            <h2>Overview</h2>
                            <p v-if="property.description">{{ property.description }}</p>
                            <p
                                v-else
                                class="rw-muted"
                            >Details for this residence are available on request.</p>

                            <ul
                                v-if="highlights.length"
                                class="rw-highlights"
                            >
                                <li
                                    v-for="item in highlights"
                                    :key="item"
                                >
                                    <i class="fas fa-check" />
                                    {{ item }}
                                </li>
                            </ul>

                            <p
                                v-if="property.address"
                                class="rw-detail-address"
                            >
                                <strong>Address:</strong> {{ property.address }}
                            </p>
                        </div>
                    </div>

                    <aside class="rw-glass rw-detail-cta reveal is-visible">
                        <p class="rw-kicker">Next step</p>
                        <h2>Interested in this residence?</h2>
                        <p>
                            Reach our team or ask the Rosewood AI Concierge — both use the same live property data.
                        </p>
                        <router-link to="/contact" class="rw-btn rw-btn-primary" style="width: 100%">
                            Contact Us
                            <i class="fas fa-arrow-right" />
                        </router-link>
                        <button
                            type="button"
                            class="rw-btn rw-btn-ghost"
                            style="width: 100%; margin-top: 0.65rem"
                            aria-label="Ask Rosewood AI Concierge"
                            @click="requestOpenAssistant"
                        >
                            ASK
                        </button>
                    </aside>
                </div>
            </section>

            <section
                v-if="hasLocation"
                id="detail-location"
                class="rw-section rw-section--alt"
            >
                <div class="container">
                    <div class="rw-section-head">
                        <h2>Location</h2>
                    </div>
                    <div class="rw-map">
                        <iframe
                            title="Property location"
                            loading="lazy"
                            referrerpolicy="no-referrer-when-downgrade"
                            :src="`https://maps.google.com/maps?q=${mapQuery}&z=14&output=embed`"
                        />
                    </div>
                </div>
            </section>

            <section
                v-if="similar.length"
                id="detail-similar"
                class="rw-section"
            >
                <div class="container">
                    <div class="rw-section-head">
                        <h2>Similar Residences</h2>
                    </div>
                    <div class="rw-property-grid">
                        <PropertyCard
                            v-for="item in similar"
                            :key="item.id"
                            :property="item"
                        />
                    </div>
                </div>
            </section>
        </template>

        <div
            v-else
            class="rw-detail-empty"
        >
            <RwEmptyState
                icon="pi pi-compass"
                title="Residence not found"
                message="This property may have been removed or is no longer available."
                :primary-cta="{ label: 'Browse residences', to: { name: 'properties' } }"
                :secondary-cta="{ label: 'Return Home', to: { name: 'home' } }"
            />
        </div>
    </div>
</template>

<style scoped>
.rw-detail-empty {
    min-height: 48vh;
    display: grid;
    place-items: center;
    padding: 2rem 1rem;
}

.rw-detail-loading {
    min-height: 40vh;
    display: grid;
    place-items: center;
    color: var(--rw-text-muted, #777b82);
}

.rw-detail-top {
    padding-top: 1.25rem;
}

.rw-back {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    margin-bottom: 1rem;
    border: 0;
    background: transparent;
    color: #a9adb5;
    font-size: 0.72rem;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
}

.rw-back:hover {
    color: #f5f2ee;
}

.rw-detail-grid {
    display: grid;
    grid-template-columns: minmax(0, 1.45fr) minmax(260px, 0.7fr);
    gap: 1.75rem;
    align-items: start;
}

.rw-detail-badges {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;
    align-items: center;
}

.rw-status {
    font-size: 0.68rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #a9adb5;
}

.rw-detail-title {
    margin: 0.85rem 0 0;
    font-size: clamp(2rem, 3.6vw, 3rem);
    line-height: 1.08;
}

.rw-detail-price {
    margin: 0.85rem 0 0;
    font-family: var(--rw-font-serif, 'Cormorant Garamond', serif);
    font-size: 1.7rem;
    color: #f5f2ee;
}

.rw-detail-location {
    margin: 0.55rem 0 0;
    color: #a9adb5;
    font-size: 0.9rem;
}

.rw-detail-location i {
    margin-right: 0.35rem;
    color: #8f2338;
}

.rw-detail-meta {
    display: grid;
    grid-template-columns: repeat(var(--meta-cols, 2), minmax(0, 1fr));
    gap: 0.65rem;
    margin-top: 1.5rem;
}

.rw-detail-meta article {
    display: flex;
    gap: 0.65rem;
    align-items: center;
    padding: 0.85rem 0.75rem;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #17181b;
}

.rw-detail-meta i {
    color: #8f2338;
    font-size: 0.85rem;
}

.rw-detail-meta span {
    display: block;
    margin-bottom: 0.15rem;
    color: #777b82;
    font-size: 0.62rem;
    letter-spacing: 0.1em;
    text-transform: uppercase;
}

.rw-detail-meta strong {
    color: #f5f2ee;
    font-weight: 500;
    font-size: 0.9rem;
}

.rw-detail-block {
    margin-top: 1.75rem;
    scroll-margin-top: 88px;
}

.rw-detail-block h2 {
    margin: 0 0 0.7rem;
    font-size: 1.45rem;
}

.rw-detail-block p,
.rw-muted {
    margin: 0;
    color: #a9adb5;
    line-height: 1.7;
    font-size: 0.92rem;
}

.rw-detail-address {
    margin-top: 0.9rem !important;
}

.rw-highlights {
    list-style: none;
    margin: 1rem 0 0;
    padding: 0;
    display: grid;
    gap: 0.55rem;
}

.rw-highlights li {
    display: flex;
    gap: 0.55rem;
    color: #a9adb5;
    font-size: 0.9rem;
}

.rw-highlights i {
    margin-top: 0.2rem;
    color: #8f2338;
    font-size: 0.7rem;
}

.rw-detail-cta {
    padding: 1.35rem;
    position: sticky;
    top: 84px;
}

.rw-detail-cta h2 {
    margin: 0.35rem 0 0.65rem;
    font-size: 1.45rem;
}

.rw-detail-cta p {
    margin: 0 0 1.1rem;
    color: #a9adb5;
    line-height: 1.6;
    font-size: 0.88rem;
}

.rw-map {
    overflow: hidden;
    border-radius: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    min-height: 320px;
}

.rw-map iframe {
    width: 100%;
    height: 320px;
    border: 0;
    filter: grayscale(0.35) contrast(1.05);
}

@media (max-width: 960px) {
    .rw-detail-grid {
        grid-template-columns: 1fr;
    }

    .rw-detail-meta {
        grid-template-columns: 1fr 1fr;
    }

    .rw-detail-cta {
        position: static;
    }
}
</style>
