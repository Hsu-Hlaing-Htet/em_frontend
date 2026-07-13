<template>
    <Dialog
        v-model:visible="visible"
        modal
        header="Cancel Contract"
        class="w-full max-w-lg"
        :closable="!submitting"
        @update:visible="onVisibleChange"
    >
        <p class="mb-4">
            Please provide a reason for cancelling this contract. This action cannot be undone.
        </p>

        <div class="field">
            <label for="cancellation_reason" class="mb-2 block text-md">
                Cancellation Reason <span class="">*</span>
            </label>
            <Textarea
                id="cancellation_reason"
                v-model="reason"
                rows="4"
                class="w-full textarea-outline"
                placeholder="Enter cancellation reason..."
            />
            <small v-if="error" class="p-error">{{ error }}</small>
        </div>

        <template #footer>
            <Button
                label="Close"
                severity="secondary"
                :disabled="submitting"
                @click="close"
            />
            <Button
                label="Confirm"
                severity="danger"
                :loading="submitting"
                @click="confirm"
            />
        </template>
    </Dialog>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';
import Textarea from 'primevue/textarea';

export default defineComponent({
    name: 'CancelContractDialog',
    components: { Dialog, Button, Textarea },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue', 'confirm'],
    setup(props, { emit }) {
        const visible = ref(props.modelValue);
        const reason = ref('');
        const error = ref('');
        const submitting = ref(false);

        watch(() => props.modelValue, (value) => {
            visible.value = value;

            if (value) {
                reason.value = '';
                error.value = '';
                submitting.value = false;
            }
        });

        const close = () => {
            emit('update:modelValue', false);
        };

        const onVisibleChange = (value) => {
            if (!value) {
                close();
            }
        };

        const confirm = () => {
            if (!reason.value.trim()) {
                error.value = 'Cancellation reason is required.';

                return;
            }

            submitting.value = true;
            emit('confirm', reason.value.trim());
            submitting.value = false;
            close();
        };

        return {
            visible,
            reason,
            error,
            submitting,
            close,
            onVisibleChange,
            confirm,
        };
    },
});
</script>
