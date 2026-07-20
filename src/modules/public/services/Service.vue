<script setup>
const services = [
  {
    title: "Property Management",
    icon: "fa-building",
    image:
      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1400",
    description:
      "Professional management solutions for luxury residential and commercial properties.",
  },
  {
    title: "Rental Services",
    icon: "fa-key",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?q=80&w=1400",
    description:
      "Helping clients find premium rental homes with a smooth leasing experience.",
  },
  {
    title: "Commercial Leasing",
    icon: "fa-city",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=1400",
    description:
      "Luxury office spaces and commercial properties tailored for businesses.",
  },
  {
    title: "Concierge Services",
    icon: "fa-bell-concierge",
    image:
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1400",
    description:
      "Personalized lifestyle and relocation support for our valued clients.",
  },
];
</script>

<template>
  <main class="rw-page">

    <!-- HERO -->
    <section
      class="relative h-[70vh] overflow-hidden"
    >
      <img
        src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1800"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <div
        class="absolute inset-0 bg-black/60"
      ></div>

      <div
        class="relative z-10 h-full
               container mx-auto px-6
               flex flex-col justify-center"
      >
        <span
          class="uppercase tracking-[6px]
                 text-[var(--rw-brand-light)]
                 text-sm mb-5"
        >
          Luxury Real Estate
        </span>

        <h1
          class="text-5xl md:text-7xl
                 font-bold text-white
                 max-w-3xl leading-tight"
        >
          Premium Property Services
        </h1>

        <p
          class="mt-6 text-lg text-white/80
                 max-w-2xl leading-8"
        >
          Elegant real estate solutions tailored for luxury homes,
          commercial investments, and premium client experiences.
        </p>

        <div class="mt-10">
          <button
            class="px-8 py-4
                   bg-[var(--rw-brand)]
                   text-white
                   rounded-xl
                   hover:brightness-110
                   transition-all duration-300"
          >
            Explore Services
          </button>
        </div>
      </div>
    </section>

    <!-- SERVICES -->
    <section class="py-28">
      <div class="container mx-auto px-6">

        <div class="text-center mb-20">
          <span
            class="uppercase tracking-[5px]
                   text-[var(--rw-primary-deep)]
                   text-sm"
          >
            What We Offer
          </span>

          <h2
            class="text-4xl font-bold mt-4"
          >
            Our Luxury Services
          </h2>
        </div>

        <div
          class="grid grid-cols-1
                 md:grid-cols-2
                 gap-10"
        >

          <article
            v-for="service in services"
            :key="service.title"
            class="group overflow-hidden
                   rounded-3xl bg-rw-surface
                   shadow-sm hover:shadow-2xl
                   transition-all duration-500"
          >
            <!-- Image -->
            <div class="relative overflow-hidden h-[320px]">

              <img
                :src="service.image"
                :alt="service.title"
                class="w-full h-full object-cover
                       transition-all duration-700
                       group-hover:scale-110"
              />

              <div
                class="absolute inset-0
                       bg-gradient-to-t
                       from-black/70 to-transparent"
              ></div>

              <!-- Icon -->
              <div
                class="absolute top-6 left-6
                       w-14 h-14 rounded-full
                       bg-rw-surface/20 backdrop-blur-md
                       flex items-center justify-center
                       text-white text-xl"
              >
                <i :class="`fas ${service.icon}`"></i>
              </div>

              <!-- Title -->
              <div
                class="absolute bottom-8 left-8"
              >
                <h3
                  class="text-3xl font-bold
                         text-white"
                >
                  {{ service.title }}
                </h3>
              </div>
            </div>

            <!-- Content -->
            <div class="p-8">

              <p
                class="text-rw-muted
                       leading-8"
              >
                {{ service.description }}
              </p>

              <button
                class="group/btn mt-8
                       flex items-center gap-3
                       text-[var(--rw-primary-deep)]
                       font-semibold
                       uppercase tracking-[2px]"
              >
                Learn More

                <i
                  class="fas fa-arrow-right
                         transition-all duration-300
                         group-hover/btn:translate-x-2"
                ></i>
              </button>
            </div>
          </article>

        </div>
      </div>
    </section>

    <!-- WHY CHOOSE US -->
    <section
      class="py-24 bg-rw-section-alt"
    >
      <div class="container mx-auto px-6">

        <div class="text-center mb-16">
          <span
            class="uppercase tracking-[5px]
                   text-[var(--rw-primary-deep)]
                   text-sm"
          >
            Excellence
          </span>

          <h2
            class="text-4xl font-bold mt-4"
          >
            Why Choose Rosewood Royale
          </h2>
        </div>

        <div
          class="grid grid-cols-1
                 md:grid-cols-3
                 gap-8"
        >

          <div
            class="bg-rw-surface rounded-2xl
                   p-10 text-center
                   hover:-translate-y-2
                   transition-all duration-300"
          >
            <div
              class="w-16 h-16 mx-auto mb-6
                     rounded-full
                     bg-[var(--rw-brand)]
                     text-white
                     flex items-center justify-center"
            >
              <i class="fas fa-award text-xl"></i>
            </div>

            <h3 class="text-2xl font-bold mb-4">
              Trusted Expertise
            </h3>

            <p class="text-rw-muted leading-7">
              Years of luxury real estate experience with premium service.
            </p>
          </div>

          <div
            class="bg-rw-surface rounded-2xl
                   p-10 text-center
                   hover:-translate-y-2
                   transition-all duration-300"
          >
            <div
              class="w-16 h-16 mx-auto mb-6
                     rounded-full
                     bg-[var(--rw-brand)]
                     text-white
                     flex items-center justify-center"
            >
              <i class="fas fa-house text-xl"></i>
            </div>

            <h3 class="text-2xl font-bold mb-4">
              Premium Properties
            </h3>

            <p class="text-rw-muted leading-7">
              Exclusive homes and commercial spaces across prime locations.
            </p>
          </div>

          <div
            class="bg-rw-surface rounded-2xl
                   p-10 text-center
                   hover:-translate-y-2
                   transition-all duration-300"
          >
            <div
              class="w-16 h-16 mx-auto mb-6
                     rounded-full
                     bg-[var(--rw-brand)]
                     text-white
                     flex items-center justify-center"
            >
              <i class="fas fa-headset text-xl"></i>
            </div>

            <h3 class="text-2xl font-bold mb-4">
              Dedicated Support
            </h3>

            <p class="text-rw-muted leading-7">
              Personalized assistance throughout your real estate journey.
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- CTA -->
    <section
      class="relative py-28 overflow-hidden"
    >
      <img
        src="https://images.unsplash.com/photo-1494526585095-c41746248156?q=80&w=1800"
        class="absolute inset-0 w-full h-full object-cover"
      />

      <div
        class="absolute inset-0 bg-[var(--rw-brand)]/80"
      ></div>

      <div
        class="relative z-10
               container mx-auto px-6
               text-center"
      >
        <h2
          class="text-5xl font-bold
                 text-white"
        >
          Let’s Find Your Perfect Property
        </h2>

        <p
          class="mt-6 text-lg text-white/80
                 max-w-2xl mx-auto"
        >
          Discover luxury living and premium investment opportunities
          with Rosewood Royale.
        </p>

        <button
          class="mt-10 px-10 py-4
                 rounded-xl
                 bg-rw-surface
                 text-[var(--rw-primary-deep)]
                 font-semibold
                 hover:bg-[var(--rw-brand-light)]
                 transition-all duration-300"
        >
          Contact Us
        </button>
      </div>
    </section>

  </main>
</template>