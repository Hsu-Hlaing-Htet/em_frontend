<script setup>
import { computed } from 'vue';
import StatusPage from '@/components/global/StatusPage.vue';
import { useStatusPageCta } from '@/composables/global/useStatusPageCta';

const { primaryCta, goBack } = useStatusPageCta({
    dashboardLabel: 'Go to dashboard',
    publicLabel: 'Return Home',
});

const retryCta = computed(() => ({
    label: 'Retry',
    icon: 'pi pi-refresh',
    onClick: () => window.location.reload(),
}));

const secondaryCta = computed(() => ({
    label: primaryCta.value.label,
    to: primaryCta.value.to,
    icon: false,
}));
</script>

<template>
    <StatusPage
        code="500"
        icon="pi pi-exclamation-circle"
        title="Something went wrong"
        message="We could not complete this request. Please try again in a moment."
        hint="If the problem continues, contact support with what you were doing."
        :primary-cta="retryCta"
        :secondary-cta="secondaryCta"
        @back="goBack"
    />
</template>
