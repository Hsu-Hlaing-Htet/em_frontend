import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store';

/**
 * Shared dashboard / login / home CTA resolution for system status pages.
 */
export function useStatusPageCta(options = {}) {
    const {
        publicLabel = 'Return Home',
        dashboardLabel = 'Go to dashboard',
        loginLabel = 'Go to login',
        homeLabel = 'Go to home',
    } = options;

    const route = useRoute();
    const router = useRouter();
    const auth = useAuthStore();

    const isAdminContext = computed(
        () => route.query.from === 'admin' || route.path.startsWith('/admin'),
    );
    const isCustomerContext = computed(
        () => route.query.from === 'customer' || route.path.startsWith('/customer'),
    );
    const isAuthenticated = computed(() => auth.isAuthenticated);
    const isPublicContext = computed(
        () => !isAdminContext.value && !isCustomerContext.value && !route.path.startsWith('/admin') && !route.path.startsWith('/customer'),
    );

    const primaryCta = computed(() => {
        if (isAdminContext.value && isAuthenticated.value) {
            return { label: dashboardLabel, to: { name: 'dashboard' } };
        }

        if (isCustomerContext.value && isAuthenticated.value) {
            return { label: dashboardLabel, to: { name: 'customerDashboard' } };
        }

        if (isAuthenticated.value) {
            if (auth.role === 'admin' || auth.role === 'super_admin') {
                return { label: dashboardLabel, to: { name: 'dashboard' } };
            }

            if (auth.role === 'customer') {
                return { label: dashboardLabel, to: { name: 'customerDashboard' } };
            }
        }

        if (isPublicContext.value) {
            return { label: publicLabel, to: { name: 'home' } };
        }

        if (!isAuthenticated.value) {
            return { label: loginLabel, to: { name: 'login' } };
        }

        return { label: homeLabel, to: { name: 'home' } };
    });

    function goBack() {
        if (window.history.length > 1) {
            router.back();
            return;
        }

        router.push(primaryCta.value.to);
    }

    return {
        auth,
        route,
        router,
        isAdminContext,
        isCustomerContext,
        isAuthenticated,
        isPublicContext,
        primaryCta,
        goBack,
    };
}
