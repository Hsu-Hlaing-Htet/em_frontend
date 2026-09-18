<script setup>
import { computed, nextTick, onMounted, ref } from 'vue';
import { getPropertyStats, getPublicProperties } from '@/modules/public/service';
import { useAnimatedCounter } from '@/composables/public/useAnimatedCounter';
import { useAssistantChat } from '@/composables/shared/useAssistantChat';

const { requestOpenAssistant } = useAssistantChat();

const inventory = ref([]);
const stats = ref({
    total: 0,
    available: 0,
    for_sale: 0,
});
const statsSectionRef = ref(null);

const LOCATION_IMAGES = {
    bahan: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200',
    kamayut: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=1200',
    sanchaung: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200',
    hlaing: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200',
};

const FALLBACK_LOCATION_IMAGE = 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200';

const approach = [
    {
        number: '01',
        title: 'Curate',
        icon: 'fa-layer-group',
        copy: 'Show relevant residences instead of overwhelming users with too many choices.',
    },
    {
        number: '02',
        title: 'Guide',
        icon: 'fa-compass',
        copy: 'Provide clear context around pricing, location, availability, and property details.',
    },
    {
        number: '03',
        title: 'Support',
        icon: 'fa-handshake',
        copy: 'Connect users with property information, the Rosewood team, and the AI Concierge when needed.',
    },
];

const values = [
    {
        title: 'Integrity',
        icon: 'fa-scale-balanced',
        copy: 'Clear information, transparent property details, and honest communication.',
    },
    {
        title: 'Excellence',
        icon: 'fa-gem',
        copy: 'Every detail should feel considered, from presentation to support.',
    },
    {
        title: 'People First',
        icon: 'fa-heart',
        copy: 'Property decisions are personal. Listen first, then guide.',
    },
    {
        title: 'A Better Tomorrow',
        icon: 'fa-sun',
        copy: 'Help people find spaces that support how they want to live.',
    },
];

const aiSupport = [
    'Available properties',
    'Rent and sale pricing',
    'Locations',
    'Property details',
];

const teamSupport = [
    'General property support',
    'Service enquiries',
    'Relocation and property questions',
    'Direct contact',
];

const totalSource = computed(() => stats.value.total);
const availableSource = computed(() => stats.value.available);
const forSaleSource = computed(() => stats.value.for_sale);

const totalCounter = useAnimatedCounter(totalSource, { suffix: '' });
const availableCounter = useAnimatedCounter(availableSource, { suffix: '' });
const forSaleCounter = useAnimatedCounter(forSaleSource, { suffix: '' });

const statCards = [
    { label: 'Properties Listed', counter: totalCounter },
    { label: 'Available Units', counter: availableCounter },
    { label: 'For Sale', counter: forSaleCounter },
];

const locations = computed(() => {
    const counts = new Map();

    inventory.value.forEach((property) => {
        const name = String(property.township || '').trim();
        if (!name) {
            return;
        }

        const key = name.toLowerCase();
        const existing = counts.get(key);
        if (existing) {
            existing.count += 1;
            return;
        }

        counts.set(key, { name, count: 1 });
    });

    return Array.from(counts.values())
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name))
        .slice(0, 4)
        .map((location) => ({
            ...location,
            image: LOCATION_IMAGES[location.name.toLowerCase()] || FALLBACK_LOCATION_IMAGE,
        }));
});

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
    try {
        const [statsRes, saleRes, rentRes] = await Promise.all([
            getPropertyStats(),
            getPublicProperties({ purpose: 'sale', per_page: 48 }),
            getPublicProperties({ purpose: 'rent', per_page: 48 }),
        ]);

        const payload = statsRes?.data?.data ?? {};
        const saleList = unwrapList(saleRes);
        const rentList = unwrapList(rentRes);
        const saleTotal = Number(saleRes?.data?.meta?.total ?? saleList.length);
        const rentTotal = Number(rentRes?.data?.meta?.total ?? rentList.length);

        inventory.value = dedupeByPurposeId([...saleList, ...rentList]);

        stats.value = {
            total: Number(payload.total ?? (saleTotal + rentTotal)),
            available: Number(payload.available ?? rentTotal),
            for_sale: saleTotal,
        };
    } catch {
        // keep zeros / empty locations
    }
}

onMounted(async () => {
    await load();
    await nextTick();
    const cards = statsSectionRef.value?.querySelectorAll('.rw-about-stat');
    cards?.forEach((card, index) => {
        statCards[index]?.counter.observeElement(card);
    });
});
</script>

<template>
    <div class="rw-about-page">
        <section class="rw-page-hero rw-page-hero--tall rw-about-hero">
            <div
                class="rw-page-hero__media"
                aria-hidden="true"
            >
                <img
                    src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1800"
                    alt=""
                >
            </div>
            <div class="rw-page-hero__overlay" />
            <div class="container rw-page-hero__content rw-about-hero__copy">
                <p class="rw-kicker">About</p>
                <h1>More Than Properties</h1>
                <p class="rw-lede">
                    A brand built around belonging — refined residences, honest guidance, and a calmer way to choose
                    where life unfolds.
                </p>
            </div>
        </section>

        <section class="rw-section reveal">
            <div class="container rw-about-story">
                <div>
                    <p class="rw-kicker">Our Story</p>
                    <h2>Crafted for people who notice.</h2>
                    <p>
                        Rosewood Royale brings together curated residences, thoughtful property information, and human
                        guidance across Yangon.
                    </p>
                    <p>
                        We believe finding a home should feel considered rather than overwhelming — with clear details,
                        relevant options, and support when you need it.
                    </p>
                </div>
                <div class="rw-about-story__media">
                    <img
                        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=1400"
                        alt="Refined residence interior"
                        loading="lazy"
                    >
                </div>
            </div>
        </section>

        <section class="rw-section rw-section--alt reveal">
            <div class="container">
                <div class="rw-section-head rw-section-head--stack">
                    <div>
                        <p class="rw-kicker">Our Approach</p>
                        <h2>A simpler way to find what fits.</h2>
                    </div>
                </div>

                <div class="rw-about-approach reveal-stagger">
                    <article
                        v-for="item in approach"
                        :key="item.number"
                        class="rw-about-approach__card"
                    >
                        <div class="rw-about-approach__top">
                            <p class="rw-about-approach__number">{{ item.number }}</p>
                            <span
                                class="rw-about-approach__icon"
                                aria-hidden="true"
                            >
                                <i :class="`fas ${item.icon}`" />
                            </span>
                        </div>
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.copy }}</p>
                    </article>
                </div>
            </div>
        </section>

        <section
            ref="statsSectionRef"
            class="rw-section reveal"
        >
            <div class="container">
                <div class="rw-section-head rw-section-head--stack">
                    <div>
                        <p class="rw-kicker">Live Snapshot</p>
                        <h2>Rosewood inventory at a glance</h2>
                    </div>
                </div>

                <div class="rw-about-stats">
                    <article
                        v-for="item in statCards"
                        :key="item.label"
                        class="rw-about-stat"
                    >
                        <h3>{{ item.counter.formattedValue() }}</h3>
                        <p>{{ item.label }}</p>
                    </article>
                </div>
            </div>
        </section>

        <section class="rw-section rw-section--alt reveal">
            <div class="container">
                <div class="rw-section-head rw-section-head--stack">
                    <div>
                        <p class="rw-kicker">Our Values</p>
                        <h2>What guides every conversation</h2>
                    </div>
                </div>

                <div class="rw-about-values reveal-stagger">
                    <article
                        v-for="value in values"
                        :key="value.title"
                        class="rw-about-values__card"
                    >
                        <div class="rw-about-values__icon">
                            <i :class="`fas ${value.icon}`" />
                        </div>
                        <h3>{{ value.title }}</h3>
                        <p>{{ value.copy }}</p>
                    </article>
                </div>
            </div>
        </section>

        <section
            v-if="locations.length"
            class="rw-section reveal"
        >
            <div class="container">
                <div class="rw-section-head rw-section-head--stack">
                    <div>
                        <p class="rw-kicker">Local Perspective</p>
                        <h2>Rooted in Yangon.</h2>
                        <p class="rw-lede">
                            Rosewood Royale helps clients explore residences across neighborhoods that offer different
                            lifestyles, access, and character.
                        </p>
                    </div>
                </div>

                <div class="rw-about-locations reveal-stagger">
                    <router-link
                        v-for="location in locations"
                        :key="location.name"
                        :to="{ path: '/properties', query: { township: location.name } }"
                        class="rw-about-location"
                    >
                        <img
                            :src="location.image"
                            :alt="location.name"
                            loading="lazy"
                        >
                        <div class="rw-about-location__overlay">
                            <h3>{{ location.name }}</h3>
                            <p>
                                {{ location.count }}
                                {{ location.count === 1 ? 'property' : 'properties' }}
                            </p>
                            <span class="rw-about-location__cta">
                                Explore properties
                                <i class="fas fa-arrow-right" />
                            </span>
                        </div>
                    </router-link>
                </div>
            </div>
        </section>

        <section class="rw-section rw-section--alt reveal">
            <div class="container">
                <div class="rw-about-concierge">
                    <div class="rw-about-concierge__intro">
                        <p class="rw-kicker">Rosewood Concierge</p>
                        <h2>Technology should make the search calmer, not colder.</h2>
                        <p>
                            Use Rosewood AI Concierge for quick property guidance, then connect with the Rosewood team
                            whenever you want a human conversation.
                        </p>
                        <div class="rw-cta-row">
                            <button
                                type="button"
                                class="rw-btn rw-btn-primary"
                                aria-label="Ask Rosewood AI Concierge"
                                @click="requestOpenAssistant"
                            >
                                ASK
                            </button>
                            <router-link
                                to="/contact"
                                class="rw-btn rw-btn-ghost"
                            >
                                Contact Us
                            </router-link>
                        </div>
                    </div>

                    <div class="rw-about-concierge__sides">
                        <article>
                            <h3>AI Concierge</h3>
                            <ul>
                                <li
                                    v-for="item in aiSupport"
                                    :key="item"
                                >
                                    <i
                                        class="fas fa-check"
                                        aria-hidden="true"
                                    />
                                    <span>{{ item }}</span>
                                </li>
                            </ul>
                        </article>
                        <article>
                            <h3>Rosewood Team</h3>
                            <ul>
                                <li
                                    v-for="item in teamSupport"
                                    :key="item"
                                >
                                    <i
                                        class="fas fa-check"
                                        aria-hidden="true"
                                    />
                                    <span>{{ item }}</span>
                                </li>
                            </ul>
                        </article>
                    </div>
                </div>
            </div>
        </section>

        <section class="rw-section reveal">
            <div class="container rw-about-cta">
                <p class="rw-kicker">Your Next Chapter</p>
                <h2>Find a place that feels right.</h2>
                <p class="rw-lede">
                    Explore Rosewood Royale residences or ask the AI Concierge to help narrow down what fits your needs.
                </p>
                <div class="rw-cta-row">
                    <router-link
                        to="/properties"
                        class="rw-btn rw-btn-primary"
                    >
                        Explore Properties
                        <i class="fas fa-arrow-right" />
                    </router-link>
                    <button
                        type="button"
                        class="rw-btn rw-btn-ghost"
                        aria-label="Ask Rosewood AI Concierge"
                        @click="requestOpenAssistant"
                    >
                        ASK
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<style scoped>
.rw-about-page > .rw-section {
    padding: 6.25rem 0;
}

.rw-about-hero__copy > * {
    animation: rw-about-hero-in 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.rw-about-hero__copy > *:nth-child(1) { animation-delay: 80ms; }
.rw-about-hero__copy > *:nth-child(2) { animation-delay: 160ms; }
.rw-about-hero__copy > *:nth-child(3) { animation-delay: 240ms; }

.rw-about-hero__copy h1 {
    font-size: clamp(2.4rem, 6.2vw, 4.5rem);
    max-width: 12ch;
    line-height: 0.98;
}

.rw-about-hero__copy .rw-lede {
    max-width: 40rem;
}

.rw-section-head--stack {
    align-items: start;
    margin-bottom: 1.85rem;
}

.rw-section-head--stack h2 {
    font-size: clamp(2rem, 3.5vw, 2.85rem);
}

.rw-section-head--stack .rw-lede {
    margin-top: 0.75rem;
    max-width: 48ch;
}

.rw-about-story {
    display: grid;
    grid-template-columns: 1fr 1.05fr;
    gap: 2.5rem;
    align-items: center;
}

.rw-about-story h2 {
    margin: 0 0 1rem;
    font-size: clamp(2rem, 3.4vw, 2.75rem);
    font-weight: 500;
}

.rw-about-story p {
    margin: 0 0 0.9rem;
    color: #a9adb5;
    line-height: 1.7;
    font-size: 0.95rem;
    max-width: 38ch;
}

.rw-about-story p:last-of-type {
    margin-bottom: 0;
}

.rw-about-story__media {
    overflow: hidden;
    min-height: 360px;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.rw-about-story__media img {
    width: 100%;
    height: 100%;
    min-height: 360px;
    object-fit: cover;
    transition: transform 0.8s ease;
}

.rw-about-story:hover .rw-about-story__media img {
    transform: scale(1.02);
}

.rw-about-approach {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.25rem;
}

.rw-about-approach__card {
    padding: 1.4rem 1.25rem;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(18, 18, 20, 0.72);
    transition: border-color 0.3s ease, transform 0.3s ease;
}

.rw-about-approach__card:hover {
    border-color: rgba(143, 35, 56, 0.45);
    transform: translateY(-2px);
}

.rw-about-approach__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1rem;
}

.rw-about-approach__number {
    margin: 0;
    color: #8f2338;
    font-size: 0.7rem;
    letter-spacing: 0.16em;
    font-weight: 500;
}

.rw-about-approach__icon {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    border: 1px solid rgba(143, 35, 56, 0.45);
    color: #8f2338;
    font-size: 0.78rem;
    transition: color 0.3s ease, background 0.3s ease;
}

.rw-about-approach__card:hover .rw-about-approach__icon {
    color: #a92b47;
    background: rgba(143, 35, 56, 0.12);
}

.rw-about-approach__card h3 {
    margin: 0 0 0.55rem;
    font-size: 1.45rem;
    font-weight: 500;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}

.rw-about-approach__card p {
    margin: 0;
    color: #a9adb5;
    font-size: 0.9rem;
    line-height: 1.65;
}

.rw-about-stats {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 14px;
    overflow: hidden;
    background: #17181b;
}

.rw-about-stat {
    padding: 1.85rem 1.4rem;
    text-align: center;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
}

.rw-about-stat:last-child {
    border-right: 0;
}

.rw-about-stat h3 {
    margin: 0;
    font-size: clamp(2.4rem, 4vw, 3.4rem);
    font-weight: 500;
    color: #f5f2ee;
    line-height: 1;
}

.rw-about-stat p {
    margin: 0.7rem 0 0;
    font-size: 0.68rem;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #777b82;
}

.rw-about-values {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.15rem;
}

.rw-about-values__card {
    padding: 1.25rem 1.1rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #17181b;
    transition: border-color 0.3s ease, transform 0.3s ease;
}

.rw-about-values__card:hover {
    border-color: rgba(143, 35, 56, 0.45);
    transform: translateY(-2px);
}

.rw-about-values__icon {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    margin-bottom: 0.85rem;
    border-radius: 999px;
    border: 1px solid rgba(143, 35, 56, 0.45);
    color: #8f2338;
    font-size: 0.8rem;
    transition: color 0.3s ease, background 0.3s ease;
}

.rw-about-values__card:hover .rw-about-values__icon {
    color: #a92b47;
    background: rgba(143, 35, 56, 0.12);
}

.rw-about-values__card h3 {
    margin: 0 0 0.5rem;
    font-size: 1.25rem;
    font-weight: 500;
}

.rw-about-values__card p {
    margin: 0;
    color: #a9adb5;
    font-size: 0.88rem;
    line-height: 1.55;
}

.rw-about-locations {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.15rem;
}

.rw-about-location {
    position: relative;
    display: block;
    overflow: hidden;
    min-height: 260px;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
}

.rw-about-location img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.55s ease;
}

.rw-about-location:hover img {
    transform: scale(1.035);
}

.rw-about-location__overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 1.25rem;
    background: linear-gradient(180deg, transparent 28%, rgba(13, 13, 15, 0.9) 100%);
}

.rw-about-location h3 {
    margin: 0;
    font-size: 1.65rem;
    font-weight: 500;
}

.rw-about-location p {
    margin: 0.3rem 0 0;
    color: #a9adb5;
    font-size: 0.8rem;
}

.rw-about-location__cta {
    display: inline-flex;
    align-items: center;
    gap: 0.4rem;
    margin-top: 0.7rem;
    color: #f5f2ee;
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
}

.rw-about-location__cta i {
    transition: transform 0.35s ease;
    font-size: 0.62rem;
}

.rw-about-location:hover .rw-about-location__cta i {
    transform: translateX(4px);
}

.rw-about-concierge {
    display: grid;
    gap: 1.75rem;
    padding: 1.85rem 1.7rem;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(18, 18, 20, 0.92);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
}

.rw-about-concierge__intro h2 {
    margin: 0 0 0.75rem;
    font-size: clamp(1.9rem, 3vw, 2.55rem);
    font-weight: 500;
    max-width: 18ch;
}

.rw-about-concierge__intro > p:not(.rw-kicker) {
    margin: 0;
    color: #a9adb5;
    font-size: 0.95rem;
    line-height: 1.7;
    max-width: 52ch;
}

.rw-about-concierge__sides {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.15rem;
}

.rw-about-concierge__sides article {
    padding: 1.2rem 1.15rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(32, 34, 38, 0.55);
}

.rw-about-concierge__sides h3 {
    margin: 0 0 0.85rem;
    font-size: 1.25rem;
    font-weight: 500;
}

.rw-about-concierge__sides ul {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.55rem;
}

.rw-about-concierge__sides li {
    display: flex;
    gap: 0.55rem;
    align-items: flex-start;
    color: #a9adb5;
    font-size: 0.88rem;
    line-height: 1.5;
}

.rw-about-concierge__sides li i {
    margin-top: 0.2rem;
    color: #8f2338;
    font-size: 0.7rem;
}

.rw-about-cta {
    text-align: center;
    padding: 2.25rem 1.5rem;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: #17181b;
}

.rw-about-cta h2 {
    margin: 0;
    font-size: clamp(2rem, 3.5vw, 2.75rem);
    font-weight: 500;
}

.rw-about-cta .rw-lede {
    margin: 0.85rem auto 0;
    max-width: 44ch;
}

.rw-about-cta .rw-cta-row {
    justify-content: center;
}

@keyframes rw-about-hero-in {
    from {
        opacity: 0;
        transform: translateY(18px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@media (max-width: 1024px) {
    .rw-about-approach {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .rw-about-approach__card:last-child {
        grid-column: 1 / -1;
    }

    .rw-about-values,
    .rw-about-locations {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }
}

@media (max-width: 800px) {
    .rw-about-story,
    .rw-about-concierge__sides {
        grid-template-columns: 1fr;
    }

    .rw-about-stats {
        grid-template-columns: 1fr;
    }

    .rw-about-stat {
        border-right: 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .rw-about-stat:last-child {
        border-bottom: 0;
    }
}

@media (max-width: 640px) {
    .rw-about-page > .rw-section {
        padding: 4.5rem 0;
    }

    .rw-about-approach,
    .rw-about-values {
        grid-template-columns: 1fr;
    }

    .rw-about-approach__card:last-child {
        grid-column: auto;
    }

    .rw-about-locations {
        display: flex;
        gap: 0.85rem;
        overflow-x: auto;
        padding-bottom: 0.35rem;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
    }

    .rw-about-location {
        flex: 0 0 78%;
        scroll-snap-align: start;
        min-height: 240px;
    }

    .rw-about-cta .rw-cta-row,
    .rw-about-concierge__intro .rw-cta-row {
        width: 100%;
    }

    .rw-about-cta .rw-btn,
    .rw-about-concierge__intro .rw-btn {
        width: 100%;
    }
}

@media (prefers-reduced-motion: reduce) {
    .rw-about-hero__copy > *,
    .rw-about-story__media img,
    .rw-about-approach__card,
    .rw-about-values__card,
    .rw-about-location img,
    .rw-about-location__cta i {
        animation: none !important;
        transition: none !important;
        transform: none !important;
    }
}
</style>
