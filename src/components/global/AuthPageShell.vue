<script setup>
import ThemeToggle from '@/components/global/ThemeToggle.vue';
import DevelopedByCredit from '@/components/global/DevelopedByCredit.vue';

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
    <div class="rw-auth-shell relative flex min-h-screen items-center justify-center px-4">
        <div
            v-if="showThemeToggle"
            class="absolute right-4 top-4"
        >
            <ThemeToggle />
        </div>

        <section class="rw-auth-card w-full max-w-md rounded-md px-7 py-8">
            <div class="text-center">
                <div
                    class="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-rw-surface shadow-[0_14px_35px_rgba(85,32,50,0.26)] ring-1 ring-[var(--rw-border)]"
                >
                    <img
                        src="@/assets/images/logo-dark.jpg"
                        alt="Rosewood Royale"
                        class="h-full w-full object-cover"
                    >
                </div>

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

        <footer class="pointer-events-none absolute inset-x-0 bottom-4 text-center">
            <DevelopedByCredit text-class="text-rw-muted" />
        </footer>
    </div>
</template>
