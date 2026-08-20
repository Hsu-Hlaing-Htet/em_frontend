import { reactive, ref } from 'vue';
import { useAppToast } from '@/composables/global/useAppToast';
import { getApiErrorMessage } from '@/utils/apiError';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { requestPasswordReset } from '@/modules/auth/service';

export function useForgotPassword() {
    const toast = useAppToast();
    const loading = ref(false);
    const submitted = ref(false);
    const errors = new Errors();

    const form = reactive({
        email: '',
    });

    bindErrorClearing(form, errors);

    async function submit() {
        errors.clear();

        if (!applyValidation(errors, form, [
            { field: 'email', type: 'email' },
        ])) {
            return;
        }

        loading.value = true;

        try {
            await requestPasswordReset({ email: form.email.trim() });

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
                errors.record(fieldErrors, false);
                toast.add({
                    severity: 'error',
                    summary: 'Request Failed',
                    detail: getApiErrorMessage(error, 'Unable to send reset link.'),
                    life: 3500,
                });
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
