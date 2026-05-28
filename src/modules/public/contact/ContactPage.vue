<script setup>

import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

import { reactive, ref } from 'vue';

import contactBanner from '@/assets/images/contact_banner.png';

const sending = ref(false);

const form = reactive({
    name: '',
    email: '',
    phone: '',
    message: '',
});

function submit() {

    console.log(form);
}

</script>

<template>

<section
    class="
        relative
        overflow-hidden
    "
>

    <!-- HERO IMAGE -->

    <div
        class="
            h-[620px]
            bg-cover
            bg-center
            bg-no-repeat
        "
        :style="{
            backgroundImage: `url(${contactBanner})`
        }"
    ></div>

    <!-- CONTACT CARD -->

    <div
        class="
            container
            relative
            z-20
            -mt-40
        "
    >

        <div
            class="
                grid
                overflow-hidden
                bg-white
                shadow-[0_20px_50px_rgba(85,32,50,0.12)]
                lg:grid-cols-2
            "
        >

            <!-- LEFT FORM -->

            <div
                class="
                    p-10
                    animate-fade-left
                "
            >

                <!-- TITLE -->

                <div class="mb-10">

                    <h2
                        class="
                            mb-4
                            text-2xl
                            font-bold
                            uppercase
                            tracking-wide
                            text-[var(--dark-pink)]
                        "
                    >
                        Write To Us
                    </h2>

                    <div
                        class="
                            h-[2px]
                            w-24
                            bg-[var(--dark-pink)]
                        "
                    ></div>

                </div>

                <!-- FORM -->

                <div class="space-y-5">

                    <InputText
                        v-model="form.name"
                        placeholder="Your Name*"
                        class="
                            w-full
                            border
                            border-[#e7d6dc]
                            px-5
                            py-5
                            text-base
                            shadow-none
                        "
                    />

                    <InputText
                        v-model="form.email"
                        placeholder="Your Email*"
                        class="
                            w-full
                            border
                            border-[#e7d6dc]
                            px-5
                            py-5
                            text-base
                            shadow-none
                        "
                    />

                    <InputText
                        v-model="form.phone"
                        placeholder="Your Phone"
                        class="
                            w-full
                            border
                            border-[#e7d6dc]
                            px-5
                            py-5
                            text-base
                            shadow-none
                        "
                    />

                    <Textarea
                        v-model="form.message"
                        rows="7"
                        placeholder="Your Message..."
                        class="
                            w-full
                            border
                            border-[#e7d6dc]
                            px-5
                            py-5
                            text-base
                            shadow-none
                        "
                    />

                    <!-- BUTTON -->


<button
  class="group relative inline-flex
         h-12 active:scale-95
         overflow-hidden rounded-xl
         p-[2px]
         transition-all duration-300
         hover:shadow-xl hover:shadow-[#552032]/20
         focus:outline-none"
>
  <!-- Animated Border -->
  <span
    class="absolute inset-[-1000%]
           animate-[spin_3s_linear_infinite]
           bg-[conic-gradient(from_90deg_at_50%_50%,#552032_0%,#D086DE_50%,#B25A77_100%)]"
  ></span>

  <!-- Button Content -->
  <span
    class="relative inline-flex
           h-full w-full
           items-center justify-center
           gap-3
           rounded-xl
           bg-white
           px-6
           text-sm font-semibold
           uppercase tracking-[2px]
           text-[#552032]
           backdrop-blur-3xl
           transition-all duration-300
           group-hover:bg-[#552032]
           group-hover:text-white"
  >
    Send

    <!-- Font Awesome Icon -->
    <i
      class="fas fa-paper-plane
             transition-all duration-300
             group-hover:translate-x-1
             group-hover:-translate-y-1
             group-hover:rotate-12"
    ></i>
  </span>
</button>



                </div>

            </div>

            <!-- RIGHT SIDE -->

            <div
                class="
                    relative
                    overflow-hidden
                    bg-gradient-to-br
                    from-[#552032]
                    to-[#1b0b12]
                    text-white
                    animate-fade-right
                "
            >

                <!-- DECOR -->

                <div
                    class="
                        absolute
                        -right-20
                        top-0
                        h-72
                        w-72
                        rounded-full
                        bg-white/5
                    "
                ></div>

                <div
                    class="
                        absolute
                        -bottom-28
                        -left-20
                        h-80
                        w-80
                        rounded-full
                        bg-white/5
                    "
                ></div>

                <!-- CONTENT -->

                <div
                    class="
                        relative
                        z-10
                        flex
                        h-full
                        flex-col
                        justify-between
                        p-10
                    "
                >

                    <!-- TOP -->

                    <div>

                        <h2
                            class="
                                mb-6
                                text-2xl
                                font-bold
                                leading-tight
                            "
                        >
                            Visit Our Office
                        </h2>

                        <p
                            class="
                                max-w-md
                                text-base
                                leading-8
                                text-[#f3dfe6]
                            "
                        >
                            Our luxury real estate consultants
                            are ready to assist you with premium
                            property investments, rentals,
                            and ownership opportunities.
                        </p>

                    </div>

                    <!-- CONTACT INFO -->

                    <div class="space-y-6 pt-12">

                        <!-- LOCATION -->

                        <div
                            class="
                                flex
                                items-start
                                gap-5
                                border-b
                                border-white/10
                                pb-6
                            "
                        >

                            <div
                                class="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#6a2a40]
                                    text-sm
                                "
                            >

                                <i class="pi pi-map-marker"></i>

                            </div>

                            <div>

                                <p
                                    class="
                                        mb-2
                                        text-sm
                                        uppercase
                                        tracking-[3px]
                                        text-[#e8ccd5]
                                    "
                                >
                                    Office
                                </p>

                                <p>
                                    No.18, Yankin Township,
                                    Yangon, Myanmar
                            </p>

                            </div>

                        </div>

                        <!-- PHONE -->

                        <div
                            class="
                                flex
                                items-start
                                gap-5
                                border-b
                                border-white/10
                                pb-6
                            "
                        >

                            <div
                                class="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#6a2a40]
                                    text-sm
                                "
                            >

                                <i class="pi pi-phone"></i>

                            </div>

                            <div>

                                <p
                                    class="
                                        mb-2
                                        text-sm
                                        uppercase
                                        tracking-[3px]
                                        text-[#e8ccd5]
                                    "
                                >
                                    Phone
                                </p>

                                <p>
                                    +95 9 55000001
                            </p>

                            </div>

                        </div>

                        <!-- EMAIL -->

                        <div
                            class="
                                flex
                                items-start
                                gap-5
                                border-b
                                border-white/10
                                pb-6
                            "
                        >

                            <div
                                class="
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#6a2a40]
                                    text-sm
                                "
                            >

                                <i class="pi pi-envelope"></i>

                            </div>

                            <div>

                                <p
                                    class="
                                        mb-2
                                        text-sm
                                        uppercase
                                        tracking-[3px]
                                        text-[#e8ccd5]
                                    "
                                >
                                    Email
                                </p>

                                <p>
                                    hello@rosewoodroyale.com
                                </p>

                            </div>

                        </div>

                        <!-- MAP -->

                        <div class="pt-4">

                            <div
                                class="
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-white/10
                                    shadow-2xl
                                "
                            >

                                <iframe
                                    src="https://www.google.com/maps?q=Yankin,Yangon&output=embed"
                                    class="
                                        h-[250px]
                                        w-full
                                    "
                                    loading="lazy"
                                ></iframe>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    </div>

</section>

</template>

<style scoped>

.animate-fade-left {
    animation: fadeLeft 1s ease;
}

.animate-fade-right {
    animation: fadeRight 1s ease;
}

@keyframes fadeLeft {

    from {
        opacity: 0;
        transform: translateX(-40px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

@keyframes fadeRight {

    from {
        opacity: 0;
        transform: translateX(40px);
    }

    to {
        opacity: 1;
        transform: translateX(0);
    }
}

</style>