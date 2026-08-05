<script setup>
import { useConfirm } from 'primevue/useconfirm';

const props = defineProps({
    canSubmit: {
        type: Boolean,
        default: false,
    },
    canApprove: {
        type: Boolean,
        default: false,
    },
    approveDisabled: {
        type: Boolean,
        default: false,
    },
    canReject: {
        type: Boolean,
        default: false,
    },
    submitting: {
        type: Boolean,
        default: false,
    },
    approving: {
        type: Boolean,
        default: false,
    },
    rejecting: {
        type: Boolean,
        default: false,
    },
    submitLabel: {
        type: String,
        default: 'Submit',
    },
    approveLabel: {
        type: String,
        default: 'Approve',
    },
    rejectLabel: {
        type: String,
        default: 'Reject',
    },
    confirmApproveMessage: {
        type: String,
        default: 'Are you sure you want to approve this record?',
    },
    confirmRejectMessage: {
        type: String,
        default: 'Are you sure you want to reject this record?',
    },
});

const emit = defineEmits(['submit', 'approve', 'reject']);

const confirm = useConfirm();

const isBusy = () => props.submitting || props.approving || props.rejecting;

const requestConfirmation = (action, message) => {
    confirm.require({
        message,
        header: 'Please confirm',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Yes, continue',
        rejectLabel: 'Cancel',
        accept: () => emit(action),
    });
};

const onSubmit = () => {
    emit('submit');
};

const onApprove = () => {
    requestConfirmation('approve', props.confirmApproveMessage);
};

const onReject = () => {
    requestConfirmation('reject', props.confirmRejectMessage);
};
</script>

<template>
    <div
        class="flex flex-wrap items-center gap-2"
        role="toolbar"
        aria-label="Workflow actions"
    >
        <Button
            v-if="canSubmit"
            type="button"
            :label="submitLabel"
            icon="pi pi-send"
            :loading="submitting"
            :disabled="isBusy()"
            :aria-label="submitLabel"
            @click="onSubmit"
        />

        <Button
            v-if="canApprove"
            type="button"
            :label="approveLabel"
            icon="pi pi-check"
            severity="success"
            :loading="approving"
            :disabled="isBusy() || approveDisabled"
            :aria-label="approveLabel"
            @click="onApprove"
        />

        <Button
            v-if="canReject"
            type="button"
            :label="rejectLabel"
            icon="pi pi-times"
            severity="danger"
            outlined
            :loading="rejecting"
            :disabled="isBusy()"
            :aria-label="rejectLabel"
            @click="onReject"
        />
    </div>
</template>
