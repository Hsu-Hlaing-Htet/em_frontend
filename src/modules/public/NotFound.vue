<script setup>
import StatusPage from '@/components/global/StatusPage.vue';
</script>

<template>
    <StatusPage
        embedded
        code="404"
        icon="pi pi-compass"
        title="This space doesn’t exist."
        message="The page you requested may have moved, or the link may be incomplete."
        :primary-cta="{ label: 'Return Home', to: { name: 'home' } }"
        :secondary-cta="{ label: 'Explore Properties', to: { name: 'properties' }, icon: 'pi pi-home' }"
    />
</template>
