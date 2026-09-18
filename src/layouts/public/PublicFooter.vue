<script setup>
import DeveloperCredit from '@/components/global/DeveloperCredit.vue';
import { PUBLIC_CONTACT, PUBLIC_SOCIAL_LINKS } from '@/config/publicSite';

defineProps({
    currentYear: {
        type: Number,
        required: true,
    },
});

const explore = [
    { label: 'Home', to: '/' },
    { label: 'Properties', to: '/properties' },
    { label: 'Services', to: '/services' },
    { label: 'About', to: '/about' },
    { label: 'Contact', to: '/contact' },
];

const properties = [
    { label: 'All Properties', to: '/properties' },
    { label: 'For Rent', to: '/rent' },
    { label: 'For Sale', to: '/buy' },
];

const contact = [
    { label: PUBLIC_CONTACT.phoneDisplay, href: PUBLIC_CONTACT.phoneHref },
    { label: PUBLIC_CONTACT.email, href: PUBLIC_CONTACT.emailHref },
    { label: 'Yangon, Myanmar', href: null },
];

const follow = PUBLIC_SOCIAL_LINKS;

const legal = [
    { label: 'Privacy', to: '/privacy' },
    { label: 'Terms & Conditions', to: '/terms' },
];
</script>

<template>
    <footer
        class="rw-footer"
        data-public-footer
    >
        <div class="container rw-footer__grid">
            <div class="rw-footer__brand-col">
                <h2 class="rw-footer__brand">Rosewood Royale</h2>
                <p class="rw-footer__tagline">Spaces for a Brighter Tomorrow</p>
                <p class="rw-footer__blurb">Luxury residences, curated with care.</p>
            </div>

            <div>
                <h3 class="rw-footer__heading">Explore</h3>
                <ul class="rw-footer__list">
                    <li
                        v-for="item in explore"
                        :key="item.label"
                    >
                        <router-link :to="item.to">{{ item.label }}</router-link>
                    </li>
                </ul>
            </div>

            <div>
                <h3 class="rw-footer__heading">Properties</h3>
                <ul class="rw-footer__list">
                    <li
                        v-for="item in properties"
                        :key="item.label"
                    >
                        <router-link :to="item.to">{{ item.label }}</router-link>
                    </li>
                </ul>
            </div>

            <div>
                <h3 class="rw-footer__heading">Contact</h3>
                <ul class="rw-footer__list">
                    <li
                        v-for="item in contact"
                        :key="item.label"
                    >
                        <a
                            v-if="item.href"
                            :href="item.href"
                        >{{ item.label }}</a>
                        <span v-else>{{ item.label }}</span>
                    </li>
                </ul>

                <template v-if="follow.length">
                    <h3 class="rw-footer__heading rw-footer__heading--follow">Follow</h3>
                    <ul class="rw-footer__list rw-footer__follow">
                        <li
                            v-for="item in follow"
                            :key="item.label"
                        >
                            <a
                                :href="item.href"
                                target="_blank"
                                rel="noopener noreferrer"
                            >{{ item.label }}</a>
                        </li>
                    </ul>
                </template>
            </div>
        </div>

        <div class="container rw-footer__bottom">
            <div class="rw-footer__bottom-left">
                <p>© {{ currentYear }} Rosewood Royale. All rights reserved.</p>
                <nav
                    class="rw-footer__legal"
                    aria-label="Legal"
                >
                    <router-link
                        v-for="item in legal"
                        :key="item.to"
                        :to="item.to"
                    >
                        {{ item.label }}
                    </router-link>
                </nav>
            </div>
            <DeveloperCredit variant="dark" />
        </div>
    </footer>
</template>

<style scoped>
.rw-footer {
    margin-top: 1.5rem;
    padding: 3rem 0 1.15rem;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    background: #0a0a0b;
}

.rw-footer__grid {
    display: grid;
    grid-template-columns: 1.4fr repeat(3, 1fr);
    gap: 2rem 1.75rem;
    padding-bottom: 2rem;
}

.rw-footer__brand {
    margin: 0;
    font-family: var(--rw-font-serif, 'Cormorant Garamond', serif);
    font-size: 1.7rem;
    font-weight: 500;
    color: #f5f2ee;
}

.rw-footer__tagline {
    margin: 0.45rem 0 0;
    color: #a9adb5;
    font-size: 0.88rem;
}

.rw-footer__blurb {
    margin: 0.75rem 0 0;
    max-width: 16rem;
    color: #777b82;
    font-size: 0.84rem;
    line-height: 1.6;
}

.rw-footer__heading {
    margin: 0 0 0.9rem;
    font-family: var(--rw-font-sans, Inter, sans-serif);
    font-size: 0.65rem;
    font-weight: 500;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: #f5f2ee;
}

.rw-footer__heading--follow {
    margin-top: 1.35rem;
}

.rw-footer__list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: grid;
    gap: 0.55rem;
}

.rw-footer__list a,
.rw-footer__list span {
    color: #a9adb5;
    font-size: 0.86rem;
    transition: color 0.25s ease;
}

.rw-footer__list a:hover,
.rw-footer__list a:focus-visible {
    color: #f5f2ee;
}

.rw-footer__follow {
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem 1rem;
}

.rw-footer__bottom {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: 0.85rem 1.5rem;
    padding-top: 1.1rem;
    padding-bottom: 0.35rem;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    color: #777b82;
    font-size: 0.78rem;
}

.rw-footer__bottom-left {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem 1.25rem;
}

.rw-footer__bottom-left p {
    margin: 0;
}

.rw-footer__legal {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem 1.1rem;
}

.rw-footer__legal a {
    color: #a9adb5;
    transition: color 0.25s ease;
}

.rw-footer__legal a:hover,
.rw-footer__legal a:focus-visible,
.rw-footer__legal a.router-link-active {
    color: #f5f2ee;
}

@media (max-width: 960px) {
    .rw-footer__grid {
        grid-template-columns: 1fr 1fr;
    }
}

@media (max-width: 640px) {
    .rw-footer__grid {
        grid-template-columns: 1fr;
        gap: 1.75rem;
    }

    .rw-footer__bottom {
        flex-direction: column;
        align-items: flex-start;
    }
}
</style>
