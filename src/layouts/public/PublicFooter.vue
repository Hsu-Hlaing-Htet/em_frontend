<script setup>
import DevelopedByCredit from '@/components/global/DevelopedByCredit.vue';

defineProps({
  currentYear: {
    type: Number,
    required: true,
  },
});
const socials = [
  {
    name: "Instagram",
    icon: "fab fa-instagram",
  },
  {
    name: "X",
    icon: "fab fa-x-twitter",
  },
  {
    name: "Facebook",
    icon: "fab fa-facebook-f",
  },
  {
    name: "YouTube",
    icon: "fab fa-youtube",
  },
];
</script>
<template>
  <footer
    class="relative overflow-hidden
           bg-gradient-to-br
           from-[#2b0615]
           via-[var(--rw-brand)]
           to-[#14030a]
           text-white"
  >
    <!-- Decorative Blur Circles -->
    <div
      class="absolute -top-32 -right-32
             w-[350px] h-auto
             bg-white/5 rounded-full"
    ></div>

    <div
      class="absolute bottom-0 left-0
             w-[250px] 
             bg-[var(--rw-brand-mid)]/20 rounded-full blur-3xl"
    ></div>

    <!-- Overlay -->
    <div class="absolute inset-0 bg-black/20"></div>

    <!-- Content -->
    <div class="relative z-10 container mx-auto px-6 py-10">

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-14">

        <!-- Brand -->
        <div>
          <h2 class="text-3xl font-semibold mb-6">
            Rosewood
            <span class="text-[var(--rw-brand-light)]">Royale</span>
          </h2>

          <p class="text-gray-300 leading-8 mb-8">
            Luxury real estate support for premium homes,
            condos, and commercial spaces.
          </p>

         <div class="space-y-5">

  <!-- Office -->
  <div class="flex items-start gap-4">

      <i class="fas fa-location-dot text-[var(--rw-brand-light)] text-lg"></i>


    <div>
      <h4
        class="uppercase tracking-[2px]
               text-sm text-[var(--rw-brand-light)] mb-1"
      >
        Office
      </h4>

      <p class="text-gray-200">
        No.18, Yankin Township, Yangon
      </p>
    </div>
  </div>

  <!-- Phone -->
  <div class="flex items-start gap-4">

      <i class="fas fa-phone text-[var(--rw-brand-light)] text-lg"></i>
  

    <div>
      <h4
        class="uppercase tracking-[2px]
               text-sm text-[var(--rw-brand-light)] mb-1"
      >
        Phone
      </h4>

      <p class="text-gray-200">
        +95 9 55000001
      </p>
    </div>
  </div>

  <!-- Email -->
  <div class="flex items-start gap-4">

      <i class="fas fa-envelope text-[var(--rw-brand-light)] text-lg"></i>
 

    <div>
      <h4
        class="uppercase tracking-[2px]
               text-sm text-[var(--rw-brand-light)] mb-1"
      >
        Email
      </h4>

      <p class="text-gray-200">
        hello@rosewoodroyale.com
      </p>
    </div>
  </div>

</div>
        </div>

      <!-- Explore -->
<div>
  <h3
    class="text-xl mb-5
           uppercase tracking-[3px]"
  >
    Explore
  </h3>

  <div class="flex flex-col space-y-5">

    <router-link
      to="/"
      class="group flex items-center justify-between
             border-b border-white/10 pb-3
             hover:text-[var(--rw-brand-light)]
             transition-all duration-300
             hover:translate-x-2"
    >
      <span>Browse</span>

      <i
        class="fas fa-arrow-right text-xs
               opacity-0 -translate-x-2
               transition-all duration-300
               group-hover:opacity-100
               group-hover:translate-x-0"
      ></i>
    </router-link>

    <router-link
      to="/properties"
      class="group flex items-center justify-between
             border-b border-white/10 pb-3
             hover:text-[var(--rw-brand-light)]
             transition-all duration-300
             hover:translate-x-2"
    >
      <span>Property for Sale</span>

      <i
        class="fas fa-arrow-right text-xs
               opacity-0 -translate-x-2
               transition-all duration-300
               group-hover:opacity-100
               group-hover:translate-x-0"
      ></i>
    </router-link>

    <router-link
      to="/booking"
      class="group flex items-center justify-between
             border-b border-white/10 pb-3
             hover:text-[var(--rw-brand-light)]
             transition-all duration-300
             hover:translate-x-2"
    >
      <span>Property for Rent</span>

      <i
        class="fas fa-arrow-right text-xs
               opacity-0 -translate-x-2
               transition-all duration-300
               group-hover:opacity-100
               group-hover:translate-x-0"
      ></i>
    </router-link>

    <router-link
      to="/contact"
      class="group flex items-center justify-between
             border-b border-white/10 pb-3
             hover:text-[var(--rw-brand-light)]
             transition-all duration-300
             hover:translate-x-2"
    >
      <span>Commercial</span>

      <i
        class="fas fa-arrow-right text-xs
               opacity-0 -translate-x-2
               transition-all duration-300
               group-hover:opacity-100
               group-hover:translate-x-0"
      ></i>
    </router-link>

    <router-link
      to="/contact"
      class="group flex items-center justify-between
             border-b border-white/10 pb-3
             hover:text-[var(--rw-brand-light)]
             transition-all duration-300
             hover:translate-x-2"
    >
      <span>Contact</span>

      <i
        class="fas fa-arrow-right text-xs
               opacity-0 -translate-x-2
               transition-all duration-300
               group-hover:opacity-100
               group-hover:translate-x-0"
      ></i>
    </router-link>
        <router-link
      to="/aboutus"
      class="group flex items-center justify-between
             border-b border-white/10 pb-3
             hover:text-[var(--rw-brand-light)]
             transition-all duration-300
             hover:translate-x-2"
    >
      <span>About Us</span>

      <i
        class="fas fa-arrow-right text-xs
               opacity-0 -translate-x-2
               transition-all duration-300
               group-hover:opacity-100
               group-hover:translate-x-0"
      ></i>
    </router-link>

  </div>
</div>

<!-- Services -->
<div>
  <h3
    class="text-xl mb-5
           uppercase tracking-[3px]"
  >
    Services
  </h3>

  <div class="flex flex-col space-y-5">

    <router-link
      to="/"
      class="group flex items-center justify-between
             border-b border-white/10 pb-3
             hover:text-[var(--rw-brand-light)]
             transition-all duration-300
             hover:translate-x-2"
    >
      <span>Management Services</span>

      <i
        class="fas fa-arrow-right text-xs
               opacity-0 -translate-x-2
               transition-all duration-300
               group-hover:opacity-100
               group-hover:translate-x-0"
      ></i>
    </router-link>

    <router-link
      to="/booking"
      class="group flex items-center justify-between
             border-b border-white/10 pb-3
             hover:text-[var(--rw-brand-light)]
             transition-all duration-300
             hover:translate-x-2"
    >
      <span>Maintenance Service</span>

      <i
        class="fas fa-arrow-right text-xs
               opacity-0 -translate-x-2
               transition-all duration-300
               group-hover:opacity-100
               group-hover:translate-x-0"
      ></i>
    </router-link>

    <router-link
      to="/contact"
      class="group flex items-center justify-between
             border-b border-white/10 pb-3
             hover:text-[var(--rw-brand-light)]
             transition-all duration-300
             hover:translate-x-2"
    >
      <span>Contact</span>

      <i
        class="fas fa-arrow-right text-xs
               opacity-0 -translate-x-2
               transition-all duration-300
               group-hover:opacity-100
               group-hover:translate-x-0"
      ></i>
    </router-link>

  </div>
</div>

        <!-- Newsletter -->
        <div>
          <h3
            class="text-xl mb-8
                   uppercase tracking-[3px]"
          >
            Newsletter
          </h3>

          <label class="block mb-4 text-sm text-gray-300">
            Email address:
          </label>

          <div class="flex overflow-hidden rounded-lg mb-3">

            <input
              type="email"
              placeholder="Your email address"
              class="w-full px-4 py-2 bg-rw-surface text-rw outline-none"
            />

          </div>


            <button
  class="group relative overflow-hidden
         px-4 py-2 mb-10
         rounded-md
         border-2 border-[var(--rw-brand)]
         uppercase tracking-widest text-sm
         text-[var(--rw-primary-deep)]
         bg-rw-surface
         transition-all duration-300
         hover:text-white
         hover:border-2 hover:border-white
         hover:shadow-lg hover:shadow-[var(--rw-brand)]/40
         active:scale-95 scale-100
             hover:scale-115
             hover:invert-0
             transition-all duration-500 ease-out"
>
  <!-- Background Animation -->
  <span
    class="absolute inset-0
           bg-[var(--rw-brand)]
           scale-x-0
           origin-left
           transition-transform duration-500
           ease-[cubic-bezier(0.68,-0.55,0.265,1.55)]
           group-hover:scale-x-100"
  ></span>

  <!-- Content -->
  <span
    class="relative z-10 flex items-center gap-3"
  >
    <!-- Font Awesome Icon -->
    <i
      class="fas fa-bell
             text-base
             transition-all duration-300
             group-hover:rotate-[20deg]
             group-hover:scale-110"
    ></i>

    Subscribe
  </span>
</button>
          <!-- From Uiverse.io by the_5814 --> 


                 <h3
            class="text-xl mb-4
                   uppercase tracking-[3px]"
          >
            Follow Us
          </h3>

          <!-- Social -->
           <div class="flex items-center gap-5">


    <button
      v-for="social in socials"
      :key="social.name"
      :class="social.hover"
      class="group relative
             w-14 h-14
             rounded-full
             bg-rw-surface
             flex items-center justify-center
             overflow-hidden
             scale-75
             hover:scale-100
             hover:invert-0
             transition-all duration-500 ease-out"
    >
      <!-- Glow Layer -->
      <span
        class="absolute inset-0
               rounded-full
               scale-0
               group-hover:scale-100
               transition-transform duration-500"
      ></span>

      <!-- Icon -->
      <i
        :class="social.icon"
        class="relative z-10
               text-2xl text-rw
               transition-all duration-500
               group-hover:text-[var(--rw-primary-deep)]
               group-hover:rotate-12"
      ></i>
    </button>



  </div>

        </div>
      </div>

 
    </div>
         <!-- Bottom -->
      <div
        class="border-t border-white/10
               mt-10 pt-8 mb-10
               text-center text-gray-400"
      >
        © {{ currentYear }} Rosewood Royale.
        All rights reserved.
        <DevelopedByCredit text-class="mt-2 text-gray-400" />
      </div>
  </footer>
</template>

