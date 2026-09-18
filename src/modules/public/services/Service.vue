<script setup>
import { ref } from 'vue';
import { useAssistantChat } from '@/composables/shared/useAssistantChat';

const { requestOpenAssistant } = useAssistantChat();

const heroValues = [
    {
        label: 'Discreet',
        copy: 'Privacy and thoughtful support',
    },
    {
        label: 'Personalized',
        copy: 'Guidance shaped around each client',
    },
    {
        label: 'Reliable',
        copy: 'Clear support throughout the property journey',
    },
];

const services = [
    {
        number: '01',
        title: 'Property Management',
        icon: 'fa-building',
        copy: 'Professional support for property operations, maintenance coordination, resident communication, and day-to-day management.',
        image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1200',
        action: { label: 'Speak With Us', to: '/contact' },
    },
    {
        number: '02',
        title: 'Private Support / Concierge',
        icon: 'fa-bell-concierge',
        copy: 'Personal assistance for property questions, handovers, resident needs, and general property-related support.',
        image: 'https://images.unsplash.com/photo-1521783593447-5702b9bfd267?q=80&w=1200',
        action: { label: 'Speak With Us', to: '/contact' },
    },
    {
        number: '03',
        title: 'Investment Advisory',
        icon: 'fa-chart-line',
        copy: 'Clear property information and guidance to help buyers and investors understand available opportunities.',
        image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1200',
        action: { label: 'Explore Properties', to: '/properties' },
    },
    {
        number: '04',
        title: 'Relocation Support',
        icon: 'fa-suitcase-rolling',
        copy: 'Practical support for clients moving to a new area, from property discovery to settling in.',
        image: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200',
        action: { label: 'Speak With Us', to: '/contact' },
    },
];

const handleItems = [
    {
        title: 'Maintenance Coordination',
        icon: 'fa-wrench',
        copy: 'Coordinating maintenance and service needs, with clear communication around property upkeep.',
    },
    {
        title: 'Resident / Tenant Support',
        icon: 'fa-comments',
        copy: 'General resident communication and ongoing property support through the Rosewood experience.',
    },
    {
        title: 'Documentation Assistance',
        icon: 'fa-file-lines',
        copy: 'Helping clients understand property-related documentation, handover information, and administrative guidance.',
    },
    {
        title: 'Relocation Guidance',
        icon: 'fa-map-location-dot',
        copy: 'Helping users explore suitable locations and discover properties based on their preferences.',
    },
    {
        title: 'Property Information',
        icon: 'fa-circle-info',
        copy: 'Pricing information, availability, and property details from Rosewood listings.',
    },
    {
        title: 'AI Property Assistance',
        icon: 'fa-wand-magic-sparkles',
        copy: 'Rosewood AI Concierge for searching available properties, rental and sale information, and location exploration.',
    },
];

const processSteps = [
    {
        number: '01',
        title: 'Understand',
        copy: 'We learn what the client is looking for — rent or sale, location, budget, and property preferences.',
    },
    {
        number: '02',
        title: 'Curate',
        copy: 'We use available Rosewood property data to narrow down suitable options and relevant services.',
    },
    {
        number: '03',
        title: 'Support',
        copy: 'We provide property information, concierge assistance, relocation support, and contact options when needed.',
    },
];

const whyValues = [
    {
        title: 'Curated Property Information',
        icon: 'fa-layer-group',
        copy: 'Relevant listings and property details without overwhelming the user.',
    },
    {
        title: 'Personalized Guidance',
        icon: 'fa-user-check',
        copy: 'Support shaped around the user’s needs and property goals.',
    },
    {
        title: 'Local Property Knowledge',
        icon: 'fa-location-dot',
        copy: 'Useful location and property context from the Rosewood platform.',
    },
    {
        title: 'Connected Support',
        icon: 'fa-link',
        copy: 'Website, property data, contact channels, and AI Concierge working together.',
    },
];

const faqs = [
    {
        question: 'What services does Rosewood Royale provide?',
        answer: 'Rosewood Royale offers property management support, private concierge assistance, investment-oriented property information, and relocation guidance — alongside curated rental and sale listings on the website.',
    },
    {
        question: 'Can you help with both rental and sale properties?',
        answer: 'Yes. You can browse For Rent and For Sale listings on the Rosewood Royale website, or ask the AI Concierge about available options in either category.',
    },
    {
        question: 'How can I find properties that match my requirements?',
        answer: 'Use the Properties pages to filter by purpose, location, and preferences, or ask the Rosewood AI Concierge to help explore listings that fit what you are looking for.',
    },
    {
        question: 'Can Rosewood help me explore different locations?',
        answer: 'Yes. You can explore listings by township and location on the website, and the AI Concierge can help you discover available properties across different areas.',
    },
    {
        question: 'What can the Rosewood AI Concierge help me with?',
        answer: 'The Rosewood AI Concierge can help you explore available properties, rental and sale pricing, locations, and property details using Rosewood Royale property data.',
    },
    {
        question: 'How do I contact the Rosewood team?',
        answer: 'Visit the Contact page to send a message, or reach the team by phone or email listed in the site footer.',
    },
];

const openFaq = ref(null);

function toggleFaq(index) {
    openFaq.value = openFaq.value === index ? null : index;
}
</script>

<template>
    <div class="rw-services-page">
        <section class="rw-page-hero rw-page-hero--tall">
            <div class="rw-page-hero__media" aria-hidden="true">
                <img
                    src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1800"
                    alt=""
                >
            </div>
            <div class="rw-page-hero__overlay" />
            <div class="container rw-page-hero__content rw-services-hero">
                <p class="rw-kicker">Services</p>
                <h1>Beyond Real Estate</h1>
                <p class="rw-lede">
                    Support that continues beyond finding a property — designed with clarity, discretion, and care.
                </p>

                <div class="rw-services-hero__values" aria-label="Service values">
                    <article
                        v-for="item in heroValues"
                        :key="item.label"
                        class="rw-services-hero__value"
                    >
                        <p class="rw-services-hero__label">{{ item.label }}</p>
                        <p>{{ item.copy }}</p>
                    </article>
                </div>
            </div>
        </section>

        <section class="rw-section reveal">
            <div class="container">
                <div class="rw-section-head rw-section-head--stack">
                    <div>
                        <p class="rw-kicker">Our Services</p>
                        <h2>Comprehensive Support for Every Stage</h2>
                    </div>
                </div>

                <div class="rw-service-grid reveal-stagger">
                    <article
                        v-for="service in services"
                        :key="service.number"
                        class="rw-service-card"
                    >
                        <div class="rw-service-card__top">
                            <p class="rw-service-card__number">{{ service.number }}</p>
                            <span class="rw-service-card__icon" aria-hidden="true">
                                <i :class="`fas ${service.icon}`" />
                            </span>
                        </div>
                        <h3>{{ service.title }}</h3>
                        <p>{{ service.copy }}</p>
                        <div class="rw-service-card__media">
                            <img
                                :src="service.image"
                                :alt="service.title"
                                loading="lazy"
                            >
                        </div>
                        <router-link
                            :to="service.action.to"
                            class="rw-link-arrow"
                        >
                            {{ service.action.label }}
                            <i class="fas fa-arrow-right" />
                        </router-link>
                    </article>
                </div>
            </div>
        </section>

        <section class="rw-section rw-section--alt reveal">
            <div class="container">
                <div class="rw-section-head rw-section-head--stack">
                    <div>
                        <p class="rw-kicker">What We Handle</p>
                        <h2>The Details, Handled</h2>
                    </div>
                </div>

                <div class="rw-handle-grid reveal-stagger">
                    <article
                        v-for="item in handleItems"
                        :key="item.title"
                        class="rw-handle-card"
                    >
                        <span class="rw-handle-card__icon" aria-hidden="true">
                            <i :class="`fas ${item.icon}`" />
                        </span>
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.copy }}</p>
                    </article>
                </div>
            </div>
        </section>

        <section class="rw-section reveal">
            <div class="container">
                <div class="rw-section-head rw-section-head--stack">
                    <div>
                        <p class="rw-kicker">Our Process</p>
                        <h2>How It Works</h2>
                    </div>
                </div>

                <ol class="rw-process">
                    <li
                        v-for="(step, index) in processSteps"
                        :key="step.number"
                        class="rw-process__step"
                    >
                        <div class="rw-process__marker">
                            <span class="rw-process__number">{{ step.number }}</span>
                            <span
                                v-if="index < processSteps.length - 1"
                                class="rw-process__line"
                                aria-hidden="true"
                            />
                        </div>
                        <div class="rw-process__body">
                            <h3>{{ step.title }}</h3>
                            <p>{{ step.copy }}</p>
                        </div>
                    </li>
                </ol>
            </div>
        </section>

        <section class="rw-section rw-section--alt reveal">
            <div class="container">
                <div class="rw-section-head rw-section-head--stack">
                    <div>
                        <p class="rw-kicker">Why Rosewood Royale</p>
                        <h2>A Higher Standard of Service</h2>
                    </div>
                </div>

                <div class="rw-why-grid reveal-stagger">
                    <article
                        v-for="item in whyValues"
                        :key="item.title"
                        class="rw-why-card"
                    >
                        <span class="rw-why-card__icon" aria-hidden="true">
                            <i :class="`fas ${item.icon}`" />
                        </span>
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.copy }}</p>
                    </article>
                </div>
            </div>
        </section>

        <section class="rw-section reveal">
            <div class="container">
                <div class="rw-concierge-panel">
                    <div class="rw-concierge-panel__copy">
                        <p class="rw-kicker">Rosewood Concierge</p>
                        <h2>Property guidance, whenever you need it.</h2>
                        <p>
                            Use the Rosewood AI Concierge to explore available properties, compare rent and sale options,
                            check pricing, and discover locations using live Rosewood property data.
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
                                to="/properties"
                                class="rw-btn rw-btn-ghost"
                            >
                                Explore Properties
                            </router-link>
                        </div>
                    </div>
                    <div
                        class="rw-concierge-panel__mark"
                        aria-hidden="true"
                    >
                        <span class="rw-concierge-panel__orb">
                            <i class="fas fa-wand-magic-sparkles" />
                        </span>
                        <p>Online Property Assistant</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="rw-section rw-section--alt reveal">
            <div class="container rw-faq">
                <div class="rw-section-head rw-section-head--stack">
                    <div>
                        <p class="rw-kicker">FAQ</p>
                        <h2>Common Questions</h2>
                    </div>
                </div>

                <div class="rw-faq__list">
                    <div
                        v-for="(item, index) in faqs"
                        :key="item.question"
                        class="rw-faq__item"
                        :class="{ 'is-open': openFaq === index }"
                    >
                        <button
                            type="button"
                            class="rw-faq__trigger"
                            :aria-expanded="openFaq === index"
                            :aria-controls="`faq-panel-${index}`"
                            :id="`faq-trigger-${index}`"
                            @click="toggleFaq(index)"
                        >
                            <span>{{ item.question }}</span>
                            <i
                                class="fas fa-chevron-down"
                                aria-hidden="true"
                            />
                        </button>
                        <div
                            :id="`faq-panel-${index}`"
                            class="rw-faq__panel"
                            role="region"
                            :aria-labelledby="`faq-trigger-${index}`"
                            :aria-hidden="openFaq !== index"
                        >
                            <div class="rw-faq__answer">
                                <p>{{ item.answer }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <section class="rw-section reveal">
            <div class="container rw-services-cta">
                <div>
                    <h2>Let Us Help You Find What’s Next</h2>
                    <p class="rw-lede">
                        Whether you are renting, buying, managing a property, or relocating, Rosewood Royale can help you
                        explore your options with clarity.
                    </p>
                </div>
                <div class="rw-cta-row rw-services-cta__actions">
                    <router-link
                        to="/contact"
                        class="rw-btn rw-btn-primary"
                    >
                        Contact Us
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
.rw-services-page > .rw-section {
    padding: 6.5rem 0;
}

.rw-services-hero > * {
    animation: rw-services-hero-in 0.75s cubic-bezier(0.22, 1, 0.36, 1) both;
}

.rw-services-hero > *:nth-child(1) { animation-delay: 80ms; }
.rw-services-hero > *:nth-child(2) { animation-delay: 160ms; }
.rw-services-hero > *:nth-child(3) { animation-delay: 240ms; }
.rw-services-hero > *:nth-child(4) { animation-delay: 360ms; }

.rw-services-hero__values {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1rem;
    margin-top: 2rem;
    max-width: 720px;
}

.rw-services-hero__value {
    padding: 0.85rem 0 0;
    border-top: 1px solid rgba(255, 255, 255, 0.14);
}

.rw-services-hero__label {
    margin: 0 0 0.35rem;
    font-family: var(--rw-font-sans, Inter, sans-serif);
    font-size: 0.68rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #f5f2ee;
}

.rw-services-hero__value > p:last-child {
    margin: 0;
    color: #a9adb5;
    font-size: 0.82rem;
    line-height: 1.5;
}

.rw-section-head--stack {
    align-items: start;
    margin-bottom: 1.85rem;
}

.rw-section-head--stack h2 {
    font-size: clamp(2rem, 3.6vw, 2.85rem);
}

.rw-service-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.35rem;
}

.rw-service-card {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    padding: 1.2rem 1.15rem 1.15rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(23, 24, 27, 0.92);
    transition:
        transform 0.35s ease,
        border-color 0.35s ease,
        background 0.35s ease;
}

.rw-service-card:hover {
    transform: translateY(-3px);
    border-color: rgba(143, 35, 56, 0.55);
    background: #202226;
}

.rw-service-card__top {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
}

.rw-service-card__number {
    margin: 0;
    color: #8f2338;
    letter-spacing: 0.16em;
    font-size: 0.7rem;
    font-weight: 500;
}

.rw-service-card__icon {
    width: 34px;
    height: 34px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    border: 1px solid rgba(143, 35, 56, 0.45);
    color: #8f2338;
    font-size: 0.78rem;
    transition: color 0.3s ease, border-color 0.3s ease, background 0.3s ease;
}

.rw-service-card:hover .rw-service-card__icon {
    color: #a92b47;
    border-color: rgba(169, 43, 71, 0.7);
    background: rgba(143, 35, 56, 0.12);
}

.rw-service-card h3 {
    margin: 0.75rem 0 0.6rem;
    font-size: clamp(1.2rem, 1.6vw, 1.45rem);
    font-weight: 500;
}

.rw-service-card > p {
    margin: 0 0 1rem;
    color: #a9adb5;
    font-size: 0.9rem;
    line-height: 1.65;
    flex: 1;
}

.rw-service-card__media {
    overflow: hidden;
    border-radius: 10px;
    height: 118px;
    margin-bottom: 1rem;
    border: 1px solid rgba(255, 255, 255, 0.08);
}

.rw-service-card__media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.7s ease;
}

.rw-service-card:hover .rw-service-card__media img {
    transform: scale(1.035);
}

.rw-handle-grid {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.25rem;
}

.rw-handle-card {
    padding: 1.25rem 1.15rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(18, 18, 20, 0.72);
    transition: border-color 0.3s ease, transform 0.3s ease;
}

.rw-handle-card:hover {
    border-color: rgba(143, 35, 56, 0.45);
    transform: translateY(-2px);
}

.rw-handle-card__icon {
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

.rw-handle-card:hover .rw-handle-card__icon {
    color: #a92b47;
    background: rgba(143, 35, 56, 0.12);
}

.rw-handle-card h3 {
    margin: 0 0 0.5rem;
    font-size: 1.2rem;
    font-weight: 500;
}

.rw-handle-card p {
    margin: 0;
    color: #a9adb5;
    font-size: 0.88rem;
    line-height: 1.65;
}

.rw-process {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 1.5rem;
}

.rw-process__marker {
    display: flex;
    align-items: center;
    gap: 0.85rem;
    margin-bottom: 1rem;
}

.rw-process__number {
    flex: 0 0 auto;
    width: 44px;
    height: 44px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    border: 1px solid rgba(143, 35, 56, 0.55);
    color: #f5f2ee;
    font-size: 0.72rem;
    letter-spacing: 0.08em;
    background: rgba(143, 35, 56, 0.12);
}

.rw-process__line {
    flex: 1;
    height: 1px;
    background: linear-gradient(90deg, rgba(143, 35, 56, 0.55), rgba(255, 255, 255, 0.08));
    transform-origin: left center;
    animation: rw-process-line 0.8s ease both;
}

.rw-process__body h3 {
    margin: 0 0 0.55rem;
    font-size: 1.45rem;
    font-weight: 500;
}

.rw-process__body p {
    margin: 0;
    color: #a9adb5;
    font-size: 0.92rem;
    line-height: 1.65;
    max-width: 32ch;
}

.rw-why-grid {
    display: grid;
    grid-template-columns: repeat(4, minmax(0, 1fr));
    gap: 1.25rem;
}

.rw-why-card {
    padding: 1.25rem 1.1rem;
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: #17181b;
    transition: border-color 0.3s ease, transform 0.3s ease;
}

.rw-why-card:hover {
    border-color: rgba(143, 35, 56, 0.45);
    transform: translateY(-2px);
}

.rw-why-card__icon {
    width: 36px;
    height: 36px;
    display: grid;
    place-items: center;
    margin-bottom: 0.85rem;
    border-radius: 999px;
    border: 1px solid rgba(143, 35, 56, 0.45);
    color: #8f2338;
    font-size: 0.8rem;
}

.rw-why-card h3 {
    margin: 0 0 0.5rem;
    font-size: 1.2rem;
    font-weight: 500;
}

.rw-why-card p {
    margin: 0;
    color: #a9adb5;
    font-size: 0.88rem;
    line-height: 1.65;
}

.rw-concierge-panel {
    display: grid;
    grid-template-columns: 1.4fr 0.7fr;
    gap: 1.75rem;
    align-items: center;
    padding: 1.85rem 1.75rem;
    border-radius: 16px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: rgba(18, 18, 20, 0.92);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.28);
}

.rw-concierge-panel h2 {
    margin: 0 0 0.75rem;
    font-size: clamp(1.85rem, 3vw, 2.45rem);
    font-weight: 500;
}

.rw-concierge-panel__copy > p:not(.rw-kicker) {
    margin: 0;
    color: #a9adb5;
    font-size: 0.95rem;
    line-height: 1.7;
    max-width: 54ch;
}

.rw-concierge-panel__mark {
    display: grid;
    justify-items: center;
    gap: 0.75rem;
    text-align: center;
    padding: 1.25rem;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(32, 34, 38, 0.7);
}

.rw-concierge-panel__orb {
    width: 64px;
    height: 64px;
    display: grid;
    place-items: center;
    border-radius: 999px;
    border: 1px solid rgba(143, 35, 56, 0.5);
    color: #f5f2ee;
    background: linear-gradient(160deg, rgba(143, 35, 56, 0.35), rgba(18, 18, 20, 0.9));
    font-size: 1.15rem;
}

.rw-concierge-panel__mark p {
    margin: 0;
    font-size: 0.72rem;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: #a9adb5;
}

.rw-faq {
    max-width: 820px;
    margin-inline: auto;
}

.rw-faq__list {
    display: grid;
    gap: 0.65rem;
}

.rw-faq__item {
    border-radius: 12px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(18, 18, 20, 0.72);
    overflow: hidden;
    transition: border-color 0.25s ease;
}

.rw-faq__item.is-open {
    border-color: rgba(143, 35, 56, 0.45);
}

.rw-faq__trigger {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 1rem;
    padding: 1rem 1.15rem;
    border: 0;
    background: transparent;
    color: #f5f2ee;
    text-align: left;
    cursor: pointer;
    font-family: var(--rw-font-sans, Inter, sans-serif);
    font-size: 0.95rem;
    font-weight: 500;
}

.rw-faq__trigger i {
    color: #a9adb5;
    font-size: 0.7rem;
    transition: transform 0.22s ease, color 0.22s ease;
}

.rw-faq__item.is-open .rw-faq__trigger i {
    transform: rotate(180deg);
    color: #8f2338;
}

.rw-faq__panel {
    display: grid;
    grid-template-rows: 0fr;
    opacity: 0;
    transition: grid-template-rows 0.22s ease, opacity 0.22s ease;
}

.rw-faq__item.is-open .rw-faq__panel {
    grid-template-rows: 1fr;
    opacity: 1;
}

.rw-faq__answer {
    overflow: hidden;
    min-height: 0;
}

.rw-faq__answer p {
    margin: 0;
    padding: 0 1.15rem 1.05rem;
    color: #a9adb5;
    font-size: 0.9rem;
    line-height: 1.7;
}

.rw-services-cta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 1.35rem;
    padding: 1.85rem 1.75rem;
    border-radius: 14px;
    border: 1px solid rgba(255, 255, 255, 0.12);
    background: #17181b;
}

.rw-services-cta h2 {
    margin: 0;
    font-size: clamp(1.85rem, 3vw, 2.45rem);
    font-weight: 500;
}

.rw-services-cta .rw-lede {
    margin-top: 0.6rem;
    max-width: 52ch;
}

.rw-services-cta__actions {
    margin-top: 0;
}

@keyframes rw-services-hero-in {
    from {
        opacity: 0;
        transform: translateY(18px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

@keyframes rw-process-line {
    from {
        transform: scaleX(0);
        opacity: 0.2;
    }
    to {
        transform: scaleX(1);
        opacity: 1;
    }
}

@media (max-width: 1100px) {
    .rw-service-grid,
    .rw-why-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .rw-handle-grid {
        grid-template-columns: repeat(2, minmax(0, 1fr));
    }

    .rw-concierge-panel {
        grid-template-columns: 1fr;
    }

    .rw-concierge-panel__mark {
        justify-self: start;
        width: min(100%, 280px);
    }
}

@media (max-width: 800px) {
    .rw-process {
        grid-template-columns: 1fr;
        gap: 1.35rem;
    }

    .rw-process__line {
        display: none;
    }

    .rw-services-hero__values {
        grid-template-columns: 1fr;
        gap: 0.75rem;
    }
}

@media (max-width: 640px) {
    .rw-service-grid,
    .rw-handle-grid,
    .rw-why-grid {
        grid-template-columns: 1fr;
    }

    .rw-services-cta__actions {
        width: 100%;
    }

    .rw-services-cta__actions .rw-btn {
        width: 100%;
    }
}

@media (prefers-reduced-motion: reduce) {
    .rw-services-hero > *,
    .rw-process__line,
    .rw-service-card,
    .rw-handle-card,
    .rw-why-card,
    .rw-service-card__media img,
    .rw-faq__panel,
    .rw-faq__trigger i {
        animation: none !important;
        transition: none !important;
        transform: none !important;
    }
}
</style>
