<script setup>
import StatusPage from '@/components/global/StatusPage.vue';
import { useStatusPageCta } from '@/composables/global/useStatusPageCta';

const { primaryCta, goBack, isPublicContext } = useStatusPageCta({
    publicLabel: 'Return Home',
});
</script>

<template>
    <StatusPage
        code="404"
        icon="pi pi-compass"
        :title="isPublicContext ? 'This space doesn’t exist.' : 'Page not found'"
        :message="isPublicContext
            ? 'The page you requested may have moved, or the link may be incomplete.'
            : 'The page you are looking for may have been moved, removed, or never existed.'"
        :primary-cta="primaryCta"
        @back="goBack"
    />
</template>
