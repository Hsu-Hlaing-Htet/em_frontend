<script setup>
import { onMounted, onUnmounted } from 'vue';
import AuthPageShell from '@/components/global/AuthPageShell.vue';
import { useLogin } from '@/composables/global/useLogin';
import { useThemeStore } from '@/stores/themeStore';

const {
    form,
    loading,
    showPassword,
    submit,
} = useLogin();

const themeStore = useThemeStore();

onMounted(() => {
    document.documentElement.setAttribute('data-theme', 'light');
});

onUnmounted(() => {
    themeStore.applyTheme();
});
</script>

<template>
    <AuthPageShell
        title="Welcome Back!"
        subtitle="Please enter your login details."
        :show-theme-toggle="false"
    >
        <form class="space-y-4" @submit.prevent="submit">
            <div>
                <label class="mb-2 block text-sm font-semibold text-[var(--rw-primary-deep)]">
                    Email
                </label>

                <input
                    v-model="form.email"
                    type="email"
                    required
                    class="rw-input-shell w-full rounded-xl px-4 py-3 outline-none"
                    placeholder="admin@rosewoodroyale.com"
                >
            </div>

            <div>
                <div class="mb-2 flex items-center justify-between gap-3">
                    <label class="text-sm font-semibold text-[var(--rw-primary-deep)]">
                        Password
                    </label>

                    <router-link
                        :to="{ name: 'forgot-password' }"
                        class="text-xs font-semibold text-[var(--rw-primary-deep)] hover:underline"
                    >
                        Forgot password?
                    </router-link>
                </div>

                <div class="rw-input-shell flex items-center rounded-xl px-4 py-3">
                    <input
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        required
                        class="flex-1 bg-transparent outline-none"
                        placeholder="Enter your password"
                    >

                    <button
                        type="button"
                        class="text-rw-muted"
                        @click="showPassword = !showPassword"
                    >
                        <i
                            :class="
                                showPassword
                                    ? 'fas fa-eye'
                                    : 'fas fa-eye-slash'
                            "
                        />
                    </button>
                </div>
            </div>

            <button
                type="submit"
                class="group relative mb-2 flex w-full scale-100 items-center justify-center overflow-hidden rounded-md border-2 border-[var(--rw-primary-deep)] bg-rw-surface px-4 py-2 text-[var(--rw-primary-deep)] transition-all duration-300 hover:scale-105 hover:border-white hover:text-white hover:shadow-lg hover:shadow-[var(--rw-brand)]/40 active:scale-95"
            >
                <span
                    class="absolute inset-0 origin-left scale-x-0 bg-[var(--rw-primary-deep)] transition-transform duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] group-hover:scale-x-100"
                />

                <span class="relative z-10 flex items-center gap-3">
                    <i
                        v-if="loading"
                        class="fas fa-spinner fa-spin text-base transition-all duration-300 group-hover:scale-110 group-hover:rotate-[20deg]"
                    />

                    Login
                </span>
            </button>
        </form>
    </AuthPageShell>
</template>
