<template>
    <Button
        type="button"
        text
        :icon="approving ? 'pi pi-spin pi-spinner' : 'pi pi-check'"
        severity="success"
        :aria-label="approving ? 'Approving...' : approveLabel"
        :disabled="approving || disabled"
        :loading="approving"
        @click="$emit('approve')"
    />
    <Button
        v-if="canReject"
        type="button"
        text
        icon="pi pi-times"
        severity="danger"
        :aria-label="rejectLabel"
        :disabled="approving || disabled"
        @click="$emit('reject')"
    />
</template>

<script>
import { defineComponent } from 'vue';
import Button from 'primevue/button';

export default defineComponent({
    name: 'ApprovalListActions',
    components: { Button },
    props: {
        canReject: {
            type: Boolean,
            default: true,
        },
        approveLabel: {
            type: String,
            default: 'Approve',
        },
        rejectLabel: {
            type: String,
            default: 'Reject',
        },
        approving: {
            type: Boolean,
            default: false,
        },
        disabled: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['approve', 'reject'],
});
</script>
