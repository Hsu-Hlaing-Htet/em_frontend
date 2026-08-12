import { reactive, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useToast } from 'primevue/usetoast';
import { getApiErrorMessage } from '@/utils/apiError';
import { Errors } from '@/utils/validation';
import { useAuthStore } from '@/modules/auth/store';

function resolveRedirectPath(route, role) {
    const redirect = route.query.redirect;

    if (typeof redirect === 'string' && redirect.startsWith('/')) {
        return redirect;
    }

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
    const toast = useToast();
    const auth = useAuthStore();

    const loading = ref(false);
    const showPassword = ref(false);
    const errors = new Errors();

    const form = reactive({
        email: '',
        password: '',
    });

    async function submit() {
        errors.clear();

        const validationErrors = {};

        if (!form.email?.trim()) {
            validationErrors.email = ['This field is required.'];
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
            validationErrors.email = ['Please enter a valid email address.'];
        }

        if (!form.password) {
            validationErrors.password = ['This field is required.'];
        }

        if (Object.keys(validationErrors).length) {
            errors.record(validationErrors);
            return;
        }

        loading.value = true;

        try {
            const response = await auth.login(form.email, form.password);
            const redirectTo = resolveRedirectPath(route, response.user.role);

            toast.add({
                severity: 'success',
                summary: 'Welcome',
                detail: 'Login successful.',
                life: 2500,
            });

            await router.push(redirectTo);
        } catch (error) {
            const fieldErrors = error?.data?.data || error?.data?.errors || error?.response?.data?.errors;

            if (fieldErrors) {
                errors.record(fieldErrors);
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
