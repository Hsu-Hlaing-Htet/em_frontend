<template>
    <Dialog
        v-model:visible="visible"
        modal
        header="Send Email?"
        class="w-full max-w-md"
        :closable="!submitting"
        :close-on-escape="!submitting"
        @update:visible="onVisibleChange"
    >
        <p
            v-if="recipients.length <= 1"
            class="send-document-email-copy"
        >
            Send {{ documentKind }} <span class="send-document-email-ref">{{ documentNumber || '—' }}</span> to
            <br>
            <span class="send-document-email-recipient">{{ singleRecipientLabel }}</span>?
        </p>

        <div
            v-else
            class="send-document-email-copy"
        >
            <p class="send-document-email-lead">
                Send {{ documentKind }} <span class="send-document-email-ref">{{ documentNumber || '—' }}</span> to:
            </p>
            <ul class="send-document-email-list">
                <li
                    v-for="recipient in recipients"
                    :key="recipient.email"
                >
                    {{ formatRecipient(recipient) }}
                </li>
            </ul>
        </div>

        <template #footer>
            <Button
                label="Cancel"
                severity="secondary"
                text
                :disabled="submitting"
                @click="close"
            />
            <Button
                :label="submitting ? 'Sending...' : 'Send'"
                icon="pi pi-envelope"
                :loading="submitting"
                :disabled="submitting || !canConfirm"
                @click="onConfirm"
            />
        </template>
    </Dialog>
</template>

<script>
import { computed, defineComponent, ref, watch } from 'vue';
import Dialog from 'primevue/dialog';
import Button from 'primevue/button';

export default defineComponent({
    name: 'SendDocumentEmailDialog',
    components: { Button, Dialog },
    props: {
        modelValue: {
            type: Boolean,
            default: false,
        },
        /** e.g. "contract", "invoice", "receipt", "utility bill" */
        documentKind: {
            type: String,
            required: true,
        },
        documentNumber: {
            type: String,
            default: '',
        },
        recipients: {
            type: Array,
            default: () => [],
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

        const canConfirm = computed(() => props.recipients.some((entry) => entry?.email));

        const formatRecipient = (recipient) => {
            const name = String(recipient?.name || '').trim();
            const email = String(recipient?.email || '').trim();

            if (name && email) {
                return `${name} (${email})`;
            }

            return name || email || '—';
        };

        const singleRecipientLabel = computed(() => {
            if (props.recipients.length === 0) {
                return '—';
            }

            return formatRecipient(props.recipients[0]);
        });

        const close = () => {
            if (props.submitting) {
                return;
            }

            emit('update:modelValue', false);
        };

        const onVisibleChange = (value) => {
            if (!value) {
                if (props.submitting) {
                    visible.value = true;
                    return;
                }

                close();
            }
        };

        const onConfirm = () => {
            if (props.submitting || !canConfirm.value) {
                return;
            }

            emit('confirm');
        };

        return {
            visible,
            canConfirm,
            singleRecipientLabel,
            formatRecipient,
            close,
            onVisibleChange,
            onConfirm,
        };
    },
});
</script>

<style scoped>
.send-document-email-copy {
    margin: 0;
    color: var(--text-color, #1f2937);
    font-size: 0.975rem;
    line-height: 1.55;
}

.send-document-email-lead {
    margin: 0 0 0.65rem;
}

.send-document-email-ref {
    font-weight: 600;
}

.send-document-email-recipient {
    font-weight: 600;
}

.send-document-email-list {
    margin: 0;
    padding-left: 1.15rem;
}

.send-document-email-list li {
    margin: 0.15rem 0;
    font-weight: 600;
    overflow-wrap: anywhere;
}
</style>
