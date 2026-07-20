<script setup>
import AuthPageShell from '@/components/global/AuthPageShell.vue';
import { useForgotPassword } from '@/composables/global/useForgotPassword';

const {
    form,
    loading,
    submitted,
    submit,
} = useForgotPassword();
</script>

<template>
    <AuthPageShell
        title="Forgot Password"
        subtitle="Enter your email and we will send you a reset link."
    >
        <form
            v-if="!submitted"
            class="space-y-4"
            @submit.prevent="submit"
        >
            <div>
                <label class="mb-2 block text-sm font-semibold text-[var(--rw-primary-deep)]">
                    Email
                </label>

                <input
                    v-model="form.email"
                    type="email"
                    required
                    class="rw-input-shell w-full rounded-xl px-4 py-3 outline-none"
                    placeholder="you@example.com"
                >
            </div>

            <button
                type="submit"
                class="group relative flex w-full scale-100 items-center justify-center overflow-hidden rounded-md border-2 border-[var(--rw-primary-deep)] bg-rw-surface px-4 py-2 text-[var(--rw-primary-deep)] transition-all duration-300 hover:scale-105 hover:border-white hover:text-white hover:shadow-lg hover:shadow-[var(--rw-brand)]/40 active:scale-95"
            >
                <span
                    class="absolute inset-0 origin-left scale-x-0 bg-[var(--rw-primary-deep)] transition-transform duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] group-hover:scale-x-100"
                />

                <span class="relative z-10 flex items-center gap-3">
                    <i
                        v-if="loading"
                        class="fas fa-spinner fa-spin text-base"
                    />

                    Send reset link
                </span>
            </button>
        </form>

        <div
            v-else
            class="rounded-xl border border-[var(--rw-border)] bg-[color-mix(in_srgb,var(--rw-surface)_88%,var(--rw-accent)_12%)] px-4 py-5 text-center text-sm text-rw-muted"
        >
            <i class="pi pi-envelope mb-3 text-2xl text-[var(--rw-primary-deep)]" />

            <p>
                If an account exists for
                <strong class="text-[var(--rw-primary-deep)]">{{ form.email }}</strong>,
                you will receive a password reset link shortly.
            </p>
        </div>

        <template #footer>
            <router-link
                :to="{ name: 'login' }"
                class="font-semibold text-[var(--rw-primary-deep)] hover:underline"
            >
                Back to login
            </router-link>
        </template>
    </AuthPageShell>
</template>
