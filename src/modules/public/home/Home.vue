<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

import Banner from './sections/Banner.vue';
import SearchBox from './sections/SearchBox.vue';
import SaleListing from './sections/SaleListing.vue';
import RentListing from './sections/RentListing.vue';
import StatsSection from './sections/StatsSection.vue';
import TestimonialsSection from './sections/TestimonialsSection.vue';

import ProgressSpinner from 'primevue/progressspinner';
import { useLanding } from '@/composables/public/useLanding';

const {
    loading,
    stats,
    serviceTiles,
    latestCommercialSpace,
} = useLanding();

const showScrollButton = ref(false);

const scrollToTop = () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth',
    });
};

const handleScroll = () => {
    showScrollButton.value = window.scrollY > 300;
};

onMounted(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
});

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll);
});
</script>

<template>
    <Banner />
    <SearchBox />
    <StatsSection :stats="stats" />
    <SaleListing />
    <RentListing />
    <TestimonialsSection />

    <!-- Services -->
    <section
        id="services"
        class="section reveal reveal-stagger"
    >
        <div class="container">
            <h2>Property Services</h2>

            <div class="layout-columns mt-4">
                <article
                    v-for="service in serviceTiles"
                    :key="service.title"
                    class="col-4 service-tile"
                >
                    <img
                        :src="service.image"
                        :alt="service.title"
                        loading="lazy"
                    >

                    <div class="service-overlay">
                        <h3>{{ service.title }}</h3>
                    </div>
                </article>
            </div>
        </div>
    </section>

    <!-- Commercial -->
    <section
        id="commercial-space"
        class="section reveal reveal-stagger"
    >
        <div class="container">
            <h2>Latest Commercial Space</h2>

            <div class="layout-columns mt-4">
                <article
                    v-for="item in latestCommercialSpace"
                    :key="item.title"
                    class="col-4 mini-listing-card"
                >
                    <img
                        :src="item.image"
                        :alt="item.title"
                        loading="lazy"
                    >

                    <div class="mini-listing-content">
                        <h3>{{ item.title }}</h3>
                        <p>{{ item.location }}</p>
                        <strong>{{ item.price }}</strong>
                    </div>
                </article>
            </div>
        </div>
    </section>

    <!-- Loading -->
    <div
        v-if="loading"
        class="loading-overlay"
    >
        <ProgressSpinner />
    </div>

    <!-- Scroll To Top -->
    <Transition
        enter-active-class="transition-all duration-500"
        enter-from-class="opacity-0 translate-x-10"
        enter-to-class="opacity-100 translate-x-0"
        leave-active-class="transition-all duration-300"
        leave-from-class="opacity-100 translate-x-0"
        leave-to-class="opacity-0 translate-x-10"
    >
        <button
            v-if="showScrollButton"
            class="group/button fixed
             right-6
             bottom-10
             -translate-y-1/2
             z-[9999]

             cursor-pointer
             w-14 h-14
             rounded-full
             border-2 border-[var(--rw-brand)]
             bg-rw-surface

             flex items-center justify-center
             overflow-hidden

             shadow-lg

             transition-all duration-300
             hover:w-44
             hover:rounded-full
             active:scale-90"
            aria-label="Scroll to top"
            @click="scrollToTop"
        >
            <span
                class="absolute
               text-[var(--rw-primary-deep)]
               text-sm font-medium
               uppercase tracking-wider

               scale-0
               transition-all duration-300
               group-hover/button:scale-100"
            >
                Scroll To Top
            </span>

            <i
                class="fas fa-arrow-up
               text-[var(--rw-primary-deep)]
               text-lg

               transition-all duration-300
               group-hover/button:-translate-y-12"
            />
        </button>
    </Transition>
</template>
