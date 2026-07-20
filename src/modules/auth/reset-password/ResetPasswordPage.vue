<script setup>
import AuthPageShell from '@/components/global/AuthPageShell.vue';
import { useResetPassword } from '@/composables/global/useResetPassword';

const {
    form,
    loading,
    showPassword,
    showConfirmPassword,
    invalidLink,
    canSubmit,
    submit,
} = useResetPassword();
</script>

<template>
    <AuthPageShell
        title="Reset Password"
        subtitle="Choose a new password for your account."
    >
        <div
            v-if="invalidLink"
            class="rounded-xl border border-[var(--rw-border)] bg-[color-mix(in_srgb,var(--rw-surface)_88%,var(--rw-accent)_12%)] px-4 py-5 text-center text-sm text-rw-muted"
        >
            <i class="pi pi-exclamation-triangle mb-3 text-2xl text-[var(--rw-primary-deep)]" />

            <p>
                This reset link is invalid or incomplete. Request a new link from the forgot password page.
            </p>

            <router-link
                :to="{ name: 'forgot-password' }"
                class="mt-4 inline-flex font-semibold text-[var(--rw-primary-deep)] hover:underline"
            >
                Request new link
            </router-link>
        </div>

        <form
            v-else
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
                    readonly
                    class="rw-input-shell w-full rounded-xl px-4 py-3 outline-none opacity-80"
                >
            </div>

            <div>
                <label class="mb-2 block text-sm font-semibold text-[var(--rw-primary-deep)]">
                    New password
                </label>

                <div class="rw-input-shell flex items-center rounded-xl px-4 py-3">
                    <input
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        required
                        minlength="8"
                        class="flex-1 bg-transparent outline-none"
                        placeholder="Enter a new password"
                    >

                    <button
                        type="button"
                        class="text-rw-muted"
                        @click="showPassword = !showPassword"
                    >
                        <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" />
                    </button>
                </div>
            </div>

            <div>
                <label class="mb-2 block text-sm font-semibold text-[var(--rw-primary-deep)]">
                    Confirm password
                </label>

                <div class="rw-input-shell flex items-center rounded-xl px-4 py-3">
                    <input
                        v-model="form.password_confirmation"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        required
                        minlength="8"
                        class="flex-1 bg-transparent outline-none"
                        placeholder="Confirm your new password"
                    >

                    <button
                        type="button"
                        class="text-rw-muted"
                        @click="showConfirmPassword = !showConfirmPassword"
                    >
                        <i :class="showConfirmPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" />
                    </button>
                </div>
            </div>

            <button
                type="submit"
                :disabled="!canSubmit || loading"
                class="group relative flex w-full scale-100 items-center justify-center overflow-hidden rounded-md border-2 border-[var(--rw-primary-deep)] bg-rw-surface px-4 py-2 text-[var(--rw-primary-deep)] transition-all duration-300 hover:scale-105 hover:border-white hover:text-white hover:shadow-lg hover:shadow-[var(--rw-brand)]/40 active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
            >
                <span
                    class="absolute inset-0 origin-left scale-x-0 bg-[var(--rw-primary-deep)] transition-transform duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] group-hover:scale-x-100"
                />

                <span class="relative z-10 flex items-center gap-3">
                    <i
                        v-if="loading"
                        class="fas fa-spinner fa-spin text-base"
                    />

                    Reset password
                </span>
            </button>
        </form>

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
