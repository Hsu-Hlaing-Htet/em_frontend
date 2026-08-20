import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAppToast } from '@/composables/global/useAppToast';
import { getApiErrorMessage } from '@/utils/apiError';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { changePassword } from '@/modules/auth/service';
import { useAuthStore } from '@/modules/auth/store';

export function useChangePassword() {
    const router = useRouter();
    const toast = useAppToast();
    const authStore = useAuthStore();

    const loading = ref(false);
    const showCurrentPassword = ref(false);
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const errors = new Errors();

    const form = reactive({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    bindErrorClearing(form, errors);

    function resetForm() {
        form.current_password = '';
        form.password = '';
        form.password_confirmation = '';
        showCurrentPassword.value = false;
        showPassword.value = false;
        showConfirmPassword.value = false;
        errors.clear();
        loading.value = false;
    }

    async function submit() {
        errors.clear();

        if (!applyValidation(errors, form, [
            { field: 'current_password', type: 'text' },
            {
                field: 'password',
                type: 'password',
                required: true,
                confirmationField: 'password_confirmation',
                currentPasswordField: 'current_password',
            },
        ])) {
            return;
        }

        loading.value = true;

        try {
            await changePassword({ ...form });

            authStore.clearSession();

            toast.add({
                severity: 'success',
                summary: 'Password updated',
                detail: 'Your password has been changed. Please sign in with your new password.',
                life: 3500,
            });

            await router.push({ name: 'login' });
        } catch (error) {
            const fieldErrors = error?.data?.data || error?.data?.errors || error?.response?.data?.errors;

            if (fieldErrors && typeof fieldErrors === 'object' && Object.keys(fieldErrors).length) {
                errors.record(fieldErrors, false);
                toast.add({
                    severity: 'error',
                    summary: 'Change Failed',
                    detail: getApiErrorMessage(error, 'Unable to change password.'),
                    life: 3500,
                });
                return;
            }

            toast.add({
                severity: 'error',
                summary: 'Change Failed',
                detail: getApiErrorMessage(error, 'Unable to change password.'),
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
        showCurrentPassword,
        showPassword,
        showConfirmPassword,
        resetForm,
        submit,
    };
}
