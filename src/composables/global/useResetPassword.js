import { computed, reactive, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppToast } from '@/composables/global/useAppToast';
import { getApiErrorMessage } from '@/utils/apiError';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { resetPassword } from '@/modules/auth/service';

function firstQueryValue(value) {
    if (Array.isArray(value)) {
        return value.find((item) => typeof item === 'string' && item !== '') ?? '';
    }

    return typeof value === 'string' ? value : '';
}

function readResetLinkParams(route) {
    let token = firstQueryValue(route.query.token);
    let email = firstQueryValue(route.query.email);

    if (typeof window !== 'undefined') {
        const params = new URLSearchParams(window.location.search);

        if (!token) {
            token = params.get('token') ?? '';
        }

        if (!email) {
            email = params.get('email') ?? '';
        }
    }

    return { token, email };
}

export function useResetPassword() {
    const route = useRoute();
    const router = useRouter();
    const toast = useAppToast();

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

    bindErrorClearing(form, errors, ['password', 'password_confirmation', 'email']);

    const canSubmit = computed(() => (
        form.token
        && form.email
    ));

    watch(
        () => [route.query.token, route.query.email, route.fullPath],
        () => {
            const { token, email } = readResetLinkParams(route);
            form.token = token;
            form.email = email;
            invalidLink.value = !token || !email;
        },
        { immediate: true },
    );

    async function submit() {
        if (!canSubmit.value) {
            return;
        }

        errors.clear();

        if (!applyValidation(errors, form, [
            {
                field: 'password',
                type: 'password',
                required: true,
                confirmationField: 'password_confirmation',
            },
        ])) {
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
                errors.record(fieldErrors, false);
                toast.add({
                    severity: 'error',
                    summary: 'Reset Failed',
                    detail: getApiErrorMessage(error, 'Unable to reset password.'),
                    life: 3500,
                });
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
