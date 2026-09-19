<template>
    <Dialog
        v-model:visible="visible"
        modal
        :header="resolvedHeader"
        class="w-full max-w-lg"
        :closable="!submitting"
        :close-on-escape="!submitting"
        @update:visible="onVisibleChange"
    >
        <p v-if="description" class="mb-4">
            {{ description }}
        </p>

        <div class="field">
            <label for="rejection_reason" class="mb-2 block text-sm font-medium">
                Rejection Reason *
            </label>
            <Textarea
                id="rejection_reason"
                v-model="remark"
                rows="4"
                class="w-full"
                :invalid="Boolean(error)"
                aria-required="true"
                :aria-invalid="Boolean(error)"
                placeholder="Enter rejection reason"
            />
            <small v-if="error" class="p-error">{{ error }}</small>
        </div>

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
                label="Reject"
                severity="danger"
                :loading="submitting"
                :disabled="submitting"
                @click="confirm"
            />
        </template>
    </Dialog>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue';
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
            default: '',
        },
        entity: {
            type: String,
            default: 'contract',
        },
        description: {
            type: String,
            default: '',
        },
        submitting: {
            type: Boolean,
            default: false,
        },
        closeOnConfirm: {
            type: Boolean,
            default: true,
        },
    },
    emits: ['update:modelValue', 'confirm'],
    setup(props, { emit }) {
        const visible = ref(props.modelValue);
        const remark = ref('');
        const error = ref('');
        const resolvedHeader = computed(() => props.header || `Reject this ${props.entity}?`);

        watch(() => props.modelValue, (value) => {
            visible.value = value;

            if (value) {
                remark.value = '';
                error.value = '';
            }
        });

        watch(remark, () => {
            if (error.value) {
                error.value = '';
            }
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
            if (props.submitting) {
                return;
            }

            if (!remark.value.trim()) {
                error.value = 'Rejection Reason is required.';

                return;
            }

            emit('confirm', remark.value.trim());

            if (props.closeOnConfirm) {
                close();
            }
        };

        return {
            visible,
            resolvedHeader,
            remark,
            error,
            close,
            onVisibleChange,
            confirm,
        };
    },
});
</script>
