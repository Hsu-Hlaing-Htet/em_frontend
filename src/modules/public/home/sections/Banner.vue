<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();
</script>

<template>
    <section class="banner">
        <div class="banner-overlay">
            <div class="container banner-content">
                <p class="banner-kicker">
                    Luxury Real Estate · Rosewood Royale
                </p>

                <h1>
                    Find Your Next Home,
                    Office, or Investment Space.
                </h1>

                <p>
                    Elegant residential and commercial listings
                    with trusted support across buying,
                    renting, and estate management.
                </p>

                <div class="banner-actions">

                    <!-- From Uiverse.io by ahmrafi22 --> 
                <button
                class="cursor-pointer group relative bg-white hover:bg-zinc-300 text-[var(--dark-pink)] text-sm px-2 py-2 rounded-l-xl rounded-t-xl bg-[#552032]
                                border border-[#552032]
                                hover:shadow-lg hover:-translate-y-1
                                focus:text-[#552032] focus:bg-gray-200
                                transition-all duration-200 ease-in-out shadow hover:shadow-lg w-40 h-12"
                >
                <div class="relative flex items-center justify-center gap-2">
                    <span class="relative inline-block overflow-hidden">
                    <span
                        class="block transition-transform duration-300 group-hover:-translate-y-full"
                    >
                        Browse Properties
                    </span>
                    <span
                        class="absolute inset-0 transition-transform duration-300 translate-y-full group-hover:translate-y-0"
                    >
                        Right Now
                    </span>
                    </span>

                    <svg
                    class="w-4 h-4 transition-transform duration-200 group-hover:rotate-45"
                    viewBox="0 0 24 24"
                    >
                    <circle fill="currentColor" r="11" cy="12" cx="12"></circle>
                    <path
                        stroke-linejoin="round"
                        stroke-linecap="round"
                        stroke-width="2"
                        stroke="white"
                        d="M7.5 16.5L16.5 7.5M16.5 7.5H10.5M16.5 7.5V13.5"
                    ></path>
                    </svg>
                </div>
                </button>



                </div>
            </div>
        </div>
    </section>
</template>

<style>

/* start banner section  */
.banner {
    min-height: 650px;
    background-image: url('https://images.unsplash.com/photo-1600585154084-4e5fe7c39198');
    background-size: cover;
    background-position: center;
}

.banner-overlay {
    min-height: 650px;
    background: linear-gradient(110deg, rgba(49, 12, 21, 0.82) 10%, rgba(70, 18, 32, 0.38) 68%);
    display: flex;
    align-items: center;
}

.banner-content {
    color: #ffffff;
    max-width: 760px;
    animation: fadeUp 0.9s ease both;
}

.banner-kicker {
    letter-spacing: 0.12em;
    text-transform: uppercase;
    font-size: 0.8rem;
    margin: 0 0 0.8rem;
    color: #fdedee;
}

.banner-content h1 {
    font-size: clamp(2rem, 5vw, 4.3rem);
    line-height: 1.02;
    margin: 0;
}

.banner-content p {
    font-size: 1.05rem;
    max-width: 650px;
    margin: 1rem 0 0;
    color: #f9f9f9;
}

.banner-actions {
    margin-top: 1.5rem;
    display: flex;
    flex-wrap: wrap;
    gap: 0.65rem;
}

/* end banner section  */
</style>