<script setup>
import ThemeToggle from '@/components/global/ThemeToggle.vue';
import GlobalFooter from '@/components/global/GlobalFooter.vue';
import RosewoodBrand from '@/components/global/RosewoodBrand.vue';

defineProps({
    title: {
        type: String,
        required: true,
    },
    subtitle: {
        type: String,
        default: '',
    },
    showThemeToggle: {
        type: Boolean,
        default: true,
    },
});
</script>

<template>
    <div class="rw-auth-shell relative flex min-h-screen flex-col items-center justify-center px-4 pb-24 pt-8">
        <div
            v-if="showThemeToggle"
            class="absolute right-4 top-4"
        >
            <ThemeToggle />
        </div>

        <section class="rw-auth-card w-full max-w-md rounded-md px-7 py-8">
            <div class="text-center">
                <RosewoodBrand
                    variant="on-light"
                    size="lg"
                    stacked
                    class="mx-auto"
                />

                <h2 class="mt-5 text-2xl font-semibold tracking-tight text-[var(--rw-primary-deep)]">
                    {{ title }}
                </h2>

                <p
                    v-if="subtitle"
                    class="mt-2 text-sm text-rw-muted"
                >
                    {{ subtitle }}
                </p>
            </div>

            <div class="mt-7">
                <slot />
            </div>

            <div
                v-if="$slots.footer"
                class="mt-6 text-center text-sm"
            >
                <slot name="footer" />
            </div>
        </section>

        <div class="pointer-events-auto absolute inset-x-0 bottom-0">
            <GlobalFooter variant="portal" />
        </div>
    </div>
</template>
