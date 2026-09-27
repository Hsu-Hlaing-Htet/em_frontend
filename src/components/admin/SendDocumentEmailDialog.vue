<template>
    <Dialog
        v-model:visible="visible"
        modal
        header="Send Email?"
        class="w-full max-w-md send-document-email-dialog"
        :closable="!submitting"
        :close-on-escape="!submitting"
        @update:visible="onVisibleChange"
    >
        <p
            v-if="recipients.length <= 1"
            class="send-document-email-copy"
        >
            Send {{ documentKind }}
            <span class="send-document-email-ref">{{ documentNumber || '—' }}</span>
            to
            <br>
            <span class="send-document-email-recipient">
                <template v-if="singleRecipient.name && singleRecipient.email">
                    <span class="send-document-email-name">{{ singleRecipient.name }}</span><span class="send-document-email-email"> ({{ singleRecipient.email }})</span>?
                </template>
                <template v-else-if="singleRecipient.name">
                    <span class="send-document-email-name">{{ singleRecipient.name }}</span>?
                </template>
                <template v-else-if="singleRecipient.email">
                    <span class="send-document-email-email">{{ singleRecipient.email }}</span>?
                </template>
                <template v-else>
                    —
                </template>
            </span>
        </p>

        <div
            v-else
            class="send-document-email-copy"
        >
            <p class="send-document-email-lead">
                Send {{ documentKind }}
                <span class="send-document-email-ref">{{ documentNumber || '—' }}</span>
                to:
            </p>
            <ul class="send-document-email-list">
                <li
                    v-for="(parts, index) in recipientRows"
                    :key="parts.email || parts.name || index"
                >
                    <template v-if="parts.name && parts.email">
                        <span class="send-document-email-name">{{ parts.name }}</span><span class="send-document-email-email"> ({{ parts.email }})</span>
                    </template>
                    <template v-else-if="parts.name">
                        <span class="send-document-email-name">{{ parts.name }}</span>
                    </template>
                    <template v-else>
                        <span class="send-document-email-email">{{ parts.email || '—' }}</span>
                    </template>
                </li>
            </ul>
        </div>

        <template #footer>
            <Button
                label="Cancel"
                severity="secondary"
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

function recipientParts(recipient) {
    return {
        name: String(recipient?.name || '').trim(),
        email: String(recipient?.email || '').trim(),
    };
}

export default defineComponent({
    name: 'SendDocumentEmailDialog',
    components: { Dialog, Button },
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

        const singleRecipient = computed(() => {
            if (props.recipients.length === 0) {
                return { name: '', email: '' };
            }

            return recipientParts(props.recipients[0]);
        });

        const recipientRows = computed(() => props.recipients.map(recipientParts));

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
            singleRecipient,
            recipientRows,
            close,
            onVisibleChange,
            onConfirm,
        };
    },
});
</script>

<style scoped>
/*
 * Surrounding Admin UI uses PrimeVue Aura --font-family ("Inter var").
 * Dialog is teleported to body, so use that same token — do not fall back to a
 * different Inter/system stack that would look disconnected from the page behind.
 */
.send-document-email-copy {
    margin: 0;
    color: var(--admin-text, var(--rw-text, #1f2937));
    font-family: var(--font-family);
    font-size: 0.975rem;
    font-weight: 400;
    line-height: 1.6;
}

.send-document-email-lead {
    margin: 0 0 0.45rem;
    font-weight: 400;
}

.send-document-email-ref {
    font-family: inherit;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
}

.send-document-email-recipient {
    display: inline-block;
    margin-top: 0.2rem;
    font-weight: 400;
}

.send-document-email-name {
    font-family: inherit;
    font-weight: 500;
    color: var(--admin-text, var(--rw-text, #1f2937));
}

.send-document-email-email {
    font-family: inherit;
    font-weight: 400;
    color: var(--admin-text-muted, var(--rw-text-muted, #6b7280));
}

.send-document-email-list {
    margin: 0;
    padding-left: 1.15rem;
}

.send-document-email-list li {
    margin: 0.2rem 0;
    font-weight: 400;
    overflow-wrap: anywhere;
}
</style>

<!-- Dialog chrome is teleported to body; scope via unique root class only. -->
<style>
.p-dialog.send-document-email-dialog .p-dialog-title,
.p-dialog.send-document-email-dialog .p-dialog-content,
.p-dialog.send-document-email-dialog .p-dialog-footer .p-button .p-button-label {
    font-family: var(--font-family);
}

.p-dialog.send-document-email-dialog .p-dialog-title {
    font-size: 1.15rem;
    font-weight: 600;
    letter-spacing: -0.01em;
    line-height: 1.25;
    color: var(--admin-text, var(--rw-text, #1f2937));
}

.p-dialog.send-document-email-dialog .p-dialog-footer .p-button .p-button-label {
    font-weight: 500;
}

/*
 * PrimeIcons require font-family: 'primeicons'.
 * Never apply Admin text fonts to .p-button-icon / .pi.
 */
.p-dialog.send-document-email-dialog .p-dialog-footer .p-button .p-button-icon,
.p-dialog.send-document-email-dialog .p-dialog-footer .p-button .p-button-icon.pi,
.p-dialog.send-document-email-dialog .p-dialog-header-icon .pi,
.p-dialog.send-document-email-dialog .p-dialog-header-close-icon {
    font-family: 'primeicons' !important;
    font-weight: normal !important;
}
</style>
