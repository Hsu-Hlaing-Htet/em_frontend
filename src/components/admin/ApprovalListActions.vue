<template>
    <Button
        text
        icon="pi pi-check"
        severity="success"
        :aria-label="approveLabel"
        @click="$emit('approve')"
    />
    <Button
        v-if="canReject"
        text
        icon="pi pi-times"
        severity="danger"
        :aria-label="rejectLabel"
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
    },
    emits: ['approve', 'reject'],
});
</script>
