<template>
    <Dialog
        v-model:visible="visible"
        modal
        header="Terminate Contract"
        class="w-full max-w-lg"
        :closable="!submitting"
        @update:visible="onVisibleChange"
    >
        <p class="mb-4">
            Please provide the termination date and reason. This action cannot be undone.
        </p>

        <div class="field">
            <label for="termination_date" class="mb-2 block text-md">
                Termination Date <span class="">*</span>
            </label>
            <input
                id="termination_date"
                v-model="terminationDate"
                type="date"
                class="p-inputtext p-component w-full"
            />
        </div>

        <div class="field">
            <label for="cancellation_reason" class="mb-2 block text-md">
                Termination Reason <span class="">*</span>
            </label>
            <Textarea
                id="cancellation_reason"
                v-model="reason"
                rows="4"
                class="w-full textarea-outline"
                placeholder="Enter termination reason..."
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
        const terminationDate = ref(new Date().toISOString().slice(0, 10));
        const error = ref('');
        const submitting = ref(false);

        watch(() => props.modelValue, (value) => {
            visible.value = value;

            if (value) {
                reason.value = '';
                terminationDate.value = new Date().toISOString().slice(0, 10);
                error.value = '';
                submitting.value = false;
            }
        });

        watch(reason, () => {
            if (error.value) {
                error.value = '';
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
                error.value = 'Termination reason is required.';

                return;
            }

            if (!terminationDate.value) {
                error.value = 'Termination date is required.';

                return;
            }

            submitting.value = true;
            emit('confirm', {
                reason: reason.value.trim(),
                termination_date: terminationDate.value,
            });
            submitting.value = false;
            close();
        };

        return {
            visible,
            reason,
            terminationDate,
            error,
            submitting,
            close,
            onVisibleChange,
            confirm,
        };
    },
});
</script>
