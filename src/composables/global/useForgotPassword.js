import { reactive, ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import { getApiErrorMessage } from '@/utils/apiError';
import { Errors } from '@/utils/validation';
import { requestPasswordReset } from '@/modules/auth/service';

export function useForgotPassword() {
    const toast = useToast();
    const loading = ref(false);
    const submitted = ref(false);
    const errors = new Errors();

    const form = reactive({
        email: '',
    });

    async function submit() {
        errors.clear();

        if (!form.email?.trim()) {
            errors.record({ email: ['This field is required.'] });
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            errors.record({ email: ['Please enter a valid email address.'] });
            return;
        }

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
            const fieldErrors = error?.data?.data || error?.data?.errors || error?.response?.data?.errors;

            if (fieldErrors) {
                errors.record(fieldErrors);
                return;
            }

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
        errors,
        loading,
        submitted,
        submit,
    };
}
