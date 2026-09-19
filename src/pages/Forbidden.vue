<script setup>
import StatusPage from '@/components/global/StatusPage.vue';
import { useStatusPageCta } from '@/composables/global/useStatusPageCta';

const { primaryCta, goBack } = useStatusPageCta();
</script>

<template>
    <StatusPage
        code="403"
        icon="pi pi-lock"
        title="Access forbidden"
        message="You do not have permission to view this page."
        hint="Contact an administrator if you believe this is a mistake."
        :primary-cta="primaryCta"
        @back="goBack"
    />
</template>
