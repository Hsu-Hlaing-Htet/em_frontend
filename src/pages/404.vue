<script setup>
import { computed } from 'vue';
import StatusPage from '@/components/global/StatusPage.vue';
import { useStatusPageCta } from '@/composables/global/useStatusPageCta';
import { getCustomerResourceNotFound } from '@/helpers/customer/resourceNotFound';

const { primaryCta, goBack, isPublicContext, isCustomerContext } = useStatusPageCta({
    publicLabel: 'Return Home',
    dashboardLabel: 'Back to Dashboard',
});

const customerPageCopy = getCustomerResourceNotFound('page');

const title = computed(() => {
    if (isPublicContext.value) {
        return 'This space doesn’t exist.';
    }

    if (isCustomerContext.value) {
        return customerPageCopy.title;
    }

    return 'Page not found';
});

const message = computed(() => {
    if (isPublicContext.value) {
        return 'The page you requested may have moved, or the link may be incomplete.';
    }

    if (isCustomerContext.value) {
        return customerPageCopy.message;
    }

    return 'The page you are looking for may have been moved, removed, or never existed.';
});

const resolvedPrimaryCta = computed(() => {
    if (isCustomerContext.value) {
        return {
            label: customerPageCopy.backLabel,
            to: customerPageCopy.backRoute,
            icon: 'pi pi-arrow-left',
        };
    }

    return primaryCta.value;
});
</script>

<template>
    <StatusPage
        code="404"
        icon="pi pi-compass"
        :title="title"
        :message="message"
        :embedded="isCustomerContext"
        :primary-cta="resolvedPrimaryCta"
        :secondary-cta="isCustomerContext ? null : undefined"
        @back="goBack"
    />
</template>
