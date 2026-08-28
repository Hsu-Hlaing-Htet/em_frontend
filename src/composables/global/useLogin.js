import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAppToast } from '@/composables/global/useAppToast';
import { getApiErrorMessage } from '@/utils/apiError';
import { Errors } from '@/utils/validation';
import { applyValidation, bindErrorClearing } from '@/utils/formValidation';
import { useAuthStore } from '@/modules/auth/store';

function firstMessage(value) {
    if (Array.isArray(value)) {
        return String(value[0] || '');
    }

    return String(value || '');
}

function mapLoginFieldErrors(fieldErrors) {
    const mapped = {};

    Object.entries(fieldErrors || {}).forEach(([field, messages]) => {
        const list = Array.isArray(messages) ? messages : [messages];
        const text = firstMessage(list);
        const lower = text.toLowerCase();

        if (lower.includes('required') || lower.includes('valid email')) {
            mapped[field] = list;
            return;
        }

        if (
            field === 'password'
            && (
                lower.includes('incorrect')
                || lower.includes('invalid')
                || lower.includes('wrong')
                || lower.includes('credentials')
            )
        ) {
            mapped.password = ['Incorrect password.'];
            return;
        }

        if (
            field === 'email'
            && (
                lower.includes('not found')
                || lower.includes('does not exist')
                || lower.includes('no account')
                || lower.includes('unknown user')
            )
        ) {
            mapped.email = ['Email not found.'];
            return;
        }

        mapped[field] = list;
    });

    return mapped;
}

function resolveRedirectPath(route, user) {
    if (user?.must_change_password) {
        return { name: 'force-change-password' };
    }

    const redirect = route.query.redirect;

    if (typeof redirect === 'string' && redirect.startsWith('/') && !redirect.startsWith('/change-password')) {
        return redirect;
    }

    const role = user?.role;

    if (role === 'super_admin' || role === 'admin') {
        return '/admin/dashboard';
    }

    if (role === 'customer') {
        return '/customer/dashboard';
    }

    return '/';
}

export function useLogin() {
    const route = useRoute();
    const router = useRouter();
    const toast = useAppToast();
    const auth = useAuthStore();

    const loading = ref(false);
    const showPassword = ref(false);
    const errors = new Errors();

    const form = reactive({
        email: '',
        password: '',
    });

    bindErrorClearing(form, errors);

    async function submit() {
        errors.clear();

        if (!applyValidation(errors, form, [
            { field: 'email', type: 'email' },
            { field: 'password', type: 'text' },
        ])) {
            return;
        }

        loading.value = true;

        try {
            const response = await auth.login(form.email, form.password);
            const redirectTo = resolveRedirectPath(route, response.user);

            toast.add({
                severity: 'success',
                summary: 'Welcome',
                detail: response.user?.must_change_password
                    ? 'Please create a new password to continue.'
                    : 'Login successful.',
                life: 2500,
            });

            await router.push(redirectTo);
        } catch (error) {
            const fieldErrors = error?.data?.data || error?.data?.errors || error?.response?.data?.errors;

            if (fieldErrors && typeof fieldErrors === 'object' && Object.keys(fieldErrors).length) {
                errors.record(mapLoginFieldErrors(fieldErrors), false);
                toast.add({
                    severity: 'error',
                    summary: 'Login Failed',
                    detail: getApiErrorMessage(error, 'Invalid credentials.'),
                    life: 3500,
                });
                return;
            }

            toast.add({
                severity: 'error',
                summary: 'Login Failed',
                detail: getApiErrorMessage(error, 'Invalid credentials.'),
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
        submit,
    };
}
