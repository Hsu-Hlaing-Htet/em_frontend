<script setup>

import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';

import { reactive, ref } from 'vue';

import contactBanner from '@/assets/images/contact_banner.png';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';

const sending = ref(false);
const errors = new Errors();

const form = reactive({
    name: '',
    email: '',
    phone: '',
    message: '',
});

bindErrorClearing(form, errors);

function submit() {
    errors.clear();

    if (!applyValidation(errors, form, [
        { field: 'name', type: 'text' },
        { field: 'email', type: 'email' },
        { field: 'phone', type: 'phone' },
        { field: 'message', type: 'text' },
    ])) {
        return;
    }

    sending.value = true;

    try {
        console.log(form);
    } finally {
        sending.value = false;
    }
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
                bg-rw-surface
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

                    <div>
                        <InputText
                            v-model="form.name"
                            placeholder="Your Name*"
                            class="
                                w-full
                                border
                                border-[var(--rw-input-border)]
                                px-5
                                py-5
                                text-base
                                shadow-none
                            "
                        />
                        <small v-if="errors.has('name')" class="p-error">
                            <div v-for="error in errors.get('name')" :key="error">{{ error }}</div>
                        </small>
                    </div>

                    <div>
                        <InputText
                            v-model="form.email"
                            placeholder="Your Email*"
                            class="
                                w-full
                                border
                                border-[var(--rw-input-border)]
                                px-5
                                py-5
                                text-base
                                shadow-none
                            "
                        />
                        <small v-if="errors.has('email')" class="p-error">
                            <div v-for="error in errors.get('email')" :key="error">{{ error }}</div>
                        </small>
                    </div>

                    <div>
                        <InputText
                            v-model="form.phone"
                            placeholder="Your Phone"
                            class="
                                w-full
                                border
                                border-[var(--rw-input-border)]
                                px-5
                                py-5
                                text-base
                                shadow-none
                            "
                        />
                        <small v-if="errors.has('phone')" class="p-error">
                            <div v-for="error in errors.get('phone')" :key="error">{{ error }}</div>
                        </small>
                    </div>

                    <div>
                        <Textarea
                            v-model="form.message"
                            rows="7"
                            placeholder="Your Message..."
                            class="
                                w-full
                                border
                                border-[var(--rw-input-border)]
                                px-5
                                py-5
                                text-base
                                shadow-none
                            "
                        />
                        <small v-if="errors.has('message')" class="p-error">
                            <div v-for="error in errors.get('message')" :key="error">{{ error }}</div>
                        </small>
                    </div>

                    <!-- BUTTON -->
            <button
  type="button"
  :disabled="sending"
  class="items-center justify-end group relative overflow-hidden
         px-4 py-2 mb-10
         rounded-md
         border-2 border-[var(--rw-brand)]
         text-[var(--rw-primary-deep)]
         bg-rw-surface
         transition-all duration-300
         hover:text-white
         hover:border-2 hover:border-white
         hover:shadow-lg hover:shadow-[var(--rw-brand)]/40
         active:scale-95 scale-100
             hover:scale-105
             hover:invert-0
             transition-all duration-500 ease-out"
  @click="submit"
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
      class="fas fa-paper-plane
             text-base
             transition-all duration-300
             group-hover:rotate-[20deg]
             group-hover:scale-110"
    ></i>

    Send
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
                    from-[var(--rw-brand)]
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
                        bg-rw-surface/5
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
                        bg-rw-surface/5
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
                                text-[var(--rw-brand-light)]
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
                                    bg-[var(--rw-brand-mid)]
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
                                        text-[var(--rw-brand-light)]
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
                                    bg-[var(--rw-brand-mid)]
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
                                        text-[var(--rw-brand-light)]
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
                                    bg-[var(--rw-brand-mid)]
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
                                        text-[var(--rw-brand-light)]
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
