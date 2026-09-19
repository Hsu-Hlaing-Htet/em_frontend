<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import StatusPage from '@/components/global/StatusPage.vue';
import { useStatusPageCta } from '@/composables/global/useStatusPageCta';

const route = useRoute();
const { goBack } = useStatusPageCta();

const primaryCta = computed(() => ({
    label: 'Sign in again',
    to: {
        name: 'login',
        query: route.query.redirect ? { redirect: route.query.redirect } : undefined,
    },
    icon: 'pi pi-refresh',
}));
</script>

<template>
    <StatusPage
        code="419"
        icon="pi pi-clock"
        title="Session expired"
        message="Your session has timed out for security. Please sign in again to continue."
        hint="Unsaved work on this page may need to be re-entered."
        :primary-cta="primaryCta"
        @back="goBack"
    />
</template>
