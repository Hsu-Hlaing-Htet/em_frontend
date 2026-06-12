import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { useAuthStore } from '@/modules/auth/store';

export function useLogin() {
    const router = useRouter();
    const toast = useToast();
    const auth = useAuthStore();

    const loading = ref(false);
    const showPassword = ref(false);

    const form = reactive({
        email: '',
        password: '',
    });

    async function submit() {
        loading.value = true;

        try {
            const response = await auth.login(
                form.email,
                form.password
            );

            toast.add({
                severity: 'success',
                summary: 'Welcome',
                detail: 'Login successful.',
                life: 2500,
            });

            router.push(response.redirect_to);
        } catch (error) {
            toast.add({
                severity: 'error',
                summary: 'Login Failed',
                detail:
                    error.response?.data?.message ||
                    'Invalid credentials.',
                life: 3500,
            });
        } finally {
            loading.value = false;
        }
    }

    return {
        form,
        loading,
        showPassword,
        submit,
    };
}