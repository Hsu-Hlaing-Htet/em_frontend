import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { getApiErrorMessage } from '@/utils/apiError';
import { resetPassword } from '@/modules/auth/service';

export function useResetPassword() {
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();

    const loading = ref(false);
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const invalidLink = ref(false);

    const form = reactive({
        token: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const canSubmit = computed(() => (
        form.token
        && form.email
        && form.password
        && form.password_confirmation
    ));

    onMounted(() => {
        form.token = typeof route.query.token === 'string' ? route.query.token : '';
        form.email = typeof route.query.email === 'string' ? route.query.email : '';

        if (!form.token || !form.email) {
            invalidLink.value = true;
        }
    });

    async function submit() {
        if (!canSubmit.value) {
            return;
        }

        loading.value = true;

        try {
            await resetPassword({ ...form });

            toast.add({
                severity: 'success',
                summary: 'Password updated',
                detail: 'Your password has been reset. You can sign in now.',
                life: 3500,
            });

            await router.push({ name: 'login' });
        } catch (error) {
            toast.add({
                severity: 'error',
                summary: 'Reset Failed',
                detail: getApiErrorMessage(error, 'Unable to reset password.'),
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
        showConfirmPassword,
        invalidLink,
        canSubmit,
        submit,
    };
}
