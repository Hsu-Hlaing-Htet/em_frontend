<script setup>
import { onBeforeUnmount, reactive, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/modules/auth/store';

const props = defineProps({
    modelValue: {
        type: Boolean,
        default: false,
    },
});

const emit = defineEmits(['update:modelValue']);

const router = useRouter();
const toast = useToast();
const auth = useAuthStore();
const loading = ref(false);
const showPassword = ref(false);

const form = reactive({
    email: '',
    password: '',
    remember: true,
});

function closeModal() {
    if (!loading.value) {
        emit('update:modelValue', false);
    }
}

function showUnavailable(feature) {
    toast.add({
        severity: 'info',
        summary: feature,
        detail: 'This option is not connected yet.',
        life: 2400,
    });
}

async function submit() {
    loading.value = true;

    try {
        const response = await auth.login(form);
        toast.add({
            severity: 'success',
            summary: 'Welcome',
            detail: 'Login successful.',
            life: 2500,
        });
        emit('update:modelValue', false);
        router.push(response.redirect_to);
    } catch (error) {
        toast.add({
            severity: 'error',
            summary: 'Login Failed',
            detail: error.response?.data?.message || 'Invalid credentials.',
            life: 3500,
        });
    } finally {
        loading.value = false;
    }
}

watch(
    () => props.modelValue,
    (isOpen) => {
        document.body.style.overflow = isOpen ? 'hidden' : '';
    }
);

onBeforeUnmount(() => {
    document.body.style.overflow = '';
});
</script>

<template>
    <Transition name="login-backdrop">
        <div
            v-if="modelValue"
            class="fixed inset-0 z-[90] flex items-center justify-center bg-[#552032]/35 px-4 py-6 backdrop-blur-md"
            @click.self="closeModal"
        >
            <Transition name="login-modal" appear>
                <section class="w-full max-w-[25rem] rounded-[1.75rem] border border-[#d6b8c1]/70 bg-white px-5 py-6 shadow-[0_28px_90px_rgba(85,32,50,0.24)] sm:px-7 sm:py-8">
                    <div class="relative text-center">
                        <button
                            type="button"
                            class="absolute right-0 top-0 flex h-9 w-9 items-center justify-center rounded-full text-gray-400 transition duration-300 hover:bg-[#d6b8c1]/25 hover:text-[#552032]"
                            aria-label="Close login modal"
                            @click="closeModal"
                        >
                            <i class="fas fa-xmark" />
                        </button>

                        <div class="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_14px_35px_rgba(85,32,50,0.26)] ring-1 ring-[#d6b8c1]/70">
                            <img
                                src="@/assets/images/logo-dark.jpg"
                                alt="Rosewood Royale"
                                class="h-full w-full object-cover"
                            >
                        </div>

                        <h2 class="mt-5 mb-0 text-2xl font-semibold tracking-tight text-[#552032]">
                            Welcome Back!
                        </h2>
                        <p class="mt-2 mb-0 text-sm text-gray-500">
                            Please enter your login details.
                        </p>
                    </div>

                    <form class="mt-7 space-y-4" @submit.prevent="submit">
                        <div class="space-y-2">
                            <label class="text-sm font-semibold text-[#552032]" for="public-login-email">
                                Email
                            </label>
                            <div class="flex items-center gap-3 rounded-xl border border-transparent bg-[#d6b8c1]/20 px-4 py-3.5 transition duration-300 focus-within:border-[#d6b8c1] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(214,184,193,0.28)]">
                                <input
                                    id="public-login-email"
                                    v-model="form.email"
                                    type="email"
                                    autocomplete="email"
                                    required
                                    class="min-w-0 flex-1 bg-transparent text-sm text-gray-950 outline-none placeholder:text-gray-400"
                                    placeholder="johnwick123@gmail.com"
                                >
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-semibold text-[#552032]" for="public-login-password">
                                Password
                            </label>
                            <div class="flex items-center gap-3 rounded-xl border border-transparent bg-[#d6b8c1]/20 px-4 py-3.5 transition duration-300 focus-within:border-[#d6b8c1] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(214,184,193,0.28)]">
                                <input
                                    id="public-login-password"
                                    v-model="form.password"
                                    :type="showPassword ? 'text' : 'password'"
                                    autocomplete="current-password"
                                    required
                                    class="min-w-0 flex-1 bg-transparent text-sm text-gray-950 outline-none placeholder:text-gray-400"
                                    placeholder="Enter your password"
                                >
                                <button
                                    type="button"
                                    class="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition duration-300 hover:bg-white hover:text-[#552032]"
                                    :aria-label="showPassword ? 'Hide password' : 'Show password'"
                                    @click="showPassword = !showPassword"
                                >
                                    <i :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'" />
                                </button>
                            </div>
                        </div>

                        <div class="flex justify-end">
                            <button
                                type="button"
                                class="text-sm font-semibold text-[#552032] transition duration-300 hover:text-[#7a3149] hover:underline"
                                @click="showUnavailable('Forgot password')"
                            >
                                Forgot password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            class="flex w-full items-center justify-center gap-3 rounded-xl bg-[#552032] px-5 py-3.5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(85,32,50,0.28)] transition duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:bg-[#6d2a40] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                            :disabled="loading"
                        >
                            <i v-if="loading" class="fas fa-circle-notch animate-spin" />
                            Login
                        </button>
                    </form>
                </section>
            </Transition>
        </div>
    </Transition>
</template>

<style scoped>
.login-backdrop-enter-active,
.login-backdrop-leave-active {
    transition: opacity 280ms ease;
}

.login-backdrop-enter-from,
.login-backdrop-leave-to {
    opacity: 0;
}

.login-modal-enter-active,
.login-modal-leave-active {
    transition: opacity 330ms ease, transform 330ms ease;
}

.login-modal-enter-from,
.login-modal-leave-to {
    opacity: 0;
    transform: translateY(18px) scale(0.94);
}
</style>
