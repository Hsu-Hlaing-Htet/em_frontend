<template>
    <Dialog
        v-model:visible="visible"
        modal
        header="Send Contract by Email"
        class="w-full max-w-lg"
        :closable="!submitting"
        @update:visible="onVisibleChange"
    >
        <dl class="send-contract-email-summary">
            <div>
                <dt>Customer</dt>
                <dd>{{ customerName || '-' }}</dd>
            </div>
            <div>
                <dt>Email</dt>
                <dd>{{ email || '-' }}</dd>
            </div>
            <div>
                <dt>Contract No</dt>
                <dd>{{ contractNo || '-' }}</dd>
            </div>
        </dl>

        <template #footer>
            <Button
                label="Cancel"
                severity="secondary"
                text
                :disabled="submitting"
                @click="close"
            />
            <Button
                label="Send Email"
                icon="pi pi-envelope"
                :loading="submitting"
                :disabled="submitting || !email"
                @click="$emit('confirm')"
            />
        </template>
    </Dialog>
</template>

<script>
import { defineComponent, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

export default defineComponent({
    name: 'SendContractEmailDialog',
    components: { Button, Dialog },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        customerName: {
            type: String,
            default: '',
        },
        email: {
            type: String,
            default: '',
        },
        contractNo: {
            type: String,
            default: '',
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
            emit('update:modelValue', false);
        };

        const onVisibleChange = (value) => {
            if (!value) {
                close();
            }
        };

        return {
            visible,
            close,
            onVisibleChange,
        };
    },
});
</script>

<style scoped>
.send-contract-email-summary {
    display: grid;
    gap: 0.75rem;
    margin: 0;
}

.send-contract-email-summary div {
    display: grid;
    grid-template-columns: 8rem minmax(0, 1fr);
    gap: 1rem;
}

.send-contract-email-summary dt {
    color: #6b7280;
    font-weight: 600;
}

.send-contract-email-summary dd {
    margin: 0;
    min-width: 0;
    overflow-wrap: anywhere;
}
</style>
