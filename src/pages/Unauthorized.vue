<script setup>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import StatusPage from '@/components/global/StatusPage.vue';
import { useStatusPageCta } from '@/composables/global/useStatusPageCta';

const route = useRoute();
const { goBack } = useStatusPageCta();

const primaryCta = computed(() => ({
    label: 'Login',
    to: {
        name: 'login',
        query: route.query.redirect ? { redirect: route.query.redirect } : undefined,
    },
    icon: 'pi pi-sign-in',
}));
</script>

<template>
    <StatusPage
        code="401"
        icon="pi pi-user"
        title="Sign in required"
        message="Your session is not authorized to view this page."
        hint="Please sign in with an account that has access."
        :primary-cta="primaryCta"
        @back="goBack"
    />
</template>
