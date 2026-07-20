import { reactive, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { getApiErrorMessage } from '@/utils/apiError';
import { requestPasswordReset } from '@/modules/auth/service';

export function useForgotPassword() {
    const toast = useToast();
    const loading = ref(false);
    const submitted = ref(false);

    const form = reactive({
        email: '',
    });

    async function submit() {
        loading.value = true;

        try {
            await requestPasswordReset({ email: form.email });

            submitted.value = true;

            toast.add({
                severity: 'success',
                summary: 'Check your email',
                detail: 'If an account exists for that email, a reset link has been sent.',
                life: 4000,
            });
        } catch (error) {
            toast.add({
                severity: 'error',
                summary: 'Request Failed',
                detail: getApiErrorMessage(error, 'Unable to send reset link.'),
                life: 3500,
            });
        } finally {
            loading.value = false;
        }
    }

    return {
        form,
        loading,
        submitted,
        submit,
    };
}
