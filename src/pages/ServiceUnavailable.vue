<script setup>
import { computed } from 'vue';
import StatusPage from '@/components/global/StatusPage.vue';
import { PUBLIC_CONTACT } from '@/config/publicSite';
import { useStatusPageCta } from '@/composables/global/useStatusPageCta';

const { goBack } = useStatusPageCta();

const primaryCta = computed(() => ({
    label: 'Refresh',
    icon: 'pi pi-refresh',
    onClick: () => window.location.reload(),
}));

const secondaryCta = computed(() => ({
    label: 'Contact support',
    to: { name: 'contact' },
    icon: 'pi pi-envelope',
}));

const supportHint = PUBLIC_CONTACT?.email
    ? `You can also reach us at ${PUBLIC_CONTACT.email}.`
    : 'Please try again shortly, or contact support if the outage continues.';
</script>

<template>
    <StatusPage
        code="503"
        icon="pi pi-wrench"
        title="Temporarily unavailable"
        message="Rosewood Royale is undergoing brief maintenance or is temporarily unavailable."
        :hint="supportHint"
        :primary-cta="primaryCta"
        :secondary-cta="secondaryCta"
        @back="goBack"
    />
</template>
