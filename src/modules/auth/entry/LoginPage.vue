<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import { useAuthStore } from '@/modules/auth/authStore';

const router = useRouter();
const toast = useToast();
const auth = useAuthStore();

const loading = ref(false);

const form = reactive({
    email: '',
    password: '',
    remember: true,
});

async function submit() {
    loading.value = true;

    try {
        const response = await auth.login(form);
        toast.add({ severity: 'success', summary: 'Welcome', detail: 'Login successful.', life: 2500 });
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
</script>

<template>
    <section class="rr-section">
        <div class="rr-container" style="max-width: 520px">
            <div class="rr-card" style="padding: 1rem">
                <p class="rr-title" style="font-size: 0.76rem">Login</p>
                <h1 style="margin: 0.2rem 0 1rem">Access Your Dashboard</h1>
                <p class="rr-muted">Admin users are redirected to `/admin/dashboard`, owners are redirected to `/user/dashboard` based on the `role` field.</p>

                <div class="rr-grid" style="margin-top: 1rem">
                    <div>
                        <label class="rr-muted">Email</label>
                        <PvInputText v-model="form.email" type="email" style="width: 100%" />
                    </div>
                    <div>
                        <label class="rr-muted">Password</label>
                        <PvInputText v-model="form.password" type="password" style="width: 100%" />
                    </div>
                </div>

                <Button :loading="loading" severity="primary" class="rr-btn" style="margin-top: 1rem; width: 100%" type="button" @click="submit">
                    Login
                </Button>

            </div>
        </div>
    </section>
</template>
