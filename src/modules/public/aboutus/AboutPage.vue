<script setup>
const stats = [
  {
    number: "12+",
    label: "Years Experience",
    icon: "fa-award",
  },
  {
    number: "850+",
    label: "Luxury Properties",
    icon: "fa-building",
  },
  {
    number: "500+",
    label: "Happy Clients",
    icon: "fa-users",
  },
  {
    number: "24/7",
    label: "Client Support",
    icon: "fa-headset",
  },
];

const values = [
  {
    title: "Luxury Experience",
    icon: "fa-gem",
    description:
      "We deliver a premium real estate experience with elegance, trust, and professionalism.",
  },
  {
    title: "Trusted Advisors",
    icon: "fa-handshake",
    description:
      "Our team guides clients with transparent advice and personalized property solutions.",
  },
  {
    title: "Prime Properties",
    icon: "fa-city",
    description:
      "We specialize in luxury homes, premium rentals, and commercial investments.",
  },
];
</script>

<template>
  <main class="bg-white text-gray-900">

    <!-- HERO -->
    <section
      class="relative h-[75vh] overflow-hidden"
    >
      <img
        src="https://images.unsplash.com/photo-1600585154526-990dced4db0d?q=80&w=1800"
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
                 text-[#d6b8c1]
                 text-sm mb-5"
        >
          About Rosewood Royale
        </span>

        <h1
          class="text-5xl md:text-7xl
                 font-bold text-white
                 max-w-4xl leading-tight"
        >
          Redefining Luxury Real Estate
        </h1>

        <p
          class="mt-6 text-lg text-gray-200
                 max-w-2xl leading-8"
        >
          We create exceptional real estate experiences through
          premium properties, trusted expertise, and personalized service.
        </p>
      </div>
    </section>

    <!-- STORY -->
    <section class="py-28">
      <div
        class="container mx-auto px-6
               grid grid-cols-1 lg:grid-cols-2
               gap-20 items-center"
      >

        <!-- Content -->
        <div>

          <span
            class="uppercase tracking-[5px]
                   text-[#552032]
                   text-sm"
          >
            Our Story
          </span>

          <h2
            class="text-5xl font-bold
                   mt-5 leading-tight"
          >
            Luxury Living With
            <span class="text-[#552032]">
              Timeless Elegance
            </span>
          </h2>

          <p
            class="mt-8 text-gray-600
                   leading-9 text-lg"
          >
            Rosewood Royale was founded with a vision to provide
            premium real estate experiences tailored to modern lifestyles.
            From elegant residences to commercial investments,
            we focus on excellence, trust, and long-term client relationships.
          </p>

          <p
            class="mt-6 text-gray-600
                   leading-9 text-lg"
          >
            Our curated portfolio and personalized services help clients
            discover properties that truly match their ambitions and lifestyle.
          </p>

          <button
            class="mt-10 px-8 py-4
                   rounded-xl
                   bg-[#552032]
                   text-white
                   hover:bg-[#6d2a43]
                   transition-all duration-300"
          >
            Explore Properties
          </button>
        </div>

        <!-- Image -->
        <div class="relative">

          <img
            src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1400"
            class="rounded-3xl shadow-2xl"
          />

          <div
            class="absolute -bottom-10 -left-10
                   bg-white
                   rounded-2xl
                   shadow-xl
                   p-8"
          >
            <h3
              class="text-4xl font-bold
                     text-[#552032]"
            >
              12+
            </h3>

            <p class="text-gray-600 mt-2">
              Years of Luxury Excellence
            </p>
          </div>
        </div>

      </div>
    </section>

    <!-- STATS -->
    <section
      class="py-24 bg-[#faf7f8]"
    >
      <div class="container mx-auto px-6">

        <div
          class="grid grid-cols-1
                 md:grid-cols-2
                 lg:grid-cols-4
                 gap-8"
        >

          <div
            v-for="item in stats"
            :key="item.label"
            class="bg-white
                   rounded-3xl
                   p-10 text-center
                   hover:-translate-y-2
                   transition-all duration-300"
          >
            <div
              class="w-16 h-16 mx-auto mb-6
                     rounded-full
                     bg-[#552032]
                     text-white
                     flex items-center justify-center"
            >
              <i :class="`fas ${item.icon}`"></i>
            </div>

            <h3
              class="text-5xl font-bold
                     text-[#552032]"
            >
              {{ item.number }}
            </h3>

            <p
              class="mt-4 text-gray-600"
            >
              {{ item.label }}
            </p>
          </div>

        </div>
      </div>
    </section>

    <!-- VALUES -->
    <section class="py-28">
      <div class="container mx-auto px-6">

        <div class="text-center mb-20">

          <span
            class="uppercase tracking-[5px]
                   text-[#552032]
                   text-sm"
          >
            Our Values
          </span>

          <h2
            class="text-5xl font-bold mt-5"
          >
            What Makes Us Different
          </h2>
        </div>

        <div
          class="grid grid-cols-1
                 md:grid-cols-3
                 gap-10"
        >

          <article
            v-for="value in values"
            :key="value.title"
            class="group bg-white
                   rounded-3xl
                   p-10
                   border border-gray-100
                   hover:border-[#552032]/20
                   hover:shadow-2xl
                   transition-all duration-500"
          >
            <div
              class="w-16 h-16
                     rounded-full
                     bg-[#552032]
                     text-white
                     flex items-center justify-center
                     text-xl"
            >
              <i :class="`fas ${value.icon}`"></i>
            </div>

            <h3
              class="text-3xl font-bold
                     mt-8"
            >
              {{ value.title }}
            </h3>

            <p
              class="mt-6 text-gray-600
                     leading-8"
            >
              {{ value.description }}
            </p>

            <button
              class="group/btn mt-8
                     flex items-center gap-3
                     text-[#552032]
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
          </article>

        </div>
      </div>
    </section>

    <!-- TEAM SECTION -->
    <section
      class="py-28 bg-[#faf7f8]"
    >
      <div class="container mx-auto px-6">

        <div
          class="grid grid-cols-1 lg:grid-cols-2
                 gap-20 items-center"
        >

          <!-- Image -->
          <div>
            <img
              src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1400"
              class="rounded-3xl shadow-2xl"
            />
          </div>

          <!-- Content -->
          <div>

            <span
              class="uppercase tracking-[5px]
                     text-[#552032]
                     text-sm"
            >
              Our Team
            </span>

            <h2
              class="text-5xl font-bold
                     mt-5 leading-tight"
            >
              Experts Dedicated To
              Your Success
            </h2>

            <p
              class="mt-8 text-gray-600
                     leading-9 text-lg"
            >
              Our experienced consultants combine local market knowledge,
              luxury property expertise, and personalized support to
              deliver exceptional client experiences.
            </p>

            <p
              class="mt-6 text-gray-600
                     leading-9 text-lg"
            >
              Whether you are buying, renting, or investing,
              we are committed to helping you make confident decisions.
            </p>

            <button
              class="mt-10 px-8 py-4
                     rounded-xl
                     border border-[#552032]
                     text-[#552032]
                     hover:bg-[#552032]
                     hover:text-white
                     transition-all duration-300"
            >
              Meet Our Team
            </button>

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
        class="absolute inset-0 bg-[#552032]/85"
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
          Let’s Build Your Future Together
        </h2>

        <p
          class="mt-6 text-lg text-gray-200
                 max-w-2xl mx-auto"
        >
          Discover luxury real estate opportunities with a trusted
          partner committed to excellence and elegance.
        </p>

        <button
          class="mt-10 px-10 py-4
                 rounded-xl
                 bg-white
                 text-[#552032]
                 font-semibold
                 hover:bg-[#d6b8c1]
                 transition-all duration-300"
        >
          Contact Us
        </button>
      </div>
    </section>

  </main>
</template>