<script setup>
import { useLogin } from './useLogin';

const {
    form,
    loading,
    showPassword,
    submit,
} = useLogin();
</script>

<template>
    <div class="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <section
            class="w-full max-w-md rounded-md border border-[#d6b8c1]/70 bg-white px-7 py-8 shadow-lg"
        >
            <div class="text-center">
                <div
                    class="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_14px_35px_rgba(85,32,50,0.26)] ring-1 ring-[#d6b8c1]/70"
                >
                    <img
                        src="@/assets/images/logo-dark.jpg"
                        alt="Rosewood Royale"
                        class="h-full w-full object-cover"
                    >
                </div>

                <h2
                    class="mt-5 text-2xl font-semibold tracking-tight text-[#552032]"
                >
                    Welcome Back!
                </h2>

                <p class="mt-2 text-sm text-gray-500">
                    Please enter your login details.
                </p>
            </div>

            <form class="mt-7 space-y-4" @submit.prevent="submit">
                <div>
                    <label class="mb-2 block text-sm font-semibold text-[#552032]">
                        Email
                    </label>

                    <input
                        v-model="form.email"
                        type="email"
                        required
                        class="w-full rounded-xl bg-[#d6b8c1]/20 px-4 py-3 outline-none"
                        placeholder="admin@rosewoodroyale.com"
                    >
                </div>

                <div>
                    <label class="mb-2 block text-sm font-semibold text-[#552032]">
                        Password
                    </label>

                    <div
                        class="flex items-center rounded-xl bg-[#d6b8c1]/20 px-4 py-3"
                    >
                        <input
                            v-model="form.password"
                            :type="showPassword ? 'text' : 'password'"
                            required
                            class="flex-1 bg-transparent outline-none"
                            placeholder="Enter your password"
                        >

                        <button
                            type="button"
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
                class="flex w-full items-center justify-center group relative overflow-hidden
                        px-4 py-2 mb-10
                        rounded-md
                        border-2 border-[#552032]
                        text-[#552032]
                        bg-white
                        transition-all duration-300
                        hover:text-white
                        hover:border-2 hover:border-white
                        hover:shadow-lg hover:shadow-[#552032]/40
                        active:scale-95 scale-100
                            hover:scale-105
                            hover:invert-0
                            transition-all duration-500 ease-out"
                >
                <!-- Background Animation -->
                <span
                    class="absolute inset-0
                        bg-[#552032]
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
                    <i v-if="loading"
                    class="fas fa-spinner fa-spin
                            text-base
                            transition-all duration-300
                            group-hover:rotate-[20deg]
                            group-hover:scale-110"
                    ></i>

                    Login
                </span>
                            </button>
            </form>
        </section>
    </div>
</template>