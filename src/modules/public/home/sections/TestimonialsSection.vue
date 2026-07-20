<script setup>
import Carousel from 'primevue/carousel';

const testimonials = [
    {
        id: 1,
        name: 'Daw Khin Khin',
        role: 'Property Owner',
        quote: 'Rosewood Royale made leasing effortless. Their team handled every detail with professionalism and warmth.',
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=200&q=80',
        rating: 5,
    },
    {
        id: 2,
        name: 'U Aung Myint',
        role: 'Commercial Tenant',
        quote: 'From viewing to contract signing, the experience felt premium. I found the perfect office space within a week.',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        rating: 5,
    },
    {
        id: 3,
        name: 'Ma Phyu Phyu',
        role: 'First-time Buyer',
        quote: 'Transparent pricing, beautiful listings, and responsive support. Rosewood is now my go-to for property needs.',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        rating: 5,
    },
    {
        id: 4,
        name: 'Ko Min Thu',
        role: 'Investor',
        quote: 'Their portfolio insights and market guidance helped me secure a high-yield investment with confidence.',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
        rating: 5,
    },
];

const responsiveOptions = [
    { breakpoint: '1024px', numVisible: 2, numScroll: 1 },
    { breakpoint: '768px', numVisible: 1, numScroll: 1 },
];
</script>

<template>
    <section class="section reveal landing-testimonials">
        <div class="container">
            <div class="section-heading-row">
                <h2>Client Testimonials</h2>
            </div>

            <Carousel
                :value="testimonials"
                :num-visible="3"
                :num-scroll="1"
                :responsive-options="responsiveOptions"
                :autoplay-interval="5000"
                circular
                class="testimonials-carousel"
            >
                <template #item="{ data }">
                    <article class="testimonial-card px-3 py-4">
                        <div class="testimonial-stars">
                            <i
                                v-for="star in data.rating"
                                :key="`${data.id}-${star}`"
                                class="fas fa-star"
                            />
                        </div>

                        <p class="testimonial-quote">
                            “{{ data.quote }}”
                        </p>

                        <div class="testimonial-author">
                            <img
                                :src="data.avatar"
                                :alt="data.name"
                                class="testimonial-avatar"
                            >
                            <div>
                                <strong>{{ data.name }}</strong>
                                <span>{{ data.role }}</span>
                            </div>
                        </div>
                    </article>
                </template>
            </Carousel>
        </div>
    </section>
</template>
