import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { getApiErrorMessage } from '@/utils/apiError';
import { Errors } from '@/utils/validation';
import { resetPassword } from '@/modules/auth/service';

export function useResetPassword() {
    const route = useRoute();
    const router = useRouter();
    const toast = useToast();

    const loading = ref(false);
    const showPassword = ref(false);
    const showConfirmPassword = ref(false);
    const invalidLink = ref(false);
    const errors = new Errors();

    const form = reactive({
        token: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const canSubmit = computed(() => (
        form.token
        && form.email
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

        errors.clear();

        const validationErrors = {};

        if (!form.password) {
            validationErrors.password = ['This field is required.'];
        } else if (form.password.length < 8) {
            validationErrors.password = ['Password must be at least 8 characters.'];
        }

        if (!form.password_confirmation) {
            validationErrors.password_confirmation = ['This field is required.'];
        } else if (form.password !== form.password_confirmation) {
            validationErrors.password_confirmation = ['Passwords do not match.'];
        }

        if (Object.keys(validationErrors).length) {
            errors.record(validationErrors);
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
            const fieldErrors = error?.data?.data || error?.data?.errors || error?.response?.data?.errors;

            if (fieldErrors) {
                errors.record(fieldErrors);
                return;
            }

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
        errors,
        loading,
        showPassword,
        showConfirmPassword,
        invalidLink,
        canSubmit,
        submit,
    };
}
