<script setup>
import { onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import AuthPageShell from '@/components/global/AuthPageShell.vue';
import { useChangePassword } from '@/composables/global/useChangePassword';
import { useThemeStore } from '@/stores/themeStore';
import { useAuthStore } from '@/modules/auth/store';

const router = useRouter();
const auth = useAuthStore();
const themeStore = useThemeStore();

const {
    form,
    errors,
    loading,
    showCurrentPassword,
    showPassword,
    showConfirmPassword,
    submit,
} = useChangePassword();

onMounted(() => {
    document.documentElement.setAttribute('data-theme', 'light');
});

onUnmounted(() => {
    themeStore.applyTheme();
});

async function logout() {
    await auth.logout();
    await router.push({ name: 'login' });
}
</script>

<template>
    <AuthPageShell
        title="Set a New Password"
        subtitle="For your security, create a new password before continuing."
        :show-theme-toggle="false"
    >
        <form class="space-y-4" novalidate @submit.prevent="submit">
            <div>
                <label class="mb-2 block text-sm font-semibold text-[var(--rw-primary-deep)]">
                    Temporary / Current Password
                </label>
                <div class="rw-input-shell flex items-center rounded-xl px-4 py-3">
                    <input
                        v-model="form.current_password"
                        :type="showCurrentPassword ? 'text' : 'password'"
                        required
                        class="flex-1 bg-transparent outline-none"
                        placeholder="Enter your temporary password"
                        :disabled="loading"
                    >
                    <button
                        type="button"
                        class="text-rw-muted"
                        @click="showCurrentPassword = !showCurrentPassword"
                    >
                        <i :class="showCurrentPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" />
                    </button>
                </div>
                <small v-if="errors.has('current_password')" class="p-error mt-1 block">
                    <div v-for="error in errors.get('current_password')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div>
                <label class="mb-2 block text-sm font-semibold text-[var(--rw-primary-deep)]">
                    New Password
                </label>
                <div class="rw-input-shell flex items-center rounded-xl px-4 py-3">
                    <input
                        v-model="form.password"
                        :type="showPassword ? 'text' : 'password'"
                        required
                        class="flex-1 bg-transparent outline-none"
                        placeholder="Enter a new password"
                        :disabled="loading"
                    >
                    <button
                        type="button"
                        class="text-rw-muted"
                        @click="showPassword = !showPassword"
                    >
                        <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" />
                    </button>
                </div>
                <small v-if="errors.has('password')" class="p-error mt-1 block">
                    <div v-for="error in errors.get('password')" :key="error">{{ error }}</div>
                </small>
            </div>

            <div>
                <label class="mb-2 block text-sm font-semibold text-[var(--rw-primary-deep)]">
                    Confirm New Password
                </label>
                <div class="rw-input-shell flex items-center rounded-xl px-4 py-3">
                    <input
                        v-model="form.password_confirmation"
                        :type="showConfirmPassword ? 'text' : 'password'"
                        required
                        class="flex-1 bg-transparent outline-none"
                        placeholder="Confirm your new password"
                        :disabled="loading"
                    >
                    <button
                        type="button"
                        class="text-rw-muted"
                        @click="showConfirmPassword = !showConfirmPassword"
                    >
                        <i :class="showConfirmPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" />
                    </button>
                </div>
                <small v-if="errors.has('password_confirmation')" class="p-error mt-1 block">
                    <div v-for="error in errors.get('password_confirmation')" :key="error">{{ error }}</div>
                </small>
            </div>

            <button
                type="submit"
                class="group relative mb-2 flex w-full scale-100 items-center justify-center overflow-hidden rounded-md border-2 border-[var(--rw-primary-deep)] bg-rw-surface px-4 py-2 text-[var(--rw-primary-deep)] transition-all duration-300 hover:scale-105 hover:border-white hover:text-white hover:shadow-lg hover:shadow-[var(--rw-brand)]/40 active:scale-95"
                :disabled="loading"
            >
                <span
                    class="absolute inset-0 origin-left scale-x-0 bg-[var(--rw-primary-deep)] transition-transform duration-500 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] group-hover:scale-x-100"
                />
                <span class="relative z-10 flex items-center gap-3">
                    <i
                        v-if="loading"
                        class="fas fa-spinner fa-spin text-base"
                    />
                    Save New Password
                </span>
            </button>

            <button
                type="button"
                class="w-full text-center text-sm font-semibold text-[var(--rw-primary-deep)] hover:underline"
                :disabled="loading"
                @click="logout"
            >
                Sign out
            </button>
        </form>
    </AuthPageShell>
</template>
