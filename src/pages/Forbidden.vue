<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const isAdminContext = computed(() => route.query.from === 'admin' || route.path.startsWith('/admin'));
const isCustomerContext = computed(() => route.query.from === 'customer' || route.path.startsWith('/customer'));
const isAuthenticated = computed(() => auth.isAuthenticated);

const primaryCta = computed(() => {
    if (isAdminContext.value && isAuthenticated.value) {
        return {
            label: 'Go to dashboard',
            to: { name: 'dashboard' },
        };
    }

    if (isCustomerContext.value && isAuthenticated.value) {
        return {
            label: 'Go to dashboard',
            to: { name: 'customerDashboard' },
        };
    }

    if (isAuthenticated.value) {
        if (auth.role === 'admin' || auth.role === 'super_admin') {
            return {
                label: 'Go to dashboard',
                to: { name: 'dashboard' },
            };
        }

        if (auth.role === 'customer') {
            return {
                label: 'Go to dashboard',
                to: { name: 'customerDashboard' },
            };
        }
    }

    if (!isAuthenticated.value) {
        return {
            label: 'Go to login',
            to: { name: 'login' },
        };
    }

    return {
        label: 'Go to home',
        to: { name: 'home' },
    };
});

const goBack = () => {
    if (window.history.length > 1) {
        router.back();
        return;
    }

    router.push(primaryCta.value.to);
};
</script>

<template>
    <div class="status-page">
        <div class="status-card">
            <p
                class="status-code"
                aria-hidden="true"
            >
                403
            </p>

            <div class="status-icon" aria-hidden="true">
                <i class="pi pi-lock" />
            </div>

            <h1 class="status-title">
                Access forbidden
            </h1>

            <p class="status-message">
                You do not have permission to view this page. Contact an administrator if you believe this is a mistake.
            </p>

            <div class="status-actions">
                <button
                    type="button"
                    class="status-button status-button-secondary"
                    @click="goBack"
                >
                    <i class="pi pi-arrow-left" aria-hidden="true" />
                    Go back
                </button>

                <router-link
                    :to="primaryCta.to"
                    class="status-button status-button-primary"
                >
                    {{ primaryCta.label }}
                </router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
.status-page {
    display: flex;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    background:
        radial-gradient(circle at top right, color-mix(in srgb, var(--rw-accent) 35%, transparent), transparent 42%),
        var(--rw-bg);
    padding: 1.5rem;
}

.status-card {
    width: min(100%, 34rem);
    border-radius: 1.5rem;
    border: 1px solid var(--rw-border);
    background: var(--rw-surface);
    box-shadow: var(--rw-shadow);
    padding: 2.5rem 2rem;
    text-align: center;
}

.status-code {
    margin: 0;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(4rem, 14vw, 6rem);
    line-height: 1;
    font-weight: 700;
    color: color-mix(in srgb, var(--rw-primary-deep) 14%, transparent);
}

.status-icon {
    display: grid;
    width: 4rem;
    height: 4rem;
    margin: -1.5rem auto 1rem;
    place-items: center;
    border-radius: 9999px;
    background: linear-gradient(135deg, var(--rw-primary-deep), var(--rw-primary));
    color: var(--rw-bg);
    font-size: 1.5rem;
}

.status-title {
    margin: 0;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(1.75rem, 4vw, 2.25rem);
    color: var(--rw-primary-deep);
}

.status-message {
    margin: 0.75rem 0 0;
    color: var(--rw-text-muted);
    line-height: 1.6;
}

.status-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 2rem;
}

.status-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    min-width: 9rem;
    border-radius: 9999px;
    padding: 0.8rem 1.25rem;
    font-weight: 600;
    text-decoration: none;
    transition: transform 0.2s ease, box-shadow 0.2s ease, background-color 0.2s ease;
}

.status-button:focus-visible {
    outline: 3px solid rgba(122, 49, 73, 0.35);
    outline-offset: 2px;
}

.status-button-primary {
    background: linear-gradient(135deg, var(--rw-primary-deep), var(--rw-primary));
    color: var(--rw-bg);
    box-shadow: var(--rw-shadow-soft);
}

.status-button-secondary {
    border: 1px solid var(--rw-border);
    background: var(--rw-surface-solid);
    color: var(--rw-primary-deep);
}

.status-button:hover {
    transform: translateY(-1px);
}

@media (prefers-reduced-motion: reduce) {
    .status-button {
        transition: none;
    }

    .status-button:hover {
        transform: none;
    }
}
</style>
