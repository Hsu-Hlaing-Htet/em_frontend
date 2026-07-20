<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '@/modules/auth/store';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

const isAdminContext = computed(() => route.path.startsWith('/admin'));
const isCustomerContext = computed(() => route.path.startsWith('/customer'));
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
    <div class="not-found-page">
        <div class="not-found-card">
            <p
                class="not-found-code"
                aria-hidden="true"
            >
                404
            </p>

            <div class="not-found-icon" aria-hidden="true">
                <i class="pi pi-compass" />
            </div>

            <h1 class="not-found-title">
                Page not found
            </h1>

            <p class="not-found-message">
                The page you are looking for may have been moved, removed, or never existed.
            </p>

            <div class="not-found-actions">
                <button
                    type="button"
                    class="not-found-button not-found-button-secondary"
                    @click="goBack"
                >
                    <i class="pi pi-arrow-left" aria-hidden="true" />
                    Go back
                </button>

                <router-link
                    :to="primaryCta.to"
                    class="not-found-button not-found-button-primary"
                >
                    {{ primaryCta.label }}
                </router-link>
            </div>
        </div>
    </div>
</template>

<style scoped>
.not-found-page {
    display: flex;
    min-height: 100vh;
    align-items: center;
    justify-content: center;
    background:
        radial-gradient(circle at top right, color-mix(in srgb, var(--rw-accent) 35%, transparent), transparent 42%),
        var(--rw-bg);
    padding: 1.5rem;
}

.not-found-card {
    width: min(100%, 34rem);
    border-radius: 1.5rem;
    border: 1px solid var(--rw-border);
    background: var(--rw-surface);
    box-shadow: var(--rw-shadow);
    padding: 2.5rem 2rem;
    text-align: center;
}

.not-found-code {
    margin: 0;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(4rem, 14vw, 6rem);
    line-height: 1;
    font-weight: 700;
    color: color-mix(in srgb, var(--rw-primary-deep) 14%, transparent);
}

.not-found-icon {
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

.not-found-title {
    margin: 0;
    font-family: Georgia, 'Times New Roman', serif;
    font-size: clamp(1.75rem, 4vw, 2.25rem);
    color: var(--rw-primary-deep);
}

.not-found-message {
    margin: 0.75rem 0 0;
    color: var(--rw-text-muted);
    line-height: 1.6;
}

.not-found-actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.75rem;
    margin-top: 2rem;
}

.not-found-button {
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

.not-found-button:focus-visible {
    outline: 3px solid rgba(122, 49, 73, 0.35);
    outline-offset: 2px;
}

.not-found-button-primary {
    background: linear-gradient(135deg, var(--rw-primary-deep), var(--rw-primary));
    color: var(--rw-bg);
    box-shadow: var(--rw-shadow-soft);
}

.not-found-button-secondary {
    border: 1px solid var(--rw-border);
    background: var(--rw-surface-solid);
    color: var(--rw-primary-deep);
}

.not-found-button:hover {
    transform: translateY(-1px);
}

@media (prefers-reduced-motion: reduce) {
    .not-found-button {
        transition: none;
    }

    .not-found-button:hover {
        transform: none;
    }
}
</style>
