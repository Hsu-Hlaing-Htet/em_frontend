<template>
    <Dialog
        v-model:visible="visible"
        modal
        :header="header"
        class="w-full max-w-lg"
        :closable="!submitting"
        @update:visible="onVisibleChange"
    >
        <p class="mb-4">
            {{ description }}
        </p>

        <div class="field">
            <Textarea
                id="reject_remark"
                v-model="remark"
                rows="4"
                class="w-full"
                placeholder="Enter rejection remark..."
            />
            <small v-if="error" class="p-error">{{ error }}</small>
        </div>

        <template #footer>
            <Button
                label="Close"
                severity="secondary"
                text
                :disabled="submitting"
                @click="close"
            />
            <Button
                label="Reject"
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
    name: 'RejectContractDialog',
    components: { Dialog, Button, Textarea },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        header: {
            type: String,
            default: 'Reject Contract',
        },
        description: {
            type: String,
            default: 'Please provide a remark explaining why this contract is being rejected.',
        },
    },
    emits: ['update:modelValue', 'confirm'],
    setup(props, { emit }) {
        const visible = ref(props.modelValue);
        const remark = ref('');
        const error = ref('');
        const submitting = ref(false);

        watch(() => props.modelValue, (value) => {
            visible.value = value;

            if (value) {
                remark.value = '';
                error.value = '';
                submitting.value = false;
            }
        });

        watch(remark, () => {
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
            if (!remark.value.trim()) {
                error.value = 'Remark is required.';

                return;
            }

            submitting.value = true;
            emit('confirm', remark.value.trim());
            submitting.value = false;
            close();
        };

        return {
            visible,
            remark,
            error,
            submitting,
            close,
            onVisibleChange,
            confirm,
        };
    },
});
</script>
