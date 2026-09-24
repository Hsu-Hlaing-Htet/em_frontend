<template>
    <router-link
        :to="{ name: 'customerNotificationList' }"
        class="customer-portal-header-icon"
        :aria-label="ariaLabel"
        @click="clearPointerFocus"
    >
        <span class="customer-portal-header-icon-bell">
            <i class="pi pi-bell" aria-hidden="true" />
            <span
                v-if="count > 0"
                class="customer-portal-header-icon-badge"
            >
                {{ count > 9 ? '9+' : count }}
            </span>
        </span>
    </router-link>
</template>

<script setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

const props = defineProps({
    count: {
        type: Number,
        default: 0,
    },
});

const { t } = useI18n();

const ariaLabel = computed(() => (
    props.count > 0
        ? t('customer.unreadNotifications', { count: props.count })
        : t('customer.notifications')
));

function clearPointerFocus(event) {
    if (event?.detail > 0) {
        event.currentTarget?.blur?.();
    }
}
</script>
