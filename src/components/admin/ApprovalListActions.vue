<template>
    <div class="admin-approval-list-actions">
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
    </div>
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

<style scoped>
.admin-approval-list-actions {
    display: inline-flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: 0.15rem;
    flex-wrap: nowrap;
    white-space: nowrap;
}

.admin-approval-list-actions :deep(.p-button.p-button-text) {
    width: 2.25rem;
    height: 2.25rem;
    min-width: 2.25rem;
    padding: 0;
}
</style>
