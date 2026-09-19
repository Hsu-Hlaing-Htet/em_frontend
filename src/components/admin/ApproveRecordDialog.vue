<template>
    <Dialog
        v-model:visible="visible"
        modal
        :header="`Approve this ${entity}?`"
        class="w-full max-w-lg"
        :closable="!submitting"
        :close-on-escape="!submitting"
        @update:visible="onVisibleChange"
    >
        <p class="mb-4">Are you sure you want to approve this record?</p>

        <template #footer>
            <Button
                type="button"
                label="Cancel"
                severity="secondary"
                text
                :disabled="submitting"
                @click="close"
            />
            <Button
                type="button"
                label="Approve"
                severity="success"
                :loading="submitting"
                :disabled="submitting"
                @click="confirm"
            />
        </template>
    </Dialog>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

export default defineComponent({
    name: 'ApproveRecordDialog',
    components: { Dialog, Button },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        entity: {
            type: String,
            required: true,
        },
        submitting: {
            type: Boolean,
            default: false,
        },
    },
    emits: ['update:modelValue', 'confirm'],
    setup(props, { emit }) {
        const visible = ref(props.modelValue);

        watch(() => props.modelValue, (value) => {
            visible.value = value;
        });

        const close = () => {
            if (!props.submitting) {
                emit('update:modelValue', false);
            }
        };

        const onVisibleChange = (value) => {
            if (!value) {
                close();
            }
        };

        const confirm = () => {
            if (!props.submitting) {
                emit('confirm');
            }
        };

        return { visible, close, onVisibleChange, confirm };
    },
});
</script>
